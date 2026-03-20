# NourishAI — Deployment

## Vercel (Website / Backend)

| Setting | Value |
|---------|-------|
| Vercel Slug | `nourish-ai` |
| Root Directory | `backend/` |
| Branch | `main` (auto-deploy on push) |
| Build Command | `next build` |
| GitHub Repo | Trace9095/NourishAI |
| Production URL | https://nourishhealthai.com |

## Build

```bash
cd backend
npm install
cp .env.example .env.local    # configure environment variables
npm run dev                    # http://localhost:3000
```

## Database

```bash
cd backend
npx drizzle-kit push           # push schema to Neon (5 tables)
npx drizzle-kit studio         # browse data in Drizzle Studio
```

## First Admin Setup

```bash
curl -X POST https://nourishhealthai.com/api/admin/setup \
  -H "Content-Type: application/json" \
  -d '{"email":"CEO@epicai.ai","password":"...","name":"Admin","token":"<ADMIN_SETUP_TOKEN>"}'
```

## iOS App

| Setting | Value |
|---------|-------|
| Bundle ID | com.epicai.nourishai |
| App Group | group.com.epicai.nourishai |
| Apple Team | MPH83385EQ |
| Xcode Project | `ios/NourishAI.xcodeproj` |
| iOS Target | iOS 17+ |
| Swift Version | 6 |

```bash
# Open in Xcode
open ios/NourishAI.xcodeproj
# Set developer team in Signing & Capabilities
# Build and run on simulator or device (iOS 17+)
```

Note: All API calls route through website API routes — no embedded keys in iOS.

## Environment Variables (Vercel)

| Variable | Required | Notes |
|----------|----------|-------|
| `ANTHROPIC_API_KEY` | Yes | Claude API (server-side only) |
| `RESEND_API_KEY` | Yes | Resend email sending |
| `DATABASE_URL` | Yes | Neon (auto via Vercel integration) |
| `NEXT_PUBLIC_APP_URL` | Yes | `https://nourishhealthai.com` |
| `ADMIN_SETUP_TOKEN` | Yes | One-time admin seed token |
| `ADMIN_SESSION_SECRET` | Yes | HMAC session signing secret |

## Security Notes

- All AI calls proxy through server routes (no client-side API keys)
- Admin auth: PBKDF2 100K iterations + HMAC SHA-256 session tokens
- Serverless-safe password reset: HMAC self-validating tokens (no in-memory state)
- Security headers: CSP, HSTS (2yr + preload), X-Frame-Options DENY
- CORS: configured in `lib/security.ts`

## App Store

- Screenshots: `marketing/output/appstore/` (25 PNGs)
- Device sizes: iPhone 6.5" (1242x2688), iPhone 6.7" (1284x2778), iPad 12.9" (2048x2732)
- StoreKit Product IDs: `com.nourishai.subscription.pro.monthly`, `com.nourishai.subscription.pro.annual`
- App Store Connect setup: pending (Trace action required)
