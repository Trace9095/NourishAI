# CLAUDE.md — NAI (NourishAI)

> AGENTS: Read this file BEFORE touching any code. Check git log. Do NOT redo completed work.
> Last updated: 2026-03-20 (Session 124)

---

## Auto-Compact
Always enable autoCompact for long sessions:
```
claude config set autoCompact true
```

## Project Overview

| Field | Value |
|-------|-------|
| **Project #** | 23 |
| **App** | NourishAI — AI-powered nutrition tracking iOS app + marketing website |
| **Bundle ID** | com.epicai.nourishai |
| **App Group** | group.com.epicai.nourishai |
| **Live URL** | [nourishhealthai.com](https://nourishhealthai.com) |
| **Vercel Slug** | `nourish-ai` |
| **GitHub** | Trace9095/NourishAI |
| **Root Directory** | `backend/` |
| **Branch** | main |
| **Version** | 0.3.1 (web) |

NourishAI is an AI-powered nutrition tracking iOS app + marketing website. Targets fitness-focused people (gym-goers, macro trackers, athletes). Freemium subscription model.

---

## Current Status

- **Build:** Passing (Next.js 16.2.0)
- **Deployment:** Live at nourishhealthai.com
- **URL:** https://nourishhealthai.com
- **Vercel Slug:** `nourish-ai`
- **Last commit:** `c66873d` — chore: add Python __pycache__ to .gitignore

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| iOS | Swift 6, SwiftUI, SwiftData, HealthKit, StoreKit 2, iOS 17+ |
| Web | Next.js 16.2.0 App Router, Tailwind CSS v4, Drizzle ORM ^0.45.1 |
| DB | Neon PostgreSQL (5 tables) |
| AI | Claude Haiku (vision) via server proxy — Haiku free / Sonnet pro |
| Auth | PBKDF2 + HMAC sessions (admin), device UUID (iOS) |
| Email | Resend API |
| Deploy | Vercel (auto-deploy on push to main) |

---

## Root Directory & Build Command

- **Vercel Root Directory:** `backend/`
- **Build command:** `cd backend && npx next build`
- **iOS:** Open `ios/NourishAI.xcodeproj` in Xcode (must create project first)

---

## Key Architecture Decisions

- **NO embedded API keys in iOS** — All AI calls go through `/api/analyze-food` server route
- **Rate limiting:** Free = 1 scan/week. Pro = unlimited + 30s cooldown. Server-side.
- **AI model tiering:** Haiku for free users / Sonnet for pro users (60x cost reduction)
- **Admin auth:** PBKDF2 + HMAC sessions. `ADMIN_SESSION_SECRET` env var required.
- **StoreKit 2 product IDs:** `com.nourishai.subscription.pro.monthly`, `com.nourishai.subscription.pro.annual`
- **DO NOT add RevenueCat** — LiftLabPro uses it, NourishAI uses StoreKit 2 only

---

## iOS App (29 Swift files)

**Architecture:** Swift 6, SwiftUI, SwiftData (local-first), HealthKit, StoreKit 2, iOS 17+

**Key files:**
- Services: NourishAPIManager, HealthKitManager, SubscriptionManager, KeychainService, PushNotificationService
- Views: DashboardView, FoodLogView, AIFoodCameraView, AIFoodChatView, ManualEntryView, BarcodeScanView, MenuScanView, FoodIdeasView, RestaurantMapView, NutritionChatView, OnboardingContainerView, ProgressView, SettingsView, SubscriptionView

**Data split:**
- iOS (SwiftData): UserProfile, DailyNutrition, FoodEntry, SavedFood, DailyWaterIntake
- Server (Neon PostgreSQL, 5 tables): users, scan_usage, admin_users, blog_posts, contact_submissions

---

## Backend File Inventory

**Pages (16):** Landing, features, about, blog (index + [slug]), contact, brand, privacy, terms, accessibility, not-found, admin (login, dashboard, users, instagram-calendar, forgot/reset-password)

**API Routes (17):** analyze-food, analyze-description, analyze-menu, suggest-foods, chat (Haiku free / Sonnet pro), lookup-barcode, register-device, scan-count, verify-subscription, contact, admin/login, admin/logout, admin/setup, admin/stats, admin/users, admin/forgot-password, admin/reset-password

**DB Schema (5 tables):** users, scan_usage, admin_users, blog_posts, contact_submissions

---

## Subscription Model

| Tier | Price | AI Scans |
|------|-------|----------|
| Free | $0 | 1/week |
| Pro | $7.99/mo or $39.99/yr | Unlimited (30s cooldown) |

---

## Admin Dashboard

- **Login:** `/admin` (email + password, "Forgot password?" link)
- **Dashboard:** `/admin/dashboard` (protected by middleware cookie check)
- **Users:** `/admin/users` (CRUD for admin accounts)
- **Instagram Calendar:** `/admin/instagram-calendar`
- **Setup:** POST `/api/admin/setup` with `ADMIN_SETUP_TOKEN` to seed first super_admin
- **Roles:** super_admin, admin, viewer (pgEnum in schema)
- **Admins:** CEO@epicai.ai (primary), Trace.hildebrand@gmail.com (added S123)

---

## Recent Work (Last 15 Commits)

```
c66873d chore: add Python __pycache__ to .gitignore
02afffc fix: viewport fixes and code splitting improvements
211b44a feat: audit + enhance JSON-LD structured data
2c28e74 chore: rename middleware to proxy.ts, commit session changes
6bb9352 docs: add standardized _notes and update docs for 2026
87065e7 feat: update robots.ts and site manifest
3fcd3c5 perf: mobile scroll + touch + viewport fixes
4414bc2 chore: update sitemap with static lastModified dates for SEO
31bd278 docs: add golden standard documentation files
9cedce1 chore: bump version to 0.3.0
2b3475c security: upgrade Next.js to 16.2.0 — fixes CSRF + DoS CVEs
6132f0c docs: update project context
86d053c docs: add BRAND.md brand identity file
426fb54 docs: upgrade README to professional format with badges and stats
de71205 docs: add .claude context folder and service runbook
```

---

## Environment Variables

| Variable | Status | Notes |
|----------|--------|-------|
| ANTHROPIC_API_KEY | SET | Claude API (server-side only) |
| RESEND_API_KEY | SET | Email sending |
| DATABASE_URL | SET | Neon (auto by integration) |
| NEXT_PUBLIC_APP_URL | SET | `https://nourishhealthai.com` |
| ADMIN_SETUP_TOKEN | SET | `nourishai-admin-setup-2026` |
| ADMIN_SESSION_SECRET | SET | Random string for session signing |

---

## Brand Identity

- **Primary:** `#34C759` (green) | Accent: `#FF9500` (orange) | Dark: `#0A0A14` | Card: `#12121A`
- **Macros:** Protein `#FF6B6B` | Carbs `#4ECDC4` | Fat `#FFE66D` | Calories `#FF9500` | Water `#5AC8FA`
- **Typography:** SF Pro (iOS), Inter body + Outfit headlines (web)
- Epic AI product — CAN show "Built by Epic AI" branding

---

## Phase Status

| Phase | Status |
|-------|--------|
| 0 — Infrastructure | COMPLETE |
| 1 — iOS Core | DONE (29 source files + Xcode project generated) |
| 2 — iOS Views + AI | DONE |
| 3 — Website + API + DB | DONE (Gold Standard 20/20, 17 API routes) |
| 3.5 — V1 Features | DONE (menu scan + URL, food ideas, restaurant discovery, AI chat) |
| 3.6 — Production Ready | DONE (S84: seed data fix, HealthKit real data, API error handling, subscription lifecycle, chat paywall) |
| 4 — Watch + Widget | NOT STARTED (depends on Xcode project setup) |
| 5 — Launch | NOT STARTED |

---

## Known Issues / Open Bugs

- Phase 4 (Watch/Widget) requires Xcode target creation — not done
- Phase 5 (Launch) requires App Store Connect setup, TestFlight, StoreKit config
- APNs push notification testing pending
- Resend domain verification for nourishhealthai.com pending

---

## Completed Work (DO NOT REDO)

- Full website (12 pages), 17 API routes, RSS feed
- Admin dashboard with users CRUD, forgot password, Instagram calendar
- iOS app: 29 Swift files, all views complete, HealthKit, StoreKit 2, APNs
- App Store screenshot generator (9 HTML templates, 25 PNGs, 5 device sizes)
- Marketing engine: 10 reel templates, 16 reels, seamless loop fade
- Security hardening: HMAC-based password reset tokens (serverless-safe)
- OWASP security audit (S122) — all issues resolved
- Next.js 16.2.0 CSRF patch applied
- Drizzle migration run, 5 tables in Neon

---

## TODO / Next Steps

1. Phase 4: Apple Watch companion target (needs Xcode)
2. Phase 4: Home screen widget target (needs Xcode)
3. Phase 5: StoreKit configuration + payment testing
4. Phase 5: App Store Connect setup + submission
5. Resend domain verification for nourishhealthai.com
6. NSLocationWhenInUseUsageDescription in Info.plist (RestaurantMapView)

---

## CEO Rules for This Project

1. **NO embedded API keys in iOS** — all AI calls go through server proxy
2. **Rate limiting is server-side** — Free = 1 scan/week, Pro = unlimited + 30s cooldown
3. **Swift 6:** MainActor default. `nonisolated` for background. Codable = Sendable.
4. **Admin auth:** PBKDF2 + HMAC sessions. `ADMIN_SESSION_SECRET` env var required.
5. **pbxproj rule:** Create Swift files through Xcode UI, not manually.
6. **DO NOT add RevenueCat** — StoreKit 2 only for this project
7. **Haiku free / Sonnet pro** — AI model tiering is intentional, do not change
8. **No backdrop-blur on fixed/sticky** — Gold Standard #31

---

## Claude Context Files

| File | Purpose |
|------|---------|
| `.claude/PROMPT.md` | Quick start guide — read this first |
| `.claude/CONTEXT.md` | Business context, product model, audience |
| `.claude/ARCHITECTURE.md` | Full technical map (repo layout, data, auth, AI, security) |
| `.claude/CONVENTIONS.md` | Stack, code patterns, git conventions, Gold Standard rules |
| `_notes/` | Per-session notes (SESSION_2026_03_19_ADMIN.md, SECURITY_AUDIT.md, etc.) |
