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

## 3. Current State (After Sessions 68-69)

### What's Built

**Website (backend/):** 12 pages, 11 API routes, 15 components, 6 lib files, middleware. Fully functional marketing site with admin dashboard, blog engine, contact form, cookie consent, brand page, legal pages, branded 404.

**iOS (ios/):** 19 Swift source files covering models, services, and all major views. NOT compilable yet — requires Xcode project creation (Trace must do in Xcode UI).

**Database schema (Drizzle ORM):** 5 tables defined — users, scan_usage, admin_users, blog_posts, contact_submissions. Migration NOT yet run.

### What's NOT Done

- **Xcode project:** .xcodeproj must be created via Xcode UI (cannot be scripted)
- **MealRow.swift:** Simple component referenced by FoodLogView, not yet created
- **DB migration:** `npx drizzle-kit push` needs to be run
- **Env vars:** ADMIN_SETUP_TOKEN and ADMIN_SESSION_SECRET need adding in Vercel
- **Admin seed:** POST to /api/admin/setup after migration + env vars
- **Domain:** nourishhealthai.com needs adding in Vercel Dashboard
- **Phase 4:** Apple Watch companion, iOS Widgets, push notifications
- **Phase 5:** TestFlight, App Store submission, marketing launch
- **Git:** All work from sessions 68-69 is uncommitted

## 4. Tech Stack

- **iOS:** Swift 6, SwiftUI, SwiftData, HealthKit, StoreKit 2, WatchKit
- **Web:** Next.js 16, Tailwind v4, Drizzle ORM, Neon PostgreSQL
- **AI:** Claude Haiku (vision) via server proxy only
- **Auth:** PBKDF2 password hashing + HMAC session tokens (admin), device UUID (iOS)
- **Email:** Resend API
- **Deploy:** Vercel (`nourish-ai`, team `team_pGqkBUxWUXiBoZoKYPgweHDl`, root: `backend/`)

## 5. Database Schema (5 tables)

```
users           — id, device_id (unique), subscription_tier, subscription_expires_at, timestamps
scan_usage      — id, user_id (FK), scan_type, model_used, tokens_used, created_at
admin_users     — id, email (unique), name, password_hash, role (enum: super_admin/admin/viewer), is_active, last_login_at, timestamps
blog_posts      — id, slug (unique), title, excerpt, content, cover_image, author, category, tags (text[]), published, timestamps
contact_submissions — id, name, email, subject, message, read, created_at
```

## 6. Admin Auth Flow

1. Trace sets `ADMIN_SETUP_TOKEN` env var in Vercel
2. POST `/api/admin/setup` with `{token, email, name, password}` creates super_admin
3. Login at `/admin` with email + password
4. Server verifies PBKDF2 hash, creates HMAC session token, sets HttpOnly cookie
5. Middleware checks cookie on `/admin/dashboard/*` routes
6. Dashboard auto-refreshes stats every 30 seconds

## 7. Brand

- Primary: `#34C759` (green) | Accent: `#FF9500` (orange) | Dark: `#0A0A14`
- Macro colors: Protein `#FF6B6B`, Carbs `#4ECDC4`, Fat `#FFE66D`, Water `#5AC8FA`
- Epic AI product — CAN show branding

## 8. Critical Rules

1. NO embedded API keys in iOS. All AI calls through server.
2. Free = 1 scan/week. Server-side enforcement.
3. Create Swift files through Xcode (pbxproj needs 4 entries per file).
4. Swift 6 = MainActor default. Use `nonisolated` for background.
5. Website follows Gold Standard (36 rules). No backdrop-blur on fixed elements.
6. Vercel root dir: `backend/`
7. CORS in `lib/security.ts`, security headers in `next.config.ts`.
8. 44px touch targets on all tappable elements.
9. Admin auth uses PBKDF2 + HMAC (not bcrypt/JWT). ADMIN_SESSION_SECRET env var required.

## 9. Key Files

| File | Purpose |
|------|---------|
| `CLAUDE.md` | Project instructions + full file inventory |
| `PHASES.md` | Phase tracking (0-5) with task statuses |
| `HUMAN_TASKS.md` | Trace's action items (env vars, Xcode, migration) |
| `TODO.md` | Feature backlog (V1-V6) |
| `APPLE_SETUP_GUIDE.md` | App Store Connect subscription setup |
| `backend/lib/db/schema.ts` | All 5 DB table definitions |
| `backend/lib/admin-auth.ts` | Admin authentication system |
| `backend/middleware.ts` | Admin route protection + llms.txt header |

## 10. Immediate Next Steps

1. **Git commit + push** all uncommitted work → triggers Vercel deploy
2. **Trace action items** (see HUMAN_TASKS.md): env vars, DB migration, admin seed, domain
3. **Create MealRow.swift** — simple component for FoodLogView
4. **Phase 4:** Apple Watch companion, iOS Widgets, push notifications
5. **Phase 5:** TestFlight beta, App Store submission, marketing launch

See `PHASES.md` for detailed task tracking and `TODO.md` for full backlog (V1-V6).
