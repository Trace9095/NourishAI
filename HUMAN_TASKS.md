# NourishAI — Human Tasks (Trace)

> Tasks that require Trace's direct action. Check items off as completed.

---

## CRITICAL — Do These First

- [x] **Add domain to Vercel:** Dashboard > nourish-ai > Settings > Domains > Add `nourishhealthai.com`
- [x] **Run Drizzle migration:** `cd backend && npx drizzle-kit push` — creates ALL tables (users, scan_usage, admin_users, blog_posts, contact_submissions)
- [x] **Set ADMIN_SETUP_TOKEN env var:** Set to `nourishai-admin-setup-2026` in Vercel production
- [x] **Set ADMIN_SESSION_SECRET env var:** Set in Vercel production for signing session cookies
- [x] **Seed your admin account:** Super admin seeded (CEO@epicai.ai, super_admin role)
  - Login at `/admin` with email `CEO@epicai.ai` + password `Trace87223!`
  - **Admin users:** /admin/users — add Adam and other admins
  - **Forgot password:** /admin/forgot-password (requires Resend domain verification)

## Xcode Project Setup

- [x] **Xcode project generated:** `ios/NourishAI.xcodeproj/project.pbxproj` created programmatically
  - Bundle Identifier: `com.epicai.nourishai`
  - iOS 17.0 deployment target, Swift 6.0
  - All 21 Swift files registered in build phases
  - HealthKit, App Groups, Camera/Photos entitlements configured
- [x] **All Swift files in project:** 21 files registered in pbxproj

### Swift files (21 total):
**Root:** NourishAIApp.swift, ContentView.swift, Constants.swift
**Models/** (3): UserProfile.swift, NutritionModels.swift, NutritionCalculator.swift
**Services/** (3): NourishAPIManager.swift, HealthKitManager.swift, SubscriptionManager.swift
**Views/Dashboard/** (1): DashboardView.swift
**Views/FoodLog/** (5): FoodLogView.swift, AIFoodCameraView.swift, AIFoodChatView.swift, ManualEntryView.swift, BarcodeScanView.swift
**Views/Onboarding/** (1): OnboardingContainerView.swift
**Views/Progress/** (1): NutritionProgressView.swift (file on disk is ProgressView.swift — struct renamed inside)
**Views/Settings/** (1): SettingsView.swift
**Views/Subscription/** (1): SubscriptionView.swift
**Components/** (2): MacroRingView.swift, MealRow.swift

- [ ] **Open in Xcode:** Open `ios/NourishAI.xcodeproj` in Xcode
  - Set your Apple Developer Team in Signing & Capabilities
  - Build and fix any signing issues
- [ ] **Add Watch target:** File > New > Target > watchOS > Watch App
- [ ] **Add Widget target:** File > New > Target > iOS > Widget Extension
- [ ] **Verify capabilities in Xcode:**
  - HealthKit (iOS + Watch)
  - In-App Purchase (iOS)
  - App Groups: `group.com.epicai.nourishai` (iOS + Widget)
  - Push Notifications (iOS)
- [ ] **Create StoreKit config:** File > New > StoreKit Configuration File > `NourishAI.storekit`

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
  - Test monthly purchase flow (approve -> dismiss paywall)
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
- [x] **Add domain in Vercel Dashboard**
- [x] Verify SSL certificate (site loads over HTTPS)

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
| ADMIN_SETUP_TOKEN | SET | `nourishai-admin-setup-2026` |
| ADMIN_SESSION_SECRET | SET | Random string for session signing |

- [ ] **Verify Resend domain:** Add `nourishhealthai.com` in Resend Dashboard

---

## Notes

### Admin Login Credentials
- **URL:** https://nourishhealthai.com/admin
- **Email:** CEO@epicai.ai
- **Password:** Trace87223! (changed via password reset)
- **Role:** super_admin
- **Users page:** /admin/users (can add Adam and other admins)
- **Forgot password:** /admin/forgot-password (sends reset email via Resend)

### HealthKit Data
**Reads:** Height, weight, biological sex, DOB, steps, active calories, sleep
**Writes:** Dietary energy, protein, carbs, fat, fiber, sugar, sodium, water, body mass

### Database Tables (migration complete)
- `users` — iOS app device registrations
- `scan_usage` — AI scan tracking and rate limiting
- `admin_users` — Dashboard admin accounts with roles (super_admin, admin, viewer)
- `blog_posts` — Blog content (currently using static file, DB ready for future)
- `contact_submissions` — Contact form entries
