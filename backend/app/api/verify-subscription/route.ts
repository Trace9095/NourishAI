import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { handleCors, corsHeaders } from "@/lib/security";
import { checkRateLimit } from "@/lib/rate-limit";

export async function OPTIONS(request: NextRequest) {
  return handleCors(request) ?? NextResponse.json(null, { status: 204 });
}

export async function POST(request: NextRequest) {
  const cors = handleCors(request);
  if (cors) return cors;

  try {
    const deviceId = request.headers.get("x-device-id");
    if (!deviceId || typeof deviceId !== "string") {
      return NextResponse.json(
        { error: "Missing device ID" },
        { status: 401, headers: corsHeaders(request) }
      );
    }

    // Rate limit: 20 verifications per hour per device (prevents abuse)
    const limit = checkRateLimit(`verify-sub:${deviceId}`, 20, 60 * 60 * 1000);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Too many verification attempts" },
        { status: 429, headers: corsHeaders(request) }
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

    // Validate types
    if (typeof transactionId !== "string" || transactionId.length > 200) {
      return NextResponse.json(
        { error: "Invalid transaction ID" },
        { status: 400, headers: corsHeaders(request) }
      );
    }
    if (typeof productId !== "string" || productId.length > 100) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400, headers: corsHeaders(request) }
      );
    }

    // Validate product ID against whitelist
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

    // Validate expiry date if provided
    let expiresAt: Date | null = null;
    if (expiresDate) {
      expiresAt = new Date(expiresDate);
      if (isNaN(expiresAt.getTime())) {
        return NextResponse.json(
          { error: "Invalid expiry date" },
          { status: 400, headers: corsHeaders(request) }
        );
      }
      // Reject expiry dates more than 2 years in the future (sanity check)
      const maxFuture = new Date();
      maxFuture.setFullYear(maxFuture.getFullYear() + 2);
      if (expiresAt > maxFuture) {
        return NextResponse.json(
          { error: "Invalid expiry date" },
          { status: 400, headers: corsHeaders(request) }
        );
      }
    }

    // TODO: Integrate Apple App Store Server API for server-side receipt verification
    // before going to production. Currently trusts client-side StoreKit 2 verification.
    // See: https://developer.apple.com/documentation/appstoreserverapi

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
