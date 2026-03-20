# NourishAI App Store Production Ready — Design & Plan

> Date: 2026-03-07 | Session: 84

## Problem Statement

NourishAI iOS app has placeholder/fake data, broken HealthKit display, non-functional AI analysis, no working paywall, and missing features. Goal: make it a real, production-quality app ready for App Store submission.

## Root Cause Analysis

### 1. Fake Data Everywhere
`NourishAIApp.swift:31` — `seedScreenshotData()` runs on every fresh install:
- Creates fake profile (name: "Trace", subscriptionTier: "pro", onboardingComplete: true)
- Seeds 5 fake meals, 6 days of fake history, fake water intake
- **Bypasses onboarding entirely** — real users never set up their profile
- Device never registers with backend (registerDevice() only in onboarding completion)

### 2. "AI Analysis Temporarily Unavailable"
`NourishAPIManager.swift:475` — `APIError.analysisServerError` is a catch-all for ANY non-2xx response.
- Since seed data bypasses onboarding, `registerDevice()` never runs
- All API calls include `X-Device-ID` header but backend returns 401 ("Device not registered")
- The generic error message "AI analysis temporarily unavailable" hides the real issue

### 3. HealthKit Shows Fake/Weird Data
- Dashboard Steps card shows `"--"` (hardcoded string, never reads HealthKit)
- Active calories not displayed anywhere
- Nutrition is WRITTEN to HealthKit when logging food, but never READ back
- Fake seed data creates DailyNutrition entries that appear alongside any real HealthKit data

### 4. Subscription System Incomplete
- No StoreKit configuration file for testing
- SubscriptionManager doesn't update UserProfile.subscriptionTier after purchase
- Settings doesn't show current plan details or manage subscription link
- Terms/Privacy buttons in SubscriptionView are no-ops `{}`
- No paywall gates on premium features (menu scan, chat are open to all)

### 5. Menu Scanner Missing Features
- No paywall (anyone can use unlimited)
- No restaurant website URL search capability
- Only supports photo scanning

---

## Implementation Plan

### Phase 0: Remove Seed Data, Fix App Launch (CRITICAL)
**Files:** `NourishAIApp.swift`

1. Wrap `seedScreenshotData()` in `#if DEBUG` — only seeds in simulator/debug builds
2. In release builds, fresh install shows onboarding (creates real profile)
3. Add device registration retry on app launch (ContentView.onAppear)
4. Ensure onboarding creates profile with subscriptionTier: "free"

### Phase 1: Fix HealthKit — Real Data Display
**Files:** `DashboardView.swift`, `HealthKitManager.swift`

1. Add `@State` for steps and active calories in DashboardView
2. Fetch steps via `HealthKitManager.shared.getSteps(for: Date())` on appear
3. Fetch active calories via `HealthKitManager.shared.getActiveCalories(for: Date())`
4. Replace hardcoded "--" in Steps QuickStatCard with real data
5. Add active calories display
6. Add pull-to-refresh to sync HealthKit data
7. Read sleep data from HealthKit (already in read permissions)

### Phase 2: Fix AI Analysis Errors
**Files:** `NourishAPIManager.swift`, `NourishAIApp.swift`, `ContentView.swift`

1. Add auto-registration on app launch (if profile exists but no serverUserId)
2. Improve error handling — parse HTTP status codes for specific error messages:
   - 401: "Please restart the app to register your device"
   - 403: "Weekly scan limit reached. Upgrade to Pro."
   - 429: "Please wait before scanning again"
   - 502: "AI service is busy. Please try again."
   - 503: "AI service is temporarily down"
3. Add retry logic for registration failures
4. Store serverUserId in UserProfile after successful registration

### Phase 3: Subscription & Paywall System
**Files:** `SubscriptionManager.swift`, `SubscriptionView.swift`, `SettingsView.swift`, `UserProfile.swift`

1. Create StoreKit configuration file for Xcode testing
2. After successful purchase, update `UserProfile.subscriptionTier` to "pro"
3. After successful purchase, call `verifySubscription` API to sync with backend
4. Settings subscription section: show plan name, expiry date, manage link
5. Add `manageSubscriptions` environment action
6. Wire Terms/Privacy buttons to actual URLs
7. Add `checkSubscriptionOnLaunch()` to verify entitlements match profile
8. Add paywall gate helper: `requirePro()` that shows SubscriptionView if free

### Phase 4: Menu Scanner — Paywall + URL Search
**Files:** `MenuScanView.swift`, `NourishAPIManager.swift`, `backend/app/api/analyze-menu-url/route.ts` (new)

1. Add scan limit check before menu analysis (same as photo scan limits)
2. Add paywall gate — free users see upgrade prompt after limit
3. Add URL input tab: "Enter restaurant website URL"
4. New backend route: `/api/analyze-menu-url` — fetches URL, extracts menu text, analyzes with Claude
5. iOS: Add URL analysis method to NourishAPIManager
6. iOS: Add segmented control in MenuScanView (Photo | Website URL)

### Phase 5: Chat Paywall + Cost Optimization
**Files:** `backend/app/api/chat/route.ts`, `NutritionChatView.swift`

1. Switch free users to Claude Haiku (cheaper), keep Sonnet for pro
2. Reduce free daily limit from 20 to 5 messages
3. Show clear upgrade CTA when limit approached (3 remaining) and reached
4. Add "Upgrade to Pro for unlimited AI chat" banner

### Phase 6: Production Audit
1. Verify all Swift files in pbxproj
2. Verify Info.plist keys (Camera, Photos, Location, HealthKit)
3. Verify entitlements (HealthKit, Push, IAP)
4. Build in Release mode
5. Backend Gold Standard audit
6. End-to-end API testing from device
7. App Store privacy nutrition labels

### Phase 7: Documentation
1. Update NourishAI CLAUDE.md, TODO.md
2. Update root CLAUDE.md, MEMORY.md
3. Update HUMAN_TASKS.md with App Store Connect steps
4. New Gold Standard items if discovered

---

## New Gold Standard Items (Proposed)

- **GS #46: No seed/placeholder data in production builds** — Screenshot seed data must be wrapped in `#if DEBUG`. Production builds must go through real onboarding flow.
- **GS #47: iOS device registration retry** — Apps must retry device registration on launch if profile exists but serverUserId is nil.
- **GS #48: Specific API error messages** — iOS apps must parse HTTP status codes and show specific user-friendly error messages, not generic catch-all errors.

---

## Architecture Decisions

1. **Haiku for free, Sonnet for pro chat** — 60x cost reduction for free tier
2. **URL menu analysis** — Server-side fetch (not client) to avoid CORS/security issues
3. **StoreKit 2** — Already implemented, just needs testing config + profile sync
4. **HealthKit read-only sync** — We write nutrition to HealthKit but read steps/calories/sleep FROM it
5. **SwiftData local-first** — All nutrition data stays on device, only scan tracking on server
