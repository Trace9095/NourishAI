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
- [x] 29 Swift files compiled (all models, views, services, components — including 4 V1 views + 3 S81 services)
- [x] SettingsView made fully editable (Edit/Save/Cancel, macro targets, goal picker)
- [x] All 29 Swift files in pbxproj (verified S84)
- [x] NSLocationWhenInUseUsageDescription set in pbxproj (both Debug + Release)
- [x] Push notification entitlement added (aps-environment in NourishAI.entitlements)
- [ ] **Set your Apple Developer Team** in Signing & Capabilities
- [ ] **Add Watch target:** File > New > Target > watchOS > Watch App
- [ ] **Add Widget target:** File > New > Target > iOS > Widget Extension
- [ ] **Verify capabilities in Xcode:**
  - HealthKit (iOS + Watch)
  - In-App Purchase (iOS)
  - App Groups: `group.com.epicai.nourishai` (iOS + Widget)
  - Push Notifications (iOS)
- [x] StoreKit config file created (`ios/NourishAI/NourishAI.storekit` — subscription group + both products + free trial)
- [ ] **Set StoreKit config in Xcode scheme:** Edit Scheme > Run > Options > StoreKit Configuration > select `NourishAI.storekit`

### App Store Connect
- [ ] Register bundle IDs (`com.epicai.nourishai`, `.watchkitapp`, `.widget`)
- [ ] Register app in App Store Connect
- [ ] Create subscription group "NourishAI Pro" with monthly ($7.99) + annual ($39.99)
- [ ] Add localizations (required for StoreKit)
- [ ] Verify Paid Apps agreement is active
- [x] App Store description + keywords written (`docs/APP_STORE_LISTING.md`)
- [ ] Create app icon (all sizes)
- [ ] Upload screenshots (6.5" + 6.7" iPhone, 13" iPad)
- [ ] TestFlight beta upload
- [ ] App Store submission

### Marketing Templates
- [x] Reel overhaul complete (S79 — 10 templates, 16 reels, 15s format, SVG icons, seamless loop fade)
- [x] Blog [slug] dynamic OG images (S78)
- [x] Hero rotating text on homepage (S78)
- [x] All emojis replaced with SVG icons (S78)
- [ ] **Story template redesign** — could use visual refresh
- [ ] **Regenerate marketing assets** after any template updates

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
- [x] 29 Swift files on disk and in pbxproj (verified S84)
- [x] All cross-file dependencies verified
- [x] iOS app builds successfully (BUILD SUCCEEDED)
- [x] Settings page fully editable (name, age, height, weight, goal, activity, macro targets)
- [x] Recalculate Targets button (Mifflin-St Jeor BMR)
- [x] HealthKit integration (height, weight, age pull + real steps/active calories display)
- [x] Seed data guarded by #if DEBUG (S84)
- [x] Device registration on launch (S84)
- [x] Subscription sync on launch (S84)
- [x] Specific API error messages per HTTP status (S84)
- [x] Menu scanner URL mode (S84)
- [x] Chat AI paywall with upgrade CTA (S84)
- [x] Chat cost optimization — Haiku free / Sonnet pro (S84)

### Marketing Engine
- [x] 8 reel MP4s generated with correct timing (17s each, 30fps, 510 frames)
- [x] Reel timing fix: Web Animations API pause+seek for frame-accurate capture
- [x] 50 feed PNGs + 15 story PNGs generated
- [x] 4 months of content calendars (March-June 2026, 68 total posts)
- [x] Reels display correctly in admin Instagram calendar (`<video>` tag)

### Website
- [x] 16 pages (landing, features, about, blog, contact, brand, privacy, terms, accessibility, 404, admin suite)
- [x] 17 API routes (AI vision, barcode, subscriptions, admin CRUD, chat, menu scan + URL, food ideas)
- [x] Gold Standard compliant (20/20 — full audit passed S84)
- [x] Blog: 10 posts with category filters
- [x] Admin dashboard: 12 KPIs, charts, auto-refresh
- [x] Chat route: Haiku for free / Sonnet for pro, 5 msg/day free limit (S84)
- [x] Menu route: supports both photo + URL-based analysis (S84)

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
