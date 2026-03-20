# AI Crawlability Audit — NourishAI
Date: 2026-03-20

## Status
| Item | Status | Notes |
|------|--------|-------|
| robots.ts with AI crawlers | ✅ Already done | Full AI crawler allowlist |
| llms.txt | ✅ Already done | Linked via `alternates.types` in metadata |
| sitemap.ts | ✅ Already done | |
| JSON-LD Structured Data | ✅ Enhanced S122 | MobileApplication + Organization + FAQPage |
| OpenGraph metadata | ✅ Complete | og:type, og:image, og:title, og:description, og:url, og:siteName |
| Twitter card tags | ✅ Complete | summary_large_image card |
| RSS feed | ✅ Present | /feed.xml linked via alternates |

## JSON-LD Schemas (Post-Audit)
- **MobileApplication**: App type, operatingSystem (iOS 17+), applicationCategory (HealthApplication), featureList (8 features), offers (Free / Pro Monthly $7.99 / Pro Annual $39.99), creator
- **Organization**: @id anchor, name, url, logo, description, contactPoint, sameAs
- **FAQPage**: 6 Q&As covering tracking method, pricing, accuracy, dietary restrictions, HealthKit sync, privacy

## Changes Made S122
- Renamed `jsonLdString` → `jsonLdApp` (renamed variable for clarity)
- Expanded `MobileApplication` schema: added `featureList`, `url`, renamed offer `name` fields, added annual offer tier
- Added new `jsonLdOrg` — Organization schema with @id, logo, description, contactPoint, sameAs
- Added new `jsonLdFaq` — FAQPage schema with 6 real questions users ask about NourishAI
- Updated `<head>` to render all three `<script type="application/ld+json">` blocks

## Notes
- Was previously: single MobileApplication schema only (no Organization, no FAQPage)
- App is iOS-only; MobileApplication type is correct (not SoftwareApplication)
- Privacy answer accurately reflects local SwiftData storage architecture
- Pro Annual $39.99/yr pricing confirmed in CLAUDE.md
