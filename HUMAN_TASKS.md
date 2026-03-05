# NourishAI — Human Tasks (Trace)

> Tasks that require Trace's direct action. Check items off as completed.

---

## Immediate (Before Development Continues)

- [ ] **Add domain to Vercel:** Go to Vercel Dashboard > nourish-ai > Settings > Domains > Add `nourishhealthai.com`. Verify DNS records match GoDaddy.
- [ ] **Run Drizzle migration:** From `backend/` directory, run `npx drizzle-kit push` to create the `users` and `scan_usage` tables in Neon.

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
- [ ] **Add Watch target:** File > New > Target > watchOS > Watch App
  - Product Name: `NourishWatch`
  - Bundle Identifier: `com.epicai.nourishai.watchkitapp`
- [ ] **Add Widget target:** File > New > Target > iOS > Widget Extension
  - Product Name: `NourishWidget`
  - Bundle Identifier: `com.epicai.nourishai.widget`
- [ ] **Enable capabilities in Xcode:**
  - HealthKit (iOS + Watch targets)
  - In-App Purchase (iOS target)
  - App Groups: `group.com.epicai.nourishai` (iOS + Widget)
  - Push Notifications (iOS target)
- [ ] **Create StoreKit configuration file:** File > New > File > StoreKit Configuration
  - Name: `NourishAI.storekit`
  - Do NOT sync with App Store Connect (for local testing)
  - Add subscription group "NourishAI Pro"
  - Add monthly ($7.99) + annual ($39.99) products
  - Scheme > Run > Options > StoreKit Configuration: select the file
- [ ] **Set Swift 6 concurrency:** Build Settings > `SWIFT_DEFAULT_ACTOR_ISOLATION` = `MainActor`

## App Store Connect

- [ ] **Register Bundle IDs:** developer.apple.com > Certificates, IDs & Profiles > Identifiers
  - `com.epicai.nourishai` (iOS app)
  - `com.epicai.nourishai.watchkitapp` (Watch)
  - `com.epicai.nourishai.widget` (Widget)
- [ ] **Register App:** App Store Connect > My Apps > "+" > New App
  - Platform: iOS
  - Name: NourishAI
  - Bundle ID: `com.epicai.nourishai`
  - SKU: `nourishai-001`
- [ ] **Create Subscription Group:** App > Monetization > Subscriptions > "+"
  - Group name: `NourishAI Pro`
  - Monthly: Product ID `com.nourishai.subscription.pro.monthly`, $7.99
  - Annual: Product ID `com.nourishai.subscription.pro.annual`, $39.99
  - Add Localizations (Display Name + Description) — REQUIRED
  - Optional: 7-day free trial on annual plan
- [ ] **Verify Paid Apps Agreement:** Agreements, Tax & Banking > "Paid Apps" must be active
- See `APPLE_SETUP_GUIDE.md` for detailed step-by-step

## Domain & DNS

- [x] Purchase domain: nourishhealthai.com
- [x] Point DNS to Vercel in GoDaddy
- [ ] **Add domain in Vercel Dashboard** (Vercel > nourish-ai > Settings > Domains)
- [ ] Verify SSL certificate is active

## Marketing

- [ ] Create Instagram account for NourishAI
- [ ] Prepare App Store screenshots (6.7" + 6.1") after app is built
- [ ] Write App Store description + keywords
- [ ] Create app icon (all sizes) — or have Claude generate SVG → export from Figma

## Environment

- [x] Neon PostgreSQL connected to Vercel
- [x] ANTHROPIC_API_KEY set
- [x] RESEND_API_KEY set
- [x] NEXT_PUBLIC_APP_URL set
- [ ] **Verify Resend domain:** Add `nourishhealthai.com` in Resend Dashboard for email sending
- [ ] **Create ANTHROPIC_API_KEY dedicated key** (optional — currently using shared LiftLabPro key)

---

## Notes

**HealthKit data the app will read:**
- Height, weight, biological sex, date of birth
- Active energy burned, basal energy burned
- Steps, sleep analysis
- Dietary energy, protein, carbohydrates, fat (if logged elsewhere)

**HealthKit data the app will write:**
- Dietary energy consumed (calories)
- Dietary protein, carbohydrates, total fat
- Dietary fiber, sugar, sodium
- Water consumption

All HealthKit access requires explicit user permission on first launch. The iOS app handles all HealthKit locally — no server involvement.
