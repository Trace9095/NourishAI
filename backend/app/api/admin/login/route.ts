import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { adminUsers } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { verifyPassword, createSession } from "@/lib/admin-auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 5 login attempts per 15 minutes per IP
    const ip = getClientIp(request);
    const limit = checkRateLimit(`admin-login:${ip}`, 5, 15 * 60 * 1000);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Too many login attempts. Try again later." },
        {
          status: 429,
          headers: { "Retry-After": String(Math.ceil((limit.resetAt - Date.now()) / 1000)) },
        }
      );
    }

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password required" },
        { status: 400 }
      );
    }

    // Input length limits
    if (typeof email !== "string" || email.length > 254) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    if (typeof password !== "string" || password.length > 128) {
      return NextResponse.json({ error: "Invalid password" }, { status: 400 });
    }

    const database = db();
    const [admin] = await database
      .select()
      .from(adminUsers)
      .where(
        and(
          eq(adminUsers.email, email.toLowerCase().trim()),
          eq(adminUsers.isActive, true)
        )
      )
      .limit(1);

    if (!admin || !verifyPassword(password, admin.passwordHash)) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Update last login
    await database
      .update(adminUsers)
      .set({ lastLoginAt: new Date() })
      .where(eq(adminUsers.id, admin.id));

    await createSession(admin.id);

    return NextResponse.json({
      success: true,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
