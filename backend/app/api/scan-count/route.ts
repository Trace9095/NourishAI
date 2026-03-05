import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, scanUsage } from "@/lib/db/schema";
import { eq, and, gte } from "drizzle-orm";
import { handleCors, corsHeaders } from "@/lib/security";

const FREE_SCANS_PER_WEEK = 1;

export async function OPTIONS(request: NextRequest) {
  return handleCors(request) ?? NextResponse.json(null, { status: 204 });
}

export async function GET(request: NextRequest) {
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

    const isPro =
      user.subscriptionTier === "pro" &&
      user.subscriptionExpiresAt &&
      user.subscriptionExpiresAt > new Date();

    // Calculate week start (Sunday midnight)
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const weeklyScans = await db()
      .select()
      .from(scanUsage)
      .where(
        and(
          eq(scanUsage.userId, user.id),
          gte(scanUsage.createdAt, weekStart)
        )
      );

    // Only count photo + description scans (not barcode)
    const aiScans = weeklyScans.filter(
      (s) => s.scanType === "photo" || s.scanType === "description"
    );

    return NextResponse.json(
      {
        scansUsed: aiScans.length,
        scansMax: isPro ? null : FREE_SCANS_PER_WEEK,
        isPro,
        canScan: isPro || aiScans.length < FREE_SCANS_PER_WEEK,
        weekResetsAt: new Date(
          weekStart.getTime() + 7 * 24 * 60 * 60 * 1000
        ).toISOString(),
      },
      { headers: corsHeaders(request) }
    );
  } catch (error) {
    console.error("scan-count error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders(request) }
    );
  }
}
