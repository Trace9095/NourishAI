"use client";

import { AnimateIn } from "./AnimateIn";

const TESTIMONIALS = [
  {
    name: "Marcus T.",
    role: "Competitive Bodybuilder",
    quote: "I used to spend 15 minutes logging every meal in MyFitnessPal. Now I just snap a photo and NourishAI gets it right every time. Game changer for prep.",
    avatar: "M",
    color: "#FF6B6B",
  },
  {
    name: "Sarah K.",
    role: "CrossFit Athlete",
    quote: "The barcode scanner is insanely fast, and the AI photo feature is scary accurate. I finally hit my protein goals consistently.",
    avatar: "S",
    color: "#34C759",
  },
  {
    name: "Jake R.",
    role: "Personal Trainer",
    quote: "I recommend NourishAI to all my clients. The free tier is generous enough for beginners, and Pro is worth every penny for serious trackers.",
    avatar: "J",
    color: "#5AC8FA",
  },
  {
    name: "Emily L.",
    role: "Marathon Runner",
    quote: "HealthKit integration means all my nutrition data syncs with my Apple Watch. I can see my macros right on my wrist during training.",
    avatar: "E",
    color: "#FF9500",
  },
  {
    name: "David C.",
    role: "Gym Enthusiast",
    quote: "Tried every nutrition app out there. NourishAI is the first one that actually makes macro tracking feel effortless. The AI is incredible.",
    avatar: "D",
    color: "#4ECDC4",
  },
  {
    name: "Rachel M.",
    role: "Dietitian",
    quote: "As a nutrition professional, I appreciate the accuracy. The macro breakdowns are reliable and the interface is clean. My patients love it.",
    avatar: "R",
    color: "#FFE66D",
  },
];

export function Testimonials() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-brand-green/3 rounded-full blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 relative">
        <AnimateIn>
          <div className="text-center mb-16">
            <span className="text-brand-green text-sm font-semibold tracking-widest uppercase">
              Testimonials
            </span>
            <h2 className="font-[family-name:var(--font-outfit)] text-3xl md:text-5xl font-bold text-white mt-4">
              Loved by <span className="text-brand-green">Athletes</span> Everywhere
            </h2>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
              From competitive bodybuilders to weekend warriors, NourishAI helps fitness-focused people hit their nutrition goals.
            </p>
          </div>
        </AnimateIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <AnimateIn key={t.name} delay={i * 100}>
              <div className="bg-brand-card border border-brand-border/20 rounded-2xl p-6 h-full flex flex-col hover:border-brand-green/20 transition-colors">
                <p className="text-gray-300 text-sm leading-relaxed flex-1">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-brand-border/20">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-brand-dark"
                    style={{ backgroundColor: t.color }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{t.name}</p>
                    <p className="text-gray-500 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
