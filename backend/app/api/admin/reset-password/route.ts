import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { adminUsers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword } from "@/lib/admin-auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { resetTokens } from "../forgot-password/route";

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 5 attempts per 15 minutes per IP
    const ip = getClientIp(request);
    const limit = checkRateLimit(`reset-password:${ip}`, 5, 15 * 60 * 1000);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Too many attempts. Try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(
              Math.ceil((limit.resetAt - Date.now()) / 1000)
            ),
          },
        }
      );
    }

    const { token, password } = await request.json();

    // Validate inputs
    if (!token || typeof token !== "string") {
      return NextResponse.json(
        { error: "Invalid or missing reset token" },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string") {
      return NextResponse.json(
        { error: "Password is required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    if (password.length > 128) {
      return NextResponse.json(
        { error: "Password must be 128 characters or fewer" },
        { status: 400 }
      );
    }

    // Look up token
    const tokenData = resetTokens.get(token);
    if (!tokenData) {
      return NextResponse.json(
        { error: "Invalid or expired reset link. Please request a new one." },
        { status: 400 }
      );
    }

    // Check expiry
    if (Date.now() > tokenData.expiresAt) {
      resetTokens.delete(token);
      return NextResponse.json(
        { error: "Reset link has expired. Please request a new one." },
        { status: 400 }
      );
    }

    // Hash the new password
    const passwordHash = hashPassword(password);

    // Update admin's password in the database
    const database = db();
    await database
      .update(adminUsers)
      .set({
        passwordHash,
        updatedAt: new Date(),
      })
      .where(eq(adminUsers.id, tokenData.adminId));

    // Delete the used token
    resetTokens.delete(token);

    return NextResponse.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Server error. Please try again." },
      { status: 500 }
    );
  }
}
