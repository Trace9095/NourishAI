import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { adminUsers } from "@/lib/db/schema";
import { hashPassword } from "@/lib/admin-auth";
import { eq } from "drizzle-orm";

// One-time setup route to seed the super admin
// Protected by ADMIN_SETUP_TOKEN env var
export async function POST(request: NextRequest) {
  try {
    const setupToken = process.env.ADMIN_SETUP_TOKEN;
    if (!setupToken) {
      return NextResponse.json(
        { error: "Setup not available" },
        { status: 403 }
      );
    }

    const { token, email, name, password } = await request.json();

    if (token !== setupToken) {
      return NextResponse.json(
        { error: "Invalid setup token" },
        { status: 403 }
      );
    }

    if (!email || !name || !password) {
      return NextResponse.json(
        { error: "Email, name, and password required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const database = db();

    // Check if admin already exists
    const [existing] = await database
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.email, email.toLowerCase().trim()))
      .limit(1);

    if (existing) {
      return NextResponse.json(
        { error: "Admin user already exists" },
        { status: 409 }
      );
    }

    const passwordHash = hashPassword(password);

    const [admin] = await database
      .insert(adminUsers)
      .values({
        email: email.toLowerCase().trim(),
        name,
        passwordHash,
        role: "super_admin",
        isActive: true,
      })
      .returning({ id: adminUsers.id, email: adminUsers.email, role: adminUsers.role });

    return NextResponse.json({
      success: true,
      message: "Super admin created successfully",
      admin,
    });
  } catch (error) {
    console.error("Admin setup error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
