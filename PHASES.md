# NourishAI — Development Phases

> Track progress across phases. Update status as work completes.

---

## Phase 0: Infrastructure & Documentation
**Status: COMPLETE**
**Started:** Session 68 (March 2026)

| # | Task | Status |
|---|------|--------|
| 0.1 | Create folder structure | DONE |
| 0.2 | Initialize git repo | DONE |
| 0.3 | Create GitHub repo (Trace9095/NourishAI) | DONE |
| 0.4 | Write CLAUDE.md | DONE |
| 0.5 | Write TODO.md | DONE |
| 0.6 | Write PHASES.md | DONE |
| 0.7 | Write APPLE_SETUP_GUIDE.md | DONE |
| 0.8 | Write _LLM_HANDOFF_PROMPT.md | DONE |
| 0.9 | Scaffold Next.js 16 website | DONE |
| 0.10 | Create Vercel project + env vars | DONE |
| 0.11 | Create SVG logo + brand assets | DONE |
| 0.12 | Update master CLAUDE.md + MEMORY.md | DONE |
| 0.13 | Initial commit + push | DONE |

---

## Phase 1: iOS Core (Models + Services)
**Status: DONE (source files written — awaiting Xcode project)**
**Depends on:** Trace creates Xcode project in Xcode UI

| # | Task | Status |
|---|------|--------|
| 1.1 | Create Xcode project (iOS + Watch + Widget targets) | BLOCKED (Trace must do in Xcode) |
| 1.2 | Copy 6 as-is files from LiftLabPro | SKIPPED (built fresh) |
| 1.3 | Create/adapt 8 modified files | DONE |
| 1.4 | Build SwiftData schema (5 models) | DONE |
| 1.5 | Build NourishAPIManager (server proxy) | DONE |
| 1.6 | Build onboarding flow (7 screens) | DONE |
| 1.7 | Build ContentView + MainTabView | DONE |

---

## Phase 2: iOS Views + AI Features
**Status: DONE (all source files written, cross-file deps resolved)**

| # | Task | Status |
|---|------|--------|
| 2.1 | Build DashboardView | DONE |
| 2.2 | Build FoodLogView + AIFoodCameraView | DONE |
| 2.3 | Build ManualEntryView + BarcodeScanView | DONE |
| 2.4 | Build subscription paywall (SubscriptionView) | DONE |
| 2.5 | Build AIFoodChatView (text description) | DONE |
| 2.6 | Wire up scan tracking + usage limits | DONE (server-side) |
| 2.7 | Build ProgressView | DONE |
| 2.8 | Build SubscriptionManager (StoreKit 2) | DONE |
| 2.9 | Build MealRow component | DONE |
| 2.10 | Fix HealthKit method calls (logNutrition) | DONE |
| 2.11 | Fix API response type mapping (FoodAnalysisResponse) | DONE |
| 2.12 | Fix SubscriptionIDs → SubscriptionProductID | DONE |
| 2.13 | Fix BarcodeResponse convenience accessors | DONE |
| 2.14 | Fix DashboardMealRow naming conflict | DONE |
| 2.15 | Fix ProgressView → NutritionProgressView (SwiftUI name conflict) | DONE |
| 2.16 | Fix servingSize String? type mismatch in 3 views | DONE |
| 2.17 | Fix MealRow optional binding on non-optional | DONE |
| 2.18 | Add WaterEntry to SwiftData model container | DONE |

---

## Phase 3: Website + API Routes + Database
**Status: DONE (Gold Standard 100% compliant)**
**Can run in parallel with:** Phase 1-2 (independent codebase)

| # | Task | Status |
|---|------|--------|
| 3.1 | Set up Neon PostgreSQL | DONE |
| 3.2 | Set up Drizzle ORM + schema | DONE (updated: admin_users, blog_posts, contact_submissions) |
| 3.3 | Build landing page (frontend-design skill) | DONE |
| 3.4 | Build API routes (7 endpoints) | DONE |
| 3.5 | Gold Standard compliance (36 rules) | DONE |
| 3.6 | Legal pages + cookie consent | DONE |
| 3.7 | Blog engine + 5 seed articles | DONE |
| 3.8 | Deploy to Vercel + domain | DEPLOYED (domain needs adding in Vercel Dashboard) |
| 3.9 | Features page (/features) | DONE |
| 3.10 | About page (/about) | DONE |
| 3.11 | Contact page (/contact) | DONE |
| 3.12 | Brand page (/brand) | DONE |
| 3.13 | Admin dashboard (/admin) | DONE |
| 3.14 | Testimonials + FAQ on landing page | DONE |
| 3.15 | Upgraded 404 page | DONE |
| 3.16 | Cookie consent banner (3-tier) | DONE |
| 3.17 | Middleware (admin auth + llms.txt header) | DONE |
| 3.18 | RSS feed (/feed.xml) | DONE |
| 3.19 | Full favicon array (svg, ico, apple-touch, 192, 512) | DONE |
| 3.20 | Logo scroll-to-top on homepage | DONE |
| 3.21 | Contact form saves to DB | DONE |
| 3.22 | Blog posts in sitemap | DONE |
| 3.23 | id="main-content" on all pages | DONE |
| 3.24 | Remove hardcoded session secret fallback | DONE |
| 3.25 | Fix CORS empty-string origin handling | DONE |
| 3.26 | FAQ CTA buttons on contact page | DONE |

---

## Phase 4: Watch + Widget + Polish
**Status: NOT STARTED**
**Depends on:** Xcode project created by Trace

| # | Task | Status |
|---|------|--------|
| 4.1 | Apple Watch companion | PENDING |
| 4.2 | iOS Widgets (small/medium/large) | PENDING |
| 4.3 | Push notifications | PENDING |
| 4.4 | Design polish (animations, haptics) | PENDING |
| 4.5 | App icon + App Store screenshots | PENDING |

---

## Phase 5: Launch
**Status: NOT STARTED**
**Depends on:** Phases 1-4 complete

| # | Task | Status |
|---|------|--------|
| 5.1 | TestFlight beta | PENDING |
| 5.2 | App Store submission | PENDING |
| 5.3 | Marketing website go-live | PENDING |
| 5.4 | Instagram launch content | PENDING |
| 5.5 | Blog SEO push | PENDING |

---

## Future Phases
- **V2:** AI meal plans + grocery lists
- **V3:** Restaurant menu scanner
- **V4:** Location-based healthy eating
- **V5:** Social features
- **V6:** iPad / macOS / Android
