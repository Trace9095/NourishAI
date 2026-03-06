# NourishAI — Project Instructions

> **Owner:** Trace Hildebrand | CEO@epicai.ai | GitHub: Trace9095
> **Bundle ID:** com.epicai.nourishai | **App Group:** group.com.epicai.nourishai
> **Vercel Slug:** `nourish-ai` | **Team:** `team_pGqkBUxWUXiBoZoKYPgweHDl`
> **Repo:** Trace9095/NourishAI | **Branch:** main
> **Domain:** nourishhealthai.com | **Project #:** 23

## What This Is

NourishAI is an AI-powered nutrition tracking iOS app + marketing website. Targets fitness-focused people (gym-goers, macro trackers, athletes). Freemium subscription model.

## Architecture

- **iOS App** (Swift 6 / SwiftUI / iOS 17+) — local-first with SwiftData
- **Marketing Website + Backend API** (Next.js 16 / Tailwind v4 / Vercel) — serves as iOS app's server + admin dashboard
- **Database** (Neon PostgreSQL via Vercel) — user accounts, scan tracking, admin users, blog, contact
- **AI** — Claude Haiku vision via server proxy (NO embedded API keys in iOS)

### Data Split
- **iOS (SwiftData):** UserProfile, DailyNutrition, FoodEntry, SavedFood, DailyWaterIntake
- **Server (Neon PostgreSQL, 5 tables):** users, scan_usage, admin_users, blog_posts, contact_submissions

## File Inventory

### Backend (Next.js 16 — Vercel root dir: `backend/`)

**Pages (12):**
- `app/page.tsx` — Landing page (hero, features, how-it-works, pricing, testimonials, FAQ, download CTA)
- `app/features/page.tsx` — Detailed features with comparison table
- `app/about/page.tsx` — About page with story, values, Epic AI
- `app/blog/page.tsx` — Blog index with category filters
- `app/blog/[slug]/page.tsx` — Blog post pages (SSG via generateStaticParams)
- `app/contact/page.tsx` — Contact page with form
- `app/brand/page.tsx` — Brand assets, colors (click-to-copy), typography, referral links (noindex)
- `app/privacy/page.tsx` — Privacy policy
- `app/terms/page.tsx` — Terms of service
- `app/accessibility/page.tsx` — Accessibility statement
- `app/not-found.tsx` — Branded 404 with gradient orbs, quick nav
- `app/admin/page.tsx` — Admin login (email + password)
- `app/admin/dashboard/page.tsx` — Full admin dashboard (12 KPIs, charts, tables, auto-refresh)

**API Routes (11) + RSS Feed:**
- `api/analyze-food/route.ts` — Claude Haiku vision proxy (photo → macros)
- `api/analyze-description/route.ts` — Text-based food analysis
- `api/lookup-barcode/route.ts` — OpenFoodFacts API (free)
- `api/register-device/route.ts` — Device UUID registration
- `api/scan-count/route.ts` — Usage tracking / remaining scans
- `api/verify-subscription/route.ts` — StoreKit receipt validation
- `api/contact/route.ts` — Contact form (Resend email)
- `api/admin/login/route.ts` — Admin login (PBKDF2 password verification)
- `api/admin/logout/route.ts` — Session cookie destruction
- `api/admin/setup/route.ts` — One-time admin seed (protected by ADMIN_SETUP_TOKEN)
- `api/admin/stats/route.ts` — Dashboard data (users, scans, revenue, costs)

**Components (15):**
AnimateIn, BrandContent, ContactForm, CookieConsentBanner, DownloadCTA, FAQ, Features, Footer, Header, Hero, HowItWorks, MacroRings, Pricing, Stats, Testimonials

**Lib (6 files):**
- `lib/admin-auth.ts` — PBKDF2 hashing, HMAC sessions, HttpOnly cookies
- `lib/blog.ts` — 5 seed articles with full HTML content
- `lib/cookie-consent.ts` — 3-tier consent (necessary/analytics/marketing)
- `lib/security.ts` — CORS utilities
- `lib/db/index.ts` — Neon + Drizzle lazy singleton connection
- `lib/db/schema.ts` — 5 tables (users, scan_usage, admin_users, blog_posts, contact_submissions)

**Other:** `middleware.ts` (admin auth redirect + llms.txt Link header), `app/opengraph-image.tsx`, `app/robots.ts`, `app/sitemap.ts`, `app/feed.xml/route.ts` (RSS), `app/admin/layout.tsx`, `app/blog/layout.tsx`

### iOS (21 Swift files — awaiting Xcode project)

**Root (3):** NourishAIApp.swift, ContentView.swift, Constants.swift
**Models (3):** UserProfile.swift, NutritionModels.swift, NutritionCalculator.swift
**Services (3):** NourishAPIManager.swift, HealthKitManager.swift, SubscriptionManager.swift
**Components (2):** MacroRingView.swift, MealRow.swift
**Views/Dashboard (1):** DashboardView.swift
**Views/FoodLog (5):** FoodLogView.swift, AIFoodCameraView.swift, AIFoodChatView.swift, ManualEntryView.swift, BarcodeScanView.swift
**Views/Onboarding (1):** OnboardingContainerView.swift
**Views/Progress (1):** ProgressView.swift
**Views/Settings (1):** SettingsView.swift
**Views/Subscription (1):** SubscriptionView.swift

