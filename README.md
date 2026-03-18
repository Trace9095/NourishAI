<p align="center">
  <img src="backend/public/favicon.svg" alt="NourishAI" width="120" height="120" />
</p>

<h1 align="center">NourishAI</h1>

<p align="center">
  <strong>AI-powered nutrition tracking for fitness-focused people. Snap a photo, get instant macros.</strong>
</p>

<p align="center">
  <a href="https://nourishhealthai.com"><img src="https://img.shields.io/badge/Website-nourishhealthai.com-34C759?style=flat-square&logo=vercel&logoColor=white" alt="Website" /></a>
  <img src="https://img.shields.io/badge/iOS-17%2B-000000?style=flat-square&logo=apple&logoColor=white" alt="iOS 17+" />
  <img src="https://img.shields.io/badge/Swift-6-F05138?style=flat-square&logo=swift&logoColor=white" alt="Swift 6" />
  <img src="https://img.shields.io/badge/Next.js-16-000000?style=flat-square&logo=next.js&logoColor=white" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/AI-Claude%20Haiku-CC785C?style=flat-square&logo=anthropic&logoColor=white" alt="Claude Haiku" />
  <img src="https://img.shields.io/badge/Database-Neon%20PostgreSQL-4ECDC4?style=flat-square&logo=postgresql&logoColor=white" alt="Neon PostgreSQL" />
  <img src="https://img.shields.io/badge/License-Proprietary-red?style=flat-square" alt="License" />
</p>

---

## Overview

NourishAI is an AI-powered nutrition tracking iOS app paired with a Next.js marketing website and backend API. Users snap a photo of any meal and get instant calorie and macro breakdowns powered by Claude Haiku vision. The app targets gym-goers, macro trackers, and athletes with a freemium subscription model.

