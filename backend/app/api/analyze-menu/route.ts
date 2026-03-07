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

    const body = await request.json();
    const { imageBase64, mediaType, menuUrl } = body;

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "AI service unavailable" },
        { status: 503, headers: corsHeaders(request) }
      );
    }

    const menuPrompt = `Analyze this restaurant menu. Extract every menu item you can find and estimate the nutritional content for each. Respond in this exact JSON format:
{
  "items": [
    {
      "name": "Menu item name",
      "estimatedCalories": number,
      "estimatedProtein": number (grams),
      "estimatedCarbs": number (grams),
      "estimatedFat": number (grams),
      "healthScore": number (1-10, where 10 is healthiest),
      "healthNotes": "Brief note about nutritional value"
    }
  ],
  "healthiestPicks": ["top 3 healthiest item names by health score"],
  "totalItemsFound": number
}
Only respond with valid JSON, no other text.`;

    let claudeMessages;
    let scanType: string;

    if (menuUrl) {
      // URL-based menu analysis: fetch the restaurant website and extract menu
      if (typeof menuUrl !== "string" || menuUrl.length > 500) {
        return NextResponse.json(
          { error: "Invalid URL" },
          { status: 400, headers: corsHeaders(request) }
        );
      }

      // Validate URL format
      let parsedUrl: URL;
      try {
        parsedUrl = new URL(menuUrl);
        if (!["http:", "https:"].includes(parsedUrl.protocol)) {
          throw new Error("Invalid protocol");
        }
      } catch {
        return NextResponse.json(
          { error: "Invalid URL format. Please enter a valid website address." },
          { status: 400, headers: corsHeaders(request) }
        );
      }

      // Fetch the website content
      let pageText: string;
      try {
        const pageResponse = await fetch(menuUrl, {
          headers: { "User-Agent": "NourishAI Menu Scanner/1.0" },
          signal: AbortSignal.timeout(10_000),
        });
        if (!pageResponse.ok) {
          return NextResponse.json(
            { error: "Could not access the restaurant website. Please check the URL." },
            { status: 400, headers: corsHeaders(request) }
          );
        }
        const html = await pageResponse.text();
        // Strip HTML tags, keep text content (limit to 8000 chars for Claude context)
        pageText = html
          .replace(/<script[\s\S]*?<\/script>/gi, "")
          .replace(/<style[\s\S]*?<\/style>/gi, "")
          .replace(/<[^>]+>/g, " ")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 8000);
      } catch {
        return NextResponse.json(
          { error: "Could not load the website. Please try again or use a photo instead." },
          { status: 400, headers: corsHeaders(request) }
        );
      }

      claudeMessages = [
        {
          role: "user" as const,
          content: `Here is text content from a restaurant website at ${menuUrl}:\n\n${pageText}\n\n${menuPrompt}`,
        },
      ];
      scanType = "menu_url";
    } else if (imageBase64 && mediaType) {
      // Photo-based menu analysis
      if (imageBase64.length > 10_000_000) {
        return NextResponse.json(
          { error: "Image too large (max 10MB)" },
          { status: 400, headers: corsHeaders(request) }
        );
      }

      claudeMessages = [
        {
          role: "user" as const,
          content: [
            {
              type: "image" as const,
              source: {
                type: "base64" as const,
                media_type: mediaType,
                data: imageBase64,
              },
            },
            { type: "text" as const, text: menuPrompt },
          ],
        },
      ];
      scanType = "menu_photo";
    } else {
      return NextResponse.json(
        { error: "Provide either an image or a restaurant URL" },
        { status: 400, headers: corsHeaders(request) }
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
        max_tokens: 2048,
        messages: claudeMessages,
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
    const tokensUsed = (claudeData.usage?.input_tokens ?? 0) + (claudeData.usage?.output_tokens ?? 0);

    // Log the scan (counts against free tier limit)
    await db().insert(scanUsage).values({
      userId: user.id,
      scanType,
      modelUsed: "haiku",
      tokensUsed: tokensUsed ?? 0,
    });

    // Parse Claude's response
    let analysis;
    try {
      const cleaned = analysisText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();
      analysis = JSON.parse(cleaned);
    } catch {
      analysis = { raw: analysisText, parseError: true };
    }

    return NextResponse.json(analysis, { headers: corsHeaders(request) });
  } catch (error) {
    console.error("analyze-menu error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders(request) }
    );
  }
}
