import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { users, scanUsage } from "@/lib/db/schema";
import { eq, and, gte } from "drizzle-orm";
import { handleCors, corsHeaders } from "@/lib/security";

const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";
const FREE_DAILY_CHATS = 5;

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

    // Parse and validate body
    const body = await request.json();
    const { message, context } = body;

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Message must not be empty" },
        { status: 400, headers: corsHeaders(request) }
      );
    }

    if (message.length > 1000) {
      return NextResponse.json(
        { error: "Message too long (max 1000 characters)" },
        { status: 400, headers: corsHeaders(request) }
      );
    }

    // Rate limit: 20 chats/day for free users, unlimited for pro
    if (!isPro) {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const dailyChats = await db()
        .select()
        .from(scanUsage)
        .where(
          and(
            eq(scanUsage.userId, user.id),
            eq(scanUsage.scanType, "chat"),
            gte(scanUsage.createdAt, todayStart)
          )
        );

      if (dailyChats.length >= FREE_DAILY_CHATS) {
        return NextResponse.json(
          {
            error: "Daily chat limit reached",
            chatsUsed: dailyChats.length,
            chatsMax: FREE_DAILY_CHATS,
            upgradeRequired: true,
          },
          { status: 429, headers: corsHeaders(request) }
        );
      }
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "AI service unavailable" },
        { status: 503, headers: corsHeaders(request) }
      );
    }

    // Build context string from user's nutrition data
    let contextInfo = "";
    if (context) {
      const parts: string[] = [];
      if (context.targetCalories) parts.push(`Daily calorie target: ${context.targetCalories} kcal`);
      if (context.targetProtein) parts.push(`Daily protein target: ${context.targetProtein}g`);
      if (context.goalType) parts.push(`Goal: ${context.goalType}`);
      if (context.dailyCalories != null) parts.push(`Calories consumed today: ${context.dailyCalories} kcal`);
      if (context.dailyProtein != null) parts.push(`Protein consumed today: ${context.dailyProtein}g`);
      if (context.dailyCarbs != null) parts.push(`Carbs consumed today: ${context.dailyCarbs}g`);
      if (context.dailyFat != null) parts.push(`Fat consumed today: ${context.dailyFat}g`);
      if (context.recentFoods?.length) parts.push(`Recent foods: ${context.recentFoods.join(", ")}`);
      if (parts.length > 0) {
        contextInfo = `\n\nUser's current nutrition data:\n${parts.join("\n")}`;
      }
    }

    // Use Haiku for free users (cheap), Sonnet for Pro users (premium experience)
    const model = isPro
      ? "claude-sonnet-4-6-20250514"
      : "claude-haiku-4-5-20251001";

    const claudeResponse = await fetch(ANTHROPIC_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        max_tokens: isPro ? 1024 : 512,
        system: `You are NourishAI, a friendly and knowledgeable nutrition assistant. You help users understand their diet, make healthier choices, and reach their nutrition goals. Keep responses concise, practical, and encouraging. Use simple language. If asked about medical conditions, remind the user to consult a healthcare professional. Never provide medical diagnoses or treatment plans.${contextInfo}`,
        messages: [
          {
            role: "user",
            content: message.trim(),
          },
        ],
      }),
    });

    if (!claudeResponse.ok) {
      const errorText = await claudeResponse.text();
      console.error("Claude API error:", claudeResponse.status, errorText);
      return NextResponse.json(
        { error: "AI chat failed" },
        { status: 502, headers: corsHeaders(request) }
      );
    }

    const claudeData = await claudeResponse.json();
    const reply = claudeData.content?.[0]?.text ?? "";
    const tokensUsed = (claudeData.usage?.input_tokens ?? 0) + (claudeData.usage?.output_tokens ?? 0);

    // Log as "chat" — does NOT count against scan limits
    await db().insert(scanUsage).values({
      userId: user.id,
      scanType: "chat",
      modelUsed: isPro ? "sonnet" : "haiku",
      tokensUsed: tokensUsed ?? 0,
    });

    return NextResponse.json(
      { reply, tokensUsed },
      { headers: corsHeaders(request) }
    );
  } catch (error) {
    console.error("chat error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders(request) }
    );
  }
}