**Built by [Epic AI](https://epicai.ai)** | Bundle ID: `com.epicai.nourishai`

---

## Codebase Stats

| Metric | Count |
|:-------|------:|
| iOS Swift Files | 29 |
| iOS Lines of Code | ~7,900 |
| Backend TS/TSX Files | ~78 |
| React Components | 15 |
| API Routes | 17 |
| Website Pages | 16 |
| Database Tables | 5 |
| Total Platforms | 2 (iOS + Web) |

---

## Features

### iOS App

- **AI Photo Scanning** -- Snap a photo of any meal, get instant calorie and macro breakdown via Claude Haiku vision
- **AI Text Analysis** -- Describe what you ate in natural language for quick macro estimates
- **Menu Scanner** -- Photograph or URL-scan restaurant menus with health scores (1-10)
- **Barcode Scanner** -- Scan packaged food barcodes via OpenFoodFacts (free, no AI cost)
- **AI Food Suggestions** -- Get smart food ideas based on remaining daily macros
- **AI Nutrition Chat** -- Conversational nutrition advice (Haiku free / Sonnet pro, 5 msg/day free)
- **Daily Dashboard** -- Calorie ring, macro progress rings, recent meals, water intake, streak tracking
- **Food Log** -- Horizontal day strip, daily summary with progress bars, meals grouped by type
- **Progress Analytics** -- 7-day calorie chart, macro averages, consistency score, 9 achievement badges
- **Restaurant Discovery** -- Apple MapKit integration for nearby healthy dining options
- **Onboarding** -- 7-step flow: name, body metrics, sex, activity level, goal, plan summary
- **HealthKit** -- Real steps, active calories, and weight sync
- **StoreKit 2** -- Auto-renewable subscriptions with backend receipt validation

### Marketing Website

- **Landing Page** -- Hero, features grid, how-it-works, pricing, testimonials, FAQ, download CTA
- **Features Page** -- Detailed breakdown with Free vs Pro comparison table
- **About Page** -- Brand story, values, Epic AI partnership
- **Blog** -- 10 articles with category filters, individual post pages, RSS feed
- **Contact** -- Form with Resend email integration
- **Brand Page** -- Color palette (click-to-copy), typography, referral links
- **Legal** -- Privacy Policy, Terms of Service, Accessibility Statement

### Admin Dashboard

- **12 KPI Cards** -- Total users, pro subscribers, revenue, AI costs, scans today/week/month, conversion rate
- **Charts** -- 30-day scan volume and user growth
- **Tables** -- Recent scans and recent users with pagination
- **User Management** -- CRUD for admin accounts (super_admin, admin, viewer roles)
- **Password Reset** -- Forgot password via Resend email with HMAC-based self-validating tokens
- **Instagram Calendar** -- Grid/list view, month filter, search, posted tracking
- **Auto-refresh** -- 30-second polling (pauses on tab hide)

---

## Tech Stack

| Layer | Technology |
|:------|:-----------|
| iOS App | Swift 6, SwiftUI, SwiftData, HealthKit, StoreKit 2, iOS 17+ |
| Web Framework | Next.js 16 (App Router), TypeScript (strict) |
| Styling | Tailwind CSS v4 |
| Database | Neon PostgreSQL via Drizzle ORM (5 tables) |
| AI | Claude Haiku (vision + text) via server proxy |
| Admin Auth | PBKDF2 (100K iterations) + HMAC SHA-256 sessions, HttpOnly cookies |
| iOS Auth | Device UUID registration |
| Email | Resend API |
| Payments | StoreKit 2 (auto-renewable subscriptions) |
| Analytics | Vercel Analytics + Speed Insights |
| Hosting | Vercel (serverless, auto-deploy on push) |

---

## Architecture

```
NourishAI-main/
├── ios/                              # iOS app (Swift 6 / SwiftUI)
│   ├── NourishAI.xcodeproj
│   └── NourishAI/
│       ├── Models/                   # SwiftData: UserProfile, Nutrition, FoodEntry
│       ├── Services/                 # API manager, HealthKit, Subscriptions, Keychain, Push
│       ├── Views/                    # Dashboard, FoodLog, Progress, Settings, Onboarding, Chat
│       │   ├── Dashboard/            # DashboardView (macro rings, meals, water)
│       │   ├── FoodLog/              # Camera, Text, Barcode, Menu, Ideas (7 views)
│       │   ├── Chat/                 # NutritionChatView (AI conversation)
│       │   ├── Discovery/            # RestaurantMapView (MapKit)
│       │   ├── Progress/             # Charts, achievements, streaks
│       │   ├── Settings/             # Profile editing, subscription management
│       │   ├── Onboarding/           # 7-step onboarding
│       │   └── Subscription/         # Paywall, plans, StoreKit 2
│       └── Components/               # MacroRingView, MealRow
│
├── backend/                          # Next.js 16 (Vercel root dir)
│   ├── app/                          # Pages + API routes
│   │   ├── page.tsx                  # Landing page
│   │   ├── features/                 # Features page
│   │   ├── about/                    # About page
│   │   ├── blog/                     # Blog index + [slug] posts
│   │   ├── contact/                  # Contact form
│   │   ├── brand/                    # Brand assets (noindex)
│   │   ├── privacy/                  # Privacy policy
│   │   ├── terms/                    # Terms of service
│   │   ├── accessibility/            # Accessibility statement
│   │   ├── admin/                    # Login, dashboard, users, forgot/reset password, IG calendar
│   │   └── api/                      # 17 API routes
│   │       ├── analyze-food/         # Claude Haiku vision (photo -> macros)
│   │       ├── analyze-description/  # Text-based food analysis
│   │       ├── analyze-menu/         # Menu photo + URL scanning
│   │       ├── suggest-foods/        # AI food suggestions
│   │       ├── chat/                 # AI nutrition chat (Haiku free / Sonnet pro)
│   │       ├── lookup-barcode/       # OpenFoodFacts API
│   │       ├── register-device/      # Device UUID registration
│   │       ├── scan-count/           # Usage tracking
│   │       ├── verify-subscription/  # StoreKit receipt validation
│   │       ├── contact/              # Contact form (Resend)
│   │       └── admin/                # login, logout, setup, stats, users, forgot/reset password
│   ├── components/                   # 15 React components
│   ├── lib/                          # DB, auth, blog, security, cookies
│   └── public/                       # Favicons, llms.txt, ai.txt
│
├── marketing/                        # Instagram + reel generators
├── CLAUDE.md                         # Project instructions
├── PHASES.md                         # Phase tracking
└── HUMAN_TASKS.md                    # Manual action items
```

### Data Architecture

**iOS (SwiftData -- local-first, offline-capable):**

| Model | Purpose |
|:------|:--------|
| `UserProfile` | Goals, body info, dietary preferences, macro targets |
| `DailyNutrition` | Daily macro totals with food entry relationships |
| `FoodEntry` | Individual meals (calories, protein, carbs, fat, meal type, entry method) |
| `SavedFood` | Favorite/frequent foods for quick re-logging |
| `DailyWaterIntake` | Hydration tracking with water entries |

**Server (Neon PostgreSQL -- 5 tables):**

| Table | Purpose |
|:------|:--------|
| `users` | Device registration, subscription status |
| `scan_usage` | AI scan tracking (type, model, tokens, timestamp) |
| `admin_users` | Dashboard access (super_admin, admin, viewer roles) |
| `blog_posts` | Blog content management |
| `contact_submissions` | Contact form entries |

---

## Subscription Model

| Tier | Price | AI Scans | Features |
|:-----|:------|:---------|:---------|
| Free | $0 | 1/week | Basic logging, manual entry, barcode, HealthKit |
| Pro | $7.99/mo or $39.99/yr | Unlimited (30s cooldown) | All free + unlimited AI, menu scanner, food ideas, AI chat (Sonnet), saved meals, analytics, water tracking |

**AI Cost:** ~$0.001-0.002 per photo scan (Claude Haiku). Free tier costs near zero. Pro user at 10 scans/day = ~$0.30/month.

---

## Getting Started

### Prerequisites

- Node.js 18+, npm
- Xcode 16+ (for iOS development)
- Neon PostgreSQL database
- Anthropic API key

### Website / Backend

```bash
cd backend
npm install
cp .env.example .env.local    # Configure environment variables
npm run dev                    # http://localhost:3000
```

### iOS App

1. Open `ios/NourishAI.xcodeproj` in Xcode
2. Set development team in Signing & Capabilities
3. Build and run on simulator or device (iOS 17+)
4. API calls route through the website's API routes -- no embedded keys

### First Admin Setup

```bash
curl -X POST https://nourishhealthai.com/api/admin/setup \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","password":"your-password","name":"Admin","token":"your-setup-token"}'
```

---

## Environment Variables

| Variable | Required | Description |
|:---------|:--------:|:------------|
| `ANTHROPIC_API_KEY` | Yes | Claude API key (server-side only) |
| `RESEND_API_KEY` | Yes | Resend email sending |
| `DATABASE_URL` | Yes | Neon PostgreSQL connection string |
| `NEXT_PUBLIC_APP_URL` | Yes | Production URL (`https://nourishhealthai.com`) |
| `ADMIN_SETUP_TOKEN` | Yes | One-time admin seed token |
| `ADMIN_SESSION_SECRET` | Yes | HMAC session signing secret |

---

## Security

- **No embedded API keys** -- All AI calls proxy through server API routes
- **PBKDF2 password hashing** -- 100,000 iterations with random salt
- **HMAC session tokens** -- SHA-256 signed, HttpOnly, Secure, SameSite cookies
- **Serverless-safe password reset** -- HMAC-based self-validating tokens (no in-memory state)
- **Input validation** -- Size limits on all inputs (photos: 10MB, text: 1,000 chars)
- **Rate limiting** -- 30-second cooldown between scans, weekly caps for free tier
- **Security headers** -- CSP, HSTS (2yr + preload), X-Frame-Options DENY, Permissions-Policy
- **CORS** -- Configured in `lib/security.ts`

---

## Deployment

| Target | Method |
|:-------|:-------|
| Website/API | Auto-deploys to Vercel on push to `main` (root dir: `backend/`) |
| iOS App | Build in Xcode, submit via App Store Connect |
| Database | Neon PostgreSQL via Vercel Integration |

---

## Brand

| Element | Value |
|:--------|:------|
| Primary Green | `#34C759` |
| Accent Orange | `#FF9500` |
| Dark Background | `#0A0A14` |
| Card Background | `#1A1A2E` |
| Protein | `#FF6B6B` |
| Carbs | `#4ECDC4` |
| Fat | `#FFE66D` |
| Water | `#5AC8FA` |
| iOS Font | SF Pro (system) |
| Web Fonts | Outfit (headlines) + Inter (body) |

---

## License

Proprietary. Copyright 2026 Epic AI. All rights reserved.
