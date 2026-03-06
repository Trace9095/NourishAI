# NourishAI — Human Tasks (Trace)

> Tasks that require Trace's direct action. Check items off as completed.

---

## CRITICAL — Do These Next

### App Store Connect Screenshots
- [ ] **Install older simulator runtimes in Xcode:** Settings > Platforms > download iOS 17 runtime
- [ ] **Add simulators for App Store screenshot sizes:**
  - **iPhone 11 Pro Max** — produces 1242x2688 screenshots (6.5" required size)
  - **iPhone 14 Pro Max** — produces 1284x2778 screenshots (6.7" required size)
  - Add via: Window > Devices and Simulators > Simulators > + button
- [ ] **Take App Store screenshots** on both simulators (portrait + landscape for each)
- [ ] **iPad screenshots:** Use **iPad Pro 13-inch (M5)** for 13" iPad size (2064x2752)

### Xcode Project
- [x] Xcode project generated and builds successfully (BUILD SUCCEEDED)
- [x] 25 Swift files compiled (all models, views, services, components)
- [x] SettingsView made fully editable (Edit/Save/Cancel, macro targets, goal picker)
- [ ] **Set your Apple Developer Team** in Signing & Capabilities
- [ ] **Add 4 new Swift files to Xcode project:**
  - MenuScanView.swift (Views/FoodLog/)
  - FoodIdeasView.swift (Views/FoodLog/)
  - RestaurantMapView.swift (Views/Discovery/)
  - NutritionChatView.swift (Views/Chat/)
  - Right-click folder > Add Files to "NourishAI" > select each .swift file
- [ ] **Add Watch target:** File > New > Target > watchOS > Watch App
- [ ] **Add Widget target:** File > New > Target > iOS > Widget Extension
- [ ] **Verify capabilities in Xcode:**
  - HealthKit (iOS + Watch)
  - In-App Purchase (iOS)
  - App Groups: `group.com.epicai.nourishai` (iOS + Widget)
  - Push Notifications (iOS)
- [ ] **Add NSLocationWhenInUseUsageDescription to Info.plist** (for RestaurantMapView)
- [ ] **Create StoreKit config:** File > New > StoreKit Configuration File > `NourishAI.storekit`
  - Add subscription group "NourishAI Pro"
  - Add product: `com.nourishai.subscription.pro.monthly` ($7.99/month)
  - Add product: `com.nourishai.subscription.pro.annual` ($39.99/year)
  - Set in scheme: Edit Scheme > Run > Options > StoreKit Configuration

### App Store Connect
- [ ] Register bundle IDs (`com.epicai.nourishai`, `.watchkitapp`, `.widget`)
- [ ] Register app in App Store Connect
- [ ] Create subscription group "NourishAI Pro" with monthly ($7.99) + annual ($39.99)
- [ ] Add localizations (required for StoreKit)
- [ ] Verify Paid Apps agreement is active
- [ ] Write App Store description + keywords
- [ ] Create app icon (all sizes)
- [ ] Upload screenshots (6.5" + 6.7" iPhone, 13" iPad)
- [ ] TestFlight beta upload
- [ ] App Store submission

### Marketing Templates — Major Overhaul Needed
- [ ] **REEL OVERHAUL (Priority 1):**
  - CTA scenes only get 1.5s — need 3-4 seconds on ALL templates
  - All content too small — text, phone mockups, icons need to be 30-50% bigger
  - Only 4 reel templates — need 8-10 unique templates (more variety)
  - Need MORE reels in content calendar — double the count
  - Overall quality must be premium/professional — these sell the app
  - Templates to fix: reel-ai-scan, reel-speed-demo, reel-macro-rings, reel-day-tracker
  - Scene timing across all: compress early scenes, give CTA 3-4s
  - Reel timing fix IS working (Web Animations API pause+seek) — just need better content
- [ ] **Story template redesign** — stories look bad, need premium SVG icons instead of emojis
- [ ] **Feed macro-tip template** — replace emoji icons with numbered SVG badges
- [ ] **Hero rotating text** — homepage needs cycling text animation (Gold Standard #38)
- [ ] **Blog [slug] dynamic OG image** — per-post OG images (Gold Standard #37)
- [ ] **Regenerate all marketing assets** after template fixes (`python3 marketing/generate.py --force`)

### DNS & Services
- [x] Domain: nourishhealthai.com (LIVE on Vercel)
- [ ] **Verify Resend domain:** Add `nourishhealthai.com` in Resend Dashboard (for password reset emails)
- [ ] **Create Instagram account** for NourishAI

---

## COMPLETED

### Infrastructure
- [x] GitHub repo (Trace9095/NourishAI)
- [x] Vercel project (`nourish-ai`)
- [x] Neon PostgreSQL (5 tables migrated)
- [x] All env vars set (ANTHROPIC_API_KEY, RESEND_API_KEY, DATABASE_URL, NEXT_PUBLIC_APP_URL, ADMIN_SETUP_TOKEN, ADMIN_SESSION_SECRET)
- [x] Admin account seeded (CEO@epicai.ai, super_admin)
- [x] Domain purchased and configured
- [x] SSL verified

### iOS App
- [x] 25 Swift files on disk and in pbxproj
- [x] All cross-file dependencies verified
- [x] iOS app builds successfully (BUILD SUCCEEDED)
- [x] Settings page fully editable (name, age, height, weight, goal, activity, macro targets)
- [x] Recalculate Targets button (Mifflin-St Jeor BMR)
- [x] HealthKit integration (height, weight, age pull)

### Marketing Engine
- [x] 8 reel MP4s generated with correct timing (17s each, 30fps, 510 frames)
- [x] Reel timing fix: Web Animations API pause+seek for frame-accurate capture
- [x] 50 feed PNGs + 15 story PNGs generated
- [x] 4 months of content calendars (March-June 2026, 68 total posts)
- [x] Reels display correctly in admin Instagram calendar (`<video>` tag)

### Website
- [x] 16 pages (landing, features, about, blog, contact, brand, privacy, terms, accessibility, 404, admin suite)
- [x] 17 API routes (AI vision, barcode, subscriptions, admin CRUD, chat, menu scan, food ideas)
- [x] Gold Standard compliant (24/27 — 3 gaps noted above in remaining improvements)
- [x] Blog: 10 posts with category filters
- [x] Admin dashboard: 12 KPIs, charts, auto-refresh

---

## Notes

### Admin Login
- **URL:** https://nourishhealthai.com/admin
- **Email:** CEO@epicai.ai
- **Password:** Trace87223!
- **Role:** super_admin

### App Store Screenshot Simulators
| Required Size | Display | Simulator |
|---|---|---|
| 1242x2688 | 6.5" iPhone | **iPhone 11 Pro Max** (needs iOS 17 runtime) |
| 1284x2778 | 6.7" iPhone | **iPhone 14 Pro Max** (needs iOS 17 runtime) |
| 2064x2752 | 13" iPad | **iPad Pro 13-inch (M5)** |

### HealthKit Data
**Reads:** Height, weight, biological sex, DOB, steps, active calories, sleep
**Writes:** Dietary energy, protein, carbs, fat, fiber, sugar, sodium, water, body mass
