import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { handleCors, corsHeaders } from "@/lib/security";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function OPTIONS(request: NextRequest) {
  return handleCors(request) ?? NextResponse.json(null, { status: 204 });
}

export async function POST(request: NextRequest) {
  const cors = handleCors(request);
  if (cors) return cors;

  try {
    // Rate limit: 10 registrations per hour per IP (prevents mass account creation)
    const ip = getClientIp(request);
    const limit = checkRateLimit(`register:${ip}`, 10, 60 * 60 * 1000);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Too many registration attempts" },
        {
          status: 429,
          headers: {
            ...corsHeaders(request),
            "Retry-After": String(Math.ceil((limit.resetAt - Date.now()) / 1000)),
          } as HeadersInit,
        }
      );
    }

    const { deviceId, pushToken } = await request.json();

    if (!deviceId || typeof deviceId !== "string" || deviceId.length < 10 || deviceId.length > 128) {
      return NextResponse.json(
        { error: "Invalid device ID" },
        { status: 400, headers: corsHeaders(request) }
      );
    }

    // Sanitize: only allow alphanumeric, hyphens, and underscores (UUID format)
    if (!/^[a-zA-Z0-9\-_]+$/.test(deviceId)) {
      return NextResponse.json(
        { error: "Invalid device ID format" },
        { status: 400, headers: corsHeaders(request) }
      );
    }

    // Sanitize push token if provided (hex string from APNs)
    const sanitizedPushToken = (typeof pushToken === "string" && /^[a-f0-9]{64}$/i.test(pushToken))
      ? pushToken
      : undefined;

    // Check if device already registered
    const existing = await db()
      .select()
      .from(users)
      .where(eq(users.deviceId, deviceId))
      .limit(1);

    if (existing.length > 0) {
      // Update push token if provided
      if (sanitizedPushToken && existing[0].pushToken !== sanitizedPushToken) {
        await db()
          .update(users)
          .set({ pushToken: sanitizedPushToken, updatedAt: new Date() })
          .where(eq(users.deviceId, deviceId));
      }
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
      .values({ deviceId, pushToken: sanitizedPushToken })
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
