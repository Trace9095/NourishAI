# NourishAI -- Architecture

## Repository Layout

```
NourishAI-main/
├── backend/                        # Vercel root dir
│   ├── app/                        # Next.js App Router pages
│   │   ├── page.tsx                # Landing page (hero, features, pricing, FAQ)
│   │   ├── about/page.tsx
│   │   ├── features/page.tsx
│   │   ├── blog/page.tsx           # Blog index with category filters
│   │   ├── blog/[slug]/page.tsx    # Blog posts (SSG via generateStaticParams)
│   │   ├── contact/page.tsx
│   │   ├── brand/page.tsx          # Brand assets (noindex)
│   │   ├── privacy/page.tsx
│   │   ├── terms/page.tsx
│   │   ├── accessibility/page.tsx
│   │   ├── not-found.tsx
│   │   ├── admin/                  # Admin dashboard (protected by middleware)
│   │   │   ├── page.tsx            # Login
│   │   │   ├── dashboard/page.tsx  # 12 KPIs, charts, tables
│   │   │   ├── users/page.tsx      # Admin user CRUD
│   │   │   ├── instagram-calendar/page.tsx
│   │   │   ├── forgot-password/page.tsx
│   │   │   └── reset-password/page.tsx
│   │   ├── api/                    # 17 API routes
│   │   │   ├── analyze-food/       # Claude Haiku vision (photo -> macros)
│   │   │   ├── analyze-description/# Text-based food analysis
│   │   │   ├── analyze-menu/       # Menu photo + URL scanning
│   │   │   ├── suggest-foods/      # AI food suggestions
│   │   │   ├── chat/               # AI nutrition chat (Haiku free / Sonnet pro)
│   │   │   ├── lookup-barcode/     # OpenFoodFacts API
│   │   │   ├── register-device/    # iOS device UUID registration
│   │   │   ├── scan-count/         # Usage tracking / remaining scans
│   │   │   ├── verify-subscription/# StoreKit receipt validation
│   │   │   ├── contact/            # Contact form (Resend email)
│   │   │   └── admin/              # Admin routes (login, logout, setup, stats, users, forgot/reset password)
│   │   ├── feed.xml/route.ts       # RSS feed
│   │   ├── opengraph-image.tsx
│   │   ├── robots.ts
│   │   ├── sitemap.ts
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/                 # 17 React components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   ├── HeroRotatingText.tsx
│   │   ├── Features.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── Pricing.tsx
│   │   ├── FAQ.tsx
│   │   ├── Testimonials.tsx
│   │   ├── Stats.tsx
│   │   ├── DownloadCTA.tsx
│   │   ├── MacroRings.tsx
│   │   ├── AnimateIn.tsx
│   │   ├── BrandContent.tsx
│   │   ├── ContactForm.tsx
│   │   ├── CookieConsentBanner.tsx
│   │   └── CopyLinkButton.tsx
│   ├── lib/
│   │   ├── admin-auth.ts           # PBKDF2 hashing, HMAC sessions, HttpOnly cookies
│   │   ├── blog.ts                 # Blog seed articles (HTML content)
│   │   ├── cookie-consent.ts       # 3-tier consent (necessary/analytics/marketing)
│   │   ├── security.ts             # CORS utilities
│   │   ├── rate-limit.ts           # In-memory rate limiting
│   │   ├── email-validation.ts     # Disposable email + MX record checks
│   │   ├── og-image.tsx            # Shared OG image component
│   │   ├── instagram-data.ts       # Instagram calendar data loader
│   │   ├── instagram-*.json        # Monthly calendar data (Mar-Jun 2026)
│   │   └── db/
│   │       ├── index.ts            # Neon + Drizzle lazy singleton
│   │       ├── schema.ts           # 5 tables (Drizzle ORM)
│   │       └── migrations/         # Drizzle migration files
│   ├── middleware.ts                # Admin auth redirect + llms.txt Link header
│   ├── next.config.ts              # Security headers, image optimization
│   ├── drizzle.config.ts
│   ├── package.json
│   └── tsconfig.json
├── ios/
│   ├── NourishAI.xcodeproj/        # Xcode project (29 Swift files)
│   └── NourishAI/
│       ├── NourishAIApp.swift       # App entry point
│       ├── ContentView.swift        # Root view + device registration
│       ├── Constants.swift          # API base URL, endpoints
│       ├── Models/                  # UserProfile, NutritionModels, NutritionCalculator
│       ├── Services/                # API manager, HealthKit, Subscriptions, Keychain, Push, AppDelegate
│       ├── Views/
│       │   ├── Dashboard/           # DashboardView
│       │   ├── FoodLog/             # Camera, Chat, Manual, Barcode, Menu, Ideas
│       │   ├── Discovery/           # RestaurantMapView (Apple MapKit)
│       │   ├── Chat/                # NutritionChatView
│       │   ├── Onboarding/          # OnboardingContainerView
│       │   ├── Progress/            # ProgressView
│       │   ├── Settings/            # SettingsView
│       │   └── Subscription/        # SubscriptionView (StoreKit 2)
│       ├── Components/              # MacroRingView, MealRow
│       └── Assets.xcassets/
├── marketing/                       # Reel generator + marketing engine
├── CLAUDE.md
├── SETUP.md
└── .claude/                         # This context folder
```

