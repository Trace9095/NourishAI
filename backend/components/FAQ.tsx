"use client";

import { useState } from "react";
import { AnimateIn } from "./AnimateIn";

const FAQS = [
  {
    category: "Getting Started",
    items: [
      {
        q: "Is NourishAI really free?",
        a: "Yes! Manual food entry, barcode scanning, HealthKit sync, and the smart macro dashboard are completely free forever. The AI photo scanning feature is available once per week on the free plan. Upgrade to Pro for unlimited AI scans.",
        link: "#pricing",
        linkText: "View Plans",
      },
      {
        q: "How do I get started tracking my macros?",
        a: "Download NourishAI from the App Store, complete the quick onboarding (takes about 60 seconds), and we'll calculate your ideal macro targets based on your goals, body composition, and activity level. Then just start logging — snap a photo, scan a barcode, or type what you ate.",
      },
      {
        q: "Does NourishAI calculate my macro targets automatically?",
        a: "Yes. During onboarding, you'll enter your height, weight, age, activity level, and goal (cut, maintain, or bulk). NourishAI uses the Mifflin-St Jeor equation for BMR, applies an activity multiplier for TDEE, then splits into protein, carbs, and fat targets. You can manually adjust these anytime in Settings.",
      },
    ],
  },
  {
    category: "AI Food Scanning",
    items: [
      {
        q: "How accurate is the AI food recognition?",
        a: "NourishAI uses Claude, one of the most advanced AI vision models available. It achieves 95%+ accuracy on common foods and meals. For the best results, take a clear photo with good lighting. You can always adjust the values after scanning.",
      },
      {
        q: "What foods can the AI recognize?",
        a: "Our AI can identify virtually any food — from simple items like an apple to complex meals like a burrito bowl. It handles restaurant meals, home-cooked dishes, packaged snacks, drinks, smoothies, and even multi-item plates. The more visible the food is in the photo, the more accurate the results.",
      },
      {
        q: "Can I describe my food with text instead of a photo?",
        a: 'Absolutely. The "Describe Your Food" feature lets you type what you ate in plain English — like "grilled chicken breast with rice and steamed broccoli" — and the AI estimates the macros instantly. Great for when you\'ve already eaten or can\'t take a photo.',
      },
      {
        q: "What about the barcode scanner?",
        a: "The barcode scanner uses OpenFoodFacts, a free database covering 500K+ packaged products worldwide. Just point your camera at any barcode and get instant nutrition data. This feature is completely free and doesn't count against your AI scan limit.",
        link: "#features",
        linkText: "See All Features",
      },
    ],
  },
  {
    category: "Privacy & Security",
    items: [
      {
        q: "Is my nutrition data private?",
        a: "Your data privacy is our top priority. All nutrition data is stored locally on your device using Apple's SwiftData — not on our servers. When you use AI photo scanning, the image is processed temporarily and immediately discarded. We never sell or share your personal data. Period.",
        link: "/privacy",
        linkText: "Read Privacy Policy",
      },
      {
        q: "Does NourishAI work offline?",
        a: "Yes! All your nutrition data is stored locally on your device. You can log meals manually, view your dashboard, track macros, and see your progress history without an internet connection. Only AI photo scanning and text description features require connectivity.",
      },
      {
        q: "What data does NourishAI collect?",
        a: "We collect only what's necessary to provide the service: your device ID for rate limiting and subscription verification, and AI scan usage counts. Your actual nutrition data, food logs, body measurements, and health information stay on your device. We have no access to it.",
      },
    ],
  },
  {
    category: "Subscription & Billing",
    items: [
      {
        q: "What's included in the Free vs Pro plan?",
        a: "Free includes unlimited manual entry, barcode scanning, HealthKit integration, the macro dashboard, and 1 AI scan per week. Pro ($7.99/mo or $39.99/yr) unlocks unlimited AI photo and text scans, the Apple Watch companion app, detailed analytics, saved meals, and priority support.",
        link: "#pricing",
        linkText: "Compare Plans",
      },
      {
        q: "Can I cancel my Pro subscription anytime?",
        a: "Absolutely. You can cancel your Pro subscription at any time through your Apple ID settings. No questions asked, no cancellation fees. You'll keep Pro access until the end of your billing period, and all your logged data stays on your device forever.",
      },
      {
        q: "Is there a free trial?",
        a: "The annual plan includes a 7-day free trial so you can experience all Pro features risk-free. You won't be charged until the trial ends, and you can cancel anytime during the trial period with no charge.",
      },
    ],
  },
  {
    category: "Features & Compatibility",
    items: [
      {
        q: "Does it work with Apple Watch?",
        a: "Yes! NourishAI includes an Apple Watch companion app that lets you check your daily macro progress, quick-add water intake, and view your nutrition summary right from your wrist. Available with the Pro plan.",
      },
      {
        q: "Does NourishAI sync with Apple Health?",
        a: "Yes. NourishAI integrates with HealthKit to read your weight, steps, and active calories, and writes your nutrition data back to Apple Health. This means your macro data is available in the Health app alongside all your other fitness metrics.",
      },
      {
        q: "How does NourishAI compare to MyFitnessPal?",
        a: "NourishAI is built specifically for macro tracking. While MyFitnessPal focuses on calorie counting with a massive food database, we're designed for people who care about hitting specific protein, carb, and fat targets. Our AI photo scanning is faster than manual database search, and we don't show ads on the free tier.",
      },
      {
        q: "What devices are supported?",
        a: "NourishAI requires iOS 17 or later and runs on iPhone. The Apple Watch companion app requires watchOS 10+. We're designed to take full advantage of Apple's latest technologies including SwiftData, HealthKit, and StoreKit 2.",
      },
    ],
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<string | null>(null);

  const toggleFaq = (key: string) => {
    setOpenIndex(openIndex === key ? null : key);
  };

  return (
    <section id="faq" className="py-24 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-green/3 rounded-full blur-[120px]" />
      </div>

      <div className="mx-auto max-w-4xl px-6 relative">
        <AnimateIn>
          <div className="text-center mb-16">
            <span className="text-brand-green text-sm font-semibold tracking-widest uppercase">
              FAQ
            </span>
            <h2 className="font-[family-name:var(--font-outfit)] text-3xl md:text-5xl font-bold text-white mt-4">
              Everything You Need to Know
            </h2>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
              Got questions? We&apos;ve got answers. If you can&apos;t find what
              you&apos;re looking for, reach out on our{" "}
              <a
                href="/contact"
                className="text-brand-green hover:underline"
              >
                contact page
              </a>
              .
            </p>
          </div>
        </AnimateIn>

        <div className="space-y-10">
          {FAQS.map((category, ci) => (
            <AnimateIn key={category.category} delay={ci * 80}>
              <div>
                <h3 className="text-brand-green text-xs font-semibold tracking-widest uppercase mb-4 pl-1">
                  {category.category}
                </h3>
                <div className="space-y-2">
                  {category.items.map((faq, fi) => {
                    const key = `${ci}-${fi}`;
                    const isOpen = openIndex === key;
                    return (
                      <div
                        key={key}
                        className="bg-brand-card border border-brand-border/20 rounded-xl overflow-hidden"
                      >
                        <button
                          onClick={() => toggleFaq(key)}
                          className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 min-h-[44px]"
                        >
                          <span className="text-white font-medium text-sm md:text-base">
                            {faq.q}
                          </span>
                          <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            className={`text-brand-green flex-shrink-0 transition-transform duration-300 ${
                              isOpen ? "rotate-180" : ""
                            }`}
                          >
                            <polyline points="6 9 12 15 18 9" />
                          </svg>
                        </button>
                        <div
                          className={`overflow-hidden transition-all duration-300 ${
                            isOpen
                              ? "max-h-96 opacity-100"
                              : "max-h-0 opacity-0"
                          }`}
                        >
                          <div className="px-6 pb-5">
                            <p className="text-gray-400 text-sm leading-relaxed">
                              {faq.a}
                            </p>
                            {faq.link && faq.linkText && (
                              <a
                                href={faq.link}
                                className="inline-flex items-center gap-2 mt-3 px-4 py-2 text-xs font-semibold text-brand-green bg-brand-green/10 border border-brand-green/20 rounded-lg hover:bg-brand-green/20 transition-colors min-h-[44px]"
                              >
                                {faq.linkText}
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <path d="M5 12h14" />
                                  <path d="m12 5 7 7-7 7" />
                                </svg>
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
