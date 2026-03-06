# NourishAI

**AI-powered nutrition tracking for fitness-focused people. Snap a photo, get instant macros.**

**Website:** [nourishhealthai.com](https://nourishhealthai.com)
**Bundle ID:** `com.epicai.nourishai`
**Built by:** [Epic AI](https://epicai.ai)

---

## Tech Stack

| Layer | Technology |
|:------|:-----------|
| iOS App | Swift 6, SwiftUI, SwiftData, iOS 17+ |
| Web Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict), Swift 6 (MainActor) |
| Styling | Tailwind CSS v4 |
| Database | Neon PostgreSQL via Drizzle ORM |
| AI | Claude Haiku (vision) via server proxy |
| Auth | PBKDF2 + HMAC sessions (admin), Device UUID (iOS) |
| Email | Resend API |
| Health | HealthKit (read/write nutrition, weight, steps) |
| Payments | StoreKit 2 (auto-renewable subscriptions) |
| Hosting | Vercel (serverless) |

---

## Features

### iOS App
- **AI Photo Scanning** -- Snap a photo of any meal, get instant calorie and macro breakdown via Claude Haiku vision
- **AI Text Analysis** -- Describe what you ate in natural language for quick macro estimates
- **Barcode Scanner** -- Scan packaged food barcodes via OpenFoodFacts API (free, no AI cost)
- **Manual Entry** -- Full manual macro entry for precise tracking
- **Daily Dashboard** -- Calorie ring, macro progress rings, recent meals, water intake, streak tracking
- **Food Log** -- Horizontal day strip, daily summary with progress bars, meals grouped by type
- **Progress Analytics** -- 7-day calorie chart, macro averages, consistency score, 9 achievement badges, AI weekly insights
- **Onboarding** -- 7-step flow: name, body metrics (ft/in + lbs conversions), sex, activity level, goal, plan summary
- **Subscription** -- Free tier (1 AI scan/week) + Pro ($7.99/mo or $39.99/yr unlimited)
- **Dark Theme** -- Full dark mode UI with branded green/orange accents

### Marketing Website
- **Landing Page** -- Hero, features grid, how-it-works, pricing, testimonials, FAQ, download CTA
- **Features Page** -- Detailed breakdown with Free vs Pro comparison table
- **About Page** -- Brand story, values, Epic AI
- **Blog** -- 5 seed articles with category filters, individual post pages
- **Contact** -- Form with Resend email integration
- **Brand Page** -- Color palette (click-to-copy), typography, referral links
- **Legal** -- Privacy Policy, Terms of Service, Accessibility Statement

### Admin Dashboard
- **12 KPI Cards** -- Total users, pro subscribers, revenue, AI costs, scans today/week/month, conversion rate
- **Charts** -- 30-day scan volume and user growth
- **Tables** -- Recent scans and recent users with pagination
- **Auto-refresh** -- 30-second polling for real-time monitoring
- **Auth** -- PBKDF2 password hashing, HMAC session cookies, HttpOnly/Secure

### API Routes (11)
- `analyze-food` -- Claude Haiku vision proxy (photo to macros)
- `analyze-description` -- Text-based food analysis
- `lookup-barcode` -- OpenFoodFacts API lookup
- `register-device` -- Device UUID registration
- `scan-count` -- Usage tracking / remaining scans
- `verify-subscription` -- StoreKit receipt validation
- `contact` -- Contact form (Resend email)
- `admin/login` -- Admin authentication
- `admin/logout` -- Session destruction
- `admin/setup` -- One-time admin seed (token-protected)
- `admin/stats` -- Dashboard data aggregation

---

## Architecture

```
NourishAI-main/
├── ios/                          # iOS app (Swift 6 / SwiftUI)
│   ├── NourishAI.xcodeproj
│   └── NourishAI/
│       ├── Models/               # SwiftData models (UserProfile, Nutrition, FoodEntry)
│       ├── Services/             # API manager, HealthKit, Subscriptions
│       ├── Views/                # Dashboard, FoodLog, Progress, Settings, Onboarding
│       └── Components/           # MacroRingView, MealRow
├── backend/                      # Next.js 16 website + API (Vercel root dir)
│   ├── app/                      # Pages, API routes, metadata
│   ├── components/               # React components (15)
│   ├── lib/                      # DB, auth, blog, security, cookies
│   └── public/                   # Favicons, llms.txt, ai.txt
├── CLAUDE.md                     # Project instructions for LLM
├── PHASES.md                     # Phase tracking
├── TODO.md                       # Feature backlog
└── HUMAN_TASKS.md                # Manual action items
```

### Data Architecture

**iOS (SwiftData -- local, offline-capable):**
- `UserProfile` -- Goals, body info, dietary preferences, macro targets
- `DailyNutrition` -- Daily macro totals with food entry relationships
- `FoodEntry` -- Individual meals with calories, protein, carbs, fat, meal type, entry method
- `SavedFood` -- Favorite/frequent foods for quick re-logging
- `DailyWaterIntake` + `WaterEntry` -- Hydration tracking

**Server (Neon PostgreSQL -- 5 tables):**
- `users` -- Device registration, subscription status
- `scan_usage` -- AI scan tracking (type, model, tokens, timestamp)
- `admin_users` -- Dashboard access (super_admin, admin, viewer roles)
- `blog_posts` -- Blog content management
- `contact_submissions` -- Contact form entries

---

## Subscription Model

| Tier | Price | AI Scans | Features |
|:-----|:------|:---------|:---------|
| Free | $0 | 1/week | Basic logging, manual entry, barcode, HealthKit |
| Pro | $7.99/mo or $39.99/yr | Unlimited (30s cooldown) | All free + unlimited AI, saved meals, analytics, water tracking, weekly insights |

**Product IDs:**
- `com.nourishai.subscription.pro.monthly`
- `com.nourishai.subscription.pro.annual`

**AI Cost:** ~$0.001-0.002 per photo scan (Claude Haiku). Free tier costs essentially nothing. Pro user at 10 scans/day = ~$0.30/month.

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- Xcode 16+ (for iOS development)
- Neon PostgreSQL database
- Anthropic API key (for AI features)

### Website

```bash
cd backend
npm install
cp .env.example .env.local   # Configure environment variables
npm run dev                   # http://localhost:3000
```

### Environment Variables

| Variable | Description |
|:---------|:-----------|
| `ANTHROPIC_API_KEY` | Claude API key (server-side only) |
| `RESEND_API_KEY` | Email sending |
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `NEXT_PUBLIC_APP_URL` | Production URL |
| `ADMIN_SETUP_TOKEN` | One-time admin seed token |
| `ADMIN_SESSION_SECRET` | HMAC session signing secret |

### iOS App

1. Open `ios/NourishAI.xcodeproj` in Xcode
2. Set development team in Signing & Capabilities
3. Build and run on simulator or device (iOS 17+)
4. API calls route through the website's API routes -- no embedded keys

### Admin Setup

```bash
# Seed the first admin account (one-time)
curl -X POST https://nourishhealthai.com/api/admin/setup \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"your-password","name":"Admin","token":"your-setup-token"}'
```

---

## Brand

| Element | Value |
|:--------|:------|
| Primary | `#34C759` (green) |
| Accent | `#FF9500` (orange) |
| Dark BG | `#0A0A14` |
| Card BG | `#1A1A2E` |
| Protein | `#FF6B6B` (red) |
| Carbs | `#4ECDC4` (teal) |
| Fat | `#FFE66D` (yellow) |
| Water | `#5AC8FA` (blue) |
| iOS Font | SF Pro (system) |
| Web Fonts | Outfit (headlines) + Inter (body) |

---

## Security

- **No embedded API keys** -- All AI calls proxy through server API routes
- **PBKDF2 password hashing** -- 100,000 iterations with random salt (admin auth)
- **HMAC session tokens** -- SHA-256 signed, HttpOnly, Secure, SameSite cookies
- **Input validation** -- Size limits on all API inputs (photos: 10MB, text: 1000 chars)
- **Rate limiting** -- 30-second cooldown between scans, weekly caps for free tier
- **Security headers** -- CSP, HSTS (2yr + preload), X-Frame-Options DENY, Permissions-Policy
- **CORS** -- Configured in `lib/security.ts`

---

## Deployment

- **Website:** Auto-deploys to Vercel on push to `main` (root dir: `backend/`)
- **iOS:** Build in Xcode, submit via App Store Connect
- **Database:** Neon PostgreSQL via Vercel Integration

---

## License

Proprietary. Copyright 2026 Epic AI. All rights reserved.
