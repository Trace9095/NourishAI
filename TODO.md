# NourishAI — Running TODO

> Running feature backlog across all phases. Check items off as completed.
> See `PHASES.md` for phase-by-phase breakdown.

---

## V1 MVP (Phases 0-5)

### Infrastructure
- [x] Create folder structure
- [x] Initialize git repo
- [x] Create GitHub repo (Trace9095/NourishAI)
- [x] Create Vercel project (`nourish-ai`)
- [x] Add Neon PostgreSQL via Vercel Integration
- [x] Set env vars (ANTHROPIC_API_KEY, RESEND_API_KEY, DATABASE_URL, NEXT_PUBLIC_APP_URL)
- [x] Purchase domain (nourishhealthai.com)
- [x] Add domain to Vercel Dashboard
- [x] Set ADMIN_SETUP_TOKEN env var in Vercel
- [x] Set ADMIN_SESSION_SECRET env var in Vercel
- [x] Run Drizzle migration (`npx drizzle-kit push`)
- [x] Seed admin account via POST /api/admin/setup

### iOS App — Models & Services
- [ ] Create Xcode project with targets (iOS, Watch, Widget) — TRACE MUST DO IN XCODE UI
- [x] Create UserProfile.swift
- [x] Create NutritionModels.swift
- [x] Create NutritionCalculator.swift
- [x] Create NourishAPIManager.swift (server proxy client)
- [x] Create HealthKitManager.swift
- [x] Create Constants.swift (NourishAI brand colors)

### iOS App — Views
- [x] Build NourishAIApp.swift (SwiftData schema)
- [x] Build ContentView.swift (onboarding check + TabView)
- [x] Build OnboardingContainerView (7 screens)
- [x] Build DashboardView (macro rings, recent meals, quick-add FAB)
- [x] Build FoodLogView (meal list grouped by MealType)
- [x] Build AIFoodCameraView (camera → server → confirm → log)
- [x] Build AIFoodChatView (text-based food analysis)
- [x] Build ManualEntryView (form-based entry)
- [x] Build BarcodeScanView (scanner + OpenFoodFacts lookup)
- [x] Build ProgressView (weight chart, macro trends, streaks)
- [x] Build SettingsView (profile, goals, HealthKit, notifications)
- [x] Build SubscriptionView (paywall — Free vs Pro)

### iOS App — Services (continued)
- [x] Build SubscriptionManager.swift (StoreKit 2 integration)

### iOS App — Components
- [x] Build MacroRingView (circular progress)
- [x] Build MealRow (food entry row — source icon, macros display)

### Website — Landing & Marketing
- [x] Scaffold Next.js 16 project
- [x] Build landing page (hero, features, pricing, testimonials, FAQ, CTA)
- [x] Build features page (/features)
- [x] Build about page (/about)
- [x] Build blog engine + 5 seed articles
- [x] Build contact page with form (/contact)
- [x] Build brand page with referral links (/brand)
- [x] Build privacy policy page
- [x] Build terms of service page
- [x] Build accessibility statement page
- [x] Build branded 404 page (gradient orbs, quick nav)
- [x] Create dynamic OG image (opengraph-image.tsx)
- [x] Create robots.ts (19-bot Gold Standard)
- [x] Create sitemap.ts (all pages)
- [x] Create llms.txt + ai.txt
- [x] Create full favicon array
- [x] Create site.webmanifest
- [x] Implement cookie consent (3-tier)
- [x] Implement security headers in next.config.ts
- [x] Add testimonials section (6 testimonials)
- [x] Add FAQ section (8 questions with accordion)
- [x] Set up Vercel Analytics + Speed Insights

### Website — Admin Dashboard
- [x] Build admin login page (/admin)
- [x] Build admin dashboard (/admin/dashboard — 12 KPIs, charts, tables)
- [x] Build admin auth (PBKDF2 + HMAC sessions)
- [x] Build admin middleware (cookie check, redirect)
- [x] Build admin API routes (login, logout, setup, stats)
- [x] Add footer lock icon (Gold Standard pattern)

### Website — API Routes (iOS Backend)
- [x] Set up Drizzle ORM + Neon connection
- [x] Create database schema (5 tables)
- [x] Build /api/register-device
- [x] Build /api/analyze-food (Claude Haiku vision proxy)
- [x] Build /api/analyze-description (text-based analysis)
- [x] Build /api/lookup-barcode (OpenFoodFacts API)
- [x] Build /api/scan-count (remaining scans)
- [x] Build /api/verify-subscription (StoreKit receipt validation)
- [ ] Integrate Apple App Store Server API for server-side receipt verification (pre-launch)
- [x] Build /api/contact (Resend email)

### Apple Watch
- [ ] Build NourishWatchApp.swift
- [ ] Build WatchDashboard (macro summary)
- [ ] Build WatchConnectivityManager (macro data sync)
- [ ] Add water quick-add from Watch

### iOS Widgets
- [ ] Build NourishWidget (small/medium/large)
- [ ] Configure App Group for widget data sharing

### App Store & Launch
- [ ] Register app in App Store Connect
- [ ] Create subscription group + products
- [ ] Configure StoreKit testing file in Xcode
- [ ] Create app icon (all sizes)
- [ ] Create App Store screenshots (6.7" + 6.1")
- [ ] Write App Store description + keywords
- [ ] TestFlight beta
- [ ] App Store submission

### Marketing
- [ ] Instagram launch content
- [x] Blog SEO articles (5 seed posts)
- [x] Social sharing OG images
- [ ] App Store optimization (ASO)

---

## V2 — AI Meal Plans + Grocery Lists
- [ ] AI meal plan generation (Claude Sonnet)
- [ ] Weekly meal plan UI
- [ ] Grocery list generation from meal plan
- [ ] Grocery list export (share sheet)
- [ ] Meal plan templates (muscle gain, fat loss, maintenance)

## V3 — Restaurant Menu Scanner
- [ ] Camera-based menu scanning
- [ ] Website URL menu scraping
- [ ] Healthiest option recommendations per dietary goal
- [ ] Restaurant favorites/history

## V4 — Location-Based Healthy Eating
- [ ] GPS-based nearby restaurant search
- [ ] Healthy menu item recommendations by location
- [ ] "Healthy near me" feature
- [ ] Integration with Google Places / Yelp API

## V5 — Social Features
- [ ] Share meals with friends
- [ ] Nutrition challenges
- [ ] Leaderboards (consistency, macro accuracy)
- [ ] Feed / activity stream

## V6 — Multi-Platform
- [ ] iPad app (adaptive layout)
- [ ] macOS Catalyst
- [ ] Android (if warranted by demand)
