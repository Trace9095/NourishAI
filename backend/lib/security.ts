import { NextRequest, NextResponse } from "next/server";

const ALLOWED_ORIGINS = [
  "https://nourishhealthai.com",
  "https://www.nourishhealthai.com",
];

export function corsHeaders(request: NextRequest): HeadersInit {
  const origin = request.headers.get("origin") ?? "";
  const isAllowed =
    ALLOWED_ORIGINS.includes(origin) ||
    process.env.NODE_ENV === "development";

  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : "",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Device-ID",
    "Access-Control-Max-Age": "86400",
  };
}

export function handleCors(request: NextRequest): NextResponse | null {
  if (request.method === "OPTIONS") {
    return NextResponse.json(null, {
      status: 204,
      headers: corsHeaders(request),
    });
  }
  return null;
}

export function rateLimitKey(deviceId: string): string {
  return `rate:${deviceId}:${Math.floor(Date.now() / 30000)}`;
}
