# NourishAI — Human Tasks (Trace)

> Tasks that require Trace's direct action. Check items off as completed.

---

## CRITICAL — Do These First

- [ ] **Add domain to Vercel:** Dashboard > nourish-ai > Settings > Domains > Add `nourishhealthai.com`
- [ ] **Run Drizzle migration:** `cd backend && npx drizzle-kit push` — creates ALL tables (users, scan_usage, admin_users, blog_posts, contact_submissions)
- [ ] **Set ADMIN_SETUP_TOKEN env var:** Vercel Dashboard > nourish-ai > Settings > Environment Variables > Add `ADMIN_SETUP_TOKEN` with a random string (e.g., `nourishai-setup-2026-random`). This protects the one-time admin setup.
- [ ] **Set ADMIN_SESSION_SECRET env var:** Add `ADMIN_SESSION_SECRET` with a random string for signing session cookies.
- [ ] **Seed your admin account:** After migration + env vars, POST to `/api/admin/setup`:
  ```bash
  curl -X POST https://nourishhealthai.com/api/admin/setup \
    -H "Content-Type: application/json" \
    -d '{"token":"YOUR_ADMIN_SETUP_TOKEN","email":"CEO@epicai.ai","name":"Trace Hildebrand","password":"YOUR_PASSWORD"}'
  ```
  Then login at `/admin` with your email + password.

## Xcode Project Setup

- [ ] **Create Xcode project:** File > New > Project > iOS App
  - Product Name: `NourishAI`
  - Team: Your Apple Developer account
  - Organization Identifier: `com.epicai`
  - Bundle Identifier: `com.epicai.nourishai`
  - Interface: SwiftUI
  - Storage: SwiftData
  - Language: Swift
  - Save to: `NourishAI-main/ios/`
- [ ] **Drag all Swift files into Xcode:** Select all files in `ios/NourishAI/` and drag into the project navigator. Ensure "Create groups" is selected and the iOS target is checked.

### Swift files to add (21 total):
**Root:** NourishAIApp.swift, ContentView.swift, Constants.swift
**Models/** (3): UserProfile.swift, NutritionModels.swift, NutritionCalculator.swift
**Services/** (3): NourishAPIManager.swift, HealthKitManager.swift, SubscriptionManager.swift
**Views/Dashboard/** (1): DashboardView.swift
**Views/FoodLog/** (5): FoodLogView.swift, AIFoodCameraView.swift, AIFoodChatView.swift, ManualEntryView.swift, BarcodeScanView.swift
**Views/Onboarding/** (1): OnboardingContainerView.swift
**Views/Progress/** (1): ProgressView.swift
**Views/Settings/** (1): SettingsView.swift
**Views/Subscription/** (1): SubscriptionView.swift
**Services/** (1): SubscriptionManager.swift
**Components/** (2): MealRow.swift, MacroRingView.swift
**Views/Subscription/** (1): SubscriptionView.swift

- [ ] **Add Watch target:** File > New > Target > watchOS > Watch App
- [ ] **Add Widget target:** File > New > Target > iOS > Widget Extension
- [ ] **Enable capabilities:**
  - HealthKit (iOS + Watch)
  - In-App Purchase (iOS)
  - App Groups: `group.com.epicai.nourishai` (iOS + Widget)
  - Push Notifications (iOS)
- [ ] **Create StoreKit config:** File > New > StoreKit Configuration File > `NourishAI.storekit`
- [ ] **Set Swift 6:** Build Settings > `SWIFT_DEFAULT_ACTOR_ISOLATION` = `MainActor`

## App Store Connect

- [ ] Register bundle IDs (`com.epicai.nourishai`, `.watchkitapp`, `.widget`)
- [ ] Register app in App Store Connect
- [ ] Create subscription group "NourishAI Pro" with monthly ($7.99) + annual ($39.99)
- [ ] Add localizations (required for StoreKit)
- [ ] Verify Paid Apps agreement is active
- [ ] See `APPLE_SETUP_GUIDE.md` for full details

## Payment Testing Checklist

- [ ] **Create StoreKit configuration file** in Xcode: File > New > File > StoreKit Configuration File > `NourishAI.storekit`
  - Do NOT sync with App Store Connect (use local testing first)
  - Add subscription group "NourishAI Pro"
  - Add product: `com.nourishai.subscription.pro.monthly` ($7.99/month)
  - Add product: `com.nourishai.subscription.pro.annual` ($39.99/year)
  - Optional: Add 7-day free trial for annual
- [ ] **Set StoreKit config in scheme:** Edit Scheme > Run > Options > StoreKit Configuration > select `NourishAI.storekit`
- [ ] **Test in Simulator:**
  - Verify products load (SubscriptionView shows real prices)
  - Test monthly purchase flow (approve → dismiss paywall)
  - Test annual purchase flow
  - Test restore purchases
  - Verify scan limit enforced for free tier (1/week)
  - Verify unlimited scans after subscribing
  - Test subscription expiry (StoreKit config allows time acceleration)
- [ ] **Sandbox testing:** Create sandbox Apple ID in App Store Connect > Users & Access > Sandbox Testers
- [ ] **TestFlight testing:** Upload build, invite testers, verify payment flow end-to-end

## Domain & DNS

- [x] Purchase domain: nourishhealthai.com
- [x] Point DNS to Vercel in GoDaddy
- [ ] **Add domain in Vercel Dashboard**
- [ ] Verify SSL certificate

## Marketing

- [ ] Create Instagram account
- [ ] App Store screenshots (after app built)
- [ ] App Store description + keywords
- [ ] App icon export (all sizes)

## Environment Variables (Vercel)

| Variable | Status | Notes |
|----------|--------|-------|
| ANTHROPIC_API_KEY | SET | Shared with LiftLabPro |
| RESEND_API_KEY | SET | For email sending |
| DATABASE_URL | SET | Auto by Neon integration |
| NEXT_PUBLIC_APP_URL | SET | `https://nourishhealthai.com` |
| ADMIN_SETUP_TOKEN | NEEDED | One-time admin seed protection |
| ADMIN_SESSION_SECRET | NEEDED | Session cookie signing |

- [ ] **Verify Resend domain:** Add `nourishhealthai.com` in Resend Dashboard

---

## Notes

### HealthKit Data
**Reads:** Height, weight, biological sex, DOB, steps, active calories, sleep
**Writes:** Dietary energy, protein, carbs, fat, fiber, sugar, sodium, water, body mass

### Database Tables (after migration)
- `users` — iOS app device registrations
- `scan_usage` — AI scan tracking and rate limiting
- `admin_users` — Dashboard admin accounts with roles (super_admin, admin, viewer)
- `blog_posts` — Blog content (currently using static file, DB ready for future)
- `contact_submissions` — Contact form entries