**All view dependencies satisfied.** SubscriptionView wired to SubscriptionManager with StoreKit 2.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| iOS | Swift 6, SwiftUI, SwiftData, HealthKit, StoreKit 2, iOS 17+ |
| Web | Next.js 16 App Router, Tailwind CSS v4, Drizzle ORM |
| DB | Neon PostgreSQL (5 tables) |
| AI | Claude Haiku (vision) via server proxy |
| Auth | PBKDF2 + HMAC sessions (admin), device UUID (iOS) |
| Email | Resend API |
| Deploy | Vercel (auto-deploy on push to main) |

## Subscription Model

| Tier | Price | AI Scans |
|------|-------|----------|
| Free | $0 | 1/week |
| Pro | $7.99/mo or $39.99/yr | Unlimited (30s cooldown) |

**Product IDs:** `com.nourishai.subscription.pro.monthly`, `com.nourishai.subscription.pro.annual`

## Brand

- Primary: `#34C759` (green) | Accent: `#FF9500` (orange) | Dark: `#0A0A14` | Card: `#12121A`
- Macros: Protein `#FF6B6B` | Carbs `#4ECDC4` | Fat `#FFE66D` | Calories `#FF9500` | Water `#5AC8FA`
- Typography: SF Pro (iOS), Inter body + Outfit headlines (web)
- Epic AI product — CAN show "Built by Epic AI" branding

## Environment Variables (Vercel)

| Variable | Status | Notes |
|----------|--------|-------|
| ANTHROPIC_API_KEY | SET | Claude API (server-side only) |
| RESEND_API_KEY | SET | Email sending |
| DATABASE_URL | SET | Neon (auto by integration) |
| NEXT_PUBLIC_APP_URL | SET | `https://nourishhealthai.com` |
| ADMIN_SETUP_TOKEN | **NEEDED** | One-time admin seed protection |
| ADMIN_SESSION_SECRET | **NEEDED** | Session cookie signing |

## Build Commands

```bash
cd backend && npx next build     # Website
# iOS: Open ios/NourishAI.xcodeproj in Xcode (must create project first)
```

## Critical Rules

1. **NO embedded API keys in iOS.** All AI calls → `/api/analyze-food` server route.
2. **Rate limiting:** Free = 1 scan/week. Pro = unlimited + 30s cooldown. Server-side.
3. **pbxproj rule:** Create Swift files through Xcode UI, not manually.
4. **Swift 6:** MainActor default. `nonisolated` for background. Codable = Sendable.
5. **Gold Standard:** Website follows all 36 rules (see master CLAUDE.md).
6. **Security pattern:** CORS in `lib/security.ts`, headers in `next.config.ts`. Never both.
7. **No backdrop-blur on fixed/sticky.** Opaque backgrounds only.
8. **44px touch targets.** All tappable elements.
9. **quality={90}** on `<Image>` components. Never on `<ImageIcon>`/`<ImagePlus>`.
10. **Vercel root dir:** `backend/`
11. **Admin auth:** PBKDF2 + HMAC sessions. `ADMIN_SESSION_SECRET` env var required.
12. **Commit format:** `feat:`/`fix:`/`chore:` + `Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>`

## Admin Dashboard

- **Login:** `/admin` (email + password)
- **Dashboard:** `/admin/dashboard` (protected by middleware cookie check)
- **Setup:** POST `/api/admin/setup` with `ADMIN_SETUP_TOKEN` to seed first super_admin
- **Roles:** super_admin, admin, viewer (pgEnum in schema)
- **Features:** 12 KPI cards, scan/user charts (30-day), recent activity tables, auto-refresh 30s
- **Footer lock icon** links to `/admin` (Gold Standard pattern)

## Session History

### Sessions 68-70 (March 2026)
- Phase 0 COMPLETE: Infrastructure, GitHub repo, Vercel project, docs, SVG logo
- Phase 1 DONE: 21 iOS Swift files written (awaiting Xcode project creation)
- Phase 2 DONE: All 5 FoodLog views, SubscriptionView wired to SubscriptionManager (StoreKit 2), MealRow component
- Phase 3 DONE: Full website (12 pages), 11 API routes + RSS feed, admin dashboard, blog engine, cookie consent, middleware, 5 DB tables, full Gold Standard compliance
- Session 70: MealRow.swift created, SubscriptionManager.swift + SubscriptionView wired to StoreKit 2, RSS feed, favicon array, contact form DB save, logo scroll-to-top, legal pages accessibility fix, comprehensive audit + HUMAN_TASKS payment testing checklist
- Remaining: Xcode project creation (Trace), env vars (ADMIN_SETUP_TOKEN, ADMIN_SESSION_SECRET), DB migration, domain in Vercel, Vercel Analytics

### Phase Status
| Phase | Status |
|-------|--------|
| 0 — Infrastructure | COMPLETE |
| 1 — iOS Core | DONE (21 source files written, awaiting Xcode) |
| 2 — iOS Views + AI | DONE |
| 3 — Website + API + DB | DONE (Gold Standard compliant) |
| 4 — Watch + Widget | NOT STARTED (depends on Xcode project) |
| 5 — Launch | NOT STARTED |

See `PHASES.md` for detailed task tracking, `HUMAN_TASKS.md` for Trace's action items, `TODO.md` for full backlog.
