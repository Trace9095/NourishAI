# NourishAI — TODO

## Blocked on Trace (Human Tasks)

- [ ] Create App Store Connect app listing (com.epicai.nourishai)
- [ ] Configure StoreKit product IDs in App Store Connect:
  `com.nourishai.subscription.pro.monthly` and `com.nourishai.subscription.pro.annual`
- [ ] Set Apple Developer Team in Xcode Signing & Capabilities
- [ ] Update production API URL in iOS app after verifying domain (currently nourishhealthai.com)
- [ ] Verify Resend domain (if nourishhealthai.com not yet verified)

## iOS — Phase 4 (Watch/Widget)

- [ ] Create WatchOS target in Xcode (Phase 4)
- [ ] Create Widget extension target in Xcode (Phase 4)
- [ ] Implement nutrition watch complication
- [ ] Implement macro ring home screen widget

## iOS — Phase 5 (Launch)

- [ ] TestFlight internal testing
- [ ] App Store submission + review
- [ ] App Store screenshot upload to App Store Connect
- [ ] Set NSLocationWhenInUseUsageDescription in Info.plist (for restaurant discovery)

## Quality

- [ ] Add 4 new Swift files (MenuScanView, FoodIdeasView, RestaurantMapView, NutritionChatView)
  to Xcode project pbxproj (need Xcode UI addition)
- [ ] Verify scanner cooldowns enforced on all 4 scan endpoints

## Backend

- [ ] Monitor AI cost per scan (target: ~$0.001-0.002 per Haiku photo scan)
- [ ] Consider blog expansion beyond current 10 posts

## Completed

- [x] Phase 0-3.6 complete (infrastructure through production readiness)
- [x] 29 iOS Swift files + Xcode project
- [x] Next.js 16 website (16 pages, 17 API routes)
- [x] Admin dashboard (12 KPIs, charts, user management, IG calendar)
- [x] HMAC serverless-safe password reset
- [x] HealthKit real data integration
- [x] Subscription lifecycle (backend sync + Settings display)
- [x] Menu scanner URL mode
- [x] Chat paywall (Haiku free / Sonnet pro)
- [x] App Store screenshots (25 PNGs)
- [x] Instagram content (4 months, 65 PNGs, 3 MP4s)
- [x] Gold Standard 20/20 (S80)
- [x] OWASP security audit (S121)
- [x] E2E validation PASS (S120)
