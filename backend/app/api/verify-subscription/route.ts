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
    const deviceId = request.headers.get("x-device-id");
    if (!deviceId) {
      return NextResponse.json(
        { error: "Missing device ID" },
        { status: 401, headers: corsHeaders(request) }
      );
    }

    const [user] = await db()
      .select()
      .from(users)
      .where(eq(users.deviceId, deviceId))
      .limit(1);

    if (!user) {
      return NextResponse.json(
        { error: "Device not registered" },
        { status: 401, headers: corsHeaders(request) }
      );
    }

    const { transactionId, productId, expiresDate } = await request.json();

    if (!transactionId || !productId) {
      return NextResponse.json(
        { error: "Missing subscription data" },
        { status: 400, headers: corsHeaders(request) }
      );
    }

    // Validate product ID
    const validProducts = [
      "com.nourishai.subscription.pro.monthly",
      "com.nourishai.subscription.pro.annual",
    ];

    if (!validProducts.includes(productId)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400, headers: corsHeaders(request) }
      );
    }

    // Update user subscription status
    // In production, you'd verify the receipt with Apple's App Store Server API
    // For now, we trust the client-side StoreKit 2 verification
    const expiresAt = expiresDate ? new Date(expiresDate) : null;

    await db()
      .update(users)
      .set({
        subscriptionTier: "pro",
        subscriptionExpiresAt: expiresAt,
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    return NextResponse.json(
      {
        success: true,
        subscriptionTier: "pro",
        subscriptionExpiresAt: expiresAt,
      },
      { headers: corsHeaders(request) }
    );
  } catch (error) {
    console.error("verify-subscription error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders(request) }
    );
  }
}