## Data Architecture

### Server-Side (Neon PostgreSQL via Drizzle ORM)

5 tables defined in `backend/lib/db/schema.ts`:

| Table | Purpose |
|-------|---------|
| `users` | iOS device registrations (UUID, push token, subscription tier/expiry) |
| `scan_usage` | AI scan tracking (user, type, model, tokens, timestamp) |
| `admin_users` | Dashboard admins (email, PBKDF2 password, role: super_admin/admin/viewer) |
| `blog_posts` | Blog content (slug, title, content, category, published flag) |
| `contact_submissions` | Contact form entries (name, email, subject, message, read flag) |

Connection: Lazy singleton via `db()` function in `lib/db/index.ts`. Neon serverless driver (HTTP mode). Safe for SSG -- won't crash at build time.

### Client-Side (iOS -- SwiftData, local-only)

| Model | Purpose |
|-------|---------|
| UserProfile | Goals, activity level, body stats |
| DailyNutrition | Daily macro totals |
| FoodEntry | Individual food items with macros |
| SavedFood | Favorites / frequent foods |
| DailyWaterIntake | Water tracking |

## Auth Architecture

### iOS Users

- Device UUID registration via `/api/register-device`
- Device ID sent as `X-Device-ID` header on all API calls
- Subscription verified via `/api/verify-subscription` (StoreKit receipt)

### Admin Dashboard

- PBKDF2 password hashing (100K iterations, SHA-512)
- HMAC-based session tokens in HttpOnly cookies (`nourishai-admin-session`)
- 24-hour session duration
- Middleware redirects unauthenticated requests to `/admin` login
- Password reset: HMAC-based self-validating tokens (15min expiry, invalidated on password change)
- Roles: `super_admin`, `admin`, `viewer`

## AI Architecture

All AI calls route through the backend (NO embedded API keys in iOS):

| Route | AI Model | Purpose |
|-------|----------|---------|
| `/api/analyze-food` | Claude Haiku (vision) | Photo to macros |
| `/api/analyze-description` | Claude Haiku (text) | Text to macros |
| `/api/analyze-menu` | Claude Haiku (vision) | Menu photo/URL to health scores |
| `/api/suggest-foods` | Claude Haiku (text) | Macro-based food suggestions |
| `/api/chat` | Haiku (free) / Sonnet (pro) | Nutrition chat |

## Security

- **CORS:** `lib/security.ts` -- allows `nourishhealthai.com` origins only
- **Headers:** `next.config.ts` headers() -- CSP, HSTS, X-Frame-Options, etc.
- **Rate limiting:** In-memory per-IP (`lib/rate-limit.ts`)
- **Email validation:** Disposable domain blocking + MX record checks
- **Admin auth:** PBKDF2 + HMAC sessions (not JWT)
