import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AnimateIn } from "@/components/AnimateIn";

export const metadata: Metadata = {
  title: "Features",
  description:
    "AI photo scanning, barcode lookup, smart macro dashboard, HealthKit integration, Apple Watch companion, and AI text analysis. Every feature you need to hit your macros.",
};

/* ─── Feature data ──────────────────────────────────────────────── */

const FEATURES = [
  {
    id: "ai-photo",
    badge: "Core Feature",
    title: "AI Photo Scanning",
    description:
      "Point your camera at any meal and NourishAI instantly identifies every food item on your plate. Our Claude-powered vision model breaks down proteins, carbs, fat, and calories with research-grade accuracy. It works with home-cooked meals, restaurant plates, smoothie bowls, snack bags, and even drinks. No more guessing portions or searching databases manually.",
    stat: "< 3 seconds",
    statLabel: "average scan time",
    color: "brand-green" as const,
    strokeColor: "#34C759",
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#34C759"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
        <path d="M12 11v4M10 13h4" opacity="0.5" />
      </svg>
    ),
  },
  {
    id: "barcode",
    badge: "Free Forever",
    title: "Barcode Scanner",
    description:
      "Scan any packaged food and get instant, accurate nutrition data pulled from our database of over half a million products powered by OpenFoodFacts. No AI credits are consumed, no subscription required, and it works completely offline once the product has been cached. From protein bars to frozen dinners, just point and scan.",
    stat: "500K+",
    statLabel: "products in database",
    color: "brand-orange" as const,
    strokeColor: "#FF9500",
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#FF9500"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M2 4h2v16H2M6 4h1v16H6M10 4h2v16h-2M15 4h1v16h-1M19 4h3v16h-3" />
        <rect x="1" y="2" width="22" height="2" rx="1" opacity="0.3" />
        <rect x="1" y="20" width="22" height="2" rx="1" opacity="0.3" />
      </svg>
    ),
  },
  {
    id: "dashboard",
    badge: "At a Glance",
    title: "Smart Macro Dashboard",
    description:
      "Four beautiful animated ring gauges show your calories, protein, carbs, and fat progress in real time. Swipe between daily, weekly, and monthly views to spot trends and stay consistent. The dashboard adapts to your goals, highlights deficits or surpluses, and gives you an instant read on exactly where you stand. No clutter, no confusion.",
    stat: "4 macro rings",
    statLabel: "real-time tracking",
    color: "macro-protein" as const,
    strokeColor: "#FF6B6B",
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#FF6B6B"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10" />
        <circle cx="12" cy="12" r="6" opacity="0.4" />
        <path d="M12 2a10 10 0 0 1 10 10" />
        <path d="M12 6a6 6 0 0 1 6 6" opacity="0.4" />
      </svg>
    ),
  },
  {
    id: "healthkit",
    badge: "Apple Ecosystem",
    title: "HealthKit Integration",
    description:
      "NourishAI connects directly to Apple Health to create one unified view of your body and nutrition. It reads your height, weight, steps, and active energy burned, then writes every macro entry back so other apps and your doctor can see your nutrition data. Everything stays in sync. No duplicate entry, no data silos.",
    stat: "2-way sync",
    statLabel: "read & write to Health",
    color: "macro-carbs" as const,
    strokeColor: "#4ECDC4",
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#4ECDC4"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
        <polyline points="12 14 12 18" opacity="0.4" />
        <polyline points="10 16 12 18 14 16" opacity="0.4" />
      </svg>
    ),
  },
  {
    id: "watch",
    badge: "On Your Wrist",
    title: "Apple Watch Companion",
    description:
      "Check your macro progress without reaching for your phone. The NourishAI watch app shows your daily ring progress, lets you quick-add water with a single tap, and provides complications for your favorite watch face. Whether you are mid-workout or in a meeting, your nutrition data is always one glance away.",
    stat: "1 tap",
    statLabel: "quick-add water",
    color: "macro-water" as const,
    strokeColor: "#5AC8FA",
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#5AC8FA"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="5" y="2" width="14" height="20" rx="7" />
        <circle cx="12" cy="12" r="4" opacity="0.4" />
        <path d="M12 10v2l1.5 1" />
        <path d="M9 1h6M9 23h6" opacity="0.3" />
      </svg>
    ),
  },
  {
    id: "text-analysis",
    badge: "No Photo Needed",
    title: "AI Text Analysis",
    description:
      "Just type what you ate in plain English. Say something like \"grilled chicken breast with a cup of brown rice and steamed broccoli\" and NourishAI will parse every ingredient, estimate portions, and return a full macro breakdown instantly. Perfect for logging meals from memory, recipes, or when a photo is not practical.",
    stat: "Natural language",
    statLabel: "just describe your meal",
    color: "macro-fat" as const,
    strokeColor: "#FFE66D",
    icon: (
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#FFE66D"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        <path d="M8 9h8M8 13h5" opacity="0.4" />
      </svg>
    ),
  },
];

