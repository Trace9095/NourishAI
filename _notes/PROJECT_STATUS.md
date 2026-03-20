# NourishAI — Project Status

> Last updated: 2026-03-19

## Status

**Web: LIVE** at [nourishhealthai.com](https://nourishhealthai.com)
**iOS: Phase 3.6 complete — Phase 4 (Watch/Widget) + Phase 5 (App Store Launch) pending**

## Platform

- iOS App: Swift 6 / SwiftUI / iOS 17+ (local-first with SwiftData)
- Backend: Next.js 16 (App Router) — Vercel root dir: `backend/`
- Database: Neon PostgreSQL via Drizzle ORM (5 tables)
- AI: Claude Haiku (vision + text) via server proxy (NO embedded keys in iOS)
- Auth: PBKDF2 + HMAC sessions (admin), device UUID (iOS users)
- Email: Resend API
- Payments: StoreKit 2 (Free / Pro)

## iOS Phase Status

| Phase | Status |
|-------|--------|
| 0 — Infrastructure | COMPLETE |
| 1 — iOS Core | DONE (29 Swift files + Xcode project generated) |
| 2 — iOS Views + AI | DONE |
| 3 — Website + API + DB | DONE (Gold Standard 20/20, 17 API routes) |
| 3.5 — V1 Features | DONE (menu scan + URL, food ideas, restaurant discovery, AI chat) |
| 3.6 — Production Ready | DONE (seed data fix, HealthKit real data, API error handling, subscription lifecycle, chat paywall) |
| 4 — Watch + Widget | NOT STARTED (depends on Xcode setup) |
| 5 — App Store Launch | NOT STARTED |

## Key Features

- AI photo scanning (Claude Haiku vision → instant macros)
- AI text/description analysis
- Menu scanner (photo + URL mode)
- Barcode scanner (OpenFoodFacts, no AI cost)
- AI food suggestions based on remaining macros
- AI nutrition chat (Haiku free / Sonnet pro, 5 msg/day free)
- Daily dashboard with macro rings
- Restaurant discovery (Apple MapKit)
- HealthKit sync (real steps + active calories)
- Admin dashboard (12 KPIs, charts, tables)
- Instagram calendar (admin)
- Password reset via Resend (HMAC self-validating tokens)

## Security Notes

- S117: Auth fixed (httpOnly cookies confirmed)
- S121: OWASP audit complete
- PBKDF2 100K iterations for admin password hashing
- Serverless-safe password reset (HMAC tokens, no in-memory state)

## Current Versions

- backend/package.json: 0.3.1 (bumped 2026-03-19)
- iOS: Swift 6, iOS 17+
