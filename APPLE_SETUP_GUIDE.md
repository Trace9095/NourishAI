# NourishAI — Apple Developer & App Store Connect Setup Guide

> Step-by-step instructions for Trace to set up subscriptions, certificates, and App Store listing.
> This is a HUMAN TASK — these steps require the Apple Developer portal and cannot be done via CLI.

---

## Prerequisites

- [x] Apple Developer Program membership ($99/yr) — already active for LiftLabPro
- [ ] Register bundle ID: `com.epicai.nourishai`
- [ ] Register app group: `group.com.epicai.nourishai`

---

## Step 1: Register Bundle IDs

1. Go to [Apple Developer > Certificates, Identifiers & Profiles](https://developer.apple.com/account/resources/identifiers/list)
2. Click "+" to register new identifiers

**Main App:**
- Type: App IDs > App
- Description: NourishAI
- Bundle ID: `com.epicai.nourishai`
- Capabilities: HealthKit, In-App Purchase, Push Notifications

**Watch App:**
- Bundle ID: `com.epicai.nourishai.watchkitapp`

**Widget:**
- Bundle ID: `com.epicai.nourishai.widget`

**App Group:**
- Type: App Groups
- Description: NourishAI Shared Data
- Identifier: `group.com.epicai.nourishai`

---

## Step 2: Register the App in App Store Connect

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Click "Apps" > "+" > "New App"
3. Fill in:
   - **Platform:** iOS
   - **Name:** NourishAI
   - **Primary Language:** English (U.S.)
   - **Bundle ID:** `com.epicai.nourishai` (must match Step 1)
   - **SKU:** `nourishai-001`
   - **User Access:** Full Access
4. Click "Create"

---

## Step 3: Create Subscription Group

1. In your app page, go to sidebar: **Monetization > Subscriptions**
2. Click "+" to create a new **Subscription Group**
3. Reference Name: `NourishAI Pro`
4. Click "Create"

---

## Step 4: Add Monthly Subscription

1. Inside the "NourishAI Pro" group, click "+" > **Create Subscription**
2. Fill in:
   - **Reference Name:** `Pro Monthly`
   - **Product ID:** `com.nourishai.subscription.pro.monthly`
3. Click "Create"
4. Set **Subscription Duration:** 1 Month
5. Click **Subscription Pricing** > "+" > Start Date: today
6. Select price: **$7.99** (or nearest tier)
7. **CRITICAL — Add Localization:**
   - Click "+" next to "Subscription Localizations"
   - Language: English (U.S.)
   - Display Name: `NourishAI Pro`
   - Description: `Unlimited AI food scanning, detailed analytics, Apple Watch companion, saved meals, and weekly insights`
   - WITHOUT a localization, StoreKit will NOT find the product!

---

## Step 5: Add Annual Subscription

1. Same group, click "+" > **Create Subscription**
2. Fill in:
   - **Reference Name:** `Pro Annual`
   - **Product ID:** `com.nourishai.subscription.pro.annual`
3. Click "Create"
4. Set **Subscription Duration:** 1 Year
5. Set price: **$39.99** (58% savings vs monthly)
6. Add the same localization as Step 4

---

## Step 6: Set Up Free Trial (Optional but Recommended)

1. Click on "Pro Annual" subscription
2. Go to **Subscription Prices** section
3. Click **Introductory Offers** > "+"
4. Type: **Free Trial**
5. Duration: **1 Week** (7 days)
6. This applies only to the annual plan — strong conversion driver

---

## Step 7: Review Information

When ready for App Store review, you'll need:
1. A screenshot of the subscription paywall in the app
2. Review Notes explaining: "Subscription unlocks unlimited AI-powered food photo scanning, detailed nutrition analytics, Apple Watch companion app, saved meals library, and weekly AI-generated nutrition insights."

---

## Step 8: Enable StoreKit Testing in Xcode

This lets you test purchases locally without real money:

1. In Xcode: **File > New > File from Template**
2. Search for "StoreKit" > select **StoreKit Configuration File**
3. Name: `NourishAI.storekit`
4. **Do NOT check** "Sync this file with an app in App Store Connect"
5. In the storekit file:
   - Click "+" bottom-left > **Add Subscription Group**
   - Group name: `NourishAI Pro`
   - Add subscription: `com.nourishai.subscription.pro.monthly` ($7.99, 1 month)
   - Add subscription: `com.nourishai.subscription.pro.annual` ($39.99, 1 year)
6. In Xcode: **Product > Scheme > Edit Scheme**
7. Go to **Run > Options**
8. Set **StoreKit Configuration** to `NourishAI.storekit`
9. Now when you run in Simulator, purchases use the local config

---

## Step 9: Agreements & Banking

1. Go to [App Store Connect > Agreements, Tax, and Banking](https://appstoreconnect.apple.com/agreements)
2. Ensure **Paid Apps** agreement is active
   - If already active from LiftLabPro, you're good
   - If not, accept the agreement and add bank account + tax forms
3. This is required before you can sell subscriptions

---

## Step 10: Sandbox Testing

Before submitting to App Store:

1. Go to [App Store Connect > Users and Access > Sandbox](https://appstoreconnect.apple.com/access/testers)
2. Create a **Sandbox Tester** account (use a test email)
3. On your test device: Settings > App Store > sign out of real account
4. Sign in with sandbox account
5. Run app from Xcode on device (not Simulator)
6. Purchase subscription — it will use sandbox (no real charge)
7. Sandbox subscriptions auto-renew at accelerated rate:
   - 1 month = 5 minutes
   - 1 year = 1 hour

---

## Step 11: TestFlight

1. In Xcode: **Product > Archive**
2. Click **Distribute App > App Store Connect**
3. Upload the archive
4. In App Store Connect: go to **TestFlight** tab
5. Create a **Test Group** (e.g., "Beta Testers")
6. Add testers by email
7. They'll get a TestFlight invite to install the app

---

## Step 12: App Store Submission

When ready for public launch:

1. In App Store Connect > App Store tab:
   - Add App Store screenshots (required sizes: 6.7" iPhone 15 Pro Max, 6.1" iPhone 15 Pro)
   - Write description, keywords, categories
   - Set Privacy Policy URL (your website's /privacy page)
   - Set Support URL (your website's /contact or main page)
2. Select the build from TestFlight
3. Add pricing (Free with In-App Purchases)
4. Click **Submit for Review**
5. Review typically takes 24-48 hours

---

## Quick Reference

| Item | Value |
|------|-------|
| Bundle ID (main) | `com.epicai.nourishai` |
| Bundle ID (watch) | `com.epicai.nourishai.watchkitapp` |
| Bundle ID (widget) | `com.epicai.nourishai.widget` |
| App Group | `group.com.epicai.nourishai` |
| SKU | `nourishai-001` |
| Monthly Product ID | `com.nourishai.subscription.pro.monthly` |
| Annual Product ID | `com.nourishai.subscription.pro.annual` |
| Monthly Price | $7.99 |
| Annual Price | $39.99 |
| Free Trial | 7 days (annual only) |
