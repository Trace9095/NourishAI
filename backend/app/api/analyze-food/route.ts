import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, scanUsage } from "@/lib/db/schema";
import { eq, and, gte } from "drizzle-orm";
import { handleCors, corsHeaders } from "@/lib/security";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const FREE_SCANS_PER_WEEK = 1;
const COOLDOWN_MS = 30_000; // 30 seconds between scans

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

    // Look up user
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
          gte(scanUsage.createdAt, new Date(Date.now() - COOLDOWN_MS))
        )
      )
      .limit(1);

    if (recentScan.length > 0) {
      return NextResponse.json(
        { error: "Please wait 30 seconds between scans" },
        { status: 429, headers: corsHeaders(request) }
      );
    }

    // Free tier: check weekly limit (counts ALL AI scan types)
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

      if (weeklyScans.length >= FREE_SCANS_PER_WEEK) {
        return NextResponse.json(
          {
            error: "Free scan limit reached",
            scansUsed: weeklyScans.length,
            scansMax: FREE_SCANS_PER_WEEK,
            upgradeRequired: true,
          },
          { status: 403, headers: corsHeaders(request) }
        );
      }
    }

    // Parse the image from the request
    const body = await request.json();
    const { imageBase64, mediaType } = body;

    if (!imageBase64 || !mediaType) {
      return NextResponse.json(
        { error: "Missing image data" },
        { status: 400, headers: corsHeaders(request) }
      );
    }

    // Limit image size to 10MB base64 (~7.5MB raw) to prevent cost abuse
    if (imageBase64.length > 10_000_000) {
      return NextResponse.json(
        { error: "Image too large (max 10MB)" },
        { status: 400, headers: corsHeaders(request) }
      );
    }

    // Call Claude Haiku vision
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
            content: [
              {
                type: "image",
                source: {
                  type: "base64",
                  media_type: mediaType,
                  data: imageBase64,
                },
              },
              {
                type: "text",
                text: `Analyze this food photo. Identify each food item and estimate the nutritional content. Respond in this exact JSON format:
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
  "notes": "any relevant notes about the estimation"
}
Only respond with valid JSON, no other text.`,
              },
            ],
          },
        ],
      }),
    });

    if (!claudeResponse.ok) {
      const errorText = await claudeResponse.text();
      console.error("Claude API error:", claudeResponse.status, errorText);
      return NextResponse.json(
        { error: "AI analysis failed" },
        { status: 502, headers: corsHeaders(request) }
      );
    }

    const claudeData = await claudeResponse.json();
    const analysisText = claudeData.content?.[0]?.text ?? "";
    const tokensUsed = claudeData.usage?.input_tokens + claudeData.usage?.output_tokens;

    // Log the scan
    await db().insert(scanUsage).values({
      userId: user.id,
      scanType: "photo",
      modelUsed: "haiku",
      tokensUsed: tokensUsed ?? 0,
    });

    // Parse Claude's response
    let analysis;
    try {
      // Strip markdown code fences if present
      const cleaned = analysisText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();
      analysis = JSON.parse(cleaned);
    } catch {
      analysis = { raw: analysisText, parseError: true };
    }

    return NextResponse.json(
      { analysis, tokensUsed },
      { headers: corsHeaders(request) }
    );
  } catch (error) {
    console.error("analyze-food error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders(request) }
    );
  }
}
