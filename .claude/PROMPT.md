# NourishAI -- Quick Start

> **Repo:** Trace9095/NourishAI | **Domain:** nourishhealthai.com
> **Vercel Slug:** `nourish-ai` | **Team:** `team_pGqkBUxWUXiBoZoKYPgweHDl`
> **Root Dir:** `backend/` | **Branch:** `main`

## What This Is

NourishAI is an AI-powered nutrition tracking app (iOS + web). Users snap a photo of food, get instant macro breakdown via Claude Haiku vision. Freemium subscription model ($7.99/mo or $39.99/yr for Pro).

- **iOS app** -- Swift 6 / SwiftUI / SwiftData / iOS 17+ (29 source files)
- **Marketing website + backend API** -- Next.js 16 / Tailwind v4 / Drizzle ORM / Neon PostgreSQL
- **AI** -- Claude Haiku (vision) for food analysis, Sonnet for Pro chat

## Current Phase

Phases 0-3.6 COMPLETE. Phase 4 (Apple Watch + Widget) and Phase 5 (App Store Launch) are pending.

## Build & Run

```bash
cd backend && npm install && npm run dev    # Web (http://localhost:3000)
# iOS: Open ios/NourishAI.xcodeproj in Xcode, set team, build
```

## Key Rules

1. NO embedded API keys in iOS -- all AI calls go through server API routes
2. De-brand: show "NourishAI" branding, NOT "Epic AI" or "Epic Adventures"
3. Rate limiting: Free = 1 scan/week, Pro = unlimited + 30s cooldown
4. Security: CORS in `lib/security.ts`, headers in `next.config.ts` -- never both
5. Package manager: npm (never yarn/pnpm)
6. Commit format: `feat:`/`fix:`/`chore:` + `Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>`

## Read Next

- `CLAUDE.md` -- full project context, file inventory, session history
- `.claude/ARCHITECTURE.md` -- technical map
- `.claude/CONVENTIONS.md` -- stack patterns and rules
- `SETUP.md` -- service runbook (env vars, DB, deploy)
