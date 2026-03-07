# NourishAI — App Store Listing

## App Name
NourishAI - Smart Nutrition

## Subtitle (30 chars max)
AI-Powered Macro Tracking

## Category
Primary: Health & Fitness
Secondary: Food & Drink

## Price
Free (with In-App Purchases)

---

## Description (4000 chars max)

NourishAI makes nutrition tracking effortless with AI-powered food recognition. Just snap a photo of your meal and get instant, accurate macro breakdowns — no more searching databases or guessing portion sizes.

INSTANT AI FOOD SCANNING
Point your camera at any meal and NourishAI instantly identifies the food and calculates calories, protein, carbs, and fat. Our AI analyzes portion sizes, ingredients, and cooking methods for accuracy that beats manual entry.

SMART MACRO TRACKING
Track your daily nutrition with beautiful macro rings that update in real time. Set personalized targets for calories, protein, carbs, and fat based on your goals — whether you're building muscle, losing fat, or maintaining.

BARCODE SCANNER
Scan packaged foods instantly. NourishAI pulls nutrition data from the world's largest open food database so you never have to type in numbers manually.

RESTAURANT MENU SCANNER
Dining out? Scan a restaurant menu or paste a website URL and NourishAI analyzes every item, showing health scores and recommending the best options for your goals.

AI NUTRITION COACH
Chat with your personal AI nutrition assistant. It knows your goals, your macros, and what you've eaten today — so it gives advice tailored specifically to you.

FOOD IDEAS & SUGGESTIONS
Running low on protein? NourishAI suggests foods that fit your remaining macros perfectly, helping you hit your targets every day.

NEARBY HEALTHY RESTAURANTS
Discover restaurants near you with an interactive map. Find healthy eating options wherever you are.

HEALTHKIT INTEGRATION
Syncs with Apple Health to pull your steps, active calories, height, weight, and more. NourishAI writes your nutrition data back to Health so everything stays connected.

PERSONALIZED GOALS
Set your nutrition goal (lose weight, build muscle, maintain) and activity level. NourishAI calculates your ideal macro targets using the Mifflin-St Jeor equation, or set custom targets manually.

BEAUTIFUL DARK INTERFACE
A premium dark theme designed for daily use. Clean, fast, and focused on what matters — your nutrition.

FREE TO START
Get started with free AI food scans every week. Upgrade to Pro for unlimited scans, premium AI chat with advanced insights, and priority analysis.

NourishAI Pro subscription options:
- Monthly: $7.99/month
- Annual: $39.99/year (save 58%)

Payment will be charged to your Apple ID account at confirmation of purchase. Subscription automatically renews unless it is canceled at least 24 hours before the end of the current period. Your account will be charged for renewal within 24 hours prior to the end of the current period. You can manage and cancel your subscriptions by going to your account settings on the App Store after purchase.

Privacy Policy: https://nourishhealthai.com/privacy
Terms of Use: https://nourishhealthai.com/terms

---

## Keywords (100 chars max, comma-separated)

nutrition,macro,tracker,calorie,counter,AI,food,scan,protein,diet,health,fitness,meal,barcode,coach

---

## Promotional Text (170 chars max, can be updated without new build)

Track macros instantly with AI. Snap a photo, get calories & macros in seconds. Scan barcodes, menus, and chat with your AI nutrition coach.

---

## What's New in This Version (for v1.0)

Welcome to NourishAI! Your AI-powered nutrition companion.

- AI food scanning — snap a photo for instant macro analysis
- Barcode scanner for packaged foods
- Restaurant menu scanner (photo or website URL)
- AI nutrition chat coach
- Personalized macro targets
- HealthKit integration
- Beautiful dark interface

---

## Support URL
https://nourishhealthai.com/contact

## Marketing URL
https://nourishhealthai.com

## Privacy Policy URL
https://nourishhealthai.com/privacy

---

## App Store Connect — Subscription Setup Guide

### Step 1: Create Subscription Group
1. Go to App Store Connect > Your App > Subscriptions
2. Click "+" to create a new Subscription Group
3. Name: **NourishAI Pro**
4. Reference Name: **NourishAI Pro**

### Step 2: Add Monthly Subscription
1. Inside the "NourishAI Pro" group, click "+" > Create Subscription
2. Reference Name: **Pro Monthly**
3. Product ID: **com.nourishai.subscription.pro.monthly**
4. Subscription Duration: **1 Month**
5. Subscription Price: **$7.99** (Price Tier 8 — set for all territories)
6. Localization (English US):
   - Display Name: **NourishAI Pro Monthly**
   - Description: **Unlimited AI scans, premium chat, full nutrition tracking**
7. Optional — Free Trial: 1 Week

### Step 3: Add Annual Subscription
1. Click "+" > Create Subscription
2. Reference Name: **Pro Annual**
3. Product ID: **com.nourishai.subscription.pro.annual**
4. Subscription Duration: **1 Year**
5. Subscription Price: **$39.99** (set for all territories)
6. Localization (English US):
   - Display Name: **NourishAI Pro Annual**
   - Description: **Best value — save 58% vs monthly. Full Pro access.**
7. Optional — Free Trial: 1 Week
8. Set Subscription Level: Same as monthly (Level 1 — they're equivalent tiers)

### Step 4: Review Screenshot
- App Store Connect requires at least 1 screenshot of the subscription paywall
- Use the generated App Store screenshot from `marketing/output/appstore/`

### Step 5: Set StoreKit Config in Xcode
1. Open NourishAI.xcodeproj
2. Edit Scheme > Run > Options
3. StoreKit Configuration: select **NourishAI.storekit**
4. Now subscriptions work in Simulator for testing

---

## Age Rating Answers

| Question | Answer |
|----------|--------|
| Cartoon or Fantasy Violence | None |
| Realistic Violence | None |
| Prolonged Graphic or Sadistic Violence | None |
| Profanity or Crude Humor | None |
| Mature/Suggestive Themes | None |
| Horror/Fear Themes | None |
| Medical/Treatment Information | Infrequent/Mild |
| Alcohol, Tobacco, Drug Use | None |
| Simulated Gambling | None |
| Sexual Content or Nudity | None |
| Unrestricted Web Access | No |
| Gambling and Contests | No |

Expected Rating: **4+**

---

## App Review Notes

This app requires network access to communicate with our backend API for AI food analysis. The AI analysis is performed server-side using Claude AI (Anthropic) — no API keys are stored in the app.

Free users get 1 AI scan per week. Pro subscribers get unlimited scans.

Test account for review: Not required — the app uses device-based registration (no login needed).

To test Pro features: Use the StoreKit sandbox environment. The subscription paywall is accessible from Settings > Upgrade to Pro, or from the Dashboard "+" button.
