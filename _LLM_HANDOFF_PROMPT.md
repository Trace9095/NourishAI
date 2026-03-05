# NourishAI — LLM Handoff Prompt

> For new LLM sessions. Read this + CLAUDE.md for full context.
> Part of the Epic AI portfolio (Project #22).

---

## 1. What Is NourishAI

An AI-powered nutrition tracking app for fitness-focused people (gym-goers, macro trackers, athletes). Snap a photo of your food, get instant macro breakdown via Claude AI vision. Track calories, protein, carbs, fat, and water throughout the day.

**Monetization:** Freemium subscription
- Free: 1 AI scan/week + manual entry + barcode scanner + HealthKit
- Pro ($7.99/mo or $39.99/yr): Unlimited AI scans + saved meals + analytics + Watch + water tracking

## 2. Architecture

```
iOS App (SwiftUI)                   Marketing Website (Next.js 16)
     |                                    |
     | HTTPS API calls                    | Vercel serverless
     |                                    |
     +---------> /api/analyze-food -------+---> Claude Haiku (vision)
     +---------> /api/lookup-barcode -----+---> OpenFoodFacts (free)
     +---------> /api/register-device ----+---> Neon PostgreSQL
     +---------> /api/scan-count ---------+---> Neon PostgreSQL
     +---------> /api/verify-subscription +---> StoreKit receipt
```

**Key principle:** iOS app is local-first (SwiftData). Server handles ONLY AI proxy, rate limiting, and subscription verification. No embedded API keys.

## 3. Repo Structure

```
NourishAI-main/
├── ios/                    # Xcode project
├── backend/                # Next.js 16 (Vercel root dir = backend/)
├── CLAUDE.md               # Project instructions
├── TODO.md                 # Feature backlog (V1-V6)
├── PHASES.md               # Phase tracking
├── APPLE_SETUP_GUIDE.md    # Subscription setup steps
└── _LLM_HANDOFF_PROMPT.md  # This file
```

## 4. Tech Stack

- **iOS:** Swift 6, SwiftUI, SwiftData, HealthKit, StoreKit 2, WatchKit
- **Web:** Next.js 16, Tailwind v4, Drizzle ORM, Neon PostgreSQL
- **AI:** Claude Haiku (vision) via server proxy
- **Deployment:** Vercel (`nourish-ai`, team `team_pGqkBUxWUXiBoZoKYPgweHDl`)

## 5. Code Reuse from LiftLabPro

Source: `CLIENT-SITES/LiftLabPro-main/`

**Copy as-is (6 files):** NutritionModels.swift, WaterIntakeModels.swift, BarcodeScanner.swift, HapticManager.swift, DesignSystem.swift, OfflineManager.swift

**Adapt (8 files):** HealthKitManager, SubscriptionManager, NotificationManager, AllEnums, UserProfile, PhoneWatchConnectivity, WidgetDataProvider, NutritionCalculator

**Rewrite (1 file):** ClaudeAPIManager → NourishAPIManager (server proxy pattern)

## 6. Brand

- Primary: `#34C759` (green) | Accent: `#FF9500` (orange) | Dark: `#0A0A14`
- Macro colors: Protein `#FF6B6B`, Carbs `#4ECDC4`, Fat `#FFE66D`, Water `#5AC8FA`
- Epic AI product — CAN show branding

## 7. Critical Rules

1. NO embedded API keys in iOS. All AI calls through server.
2. Free = 1 scan/week. Server-side enforcement.
3. Create Swift files through Xcode (pbxproj needs 4 entries per file).
4. Swift 6 = MainActor default. Use `nonisolated` for background.
5. Website follows Gold Standard (36 rules). No backdrop-blur on fixed elements.
6. Vercel root dir: `backend/`
7. CORS in `lib/security.ts`, security headers in `next.config.ts`.

## 8. Current Status

- **Phase 0:** Infrastructure setup (Session 68)
- **GitHub:** https://github.com/Trace9095/NourishAI
- **Vercel:** nourish-ai
- **Domain:** nourishhealthai.com

## 9. Development Phases

| Phase | Description | Status |
|-------|------------|--------|
| 0 | Infrastructure & docs | IN PROGRESS |
| 1 | iOS Core (models + services) | NOT STARTED |
| 2 | iOS Views + AI features | NOT STARTED |
| 3 | Website + API + database | NOT STARTED |
| 4 | Watch + Widget + polish | NOT STARTED |
| 5 | Launch | NOT STARTED |

See `PHASES.md` for detailed task tracking and `TODO.md` for full backlog (V1-V6).
