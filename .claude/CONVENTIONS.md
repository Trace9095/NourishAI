# NourishAI -- Conventions

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 16.1.6 |
| Language | TypeScript (strict) | 5.x |
| React | React + React DOM | 19.2.3 |
| Styling | Tailwind CSS v4 | 4.x |
| ORM | Drizzle ORM | 0.45.1 |
| Database | Neon PostgreSQL (serverless HTTP) | -- |
| Email | Resend | 6.9.3 |
| Analytics | Vercel Analytics + Speed Insights | -- |
| iOS | Swift 6, SwiftUI, SwiftData, iOS 17+ | -- |
| Package Manager | npm | always |

## Project Structure

- **Vercel root dir:** `backend/`
- **App directory:** `backend/app/` (NOT `backend/src/app/`)
- **Components:** `backend/components/`
- **Lib:** `backend/lib/`
- **DB schema:** `backend/lib/db/schema.ts` (Drizzle)
- **iOS source:** `ios/NourishAI/`
- **Path alias:** `@/` maps to `backend/`

## Code Patterns

### Database Access
```typescript
import { db } from "@/lib/db";
// Always call db() as a function (lazy singleton)
const database = db();
```

### Resend Email (Lazy Init)
```typescript
// CORRECT: Lazy init inside handler
let _resend: Resend | null = null;
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}

// WRONG: Module-scope instantiation (breaks SSG)
const resend = new Resend(process.env.RESEND_API_KEY);
```

### CORS Pattern
```typescript
import { handleCors, corsHeaders } from "@/lib/security";

export async function OPTIONS(request: NextRequest) {
  return handleCors(request) ?? NextResponse.json(null, { status: 204 });
}

export async function POST(request: NextRequest) {
  const cors = handleCors(request);
  if (cors) return cors;
  // ... handler logic
  return NextResponse.json(data, { headers: corsHeaders(request) });
}
```

### Admin Auth Check
```typescript
import { getSessionAdmin } from "@/lib/admin-auth";

const admin = await getSessionAdmin();
if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
```

## iOS Conventions

- **Swift 6:** `@MainActor` by default, `nonisolated` for background work
- **Codable = Sendable** for all model types
- **API calls:** All go through `NourishAPIManager` -- never embed API keys
- **Device ID:** Stored in Keychain via `KeychainService`
- **New Swift files:** Add through Xcode UI (4 pbxproj entries required)

## Git Conventions

- **Branch:** `main` (single branch, auto-deploys to Vercel)
- **Commit prefix:** `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`
- **Co-author:** `Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>`
- **Never commit:** `.env`, `.env.local`, `.env.production`, secrets
- **Image quality:** `quality={90}` on `<Image>` components, never on Lucide icons (`<ImageIcon>`, `<ImagePlus>`)

## Gold Standard Rules (Key Items)

- OG image route segment config (`runtime`, `size`) must be static literals
- No `backdrop-blur` on fixed/sticky elements (iOS Safari breaks)
- 44px minimum touch targets on all tappable elements
- All pages need per-page `opengraph-image.tsx`
- Security headers in `next.config.ts` headers() only -- never duplicate in `lib/security.ts`
- CORS in `lib/security.ts` only -- never in `next.config.ts`
- Footer lock icon links to `/admin`
- `<Image fill>` needs explicit `sizes` prop (heroes need `sizes="100vw"`)

## Naming

- **Brand:** "NourishAI" (one word, capital N and AI)
- **Domain:** nourishhealthai.com
- **De-brand:** No "Epic AI" or "Epic Adventures" in visitor-facing content
- **Colors:** Primary `#34C759` (green), Accent `#FF9500` (orange), Dark `#0A0A14`
- **Fonts:** Inter (body) + Outfit (headlines) on web, SF Pro on iOS
