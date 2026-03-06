import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, scanUsage } from "@/lib/db/schema";
import { eq, and, gte } from "drizzle-orm";
import { handleCors, corsHeaders } from "@/lib/security";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

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

    const isPro =
      user.subscriptionTier === "pro" &&
      user.subscriptionExpiresAt &&
      user.subscriptionExpiresAt > new Date();

    // Rate limiting: check cooldown (all users)
    const recentScan = await db()
      .select()
      .from(scanUsage)
      .where(
        and(
          eq(scanUsage.userId, user.id),
          gte(scanUsage.createdAt, new Date(Date.now() - 30_000))
        )
      )
      .limit(1);

    if (recentScan.length > 0) {
      return NextResponse.json(
        { error: "Please wait 30 seconds between scans" },
        { status: 429, headers: corsHeaders(request) }
      );
    }

    // Free tier weekly limit (counts ALL AI scan types: photo + description)
    if (!isPro) {
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

      if (weeklyScans.length >= 1) {
        return NextResponse.json(
          {
            error: "Free scan limit reached",
            scansUsed: weeklyScans.length,
            scansMax: 1,
            upgradeRequired: true,
          },
          { status: 403, headers: corsHeaders(request) }
        );
      }
    }

    const { description } = await request.json();
    if (!description || typeof description !== "string") {
      return NextResponse.json(
        { error: "Missing food description" },
        { status: 400, headers: corsHeaders(request) }
      );
    }

    // Limit description length to prevent prompt injection and cost abuse
    if (description.length > 500) {
      return NextResponse.json(
        { error: "Description too long (max 500 characters)" },
        { status: 400, headers: corsHeaders(request) }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "AI service unavailable" },
        { status: 503, headers: corsHeaders(request) }
      );
    }

    const claudeResponse = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: `Analyze this food description and estimate nutritional content: "${description}"

Respond in this exact JSON format:
{
  "foods": [
    {
      "name": "food item name",
      "servingSize": "estimated serving size",
      "calories": number,
      "protein": number (grams),
      "carbs": number (grams),
      "fat": number (grams),
      "fiber": number (grams)
    }
  ],
  "totalCalories": number,
  "totalProtein": number,
  "totalCarbs": number,
  "totalFat": number,
  "confidence": "high" | "medium" | "low",
  "notes": "any relevant notes"
}
Only respond with valid JSON, no other text.`,
          },
        ],
      }),
    });

    if (!claudeResponse.ok) {
      console.error("Claude API error:", claudeResponse.status);
      return NextResponse.json(
        { error: "AI analysis failed" },
        { status: 502, headers: corsHeaders(request) }
      );
    }

    const claudeData = await claudeResponse.json();
    const analysisText = claudeData.content?.[0]?.text ?? "";
    const tokensUsed = claudeData.usage?.input_tokens + claudeData.usage?.output_tokens;

    await db().insert(scanUsage).values({
      userId: user.id,
      scanType: "description",
      modelUsed: "haiku",
      tokensUsed: tokensUsed ?? 0,
    });

    let analysis;
    try {
      analysis = JSON.parse(analysisText);
    } catch {
      analysis = { raw: analysisText, parseError: true };
    }

    return NextResponse.json(
      { analysis, tokensUsed },
      { headers: corsHeaders(request) }
    );
  } catch (error) {
    console.error("analyze-description error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders(request) }
    );
  }
}
