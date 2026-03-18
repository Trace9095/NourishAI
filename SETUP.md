# NourishAI -- Service Runbook

> **Domain:** nourishhealthai.com | **Vercel Slug:** `nourish-ai`
> **Repo:** Trace9095/NourishAI | **Branch:** main
> **Vercel Root Dir:** `backend/`

---

## 1. Prerequisites

- Node.js 18+ and npm
- Xcode 16+ (for iOS development)
- Apple Developer account (for TestFlight / App Store)
- Vercel CLI: `npm i -g vercel`

## 2. Clone & Install

```bash
git clone git@github.com:Trace9095/NourishAI.git NourishAI-main
cd NourishAI-main/backend
npm install
```

## 3. Environment Variables

### Required (Vercel + local .env.local)

| Variable | Purpose | Where to get it |
|----------|---------|-----------------|
| `DATABASE_URL` | Neon PostgreSQL connection string | Vercel Neon integration (auto-set) |
| `ANTHROPIC_API_KEY` | Claude API for AI features | console.anthropic.com |
| `RESEND_API_KEY` | Email sending (contact form, admin password reset) | resend.com dashboard |
| `NEXT_PUBLIC_APP_URL` | Canonical URL | `https://nourishhealthai.com` |
| `ADMIN_SETUP_TOKEN` | One-time admin seed token | Set any secure string |
| `ADMIN_SESSION_SECRET` | HMAC signing for admin session cookies | Random 32+ char string |

### Pull from Vercel (recommended)

```bash
cd backend
vercel link --project nourish-ai --scope team_pGqkBUxWUXiBoZoKYPgweHDl --yes
vercel env pull .env.local
```

### Add a new env var

```bash
vercel env add VARIABLE_NAME production
```

## 4. Database

**ORM:** Drizzle ORM with Neon serverless HTTP driver.
**Schema:** `backend/lib/db/schema.ts` (5 tables).
**Config:** `backend/drizzle.config.ts`

### Run migrations

```bash
cd backend
npx drizzle-kit push
```

### Generate a new migration

```bash
cd backend
npx drizzle-kit generate
npx drizzle-kit push
```

### Seed first admin user

```bash
curl -X POST https://nourishhealthai.com/api/admin/setup \
  -H "Content-Type: application/json" \
  -d '{"email":"trace.hildebrand@gmail.com","name":"Trace Hildebrand","password":"YOUR_PASSWORD","setupToken":"YOUR_ADMIN_SETUP_TOKEN"}'
```

## 5. Local Development

```bash
cd backend
npm run dev          # http://localhost:3000
```

### iOS Development

1. Open `ios/NourishAI.xcodeproj` in Xcode
2. Set signing team to Apple Developer account
3. Update `Constants.swift` API base URL if needed (points to `nourishhealthai.com` by default)
4. Build and run on simulator or device

## 6. Build & Deploy

### Local build test

```bash
cd backend
npx next build
```

### Production deploy

Push to `main` branch triggers automatic Vercel deployment:

```bash
git add <specific files>
git commit -m "feat: description

Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>"
git push origin main
```

### Check deployment status

```bash
# Via Vercel CLI
vercel ls --scope team_pGqkBUxWUXiBoZoKYPgweHDl

# Via Vercel MCP (in Claude Code main context only)
# Use get_deployment or list_deployments with projectId nourish-ai
```

## 7. Email (Resend)

- **Provider:** Resend API (v6.9.3)
- **FROM address:** `NourishAI <noreply@nourishhealthai.com>`
- **Used in:**
  - `api/contact/route.ts` -- contact form submissions
  - `api/admin/forgot-password/route.ts` -- admin password reset emails
- **Lazy init pattern:** `getResend()` inside handlers, never module-scope
- **Domain:** `nourishhealthai.com` must be verified in Resend dashboard

## 8. Admin Dashboard

- **Login:** `https://nourishhealthai.com/admin`
- **Dashboard:** `/admin/dashboard` (12 KPIs, scan/user charts, activity tables)
- **Users:** `/admin/users` (CRUD for admin accounts)
- **Instagram:** `/admin/instagram-calendar` (content calendar management)
- **Auth:** PBKDF2 password hashing + HMAC session cookies (24hr)
- **Roles:** `super_admin` > `admin` > `viewer`

## 9. API Routes Reference

| Route | Method | Auth | Purpose |
|-------|--------|------|---------|
| `/api/analyze-food` | POST | X-Device-ID | Photo to macros (Claude Haiku vision) |
| `/api/analyze-description` | POST | X-Device-ID | Text to macros |
| `/api/analyze-menu` | POST | X-Device-ID | Menu scanning (photo + URL) |
| `/api/suggest-foods` | POST | X-Device-ID | AI food suggestions |
| `/api/chat` | POST | X-Device-ID | AI nutrition chat |
| `/api/lookup-barcode` | GET | X-Device-ID | OpenFoodFacts barcode lookup |
| `/api/register-device` | POST | none | Device UUID registration |
| `/api/scan-count` | GET | X-Device-ID | Usage / remaining scans |
| `/api/verify-subscription` | POST | X-Device-ID | StoreKit receipt validation |
| `/api/contact` | POST | none (rate-limited) | Contact form |
| `/api/admin/login` | POST | credentials | Admin login |
| `/api/admin/logout` | POST | session cookie | Admin logout |
| `/api/admin/setup` | POST | ADMIN_SETUP_TOKEN | One-time admin seed |
| `/api/admin/stats` | GET | session cookie | Dashboard data |
| `/api/admin/users` | GET/POST/PATCH/DELETE | session cookie | Admin user CRUD |
| `/api/admin/forgot-password` | POST | none | Password reset email |
| `/api/admin/reset-password` | POST | reset token | Password update |

## 10. Monitoring

- **Vercel Analytics:** Enabled via `@vercel/analytics` in layout
- **Vercel Speed Insights:** Enabled via `@vercel/speed-insights` in layout
- **Admin dashboard:** Auto-refreshes every 30s (pauses on tab hide)
- **Deployment logs:** Vercel dashboard or `vercel logs` CLI

## 11. Troubleshooting

| Issue | Fix |
|-------|-----|
| `DATABASE_URL is not set` | Run `vercel env pull .env.local` in backend/ |
| `ADMIN_SESSION_SECRET not set` | Add to Vercel env vars, redeploy |
| Admin login fails | Check `isActive` flag on admin_users record |
| AI analysis returns error | Verify `ANTHROPIC_API_KEY` is set and valid |
| Contact form email fails | Verify `RESEND_API_KEY` + domain verification in Resend |
| Build fails locally | Delete `node_modules/` and `npm install` fresh |
| Turbopack fails | Use `npx next build --webpack` |
| iOS API calls fail | Check `Constants.swift` base URL matches production domain |
