# NourishAI — Running TODO

> Running feature backlog across all phases. Check items off as completed.
> See `PHASES.md` for phase-by-phase breakdown.

---

## V1 MVP (Phases 0-5)

### Infrastructure
- [x] Create folder structure
- [x] Initialize git repo
- [x] Create GitHub repo (Trace9095/NourishAI)
- [ ] Create Vercel project (`nourish-ai`)
- [ ] Add Neon PostgreSQL via Vercel Integration
- [ ] Set env vars (ANTHROPIC_API_KEY, RESEND_API_KEY, DATABASE_URL)
- [ ] Purchase domain (nourishai.app / .co / .com)
- [ ] Point domain to Vercel

### iOS App — Models & Services
- [ ] Create Xcode project with targets (iOS, Watch, Widget)
- [ ] Copy NutritionModels.swift from LiftLabPro (as-is)
- [ ] Copy WaterIntakeModels.swift from LiftLabPro (as-is)
- [ ] Copy BarcodeScanner.swift from LiftLabPro (as-is)
- [ ] Copy HapticManager.swift from LiftLabPro (as-is)
- [ ] Copy DesignSystem.swift from LiftLabPro (as-is)
- [ ] Copy OfflineManager.swift from LiftLabPro (as-is)
- [ ] Create UserProfile.swift (trimmed from LiftLabPro)
- [ ] Create AllEnums.swift (nutrition enums only)
- [ ] Create NutritionCalculator.swift (BMR/TDEE/macros only)
- [ ] Create GoalModels.swift (NutritionGoal enum)
- [ ] Create NourishAPIManager.swift (server proxy client)
- [ ] Adapt HealthKitManager.swift (remove workout methods)
- [ ] Simplify SubscriptionManager.swift (2 tiers, scan-based)
- [ ] Adapt NotificationManager.swift (meal reminders)
- [ ] Create Constants.swift (NourishAI brand colors)

### iOS App — Views
- [ ] Build NourishAIApp.swift (SwiftData schema)
- [ ] Build ContentView.swift (onboarding check + TabView)
- [ ] Build OnboardingFlow (7 screens)
- [ ] Build DashboardView (macro rings, recent meals, quick-add FAB)
- [ ] Build FoodLogView (meal list grouped by MealType)
- [ ] Build AIFoodCameraView (camera -> server -> confirm -> log)
- [ ] Build AIFoodChatView (text-based food analysis)
- [ ] Build ManualEntryView (form-based entry)
- [ ] Build BarcodeScanView (scanner + OpenFoodFacts lookup)
- [ ] Build ProgressView (weight chart, macro trends, streaks)
- [ ] Build SettingsView (profile, goals, HealthKit, notifications)
- [ ] Build SubscriptionView (paywall — Free vs Pro)
- [ ] Build UpgradePromptView (triggered at scan limit)

### iOS App — Components
- [ ] Build MacroRingView (circular progress)
- [ ] Build MealCard (food entry card)
- [ ] Build NutrientBar (horizontal progress)
- [ ] Build QuickAddFAB (floating action button with options)

### Website — Landing & Marketing
- [ ] Scaffold Next.js 16 project
- [ ] Build landing page (hero, features, pricing, CTA)
- [ ] Build pricing page
- [ ] Build blog engine + seed articles
- [ ] Build privacy policy page
- [ ] Build terms of service page
- [ ] Build accessibility statement page
- [ ] Build branded 404 page
- [ ] Create dynamic OG image (opengraph-image.tsx)
- [ ] Create robots.ts (19-bot Gold Standard)
- [ ] Create sitemap.ts
- [ ] Create llms.txt + ai.txt
- [ ] Create full favicon array
- [ ] Create site.webmanifest
- [ ] Implement cookie consent (3-tier)
- [ ] Implement security headers in next.config.ts
- [ ] Set up Vercel Analytics

### Website — API Routes (iOS Backend)
- [ ] Set up Drizzle ORM + Neon connection
- [ ] Create database schema (users, scan_usage)
- [ ] Build /api/register-device (create user, return auth token)
- [ ] Build /api/analyze-food (Claude Haiku vision proxy)
- [ ] Build /api/analyze-description (text-based food analysis)
- [ ] Build /api/lookup-barcode (OpenFoodFacts API)
- [ ] Build /api/scan-count (remaining scans)
- [ ] Build /api/verify-subscription (StoreKit receipt validation)
- [ ] Build /api/contact (Resend email)

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
- [ ] Blog SEO articles (5 seed posts)
- [ ] Social sharing OG images
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
