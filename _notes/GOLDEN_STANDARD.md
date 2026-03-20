# GOLDEN_STANDARD.md — NourishAI (NAI)

> Production URL: https://nourishhealthai.com
> Last reviewed: 2026-03-19 (Session 122)
> Vercel Slug: `nourish-ai`
> Full 106-item checklist: `../../_audit/GOLD_STANDARD_CHECKLIST.md`

---

## Quick Reference

| Stack | Details |
|-------|---------|
| Framework | Next.js 16 App Router + TypeScript + iOS (Swift) |
| Backend Root | `backend/src/app/` |
| Database | Neon Postgres (Prisma) |
| Auth | Custom (email + magic link) |
| Payments | StoreKit 2 (iOS subscriptions) |
| Email | Resend — noreply@nourishhealthai.com |
| Deployment | Vercel (`nourish-ai`) |

---

## Checklist

### Identity & Branding
- [x] Favicon (32x32, 192x192, 512x512 PNG)
- [x] Apple touch icon (180x180)
- [x] OG image on root + key pages (`opengraph-image.tsx`)
- [x] Correct site name + description in metadata
- [x] De-branding: No Epic AI/Epic Adventures branding visitor-facing

### Mobile & Performance
- [x] `100dvh` for full-height sections (not `100vh`)
- [x] `safe-area-inset` padding for iOS notch/home bar
- [x] 44px minimum touch targets on all tappable elements
- [x] No `backdrop-blur` on fixed/sticky elements (iOS Safari bug)
- [x] `next/image` with `quality={90}` + `sizes` prop on heroes
- [ ] Lighthouse audit: LCP < 2.5s, CLS < 0.1, FID < 100ms

### Design System
- [x] Dark theme background
- [x] Consistent brand accent color
- [x] shadcn/ui components
- [x] Empty states, loading skeletons, error states

### SEO & Meta
- [x] Unique title + meta description per page
- [x] Canonical URL set
- [x] robots.txt + sitemap.xml present
- [ ] JSON-LD structured data
- [x] Full OG tags

### Auth & Security
- [x] Security headers in `next.config.ts` (CSP, HSTS, X-Frame-Options, Permissions-Policy)
- [x] No secrets in client-side code or git
- [x] Auth-protected admin routes
- [x] Input validation on all forms
- [x] Rate limiting on auth/sensitive endpoints

### Payments

#### Payments (StoreKit 2 — iOS)
- [x] StoreKit 2 in-app purchases implemented (iOS subscriptions)
- Free tier: Haiku AI model
- Pro tier: Sonnet AI model
- N/A — No web Stripe integration. iOS-only subscriptions.
- If web billing added: `metadata: { site: "nai", app_url: "https://nourishhealthai.com" }`

#### iOS Pricing (TikTok-style dual pricing)
- iOS subscriptions: standard App Store pricing
- Web direct: 30% lower (avoid App Store commission)

### Email

#### Email (Resend)
- [x] Gmail-safe table-based templates
- [x] Lazy Resend init (`getResend()`)
- [x] Welcome emails
- [x] Magic link / auth emails
- [x] FROM: noreply@nourishhealthai.com

### TypeScript & Code Quality
- [x] TypeScript strict mode
- [x] Build passes with 0 errors
- [x] No unused imports

### Deployment
- [x] Vercel deployment live
- [x] Environment variables in Vercel (not .env)
- [x] Custom domain connected + verified
- [x] Branch: `main`

### Version Compliance
- [x] All copyright dates: 2026
- [x] Next.js 16 + React 19
- [x] No deprecated `@vercel/postgres` or `@vercel/kv`

---

## Known Issues / TODO

- [ ] **Phase 4 pending:** Apple Watch app + Home Screen Widget
- [ ] **Phase 5 pending:** Full App Store launch
- [ ] JSON-LD HealthApp / SoftwareApplication schema
- [ ] Lighthouse audit
- **AI models:** Haiku for free tier, Sonnet for pro — cost-optimized
- **Client project:** Coordinate with client for App Store publishing
- **iOS app:** KeychainService + PushNotificationService installed (S81+)
- **All 7 iOS apps in portfolio** have KeychainService (RT, WWBG, TacosY, LiftLabPro, NourishAI, CalmChat + WW Scheduling)

---

*Generated: 2026-03-19 | Epic AI Portfolio*
