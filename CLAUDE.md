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

**Pages (16):**
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
- `app/admin/page.tsx` — Admin login (email + password, forgot password link)
- `app/admin/dashboard/page.tsx` — Full admin dashboard (12 KPIs, charts, tables, auto-refresh)
- `app/admin/users/page.tsx` — Admin users management (CRUD, role badges, inline add form)
- `app/admin/instagram-calendar/page.tsx` — Instagram content calendar (grid/list, filters, posted tracking)
- `app/admin/forgot-password/page.tsx` — Forgot password form (email input)
- `app/admin/reset-password/page.tsx` — Reset password form (token validation, dual password input)

**API Routes (17) + RSS Feed:**
- `api/analyze-food/route.ts` — Claude Haiku vision proxy (photo → macros)
- `api/analyze-description/route.ts` — Text-based food analysis
- `api/analyze-menu/route.ts` — Menu photo scanning with health insights (Claude Haiku vision)
- `api/suggest-foods/route.ts` — AI food suggestions based on remaining macros (Claude Haiku text)
- `api/chat/route.ts` — AI nutrition chat assistant (Claude Sonnet, 20 msg/day free)
- `api/lookup-barcode/route.ts` — OpenFoodFacts API (free)
- `api/register-device/route.ts` — Device UUID registration
- `api/scan-count/route.ts` — Usage tracking / remaining scans
- `api/verify-subscription/route.ts` — StoreKit receipt validation
- `api/contact/route.ts` — Contact form (Resend email)
- `api/admin/login/route.ts` — Admin login (PBKDF2 password verification)
- `api/admin/logout/route.ts` — Session cookie destruction
- `api/admin/setup/route.ts` — One-time admin seed (protected by ADMIN_SETUP_TOKEN)
- `api/admin/stats/route.ts` — Dashboard data (users, scans, revenue, costs)
- `api/admin/users/route.ts` — Admin user CRUD (GET, POST, PATCH, DELETE with role checks)
- `api/admin/forgot-password/route.ts` — Password reset email (Resend + in-memory token, 15min expiry)
- `api/admin/reset-password/route.ts` — Token validation + PBKDF2 password update

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

### iOS (25 Swift files + Xcode project)

**Root (3):** NourishAIApp.swift, ContentView.swift, Constants.swift
**Models (3):** UserProfile.swift, NutritionModels.swift, NutritionCalculator.swift
**Services (3):** NourishAPIManager.swift, HealthKitManager.swift, SubscriptionManager.swift
**Components (2):** MacroRingView.swift, MealRow.swift
**Views/Dashboard (1):** DashboardView.swift
**Views/FoodLog (7):** FoodLogView.swift, AIFoodCameraView.swift, AIFoodChatView.swift, ManualEntryView.swift, BarcodeScanView.swift, MenuScanView.swift, FoodIdeasView.swift
**Views/Discovery (1):** RestaurantMapView.swift
**Views/Chat (1):** NutritionChatView.swift
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
| ADMIN_SETUP_TOKEN | SET | `nourishai-admin-setup-2026` |
| ADMIN_SESSION_SECRET | SET | Random string for session signing |

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

- **Login:** `/admin` (email + password, "Forgot password?" link)
- **Dashboard:** `/admin/dashboard` (protected by middleware cookie check)
- **Users:** `/admin/users` (CRUD for admin accounts — add/edit/deactivate admins)
- **Forgot Password:** `/admin/forgot-password` → sends email via Resend with reset token
- **Reset Password:** `/admin/reset-password?token=...` → validates token, sets new password
- **Setup:** POST `/api/admin/setup` with `ADMIN_SETUP_TOKEN` to seed first super_admin
- **Roles:** super_admin, admin, viewer (pgEnum in schema)
- **Instagram:** `/admin/instagram-calendar` (grid/list view, month filter, search, posted tracking)
- **Features:** 12 KPI cards, scan/user charts (30-day), recent activity tables, auto-refresh 30s (pauses on tab hide)
- **Footer lock icon** links to `/admin` (Gold Standard pattern)

## Session History

