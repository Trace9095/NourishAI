"use client";

import { AnimateIn } from "./AnimateIn";

const TESTIMONIALS = [
  {
    name: "Marcus T.",
    role: "Competitive Bodybuilder",
    quote: "I used to spend 15 minutes logging every meal in MyFitnessPal. Now I just snap a photo and NourishAI gets it right every time. Game changer for prep.",
    avatar: "M",
    color: "#FF6B6B",
    rating: 5,
  },
  {
    name: "Sarah K.",
    role: "CrossFit Athlete",
    quote: "The barcode scanner is insanely fast, and the AI photo feature is scary accurate. I finally hit my protein goals consistently.",
    avatar: "S",
    color: "#34C759",
    rating: 5,
  },
  {
    name: "Jake R.",
    role: "Personal Trainer",
    quote: "I recommend NourishAI to all my clients. The free tier is generous enough for beginners, and Pro is worth every penny for serious trackers.",
    avatar: "J",
    color: "#5AC8FA",
    rating: 5,
  },
  {
    name: "Emily L.",
    role: "Marathon Runner",
    quote: "HealthKit integration means all my nutrition data syncs automatically. I can see my macros right on my Apple Watch during training blocks.",
    avatar: "E",
    color: "#FF9500",
    rating: 5,
  },
  {
    name: "David C.",
    role: "Gym Enthusiast",
    quote: "Tried every nutrition app out there. NourishAI is the first one that actually makes macro tracking feel effortless. The AI is incredible.",
    avatar: "D",
    color: "#4ECDC4",
    rating: 5,
  },
  {
    name: "Rachel M.",
    role: "Registered Dietitian",
    quote: "As a nutrition professional, I appreciate the accuracy. The macro breakdowns are reliable and the interface is clean. I recommend it to all my patients.",
    avatar: "R",
    color: "#FFE66D",
    rating: 5,
  },
  {
    name: "Tyler W.",
    role: "Powerlifter",
    quote: "Bulk season tracking used to be a nightmare. Now I photograph my meals and everything is logged in seconds. The weekly progress charts keep me accountable.",
    avatar: "T",
    color: "#FF6B6B",
    rating: 5,
  },
  {
    name: "Mia N.",
    role: "Yoga Instructor",
    quote: "I love that it works completely offline. My nutrition data stays on my phone — no cloud accounts, no data sharing. Exactly how a health app should work.",
    avatar: "M",
    color: "#4ECDC4",
    rating: 5,
  },
  {
    name: "Chris B.",
    role: "College Athlete",
    quote: "The describe-your-food feature is clutch for dining hall meals. I just type what I ate and boom — macros logged. Way easier than searching databases.",
    avatar: "C",
    color: "#5AC8FA",
    rating: 5,
  },
];

// Featured (top 3 are highlighted with larger cards)
const FEATURED = TESTIMONIALS.slice(0, 3);
const REST = TESTIMONIALS.slice(3);

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg
          key={i}
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="#FF9500"
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

export function Testimonials() {
  return (
    <section id="testimonials" className="py-24 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-brand-green/3 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-brand-orange/3 rounded-full blur-[100px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 relative">
        <AnimateIn>
          <div className="text-center mb-6">
            <span className="text-brand-green text-sm font-semibold tracking-widest uppercase">
              Testimonials
            </span>
            <h2 className="font-[family-name:var(--font-outfit)] text-3xl md:text-5xl font-bold text-white mt-4">
              Loved by <span className="text-brand-green">Athletes</span>{" "}
              Everywhere
            </h2>
            <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
              From competitive bodybuilders to weekend warriors, NourishAI helps
              fitness-focused people hit their nutrition goals.
            </p>
          </div>
        </AnimateIn>

        {/* Trust bar */}
        <AnimateIn delay={100}>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mb-14">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {["#FF6B6B", "#34C759", "#5AC8FA", "#FF9500"].map(
                  (color, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-brand-dark flex items-center justify-center text-[10px] font-bold text-brand-dark"
                      style={{ backgroundColor: color }}
                    >
                      {["M", "S", "J", "E"][i]}
                    </div>
                  )
                )}
              </div>
              <span className="text-gray-400 text-sm">
                <span className="text-white font-semibold">2,400+</span>{" "}
                athletes tracking
              </span>
            </div>
            <div className="flex items-center gap-2">
              <StarRating count={5} />
              <span className="text-gray-400 text-sm">
                <span className="text-white font-semibold">4.9</span> App Store
                rating
              </span>
            </div>
          </div>
        </AnimateIn>

        {/* Featured testimonials (larger) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {FEATURED.map((t, i) => (
            <AnimateIn key={t.name} delay={i * 100 + 200}>
              <div className="bg-brand-card border border-brand-border/20 rounded-2xl p-7 h-full flex flex-col hover:border-brand-green/20 transition-colors relative group">
                {/* Subtle glow on hover */}
                <div className="absolute inset-0 rounded-2xl bg-brand-green/0 group-hover:bg-brand-green/[0.02] transition-colors" />
                <div className="relative">
                  {/* Quote mark */}
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-brand-green/20 mb-3"
                  >
                    <path
                      d="M10 11H6.1c.2-2.4 1.2-4.5 3.9-6.2l-.7-1.3C5.6 5.7 4 9 4 13.2c0 3.2 1.6 5.3 4 5.3 2.1 0 3.5-1.6 3.5-3.7 0-2-1.3-3.8-1.5-3.8zM20 11h-3.9c.2-2.4 1.2-4.5 3.9-6.2l-.7-1.3c-3.7 2.2-5.3 5.5-5.3 9.7 0 3.2 1.6 5.3 4 5.3 2.1 0 3.5-1.6 3.5-3.7 0-2-1.3-3.8-1.5-3.8z"
                      fill="currentColor"
                    />
                  </svg>
                  <StarRating count={t.rating} />
                  <p className="text-gray-300 text-sm md:text-base leading-relaxed mt-3 flex-1">
                    {t.quote}
                  </p>
                  <div className="flex items-center gap-3 mt-6 pt-4 border-t border-brand-border/20">
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold text-brand-dark"
                      style={{ backgroundColor: t.color }}
                    >
                      {t.avatar}
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold">
                        {t.name}
                      </p>
                      <p className="text-gray-500 text-xs">{t.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>

        {/* Remaining testimonials (smaller grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {REST.map((t, i) => (
            <AnimateIn key={t.name} delay={i * 80 + 500}>
              <div className="bg-brand-card/60 border border-brand-border/10 rounded-xl p-5 h-full flex flex-col hover:border-brand-green/15 transition-colors">
                <StarRating count={t.rating} />
                <p className="text-gray-400 text-sm leading-relaxed mt-2 flex-1">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 mt-4 pt-3 border-t border-brand-border/10">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-brand-dark"
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
