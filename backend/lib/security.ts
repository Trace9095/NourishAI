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

  const headers: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Device-ID",
    "Access-Control-Max-Age": "86400",
  };

  // Only set ACAO header for allowed origins — omit entirely for disallowed
  if (isAllowed && origin) {
    headers["Access-Control-Allow-Origin"] = origin;
  }

  return headers;
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