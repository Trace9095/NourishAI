import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { adminUsers } from "@/lib/db/schema";
import { hashPassword } from "@/lib/admin-auth";
import { eq } from "drizzle-orm";

// ONE-TIME password reset route — protected by ADMIN_SETUP_TOKEN
// DELETE THIS ROUTE after first use
export async function POST(request: NextRequest) {
  try {
    const setupToken = process.env.ADMIN_SETUP_TOKEN;
    if (!setupToken) {
      return NextResponse.json({ error: "Not available" }, { status: 403 });
    }

    const { token, email, newPassword } = await request.json();

    if (token !== setupToken) {
      return NextResponse.json({ error: "Invalid token" }, { status: 403 });
    }

    if (!email || !newPassword || newPassword.length < 8) {
      return NextResponse.json(
        { error: "Email and newPassword (8+ chars) required" },
        { status: 400 }
      );
    }

    const database = db();
    const passwordHash = hashPassword(newPassword);

    const result = await database
      .update(adminUsers)
      .set({ passwordHash, updatedAt: new Date() })
      .where(eq(adminUsers.email, email.toLowerCase().trim()))
      .returning({ id: adminUsers.id, email: adminUsers.email });

    if (result.length === 0) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Password updated",
      admin: result[0],
    });
  } catch (error) {
    console.error("Password reset error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