/* ─── Comparison table data ─────────────────────────────────────── */

const COMPETITORS = ["NourishAI", "MyFitnessPal", "Lose It!", "Cronometer"];

const COMPARISON_ROWS: {
  feature: string;
  values: [string, string, string, string];
}[] = [
  {
    feature: "AI Photo Scan",
    values: ["Yes", "Premium only", "No", "No"],
  },
  {
    feature: "Barcode Scanner",
    values: ["Free", "Free", "Free", "Free"],
  },
  {
    feature: "HealthKit Sync",
    values: ["Full 2-way", "Limited", "Limited", "Yes"],
  },
  {
    feature: "Apple Watch",
    values: ["Yes", "No", "Yes", "No"],
  },
  {
    feature: "Free Tier",
    values: ["Generous", "Ad-heavy", "Limited", "Limited"],
  },
  {
    feature: "Monthly Price",
    values: ["$7.99", "$19.99", "$19.99", "$5.99"],
  },
  {
    feature: "AI Accuracy",
    values: ["Claude AI", "Basic ML", "N/A", "N/A"],
  },
  {
    feature: "Scan Speed",
    values: ["< 3 sec", "5-10 sec", "N/A", "N/A"],
  },
];

/* ─── Shared SVG icons ──────────────────────────────────────────── */

const CheckIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#34C759"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const AppleIcon = () => (
  <svg width="22" height="26" viewBox="0 0 20 24" fill="currentColor" aria-hidden="true">
    <path d="M16.52 12.46c-.03-3.12 2.55-4.62 2.67-4.7-1.45-2.13-3.72-2.42-4.53-2.45-1.93-.2-3.76 1.14-4.74 1.14-.98 0-2.5-1.11-4.1-1.08-2.11.03-4.06 1.23-5.15 3.12-2.2 3.81-.56 9.46 1.58 12.55 1.05 1.52 2.3 3.22 3.94 3.16 1.58-.06 2.18-1.02 4.09-1.02 1.91 0 2.46 1.02 4.13.99 1.7-.03 2.78-1.55 3.82-3.08 1.2-1.77 1.7-3.48 1.73-3.57-.04-.02-3.32-1.27-3.35-5.06h-.09zM13.44 3.26C14.31 2.2 14.91.78 14.76-.62c-1.2.05-2.65.8-3.51 1.81-.77.89-1.44 2.31-1.26 3.67 1.33.1 2.69-.68 3.45-1.6z" />
  </svg>
);

/* ─── Color map for Tailwind classes ────────────────────────────── */

function getBgClass(color: string) {
  const map: Record<string, string> = {
    "brand-green": "bg-brand-green/10",
    "brand-orange": "bg-brand-orange/10",
    "macro-protein": "bg-macro-protein/10",
    "macro-carbs": "bg-macro-carbs/10",
    "macro-fat": "bg-macro-fat/10",
    "macro-water": "bg-macro-water/10",
  };
  return map[color] ?? "bg-brand-green/10";
}

function getBorderClass(color: string) {
  const map: Record<string, string> = {
    "brand-green": "border-brand-green/20",
    "brand-orange": "border-brand-orange/20",
    "macro-protein": "border-macro-protein/20",
    "macro-carbs": "border-macro-carbs/20",
    "macro-fat": "border-macro-fat/20",
    "macro-water": "border-macro-water/20",
  };
  return map[color] ?? "border-brand-green/20";
}

