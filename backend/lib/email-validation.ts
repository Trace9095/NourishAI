/**
 * Server-side email validation beyond simple regex.
 * Blocks disposable/throwaway domains and verifies MX records.
 */

// Common disposable email domains (bots love these)
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com", "guerrillamail.com", "guerrillamail.net", "tempmail.com",
  "throwaway.email", "yopmail.com", "sharklasers.com", "guerrillamailblock.com",
  "grr.la", "dispostable.com", "mailnesia.com", "maildrop.cc", "discard.email",
  "temp-mail.org", "fakeinbox.com", "trashmail.com", "trashmail.net",
  "trashmail.me", "mailcatch.com", "10minutemail.com", "tempail.com",
  "mohmal.com", "burnermail.io", "jetable.org", "getairmail.com",
  "mailexpire.com", "tempinbox.com", "mailnull.com", "spamgourmet.com",
  "mytrashmail.com", "getnada.com", "emailondeck.com", "tempr.email",
  "33mail.com", "maildrop.cc", "inboxkitten.com", "harakirimail.com",
  "crazymailing.com", "mailsac.com", "tempmailo.com", "emlpro.com",
  "correotemporal.org", "mintemail.com", "trash-mail.com", "one-time.email",
  "luxusmail.org", "anonaddy.com", "simplelogin.co",
]);

// Domains that aren't real email providers
const SUSPICIOUS_TLDS = new Set([
  ".xyz", ".top", ".click", ".loan", ".work", ".gq", ".cf", ".tk", ".ml", ".ga",
]);

export function extractDomain(email: string): string {
  return email.split("@")[1]?.toLowerCase() ?? "";
}

export function isDisposableEmail(email: string): boolean {
  const domain = extractDomain(email);
  if (DISPOSABLE_DOMAINS.has(domain)) return true;

  // Check suspicious TLDs
  for (const tld of SUSPICIOUS_TLDS) {
    if (domain.endsWith(tld)) return true;
  }

  return false;
}

/**
 * Verify the email domain has MX records (real mail server).
 * Uses DNS over HTTPS (Cloudflare) — works in serverless.
 */
export async function hasMxRecords(email: string): Promise<boolean> {
  const domain = extractDomain(email);
  if (!domain) return false;

  try {
    const res = await fetch(
      `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=MX`,
      {
        headers: { Accept: "application/dns-json" },
        signal: AbortSignal.timeout(3000), // 3s timeout
      }
    );

    if (!res.ok) return true; // Fail open — don't block on DNS issues

    const data = await res.json();
    // Status 0 = NOERROR, Answer array has MX records
    return data.Status === 0 && Array.isArray(data.Answer) && data.Answer.length > 0;
  } catch {
    return true; // Fail open on network errors
  }
}
