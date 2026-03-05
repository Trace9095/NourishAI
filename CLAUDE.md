# NourishAI — Project Instructions

> **Owner:** Trace Hildebrand | CEO@epicai.ai | GitHub: Trace9095
> **Bundle ID:** com.epicai.nourishai | **App Group:** group.com.epicai.nourishai
> **Vercel Slug:** `nourish-ai` | **Team:** `team_pGqkBUxWUXiBoZoKYPgweHDl`
> **Repo:** Trace9095/NourishAI | **Branch:** main

## What This Is

NourishAI is an AI-powered nutrition tracking iOS app + marketing website. It targets fitness-focused people (gym-goers, macro trackers, athletes) and monetizes via freemium subscription.

## Architecture

- **iOS App** (Swift 6 / SwiftUI / iOS 17+) — local-first with SwiftData
- **Marketing Website + Backend API** (Next.js 16 / Tailwind v4 / Vercel) — serves as the iOS app's server
- **Database** (Neon PostgreSQL via Vercel) — user accounts, scan tracking, subscription verification
- **AI** — Claude Haiku vision via server proxy (NO embedded API keys in iOS)

### Data Split
- **iOS (SwiftData):** UserProfile, DailyNutrition, FoodEntry, SavedFood, DailyWaterIntake
- **Server (Neon):** users, scan_usage tables (rate limiting, subscription status, AI logs)

## Repo Structure

```
NourishAI-main/
├── ios/                    # Xcode project (create via Xcode UI)
├── website/                # Next.js 16 marketing site + API (Vercel root dir)
├── CLAUDE.md               # This file
├── _LLM_HANDOFF_PROMPT.md  # Full handoff context
├── TODO.md                 # Running feature backlog
├── PHASES.md               # Phase breakdown with status
└── APPLE_SETUP_GUIDE.md    # App Store Connect subscription setup
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| iOS Language | Swift 6 (strict concurrency, MainActor default) |
| iOS UI | SwiftUI, iOS 17+ |
| iOS Storage | SwiftData (local-first, offline-capable) |
| iOS Health | HealthKit (nutrition read/write, weight, steps) |
| iOS Payments | StoreKit 2 (Free + Pro subscription) |
| iOS Watch | WatchKit + WatchConnectivity (watchOS 10+) |
| Web Framework | Next.js 16 App Router |
| Web Styling | Tailwind CSS v4 + shadcn/ui |
| Web ORM | Drizzle ORM |
| Database | Neon PostgreSQL (via Vercel Integration) |
| AI | Anthropic Claude API (Haiku for scans, server-side only) |
| Email | Resend API |
| Deployment | Vercel (auto-deploy on push to main) |

## Subscription Model

| Tier | Price | AI Scans | Key Features |
|------|-------|----------|-------------|
| Free | $0 | 1/week | Manual entry, barcode, HealthKit, basic dashboard |
| Pro | $7.99/mo or $39.99/yr | Unlimited | + AI photo scans, saved meals, analytics, watch app, water tracking |

**Product IDs:**
- `com.nourishai.subscription.pro.monthly`
- `com.nourishai.subscription.pro.annual`

## Brand

**Colors:**
- Primary: `#34C759` (Apple Health green)
- Accent: `#FF9500` (warm orange)
- Dark: `#0A0A14` | Card: `#12121A`
- Protein: `#FF6B6B` | Carbs: `#4ECDC4` | Fat: `#FFE66D` | Calories: `#FF9500` | Water: `#5AC8FA`

**Typography:** SF Pro (iOS system). Website: Inter (body) + Outfit (headlines).

**Branding:** NourishAI is an Epic AI product. CAN show "Built by Epic AI" in footer/about.

## Build Commands

```bash
# Website
cd website && npx next build

# iOS (via Xcode or xcodebuild)
# Open ios/NourishAI.xcodeproj in Xcode
```

## Environment Variables (Vercel)

```
ANTHROPIC_API_KEY=sk-ant-...     # Claude API (server-side only)
RESEND_API_KEY=re_...            # Email sending
DATABASE_URL=postgresql://...    # Neon (auto-set by integration)
NEXT_PUBLIC_APP_URL=https://...  # Canonical URL
```

## Critical Rules

1. **NO embedded API keys in iOS code.** All AI calls go through `/api/analyze-food` server route.
2. **Rate limiting:** Free = 1 scan/week. Pro = unlimited with 30s cooldown. Server-side enforcement.
3. **pbxproj rule:** Every .swift file needs 4 entries. Create files through Xcode, not manually.
4. **Swift 6 concurrency:** `MainActor` default. Use `nonisolated` for background. All Codable = `Sendable`.
5. **SwiftData arrays:** Use `[Type]?` (optional) for CloudKit compatibility.
6. **Gold Standard:** Website follows all 36 rules from day 1 (see master CLAUDE.md).
7. **Security pattern:** CORS in `lib/security.ts`, headers in `next.config.ts`. Never both.
8. **No backdrop-blur on fixed/sticky.** Use fully opaque backgrounds.
9. **44px touch targets** on all tappable elements.
10. **quality={90}** on `<Image>` components. Never on `<ImageIcon>` or `<ImagePlus>`.
11. **Vercel root dir:** `website/` — same pattern as RT/WWBG `backend/`.
12. **Commit format:** `feat:`, `fix:`, `chore:` + `Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>`

## Code Reuse from LiftLabPro

Source: `CLIENT-SITES/LiftLabPro-main/`

**Copy as-is:** NutritionModels.swift, WaterIntakeModels.swift, BarcodeScanner.swift, HapticManager.swift, DesignSystem.swift, OfflineManager.swift

**Adapt:** HealthKitManager (trim workouts), SubscriptionManager (2 tiers, scan-based), NotificationManager (meal reminders), AllEnums (nutrition only), UserProfile (nutrition fields only)

**Rewrite:** ClaudeAPIManager → NourishAPIManager (server proxy, no embedded keys)

## Session History

### Session 68 (Current — March 2026)
- Project created. GitHub repo: Trace9095/NourishAI
- Phase 0: Infrastructure & documentation
