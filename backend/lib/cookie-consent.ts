// Cookie consent utility — 3-tier system (Gold Standard #15)
// Tiers: necessary (always), analytics (opt-in), marketing (opt-in)

export type ConsentLevel = "necessary" | "analytics" | "marketing";

export interface ConsentState {
  necessary: boolean; // always true
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
}

const CONSENT_KEY = "nourishai-cookie-consent";

export function getConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(CONSENT_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function setConsent(analytics: boolean, marketing: boolean): void {
  if (typeof window === "undefined") return;
  const state: ConsentState = {
    necessary: true,
    analytics,
    marketing,
    timestamp: Date.now(),
  };
  localStorage.setItem(CONSENT_KEY, JSON.stringify(state));
}

export function hasConsented(): boolean {
  return getConsent() !== null;
}

export function hasAnalyticsConsent(): boolean {
  const consent = getConsent();
  return consent?.analytics ?? false;
}

export function hasMarketingConsent(): boolean {
  const consent = getConsent();
  return consent?.marketing ?? false;
}
