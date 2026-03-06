# NourishAI — LLM Handoff Prompt

> For new LLM sessions. Read this + CLAUDE.md for full context.
> Part of the Epic AI portfolio (Project #23).

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
     +---------> /api/analyze-description +---> Claude Haiku (text)
     +---------> /api/lookup-barcode -----+---> OpenFoodFacts (free)
     +---------> /api/register-device ----+---> Neon PostgreSQL
     +---------> /api/scan-count ---------+---> Neon PostgreSQL
     +---------> /api/verify-subscription +---> StoreKit receipt
     +---------> /api/contact -----------+---> Resend email
```

**Admin Dashboard:**
```
Browser --> /admin (login page)
        --> /admin/dashboard (protected by middleware)
        --> /api/admin/login (PBKDF2 verify)
        --> /api/admin/stats (dashboard data)
        --> /api/admin/setup (one-time seed)
```

**Key principle:** iOS app is local-first (SwiftData). Server handles ONLY AI proxy, rate limiting, and subscription verification. No embedded API keys.

## 3. Current State (After Session 73)

### What's Built and Live

**Website (backend/):** 12 pages, 11 API routes + RSS feed, 15 components, 6 lib files, middleware. Live at nourishhealthai.com. Gold Standard 100% compliant. Admin dashboard with PBKDF2+HMAC auth, blog engine (5 articles), contact form (saves to DB), cookie consent, brand page, legal pages, branded 404, FAQ with CTA buttons.

**iOS (ios/):** 21 Swift source files + Xcode project (project.pbxproj generated). All cross-file dependencies resolved. SubscriptionManager wired to StoreKit 2. All HealthKit calls use correct `logNutrition()` method. Needs opening in Xcode to set team and build.

**Database:** 5 tables created via Drizzle migration (users, scan_usage, admin_users, blog_posts, contact_submissions).

**Admin:** Super admin seeded (CEO@epicai.ai). Login works at /admin.

**Env vars:** All 6 production env vars set in Vercel.

### What's NOT Done

- **Xcode build:** Project needs opening in Xcode to set Developer Team and build
- **Watch/Widget targets:** Need creating through Xcode UI
- **StoreKit config:** .storekit file for testing payments
- **App Store Connect:** Bundle ID registration, subscription group creation
- **Resend domain:** nourishhealthai.com needs verifying in Resend Dashboard
- **Phase 4:** Apple Watch companion, iOS Widgets, push notifications
- **Phase 5:** TestFlight, App Store submission, marketing launch

## 4. Tech Stack

- **iOS:** Swift 6, SwiftUI, SwiftData, HealthKit, StoreKit 2, WatchKit
- **Web:** Next.js 16, Tailwind v4, Drizzle ORM, Neon PostgreSQL
- **AI:** Claude Haiku (vision) via server proxy only
- **Auth:** PBKDF2 password hashing + HMAC session tokens (admin), device UUID (iOS)
- **Email:** Resend API
- **Deploy:** Vercel (`nourish-ai`, team `team_pGqkBUxWUXiBoZoKYPgweHDl`, root: `backend/`)

## 5. Database Schema (5 tables — migrated)

```
users           — id, device_id (unique), subscription_tier, subscription_expires_at, timestamps
scan_usage      — id, user_id (FK), scan_type, model_used, tokens_used, created_at
admin_users     — id, email (unique), name, password_hash, role (enum: super_admin/admin/viewer), is_active, last_login_at, timestamps
blog_posts      — id, slug (unique), title, excerpt, content, cover_image, author, category, tags (text[]), published, timestamps
contact_submissions — id, name, email, subject, message, read, created_at
```

## 6. Critical Rules

1. NO embedded API keys in iOS. All AI calls through server.
2. Free = 1 scan/week. Server-side enforcement.
3. Swift 6 = MainActor default. Use `nonisolated` for background.
4. Website follows Gold Standard (36 rules). No backdrop-blur on fixed elements.
5. Vercel root dir: `backend/`
6. CORS in `lib/security.ts`, security headers in `next.config.ts`.
7. 44px touch targets on all tappable elements.
8. Admin auth uses PBKDF2 + HMAC. ADMIN_SESSION_SECRET env var required.

## 7. Key Files

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Project instructions + full file inventory |
| `PHASES.md` | Phase tracking (0-5) with task statuses |
| `HUMAN_TASKS.md` | Remaining action items |
| `TODO.md` | Feature backlog (V1-V6) |
| `APPLE_SETUP_GUIDE.md` | App Store Connect subscription setup |
| `backend/lib/db/schema.ts` | All 5 DB table definitions |
| `backend/lib/admin-auth.ts` | Admin authentication system |
| `backend/middleware.ts` | Admin route protection + llms.txt header |

## 8. Immediate Next Steps

1. **Open Xcode project** — Set developer team, build, fix any signing issues
2. **Create StoreKit config** — Add .storekit file with both subscription products
3. **App Store Connect** — Register bundle IDs, create subscription group
4. **Payment testing** — StoreKit sandbox, then TestFlight
5. **Phase 4:** Apple Watch companion, iOS Widgets
6. **Phase 5:** App Store submission + marketing launch

See `PHASES.md` for detailed task tracking and `TODO.md` for full backlog (V1-V6).
