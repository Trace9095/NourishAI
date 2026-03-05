"use client";

import { useState } from "react";
import { AnimateIn } from "./AnimateIn";

const FAQS = [
  {
    q: "Is NourishAI really free?",
    a: "Yes! Manual food entry, barcode scanning, HealthKit sync, and the smart macro dashboard are completely free forever. The AI photo scanning feature is available once per week on the free plan. Upgrade to Pro for unlimited AI scans.",
  },
  {
    q: "How accurate is the AI food recognition?",
    a: "NourishAI uses Claude, one of the most advanced AI vision models available. It achieves 95%+ accuracy on common foods and meals. For the best results, take a clear photo with good lighting. You can always adjust the values if needed.",
  },
  {
    q: "Does NourishAI work offline?",
    a: "Yes! All your nutrition data is stored locally on your device using Apple's SwiftData. You can log meals manually, view your dashboard, and track progress without an internet connection. Only AI photo scanning requires connectivity.",
  },
  {
    q: "How does NourishAI compare to MyFitnessPal?",
    a: "NourishAI is built specifically for macro tracking. While MyFitnessPal focuses on calorie counting, we're designed for people who care about hitting specific protein, carb, and fat targets. Our AI photo scanning is faster and more accurate than manual database search.",
  },
  {
    q: "Can I cancel my Pro subscription anytime?",
    a: "Absolutely. You can cancel your Pro subscription at any time through your Apple ID settings. No questions asked, no cancellation fees. You'll keep Pro access until the end of your billing period.",
  },
  {
    q: "Is my nutrition data private?",
    a: "Your data privacy is our top priority. All nutrition data is stored locally on your device — not on our servers. When you use AI photo scanning, the image is processed temporarily and immediately discarded. We never sell or share your personal data.",
  },
  {
    q: "Does it work with Apple Watch?",
    a: "Yes! NourishAI includes an Apple Watch companion app that lets you check your daily macro progress, quick-add water intake, and view your nutrition summary right from your wrist.",
  },
  {
    q: "What foods can the AI recognize?",
    a: "Our AI can identify virtually any food — from simple items like an apple to complex meals like a burrito bowl. It handles restaurant meals, home-cooked dishes, packaged snacks, drinks, and even multi-item plates. The barcode scanner covers 500K+ packaged products.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="py-24 relative">
      <div className="mx-auto max-w-3xl px-6">
        <AnimateIn>
          <div className="text-center mb-16">
            <span className="text-brand-green text-sm font-semibold tracking-widest uppercase">
              FAQ
            </span>
            <h2 className="font-[family-name:var(--font-outfit)] text-3xl md:text-5xl font-bold text-white mt-4">
              Common Questions
            </h2>
          </div>
        </AnimateIn>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <AnimateIn key={i} delay={i * 50}>
              <div className="bg-brand-card border border-brand-border/20 rounded-xl overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
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
                      openIndex === i ? "rotate-180" : ""
                    }`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === i ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  <p className="px-6 pb-5 text-gray-400 text-sm leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
