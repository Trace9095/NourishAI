import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, scanUsage } from "@/lib/db/schema";
import { eq, and, gte } from "drizzle-orm";
import { handleCors, corsHeaders } from "@/lib/security";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const SUGGESTIONS_PER_HOUR = 10;
const VALID_TIMES = ["morning", "afternoon", "evening", "night"];

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

    // Parse and validate body
    const rawBody = await request.text();
    if (rawBody.length > 2000) {
      return NextResponse.json(
        { error: "Request body too large" },
        { status: 400, headers: corsHeaders(request) }
      );
    }

    const body = JSON.parse(rawBody);
    const { remainingCalories, remainingProtein, remainingCarbs, remainingFat, timeOfDay, preferences } = body;

    if (
      typeof remainingCalories !== "number" || remainingCalories < 0 ||
      typeof remainingProtein !== "number" || remainingProtein < 0 ||
      typeof remainingCarbs !== "number" || remainingCarbs < 0 ||
      typeof remainingFat !== "number" || remainingFat < 0
    ) {
      return NextResponse.json(
        { error: "All macro values must be non-negative numbers" },
        { status: 400, headers: corsHeaders(request) }
      );
    }

    if (!VALID_TIMES.includes(timeOfDay)) {
      return NextResponse.json(
        { error: "timeOfDay must be one of: morning, afternoon, evening, night" },
        { status: 400, headers: corsHeaders(request) }
      );
    }

    // Rate limit: 10 suggestions per hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const recentSuggestions = await db()
      .select()
      .from(scanUsage)
      .where(
        and(
          eq(scanUsage.userId, user.id),
          eq(scanUsage.scanType, "suggestion"),
          gte(scanUsage.createdAt, oneHourAgo)
        )
      );

    if (recentSuggestions.length >= SUGGESTIONS_PER_HOUR) {
      return NextResponse.json(
        { error: "Suggestion limit reached (10/hour). Try again later." },
        { status: 429, headers: corsHeaders(request) }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "AI service unavailable" },
        { status: 503, headers: corsHeaders(request) }
      );
    }

    const preferencesText = preferences?.length
      ? `\nDietary preferences: ${preferences.join(", ")}`
      : "";

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
            content: `Suggest 5 foods I could eat right now based on my remaining macros for the day. It is currently ${timeOfDay}.

Remaining macros:
- Calories: ${remainingCalories} kcal
- Protein: ${remainingProtein}g
- Carbs: ${remainingCarbs}g
- Fat: ${remainingFat}g${preferencesText}

Respond in this exact JSON format:
{
  "suggestions": [
    {
      "name": "Food name",
      "description": "Brief appetizing description",
      "calories": number,
      "protein": number (grams),
      "carbs": number (grams),
      "fat": number (grams),
      "prepTime": number (minutes),
      "difficulty": "easy" | "medium" | "hard"
    }
  ]
}
Only respond with valid JSON, no other text.`,
          },
        ],
      }),
    });

    if (!claudeResponse.ok) {
      const errorText = await claudeResponse.text();
      console.error("Claude API error:", claudeResponse.status, errorText);
      return NextResponse.json(
        { error: "AI suggestion failed" },
        { status: 502, headers: corsHeaders(request) }
      );
    }

    const claudeData = await claudeResponse.json();
    const analysisText = claudeData.content?.[0]?.text ?? "";
    const tokensUsed = (claudeData.usage?.input_tokens ?? 0) + (claudeData.usage?.output_tokens ?? 0);

    // Log as "suggestion" — does NOT count against free scan limit
    await db().insert(scanUsage).values({
      userId: user.id,
      scanType: "suggestion",
      modelUsed: "haiku",
      tokensUsed: tokensUsed ?? 0,
    });

    // Parse Claude's response
    let suggestions;
    try {
      const cleaned = analysisText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();
      suggestions = JSON.parse(cleaned);
    } catch {
      suggestions = { raw: analysisText, parseError: true };
    }

    return NextResponse.json(
      { ...suggestions, tokensUsed },
      { headers: corsHeaders(request) }
    );
  } catch (error) {
    console.error("suggest-foods error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders(request) }
    );
  }
}
