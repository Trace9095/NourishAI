import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { handleCors, corsHeaders } from "@/lib/security";

export async function OPTIONS(request: NextRequest) {
  return handleCors(request) ?? NextResponse.json(null, { status: 204 });
}

export async function POST(request: NextRequest) {
  const cors = handleCors(request);
  if (cors) return cors;

  try {
    const { deviceId } = await request.json();

    if (!deviceId || typeof deviceId !== "string" || deviceId.length < 10) {
      return NextResponse.json(
        { error: "Invalid device ID" },
        { status: 400, headers: corsHeaders(request) }
      );
    }

    // Check if device already registered
    const existing = await db()
      .select()
      .from(users)
      .where(eq(users.deviceId, deviceId))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        {
          userId: existing[0].id,
          subscriptionTier: existing[0].subscriptionTier,
          subscriptionExpiresAt: existing[0].subscriptionExpiresAt,
        },
        { headers: corsHeaders(request) }
      );
    }

    // Create new user
    const [newUser] = await db()
      .insert(users)
      .values({ deviceId })
      .returning();

    return NextResponse.json(
      {
        userId: newUser.id,
        subscriptionTier: newUser.subscriptionTier,
        subscriptionExpiresAt: newUser.subscriptionExpiresAt,
      },
      { status: 201, headers: corsHeaders(request) }
    );
  } catch (error) {
    console.error("register-device error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders(request) }
    );
  }
}