function getTextClass(color: string) {
  const map: Record<string, string> = {
    "brand-green": "text-brand-green",
    "brand-orange": "text-brand-orange",
    "macro-protein": "text-macro-protein",
    "macro-carbs": "text-macro-carbs",
    "macro-fat": "text-macro-fat",
    "macro-water": "text-macro-water",
  };
  return map[color] ?? "text-brand-green";
}

function getGlowClass(color: string) {
  const map: Record<string, string> = {
    "brand-green": "shadow-brand-green/20",
    "brand-orange": "shadow-brand-orange/20",
    "macro-protein": "shadow-macro-protein/20",
    "macro-carbs": "shadow-macro-carbs/20",
    "macro-fat": "shadow-macro-fat/20",
    "macro-water": "shadow-macro-water/20",
  };
  return map[color] ?? "shadow-brand-green/20";
}

/* ─── Page ──────────────────────────────────────────────────────── */

export default function FeaturesPage() {
  return (
    <>
      <Header />
      <main id="main-content">
        {/* ── Hero ──────────────────────────────────────────── */}
        <section className="relative min-h-[70vh] flex items-center pt-24 pb-16 sm:pt-32 sm:pb-24 overflow-hidden">
          {/* Gradient orbs */}
          <div className="absolute top-16 left-[15%] w-[500px] h-[500px] bg-brand-green/6 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-0 right-[10%] w-[420px] h-[420px] bg-brand-orange/5 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-macro-carbs/3 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative mx-auto max-w-4xl px-6 text-center">
            <AnimateIn>
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-green/20 bg-brand-green/5 px-4 py-1.5 mb-8">
                <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
                <span className="text-xs text-brand-green font-medium tracking-wide">
                  6 Powerful Features
                </span>
              </div>
            </AnimateIn>

            <AnimateIn delay={0.1}>
              <h1 className="font-[family-name:var(--font-outfit)] text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
                Every Feature You Need to{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green via-macro-carbs to-brand-green">
                  Hit Your Macros
                </span>
              </h1>
            </AnimateIn>

            <AnimateIn delay={0.2}>
              <p className="text-lg sm:text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto mb-10">
                From AI-powered photo scanning to Apple Watch complications, NourishAI gives you the complete nutrition tracking toolkit. No compromises, no clutter.
              </p>
            </AnimateIn>

            <AnimateIn delay={0.3}>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <a
                  href="#ai-photo"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-green px-8 py-4 text-base font-semibold text-brand-dark hover:bg-brand-green-dark transition-all min-h-[44px]"
                >
                  Explore Features
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M12 5v14M5 12l7 7 7-7" />
                  </svg>
                </a>
                <a
                  href="#comparison"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-brand-border px-8 py-4 text-base font-medium text-gray-300 hover:text-white hover:border-gray-500 transition-all min-h-[44px]"
                >
                  Compare Apps
                </a>
              </div>
            </AnimateIn>
          </div>
        </section>

        {/* ── Feature Blocks (alternating layout) ──────────── */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-6 space-y-24 sm:space-y-32">
            {FEATURES.map((feature, i) => {
              const isReversed = i % 2 === 1;
              return (
                <div
                  key={feature.id}
                  id={feature.id}
                  className="scroll-mt-24"
                >
                  <AnimateIn>
                    <div
                      className={`grid lg:grid-cols-2 gap-12 lg:gap-16 items-center ${
                        isReversed ? "lg:direction-rtl" : ""
                      }`}
                      style={isReversed ? { direction: "rtl" } : undefined}
                    >
                      {/* Visual / icon panel */}
                      <div
                        className="relative flex items-center justify-center"
                        style={isReversed ? { direction: "ltr" } : undefined}
                      >
                        <div className="relative">
                          {/* Glow behind */}
                          <div
                            className={`absolute inset-0 ${getBgClass(feature.color)} rounded-3xl blur-3xl scale-110 pointer-events-none`}
                          />

                          {/* Card */}
                          <div
                            className={`relative w-full max-w-md aspect-square rounded-3xl bg-brand-card border ${getBorderClass(feature.color)} flex flex-col items-center justify-center p-10 overflow-hidden`}
                          >
                            {/* Decorative grid pattern */}
                            <div className="absolute inset-0 opacity-[0.03]">
                              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                  <pattern id={`grid-${feature.id}`} width="40" height="40" patternUnits="userSpaceOnUse">
                                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                                  </pattern>
                                </defs>
                                <rect width="100%" height="100%" fill={`url(#grid-${feature.id})`} />
                              </svg>
                            </div>

                            {/* Corner accent */}
                            <div
                              className={`absolute top-0 right-0 w-32 h-32 ${getBgClass(feature.color)} rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none`}
                            />

                            {/* Large icon */}
                            <div
                              className={`relative w-24 h-24 rounded-2xl ${getBgClass(feature.color)} border ${getBorderClass(feature.color)} flex items-center justify-center mb-8 shadow-lg ${getGlowClass(feature.color)}`}
                            >
                              <div className="scale-[1.8]">{feature.icon}</div>
                            </div>

                            {/* Stat */}
                            <div className="relative text-center">
                              <p
                                className={`font-[family-name:var(--font-outfit)] text-4xl sm:text-5xl font-extrabold ${getTextClass(feature.color)}`}
                              >
                                {feature.stat}
                              </p>
                              <p className="text-sm text-gray-500 mt-2">{feature.statLabel}</p>
                            </div>

                            {/* Bottom decorative line */}
                            <div
                              className={`absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-${feature.color}/30 to-transparent`}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Text content */}
                      <div
                        className="flex flex-col justify-center"
                        style={isReversed ? { direction: "ltr" } : undefined}
                      >
                        <div
                          className={`inline-flex items-center self-start gap-2 rounded-full border ${getBorderClass(feature.color)} ${getBgClass(feature.color)} px-3 py-1 mb-5`}
                        >
                          <span className={`text-[10px] font-bold uppercase tracking-widest ${getTextClass(feature.color)}`}>
                            {feature.badge}
                          </span>
                        </div>

                        <h2 className="font-[family-name:var(--font-outfit)] text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-6">
                          {feature.title}
                        </h2>

                        <p className="text-base sm:text-lg text-gray-400 leading-relaxed mb-8 max-w-lg">
                          {feature.description}
                        </p>

                        {/* Bullet highlights */}
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-xl ${getBgClass(feature.color)} flex items-center justify-center flex-shrink-0`}>
                            {feature.icon}
                          </div>
                          <div>
                            <p className={`text-sm font-semibold ${getTextClass(feature.color)}`}>
                              {feature.stat}
                            </p>
                            <p className="text-xs text-gray-500">{feature.statLabel}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </AnimateIn>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── Comparison Table ─────────────────────────────── */}
        <section id="comparison" className="relative py-24 sm:py-32 scroll-mt-24">
          {/* Background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-green/3 rounded-full blur-[180px] pointer-events-none" />

          <div className="relative mx-auto max-w-5xl px-6">
            <AnimateIn className="text-center mb-16">
              <p className="text-sm font-semibold text-brand-green uppercase tracking-widest mb-4">
                Comparison
              </p>
              <h2 className="font-[family-name:var(--font-outfit)] text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-4">
                How NourishAI{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-macro-carbs">
                  Stacks Up
                </span>
              </h2>
              <p className="text-gray-400 max-w-lg mx-auto">
                See how we compare to the most popular nutrition tracking apps on the market.
              </p>
            </AnimateIn>

            <AnimateIn delay={0.15}>
              {/* Desktop table */}
              <div className="hidden md:block rounded-2xl border border-brand-border/50 bg-brand-card overflow-hidden">
                <table className="w-full text-left" role="table">
                  <thead>
                    <tr className="border-b border-brand-border/50">
                      <th className="px-6 py-5 text-sm font-semibold text-gray-400 uppercase tracking-wider">
                        Feature
                      </th>
                      {COMPETITORS.map((name, ci) => (
                        <th
                          key={name}
                          className={`px-6 py-5 text-sm font-semibold uppercase tracking-wider text-center ${
                            ci === 0
                              ? "text-brand-green bg-brand-green/5"
                              : "text-gray-500"
                          }`}
                        >
                          {name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARISON_ROWS.map((row, ri) => (
                      <tr
                        key={row.feature}
                        className={
                          ri < COMPARISON_ROWS.length - 1
                            ? "border-b border-brand-border/30"
                            : ""
                        }
                      >
                        <td className="px-6 py-4 text-sm font-medium text-gray-300">
                          {row.feature}
                        </td>
                        {row.values.map((val, vi) => (
                          <td
                            key={`${row.feature}-${vi}`}
                            className={`px-6 py-4 text-sm text-center ${
                              vi === 0
                                ? "text-brand-green font-semibold bg-brand-green/5"
                                : "text-gray-500"
                            }`}
                          >
                            <span className="inline-flex items-center justify-center gap-1.5">
                              {val === "Yes" && vi === 0 && <CheckIcon />}
                              {val}
                            </span>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden space-y-4">
                {COMPARISON_ROWS.map((row) => (
                  <div
                    key={row.feature}
                    className="rounded-xl border border-brand-border/50 bg-brand-card p-4"
                  >
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-3 font-semibold">
                      {row.feature}
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {COMPETITORS.map((name, ci) => (
                        <div
                          key={`${row.feature}-${name}`}
                          className={`rounded-lg p-3 text-center ${
                            ci === 0
                              ? "bg-brand-green/10 border border-brand-green/20"
                              : "bg-brand-card-hover border border-brand-border/30"
                          }`}
                        >
                          <p
                            className={`text-[10px] font-semibold uppercase tracking-wider mb-1 ${
                              ci === 0 ? "text-brand-green" : "text-gray-600"
                            }`}
                          >
                            {name}
                          </p>
                          <p
                            className={`text-sm font-medium ${
                              ci === 0 ? "text-brand-green" : "text-gray-400"
                            }`}
                          >
                            {row.values[ci]}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </AnimateIn>
          </div>
        </section>

        {/* ── CTA Section ──────────────────────────────────── */}
        <section className="relative py-24 sm:py-32 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] pointer-events-none">
            <div className="absolute top-0 left-[10%] w-52 h-52 bg-brand-green/8 rounded-full blur-3xl" />
            <div className="absolute bottom-[10%] right-0 w-44 h-44 bg-brand-orange/8 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-[25%] w-40 h-40 bg-macro-protein/5 rounded-full blur-3xl" />
            <div className="absolute top-[15%] right-[15%] w-36 h-36 bg-macro-carbs/5 rounded-full blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-3xl px-6 text-center">
            <AnimateIn>
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-green/20 bg-brand-green/5 px-4 py-1.5 mb-8">
                <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
                <span className="text-xs text-brand-green font-medium tracking-wide">
                  Available on iOS
                </span>
              </div>
            </AnimateIn>

            <AnimateIn delay={0.1}>
              <h2 className="font-[family-name:var(--font-outfit)] text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6">
                Ready to Transform{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green via-macro-carbs to-brand-green">
                  Your Nutrition?
                </span>
              </h2>
            </AnimateIn>

            <AnimateIn delay={0.2}>
              <p className="text-lg text-gray-400 mb-10 max-w-lg mx-auto leading-relaxed">
                Download NourishAI and start tracking your macros with AI. Free to use, no credit card required.
              </p>
            </AnimateIn>

            <AnimateIn delay={0.3}>
              <a
                href="/#download"
                className="inline-flex items-center justify-center gap-3 rounded-2xl bg-white px-10 py-5 text-lg font-bold text-brand-dark hover:bg-gray-100 transition-all min-h-[44px] shadow-lg shadow-white/10"
              >
                <AppleIcon />
                Download on the App Store
              </a>
              <p className="text-xs text-gray-600 mt-4">
                Free to download. No credit card required.
              </p>
            </AnimateIn>

            {/* Trust badges */}
            <AnimateIn delay={0.4}>
              <div className="flex flex-wrap items-center justify-center gap-8 mt-12 pt-8 border-t border-brand-border/30">
                <div className="flex items-center gap-2">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#34C759"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  </svg>
                  <span className="text-xs text-gray-500">Privacy First</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#34C759"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <span className="text-xs text-gray-500">HealthKit Sync</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#34C759"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                    <line x1="12" y1="18" x2="12.01" y2="18" />
                  </svg>
                  <span className="text-xs text-gray-500">iOS 17+</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#34C759"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect x="6" y="2" width="12" height="20" rx="6" />
                    <circle cx="12" cy="8" r="2" />
                  </svg>
                  <span className="text-xs text-gray-500">Apple Watch</span>
                </div>
              </div>
            </AnimateIn>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
