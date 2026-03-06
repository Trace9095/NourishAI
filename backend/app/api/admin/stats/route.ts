import { NextResponse } from "next/server";
import { verifySession } from "@/lib/admin-auth";
import { db } from "@/lib/db";
import { users, scanUsage } from "@/lib/db/schema";
import { eq, sql, gte, and, desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await verifySession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const database = db();

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(todayStart);
    weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Sunday
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Total users
    const [totalUsersResult] = await database
      .select({ count: sql<number>`count(*)::int` })
      .from(users);

    // Pro subscribers
    const [proUsersResult] = await database
      .select({ count: sql<number>`count(*)::int` })
      .from(users)
      .where(eq(users.subscriptionTier, "pro"));

    // Total scans
    const [totalScansResult] = await database
      .select({ count: sql<number>`count(*)::int` })
      .from(scanUsage);

    // Scans today
    const [scansTodayResult] = await database
      .select({ count: sql<number>`count(*)::int` })
      .from(scanUsage)
      .where(gte(scanUsage.createdAt, todayStart));

    // Scans this week
    const [scansWeekResult] = await database
      .select({ count: sql<number>`count(*)::int` })
      .from(scanUsage)
      .where(gte(scanUsage.createdAt, weekStart));

    // Scans this month
    const [scansMonthResult] = await database
      .select({ count: sql<number>`count(*)::int` })
      .from(scanUsage)
      .where(gte(scanUsage.createdAt, monthStart));

    // Scans by type
    const scansByType = await database
      .select({
        scanType: scanUsage.scanType,
        count: sql<number>`count(*)::int`,
      })
      .from(scanUsage)
      .groupBy(scanUsage.scanType);

    // Total tokens used
    const [tokensResult] = await database
      .select({ total: sql<number>`coalesce(sum(${scanUsage.tokensUsed}), 0)::int` })
      .from(scanUsage);

    // Daily scan counts (last 30 days)
    const dailyScans = await database
      .select({
        date: sql<string>`date(${scanUsage.createdAt})`,
        count: sql<number>`count(*)::int`,
        tokens: sql<number>`coalesce(sum(${scanUsage.tokensUsed}), 0)::int`,
      })
      .from(scanUsage)
      .where(gte(scanUsage.createdAt, thirtyDaysAgo))
      .groupBy(sql`date(${scanUsage.createdAt})`)
      .orderBy(sql`date(${scanUsage.createdAt})`);

    // New users per day (last 30 days)
    const dailyUsers = await database
      .select({
        date: sql<string>`date(${users.createdAt})`,
        count: sql<number>`count(*)::int`,
      })
      .from(users)
      .where(gte(users.createdAt, thirtyDaysAgo))
      .groupBy(sql`date(${users.createdAt})`)
      .orderBy(sql`date(${users.createdAt})`);

    // Recent scans (last 50)
    const recentScans = await database
      .select({
        id: scanUsage.id,
        scanType: scanUsage.scanType,
        modelUsed: scanUsage.modelUsed,
        tokensUsed: scanUsage.tokensUsed,
        createdAt: scanUsage.createdAt,
        userId: scanUsage.userId,
      })
      .from(scanUsage)
      .orderBy(desc(scanUsage.createdAt))
      .limit(50);

    // Recent users (last 20) — truncate device IDs for privacy
    const recentUsersRaw = await database
      .select({
        id: users.id,
        deviceId: users.deviceId,
        subscriptionTier: users.subscriptionTier,
        createdAt: users.createdAt,
      })
      .from(users)
      .orderBy(desc(users.createdAt))
      .limit(20);

    const recentUsers = recentUsersRaw.map((u) => ({
      ...u,
      deviceId: u.deviceId ? `${u.deviceId.slice(0, 8)}...` : null,
    }));

    // Estimated AI cost (Haiku: ~$0.001/scan average)
    const aiScans = scansByType.filter(
      (s) => s.scanType === "photo" || s.scanType === "description"
    );
    const totalAiScans = aiScans.reduce((sum, s) => sum + s.count, 0);
    const estimatedCost = totalAiScans * 0.0015; // ~$0.0015 per Haiku call

    return NextResponse.json({
      overview: {
        totalUsers: totalUsersResult?.count ?? 0,
        proUsers: proUsersResult?.count ?? 0,
        freeUsers: (totalUsersResult?.count ?? 0) - (proUsersResult?.count ?? 0),
        totalScans: totalScansResult?.count ?? 0,
        scansToday: scansTodayResult?.count ?? 0,
        scansThisWeek: scansWeekResult?.count ?? 0,
        scansThisMonth: scansMonthResult?.count ?? 0,
        totalTokens: tokensResult?.total ?? 0,
        estimatedCost: Math.round(estimatedCost * 100) / 100,
      },
      scansByType: scansByType.reduce(
        (acc, s) => ({ ...acc, [s.scanType]: s.count }),
        {} as Record<string, number>
      ),
      dailyScans,
      dailyUsers,
      recentScans,
      recentUsers,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
