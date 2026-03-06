import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { adminUsers } from "@/lib/db/schema";
import { hashPassword } from "@/lib/admin-auth";
import { eq } from "drizzle-orm";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

// One-time setup route to seed the super admin
// Protected by ADMIN_SETUP_TOKEN env var
export async function POST(request: NextRequest) {
  try {
    // Rate limit: 3 attempts per hour (prevents token brute-force)
    const ip = getClientIp(request);
    const limit = checkRateLimit(`admin-setup:${ip}`, 3, 60 * 60 * 1000);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Too many attempts" },
        { status: 429, headers: { "Retry-After": String(Math.ceil((limit.resetAt - Date.now()) / 1000)) } }
      );
    }

    const setupToken = process.env.ADMIN_SETUP_TOKEN;
    if (!setupToken) {
      return NextResponse.json(
        { error: "Setup not available" },
        { status: 403 }
      );
    }

    const { token, email, name, password } = await request.json();

    // Constant-time comparison for setup token
    if (
      typeof token !== "string" ||
      token.length !== setupToken.length ||
      !crypto.subtle
    ) {
      // Fallback: simple comparison if subtle not available
      if (token !== setupToken) {
        return NextResponse.json(
          { error: "Invalid setup token" },
          { status: 403 }
        );
      }
    } else {
      const encoder = new TextEncoder();
      const a = encoder.encode(token);
      const b = encoder.encode(setupToken);
      if (a.length !== b.length) {
        return NextResponse.json(
          { error: "Invalid setup token" },
          { status: 403 }
        );
      }
      // Use timing-safe comparison
      let mismatch = 0;
      for (let i = 0; i < a.length; i++) {
        mismatch |= a[i] ^ b[i];
      }
      if (mismatch !== 0) {
        return NextResponse.json(
          { error: "Invalid setup token" },
          { status: 403 }
        );
      }
    }

    if (!email || !name || !password) {
      return NextResponse.json(
        { error: "Email, name, and password required" },
        { status: 400 }
      );
    }

    // Input validation
    if (typeof email !== "string" || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    if (typeof name !== "string" || name.length > 100) {
      return NextResponse.json({ error: "Invalid name" }, { status: 400 });
    }
    if (typeof password !== "string" || password.length < 8 || password.length > 128) {
      return NextResponse.json(
        { error: "Password must be 8-128 characters" },
        { status: 400 }
      );
    }

    const database = db();

    // Check if ANY admin already exists (not just this email)
    const existingAdmins = await database
      .select()
      .from(adminUsers)
      .limit(1);

    if (existingAdmins.length > 0) {
      return NextResponse.json(
        { error: "Admin already configured. Setup is disabled." },
        { status: 409 }
      );
    }

    const passwordHash = hashPassword(password);

    const [admin] = await database
      .insert(adminUsers)
      .values({
        email: email.toLowerCase().trim(),
        name: name.trim(),
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
