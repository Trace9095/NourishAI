# STRIPE_STANDARD.md — NourishAI (NAI)

> Full standard: `../../EPIC-AI-INTERNAL/_notes/STRIPE_STANDARD.md`
> Last updated: 2026-03-19

## Integration Status

**Status: N/A — iOS StoreKit 2 only**

NourishAI uses StoreKit 2 for iOS in-app subscriptions. No web Stripe integration.

If web subscriptions are added:
```typescript
metadata: {
  site: "nai",
  app_url: "https://nourishhealthai.com",
}
```
Note: iOS price should be 30% higher than web price to offset App Store fee.

---

*Last updated: 2026-03-19*
