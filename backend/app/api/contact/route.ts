import { NextRequest, NextResponse } from "next/server";
import { handleCors, corsHeaders } from "@/lib/security";
import { db } from "@/lib/db";
import { contactSubmissions } from "@/lib/db/schema";

export async function OPTIONS(request: NextRequest) {
  return handleCors(request) ?? NextResponse.json(null, { status: 204 });
}

export async function POST(request: NextRequest) {
  const cors = handleCors(request);
  if (cors) return cors;

  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400, headers: corsHeaders(request) }
      );
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400, headers: corsHeaders(request) }
      );
    }

    // Save to database
    try {
      const database = db();
      await database.insert(contactSubmissions).values({
        name,
        email,
        subject: subject || "General Inquiry",
        message,
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

    const emailSubject = subject
      ? `NourishAI Contact [${subject}]: ${name}`
      : `NourishAI Contact: ${name}`;

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: "NourishAI <noreply@nourishhealthai.com>",
        to: "CEO@epicai.ai",
        subject: emailSubject,
        text: `Name: ${name}\nEmail: ${email}\nSubject: ${subject || "General Inquiry"}\n\nMessage:\n${message}`,
        reply_to: email,
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
