# NourishAI -- Business Context

## Product

NourishAI is an AI-powered nutrition tracking app targeting fitness-focused people: gym-goers, macro trackers, and athletes. Users photograph their food and get instant macro breakdowns (calories, protein, carbs, fat) via Claude Haiku vision AI.

## Business Model

- **Free tier:** 1 AI scan per week, 5 chat messages per day (Haiku)
- **Pro tier:** $7.99/month or $39.99/year -- unlimited scans (30s cooldown), Sonnet-level AI chat
- StoreKit 2 in-app subscriptions (iOS), receipt validation on backend
- Product IDs: `com.nourishai.subscription.pro.monthly`, `com.nourishai.subscription.pro.annual`

## Owner

Trace Hildebrand (trace.hildebrand@gmail.com, GitHub: Trace9095). This is a client project within the Epic AI portfolio (#23 of 25 projects).

## De-branding

NourishAI is a standalone product. Visitor-facing pages must NOT display "Epic AI" or "Epic Adventures" branding. The CLAUDE.md note "CAN show Built by Epic AI branding" refers to the `/brand` page only -- all public pages use "NourishAI" identity exclusively.

## Target Audience

- Gym-goers tracking macros
- Athletes monitoring nutrition
- Health-conscious people wanting effortless food logging
- People who prefer photo-based logging over manual entry

## Key Features (Shipped)

- AI food photo analysis (Claude Haiku vision)
- Text-based food description analysis
- Menu scanning (photo + URL mode)
- AI food suggestions based on remaining macros
- AI nutrition chat (Haiku free / Sonnet pro)
- Barcode scanning (OpenFoodFacts API)
- Restaurant discovery (Apple MapKit, iOS-only)
- HealthKit integration (steps, active calories)
- Admin dashboard with 12 KPIs, user management, Instagram calendar
- Blog (10 posts, SSG), contact form, cookie consent

## Pending

- Phase 4: Apple Watch app + iOS Widget
- Phase 5: App Store submission + launch marketing
