import { cookies } from "next/headers";
import { db } from "@/lib/db";
import { adminUsers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

const COOKIE_NAME = "nourishai-admin-session";
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET;
if (!SESSION_SECRET) {
  // In production, this MUST be set. During build (SSG), admin routes aren't invoked.
  if (process.env.NODE_ENV === "production" && typeof window === "undefined") {
    console.warn("ADMIN_SESSION_SECRET not set — admin auth will fail");
  }
}

function getSecret(): string {
  if (!SESSION_SECRET) throw new Error("ADMIN_SESSION_SECRET env var is required");
  return SESSION_SECRET;
}

// Password hashing with PBKDF2 (Node.js crypto, works in Vercel serverless)
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedHash: string): boolean {
  const [salt, hash] = storedHash.split(":");
  if (!salt || !hash) return false;
  const testHash = crypto.pbkdf2Sync(password, salt, 100000, 64, "sha512").toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(testHash));
}

// Session token: HMAC of admin user ID + expiry
function createToken(adminId: string, expiresAt: number): string {
  const payload = `${adminId}:${expiresAt}`;
  const hmac = crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");
  return Buffer.from(`${payload}:${hmac}`).toString("base64");
}

function verifyToken(token: string): { adminId: string; expiresAt: number } | null {
  try {
    const decoded = Buffer.from(token, "base64").toString();
    const parts = decoded.split(":");
    if (parts.length !== 3) return null;
    const [adminId, expiresStr, hmac] = parts;
    const expiresAt = parseInt(expiresStr, 10);
    if (isNaN(expiresAt) || Date.now() > expiresAt) return null;

    const payload = `${adminId}:${expiresStr}`;
    const expectedHmac = crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");
    if (!crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(expectedHmac))) return null;

    return { adminId, expiresAt };
  } catch {
    return null;
  }
}

export async function createSession(adminId: string): Promise<void> {
  const expiresAt = Date.now() + SESSION_DURATION;
  const token = createToken(adminId, expiresAt);

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(expiresAt),
  });
}

export async function verifySession(): Promise<{ adminId: string } | null> {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get(COOKIE_NAME);
    if (!session?.value) return null;
    const result = verifyToken(session.value);
    if (!result) return null;
    return { adminId: result.adminId };
  } catch {
    return null;
  }
}

export async function getSessionAdmin() {
  const session = await verifySession();
  if (!session) return null;

  try {
    const database = db();
    const [admin] = await database
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.id, session.adminId))
      .limit(1);
    if (!admin || !admin.isActive) return null;
    return admin;
  } catch {
    return null;
  }
}

// Password reset tokens: HMAC-based, self-validating (works on serverless)
// Includes password hash prefix in HMAC so token is invalidated after password change
export function createResetToken(adminId: string, passwordHash: string): string {
  const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes
  const hashPrefix = passwordHash.slice(0, 16);
  const payload = `reset:${adminId}:${expiresAt}:${hashPrefix}`;
  const hmac = crypto.createHmac("sha256", getSecret()).update(payload).digest("hex");
  return Buffer.from(`${adminId}:${expiresAt}:${hmac}`).toString("base64url");
}

export function verifyResetToken(
  token: string,
  passwordHash: string
): { adminId: string } | null {
  try {
    const decoded = Buffer.from(token, "base64url").toString();
    const parts = decoded.split(":");
    if (parts.length !== 3) return null;
    const [adminId, expiresStr, hmac] = parts;
    const expiresAt = parseInt(expiresStr, 10);
    if (isNaN(expiresAt) || Date.now() > expiresAt) return null;

    const hashPrefix = passwordHash.slice(0, 16);
    const payload = `reset:${adminId}:${expiresStr}:${hashPrefix}`;
    const expectedHmac = crypto
      .createHmac("sha256", getSecret())
      .update(payload)
      .digest("hex");
    if (!crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(expectedHmac)))
      return null;

    return { adminId };
  } catch {
    return null;
  }
}

export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export { COOKIE_NAME };
