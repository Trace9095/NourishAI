import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { adminUsers } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import crypto from "crypto";
import { Resend } from "resend";

// Lazy Resend singleton (safe for SSG)
let _resend: Resend | null = null;
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

// In-memory token store: token -> { adminId, expiresAt }
// Exported so reset-password route can access it
export const resetTokens = new Map<
  string,
  { adminId: string; expiresAt: number }
>();

// Clean up expired tokens periodically
function cleanupTokens() {
  const now = Date.now();
  for (const [token, data] of resetTokens) {
    if (now > data.expiresAt) resetTokens.delete(token);
  }
}

const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "https://www.nourishhealthai.com";

function buildResetEmailHtml(resetUrl: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Reset Your Password</title></head>
<body style="margin:0;padding:0;background-color:#1a1a1a;font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#1a1a1a;">
  <tr>
    <td align="center" style="padding:40px 20px;">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="480" style="max-width:480px;width:100%;">
        <!-- Logo -->
        <tr>
          <td align="center" style="padding:0 0 32px 0;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="font-family:Arial,Helvetica,sans-serif;font-size:28px;font-weight:bold;color:#ffffff;">
                  Nourish<span style="color:#34C759;">AI</span>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Card -->
        <tr>
          <td bgcolor="#0d0d0d" style="background-color:#0d0d0d;border-radius:16px;padding:40px 32px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
              <!-- Icon -->
              <tr>
                <td align="center" style="padding:0 0 24px 0;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td width="56" height="56" align="center" bgcolor="#34C759" style="background-color:rgba(52,199,89,0.15);border-radius:28px;color:#34C759;font-size:28px;">
                        &#128274;
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <!-- Heading -->
              <tr>
                <td align="center" style="font-family:Arial,Helvetica,sans-serif;font-size:22px;font-weight:bold;color:#ffffff;padding:0 0 12px 0;">
                  Password Reset Request
                </td>
              </tr>
              <!-- Body text -->
              <tr>
                <td align="center" style="font-family:Arial,Helvetica,sans-serif;font-size:15px;line-height:24px;color:#a0a0a0;padding:0 0 28px 0;">
                  We received a request to reset the password for your NourishAI admin account. Click the button below to set a new password. This link expires in 15 minutes.
                </td>
              </tr>
              <!-- Button -->
              <tr>
                <td align="center" style="padding:0 0 28px 0;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td align="center" bgcolor="#34C759" style="background-color:#34C759;border-radius:12px;">
                        <a href="${resetUrl}" target="_blank" style="display:inline-block;padding:14px 36px;font-family:Arial,Helvetica,sans-serif;font-size:16px;font-weight:bold;color:#0A0A14;text-decoration:none;min-height:44px;line-height:20px;">
                          Reset Password
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
              <!-- Fallback link -->
              <tr>
                <td align="center" style="font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:20px;color:#666666;padding:0 0 8px 0;">
                  If the button does not work, copy and paste this URL into your browser:
                </td>
              </tr>
              <tr>
                <td align="center" style="font-family:monospace;font-size:12px;line-height:18px;color:#34C759;word-break:break-all;padding:0 0 24px 0;">
                  ${resetUrl}
                </td>
              </tr>
              <!-- Divider -->
              <tr>
                <td style="border-top:1px solid #222222;padding:24px 0 0 0;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                      <td style="font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:20px;color:#555555;">
                        If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td align="center" style="padding:24px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#444444;">
            NourishAI &mdash; AI-Powered Nutrition Tracking
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 3 requests per 15 minutes per IP
    const ip = getClientIp(request);
    const limit = checkRateLimit(`forgot-password:${ip}`, 3, 15 * 60 * 1000);
    if (!limit.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Try again later." },
        {
          status: 429,
          headers: {
            "Retry-After": String(
              Math.ceil((limit.resetAt - Date.now()) / 1000)
            ),
          },
        }
      );
    }

    const { email } = await request.json();

    if (!email || typeof email !== "string" || email.length > 254) {
      return NextResponse.json(
        { message: "If an account exists, a reset link has been sent." },
        { status: 200 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Look up active admin by email
    const database = db();
    const [admin] = await database
      .select({ id: adminUsers.id, email: adminUsers.email })
      .from(adminUsers)
      .where(
        and(
          eq(adminUsers.email, normalizedEmail),
          eq(adminUsers.isActive, true)
        )
      )
      .limit(1);

    if (admin) {
      // Clean up expired tokens before adding a new one
      cleanupTokens();

      // Generate a secure token
      const token = crypto.randomBytes(32).toString("hex");
      resetTokens.set(token, {
        adminId: admin.id,
        expiresAt: Date.now() + 15 * 60 * 1000, // 15 minutes
      });

      // Build reset URL
      const resetUrl = `${APP_URL}/admin/reset-password?token=${token}`;

      // Send email via Resend
      try {
        const resend = getResend();
        await resend.emails.send({
          from: "NourishAI <noreply@nourishhealthai.com>",
          to: admin.email,
          subject: "Reset your NourishAI admin password",
          html: buildResetEmailHtml(resetUrl),
        });
      } catch (emailError) {
        console.error("Failed to send reset email:", emailError);
        // Don't expose email failure to client
      }
    }

    // Always return success (don't reveal if email exists)
    return NextResponse.json({
      message: "If an account exists, a reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { message: "If an account exists, a reset link has been sent." },
      { status: 200 }
    );
  }
}
