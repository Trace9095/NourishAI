import { NextRequest, NextResponse } from "next/server";
import { handleCors, corsHeaders } from "@/lib/security";
import { db } from "@/lib/db";
import { contactSubmissions } from "@/lib/db/schema";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { isDisposableEmail, hasMxRecords } from "@/lib/email-validation";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function OPTIONS(request: NextRequest) {
  return handleCors(request) ?? NextResponse.json(null, { status: 204 });
}

export async function POST(request: NextRequest) {
  const cors = handleCors(request);
  if (cors) return cors;

  try {
    // Rate limit: 3 submissions per 15 minutes per IP
    const ip = getClientIp(request);
    const limit = checkRateLimit(`contact:${ip}`, 3, 15 * 60 * 1000);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Too many submissions. Please try again later." },
        {
          status: 429,
          headers: {
            ...corsHeaders(request),
            "Retry-After": String(Math.ceil((limit.resetAt - Date.now()) / 1000)),
          } as HeadersInit,
        }
      );
    }

    const body = await request.json();
    const { name, email, subject, message, website, _formTime } = body;

    // Honeypot: if "website" field is filled, it's a bot (field is hidden via CSS)
    if (website) {
      // Return success to not tip off the bot, but don't actually send
      return NextResponse.json(
        { success: true },
        { headers: corsHeaders(request) }
      );
    }

    // Time-based check: form must take at least 3 seconds to fill (bots are instant)
    if (_formTime && typeof _formTime === "number") {
      const elapsed = Date.now() - _formTime;
      if (elapsed < 3000) {
        return NextResponse.json(
          { success: true }, // Fake success to not reveal the check
          { headers: corsHeaders(request) }
        );
      }
    }

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400, headers: corsHeaders(request) }
      );
    }

    // Input length limits
    if (typeof name !== "string" || name.length > 100) {
      return NextResponse.json(
        { error: "Name too long (max 100 characters)" },
        { status: 400, headers: corsHeaders(request) }
      );
    }
    if (typeof email !== "string" || email.length > 254) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400, headers: corsHeaders(request) }
      );
    }
    if (typeof message !== "string" || message.length > 2000) {
      return NextResponse.json(
        { error: "Message too long (max 2000 characters)" },
        { status: 400, headers: corsHeaders(request) }
      );
    }
    if (subject && (typeof subject !== "string" || subject.length > 200)) {
      return NextResponse.json(
        { error: "Subject too long (max 200 characters)" },
        { status: 400, headers: corsHeaders(request) }
      );
    }

    // Email format validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400, headers: corsHeaders(request) }
      );
    }

    // Reject emails with newlines (header injection prevention)
    if (/[\r\n]/.test(email) || /[\r\n]/.test(name)) {
      return NextResponse.json(
        { error: "Invalid input" },
        { status: 400, headers: corsHeaders(request) }
      );
    }

    // Block disposable/throwaway email domains
    if (isDisposableEmail(email)) {
      return NextResponse.json(
        { error: "Please use a real email address, not a disposable one." },
        { status: 400, headers: corsHeaders(request) }
      );
    }

    // Verify the email domain has MX records (real mail server)
    const hasMx = await hasMxRecords(email);
    if (!hasMx) {
      return NextResponse.json(
        { error: "That email domain doesn't appear to accept mail. Please use a valid email." },
        { status: 400, headers: corsHeaders(request) }
      );
    }

    // Save to database
    try {
      const database = db();
      await database.insert(contactSubmissions).values({
        name: escapeHtml(name.trim()),
        email: email.trim().toLowerCase(),
        subject: escapeHtml((subject || "General Inquiry").trim()),
        message: escapeHtml(message.trim()),
      });
    } catch (dbError) {
      console.error("DB save error (non-blocking):", dbError);
    }

    // Send email
    const resendKey = process.env.RESEND_API_KEY;
    if (!resendKey) {
      console.error("RESEND_API_KEY not configured");
      return NextResponse.json(
        { error: "Email service unavailable" },
        { status: 503, headers: corsHeaders(request) }
      );
    }

    const safeSubject = subject
      ? `NourishAI Contact [${escapeHtml(subject.trim())}]: ${escapeHtml(name.trim())}`
      : `NourishAI Contact: ${escapeHtml(name.trim())}`;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: "NourishAI <noreply@nourishhealthai.com>",
        to: "CEO@epicai.ai",
        subject: safeSubject,
        text: `Name: ${escapeHtml(name.trim())}\nEmail: ${email.trim()}\nSubject: ${escapeHtml((subject || "General Inquiry").trim())}\n\nMessage:\n${escapeHtml(message.trim())}`,
        reply_to: email.trim(),
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Resend error:", response.status, errorText);
      return NextResponse.json(
        { error: "Failed to send message" },
        { status: 502, headers: corsHeaders(request) }
      );
    }

    return NextResponse.json(
      { success: true },
      { headers: corsHeaders(request) }
    );
  } catch (error) {
    console.error("contact error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: corsHeaders(request) }
    );
  }
}
