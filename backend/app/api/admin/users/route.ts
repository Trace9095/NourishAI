import { NextRequest, NextResponse } from "next/server";
import { verifySession, getSessionAdmin, hashPassword } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { adminUsers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

// GET — list all admin users (exclude passwordHash) + current admin identity
export async function GET() {
  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const database = db();
    const allAdmins = await database
      .select({
        id: adminUsers.id,
        email: adminUsers.email,
        name: adminUsers.name,
        role: adminUsers.role,
        isActive: adminUsers.isActive,
        lastLoginAt: adminUsers.lastLoginAt,
        createdAt: adminUsers.createdAt,
        updatedAt: adminUsers.updatedAt,
      })
      .from(adminUsers)
      .orderBy(adminUsers.createdAt);

    // Include current admin identity for the client
    const currentAdmin = allAdmins.find((a) => a.id === session.adminId) || null;

    return NextResponse.json({
      admins: allAdmins,
      currentAdmin: currentAdmin
        ? { id: currentAdmin.id, email: currentAdmin.email, name: currentAdmin.name, role: currentAdmin.role }
        : null,
    });
  } catch (error) {
    console.error("Admin users GET error:", error);
    return NextResponse.json({ error: "Failed to fetch admin users" }, { status: 500 });
  }
}

// POST — create new admin user
export async function POST(request: NextRequest) {
  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Rate limit: 5 creates per 15 minutes per IP
  const ip = getClientIp(request);
  const limit = checkRateLimit(`admin-users-create:${ip}`, 5, 15 * 60 * 1000);
  if (!limit.allowed) {
    return NextResponse.json(
      { error: "Too many requests. Try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil((limit.resetAt - Date.now()) / 1000)) },
      }
    );
  }

  try {
    const requester = await getSessionAdmin();
    if (!requester) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only super_admin and admin can create users
    if (requester.role !== "super_admin" && requester.role !== "admin") {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    const body = await request.json();
    const { email, name, password, role } = body;

    // Validate inputs
    if (!email || !name || !password || !role) {
      return NextResponse.json({ error: "Email, name, password, and role are required" }, { status: 400 });
    }

    if (typeof email !== "string" || email.length > 254) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    if (typeof name !== "string" || name.length > 100) {
      return NextResponse.json({ error: "Invalid name" }, { status: 400 });
    }
    if (typeof password !== "string" || password.length < 8 || password.length > 128) {
      return NextResponse.json({ error: "Password must be 8-128 characters" }, { status: 400 });
    }

    const validRoles = ["super_admin", "admin", "viewer"] as const;
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Only super_admin can create super_admin
    if (role === "super_admin" && requester.role !== "super_admin") {
      return NextResponse.json({ error: "Only super_admin can create super_admin accounts" }, { status: 403 });
    }

    const database = db();

    // Check if email already exists
    const [existing] = await database
      .select({ id: adminUsers.id })
      .from(adminUsers)
      .where(eq(adminUsers.email, email.toLowerCase().trim()))
      .limit(1);

    if (existing) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 });
    }

    const passwordHash = hashPassword(password);

    const [newAdmin] = await database
      .insert(adminUsers)
      .values({
        email: email.toLowerCase().trim(),
        name: name.trim(),
        passwordHash,
        role,
        isActive: true,
      })
      .returning({
        id: adminUsers.id,
        email: adminUsers.email,
        name: adminUsers.name,
        role: adminUsers.role,
        isActive: adminUsers.isActive,
        createdAt: adminUsers.createdAt,
      });

    return NextResponse.json({ admin: newAdmin }, { status: 201 });
  } catch (error) {
    console.error("Admin users POST error:", error);
    return NextResponse.json({ error: "Failed to create admin user" }, { status: 500 });
  }
}

// PATCH — update admin user (role, isActive)
export async function PATCH(request: NextRequest) {
  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const requester = await getSessionAdmin();
    if (!requester) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, role, isActive } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Admin ID is required" }, { status: 400 });
    }

    const database = db();

    // Fetch target admin
    const [target] = await database
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.id, id))
      .limit(1);

    if (!target) {
      return NextResponse.json({ error: "Admin user not found" }, { status: 404 });
    }

    const updates: Record<string, unknown> = { updatedAt: new Date() };

    // Role change — only super_admin can change roles
    if (role !== undefined) {
      if (requester.role !== "super_admin") {
        return NextResponse.json({ error: "Only super_admin can change roles" }, { status: 403 });
      }
      const validRoles = ["super_admin", "admin", "viewer"] as const;
      if (!validRoles.includes(role)) {
        return NextResponse.json({ error: "Invalid role" }, { status: 400 });
      }
      updates.role = role;
    }

    // Active status change
    if (isActive !== undefined) {
      if (typeof isActive !== "boolean") {
        return NextResponse.json({ error: "isActive must be a boolean" }, { status: 400 });
      }
      // Cannot deactivate yourself
      if (id === requester.id && isActive === false) {
        return NextResponse.json({ error: "Cannot deactivate your own account" }, { status: 400 });
      }
      // Only super_admin can change active status
      if (requester.role !== "super_admin") {
        return NextResponse.json({ error: "Only super_admin can change active status" }, { status: 403 });
      }
      updates.isActive = isActive;
    }

    if (Object.keys(updates).length === 1) {
      // Only updatedAt — nothing to actually change
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const [updated] = await database
      .update(adminUsers)
      .set(updates)
      .where(eq(adminUsers.id, id))
      .returning({
        id: adminUsers.id,
        email: adminUsers.email,
        name: adminUsers.name,
        role: adminUsers.role,
        isActive: adminUsers.isActive,
        updatedAt: adminUsers.updatedAt,
      });

    return NextResponse.json({ admin: updated });
  } catch (error) {
    console.error("Admin users PATCH error:", error);
    return NextResponse.json({ error: "Failed to update admin user" }, { status: 500 });
  }
}

// DELETE — delete admin user (super_admin only)
export async function DELETE(request: NextRequest) {
  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const requester = await getSessionAdmin();
    if (!requester) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only super_admin can delete
    if (requester.role !== "super_admin") {
      return NextResponse.json({ error: "Only super_admin can delete admin users" }, { status: 403 });
    }

    const body = await request.json();
    const { id } = body;

    if (!id || typeof id !== "string") {
      return NextResponse.json({ error: "Admin ID is required" }, { status: 400 });
    }

    // Cannot delete yourself
    if (id === requester.id) {
      return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
    }

    const database = db();

    // Verify target exists
    const [target] = await database
      .select({ id: adminUsers.id })
      .from(adminUsers)
      .where(eq(adminUsers.id, id))
      .limit(1);

    if (!target) {
      return NextResponse.json({ error: "Admin user not found" }, { status: 404 });
    }

    await database.delete(adminUsers).where(eq(adminUsers.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin users DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete admin user" }, { status: 500 });
  }
}