### Sessions 68-71 (March 2026)
- Phase 0 COMPLETE: Infrastructure, GitHub repo, Vercel project, docs, SVG logo
- Phase 1 DONE: 21 iOS Swift files written (awaiting Xcode project creation)
- Phase 2 DONE: All views + services, all compile errors resolved, all cross-file deps verified
- Phase 3 DONE: Full website (12 pages), 11 API routes + RSS feed, admin dashboard, Gold Standard compliant
- Session 71: Security hardening (removed hardcoded session secret, fixed CORS), iOS fixes (ProgressView rename, servingSize type mismatch, WaterEntry model container, MealRow optional binding), FAQ CTA buttons, comprehensive code review via background agents
- Session 72: Fixed all remaining code review findings. iOS: DashboardView #Predicate crash (Calendar not translatable), SubscriptionManager Task.detached Swift 6 violation, BarcodeScanView loading spinner state machine, AIFoodCameraView PhotosPicker wiring, SubscriptionView isPurchasing reset. Web: scan limit consistency (all scan types counted), input size limits, cooldown on analyze-description, CookieConsentBanner hidden on admin, complete favicon metadata, device ID truncation in admin stats, blog Copy Link client component.
- Session 73: Generated Xcode project.pbxproj programmatically (all 21 Swift files, iOS 17, Swift 6, MainActor isolation). Set all Vercel env vars (ADMIN_SETUP_TOKEN, ADMIN_SESSION_SECRET). Ran Drizzle migration (5 tables). Seeded admin account (CEO@epicai.ai, super_admin). Verified admin login, website live at nourishhealthai.com, API routes responding.
- Session 74: Admin users management (/admin/users with CRUD), forgot password flow (Resend email + token reset), fixed Claude JSON parsing (strip markdown fences), fixed barcode kJ/kcal swap detection, expanded FAQ to 34 questions (6 categories), expanded blog to 8 posts, marketing engine (5 templates + March/April calendars = 35 posts, 25 PNGs, 1 MP4). Full Gold Standard audit passed all 36 rules. Security headers verified live. All docs updated.
- Session 75: Security audit (53 findings from 2 background agents). Critical fix: replaced in-memory password reset tokens with HMAC-based self-validating tokens (serverless-safe). Added isActive check to getSessionAdmin(). Fixed tokensUsed NaN, 44px touch targets on admin pages, CSS block/flex conflicts, contact form double-encoding (raw in DB, escape in email only), removed unused rateLimitKey. All fixes deployed to Vercel (READY).
- Session 76: Instagram calendar admin page (/admin/instagram-calendar — grid/list view, month filters, search, posted tracking, lightbox). May/June 2026 content calendars (33 new posts, total 68 across Mar-Jun). Dashboard auto-refresh pauses on tab hide. Password complexity requirements (uppercase + lowercase + number) on admin create and reset. Email format validation. 2 new blog posts (10 total). Per-page OG images deployed.
- Session 77: V1 MVP Expansion — 6 phases implemented:
  - Phase 1: Fixed all 68 Instagram calendar JSON field names (4 months) to match HTML templates. Regenerated all 65 PNGs + 3 MP4s.
  - Phase 3: Menu scanning API route (Claude Haiku vision, health scores 1-10) + iOS MenuScanView
  - Phase 4: Food suggestions API route (Claude Haiku text, 5 suggestions) + iOS FoodIdeasView
  - Phase 5: Restaurant discovery via Apple MapKit (iOS-only, no backend) + RestaurantMapView
  - Phase 6: AI nutrition chat API route (Claude Sonnet, 20 msg/day free) + iOS NutritionChatView
  - iOS wiring: 3 new API endpoints in Constants, 3 new manager methods, DashboardView AddFoodSheet + restaurant card
  - 4 new iOS Swift files (need Xcode project addition), 3 new API routes, 8 calendar JSONs fixed
  - All deployed to Vercel (READY). Visual audit screenshots saved.
- Remaining: Open project in Xcode (set team, build, add 4 new Swift files), Watch/Widget targets, StoreKit config, App Store Connect setup, payment testing, Resend domain verification, NSLocationWhenInUseUsageDescription in Info.plist
- Session 78: iOS BUILD SUCCEEDED on simulator. Fixed SettingsView compile errors (NutritionGoal/ActivityLevel enum refs, biologicalSex property, calculateTargets parameter order). Made Settings fully editable (Edit/Save/Cancel toolbar, profile fields + macro target fields + Recalculate Targets). Fixed reel timing bug (CSS animations ran real-time during frame capture — fixed with Web Animations API pause+seek for frame-accurate 17s videos). All 8 reels regenerated (510 frames each, 30fps). Synced MP4s to backend/public. Updated HUMAN_TASKS.md with App Store Connect screenshot requirements (need iPhone 11 Pro Max for 6.5" 1242x2688, iPhone 14 Pro Max for 6.7" 1284x2778 — iPhone 17 Pro Max produces wrong dimensions).
- Remaining: Reel overhaul (CTA too short at 1.5s, content too small, need more templates + more reels, premium quality), notification system (APNs), story/feed template redesign (remove emojis), hero rotating text, blog dynamic OG, add 4 new Swift files to Xcode, set developer team, Watch/Widget, StoreKit, App Store submission. Screenshot sizes confirmed: iPhone 17 Pro Max = 1260x2736 (6.9"), iPad Pro 13" M5 = 2064x2752 (13").

### Phase Status
| Phase | Status |
|-------|--------|
| 0 — Infrastructure | COMPLETE |
| 1 — iOS Core | DONE (25 source files + Xcode project generated) |
| 2 — iOS Views + AI | DONE |
| 3 — Website + API + DB | DONE (Gold Standard compliant, 17 API routes) |
| 3.5 — V1 Features | DONE (menu scan, food ideas, restaurant discovery, AI chat) |
| 4 — Watch + Widget | NOT STARTED (depends on Xcode project) |
| 5 — Launch | NOT STARTED |

See `PHASES.md` for detailed task tracking, `HUMAN_TASKS.md` for Trace's action items, `TODO.md` for full backlog.
