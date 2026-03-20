import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AnimateIn } from "@/components/AnimateIn";

export const metadata: Metadata = {
  title: "About",
  description:
    "NourishAI was built by fitness enthusiasts who believe tracking macros should be effortless. Learn about our mission, values, and the technology behind AI-powered nutrition tracking.",
};

const VALUES = [
  {
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#34C759"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    ),
    title: "Privacy First",
    description:
      "Your nutrition data stays on your device. We process AI scans server-side but never store your photos. We never sell your data to third parties. Period.",
    accent: "brand-green",
  },
  {
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#FF9500"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5" />
        <path d="M2 12l10 5 10-5" />
      </svg>
    ),
    title: "AI That Works",
    description:
      "Powered by Claude AI from Anthropic, the most capable and accurate food recognition available. Not a gimmick — real computer vision that understands your plate.",
    accent: "brand-orange",
  },
  {
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#FF6B6B"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
    title: "Built for Athletes",
    description:
      "Designed by lifters, for lifters. We focus on macros — protein, carbs, and fat — not just calories. Because hitting your protein target matters more than a calorie number.",
    accent: "macro-protein",
  },
  {
    icon: (
      <svg
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#4ECDC4"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M8 14s1.5 2 4 2 4-2 4-2" />
        <line x1="9" y1="9" x2="9.01" y2="9" />
        <line x1="15" y1="9" x2="15.01" y2="9" />
      </svg>
    ),
    title: "Free Forever Basics",
    description:
      "Manual entry, barcode scanning, and HealthKit sync are always free. No paywalls on the fundamentals. Pro unlocks unlimited AI scans, analytics, and the watch app.",
    accent: "macro-carbs",
  },
];

const TECH_ITEMS = [
  {
    label: "SwiftUI",
    description: "Native iOS built with Apple's modern UI framework for buttery-smooth performance",
    color: "#34C759",
  },
  {
    label: "HealthKit",
    description: "Deep integration with Apple Health for seamless nutrition data sync",
    color: "#FF6B6B",
  },
  {
    label: "Claude AI",
    description: "Anthropic's vision model for accurate, instant food recognition from photos",
    color: "#FF9500",
  },
  {
    label: "Server-Side Processing",
    description: "Your photos are analyzed on our servers and immediately discarded — never stored",
    color: "#4ECDC4",
  },
];

export default function AboutPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="pt-20">
        {/* ───────── HERO ───────── */}
        <section className="relative py-24 sm:py-32 lg:py-40 overflow-hidden">
          {/* Decorative gradient orbs */}
          <div className="absolute top-0 left-1/3 w-[600px] h-[600px] bg-brand-green/5 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-brand-orange/4 rounded-full blur-[120px] pointer-events-none" />

          {/* Decorative SVG grid pattern */}
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.03] pointer-events-none"
            aria-hidden="true"
          >
            <defs>
              <pattern id="about-grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#about-grid)" />
          </svg>

          <div className="relative mx-auto max-w-4xl px-6 text-center">
            <AnimateIn>
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-green/20 bg-brand-green/5 px-4 py-1.5 mb-8">
                <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
                <span className="text-xs text-brand-green font-medium tracking-wide uppercase">
                  Our Story
                </span>
              </div>
            </AnimateIn>

            <AnimateIn delay={0.1}>
              <h1 className="font-[family-name:var(--font-outfit)] text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-6 leading-[1.1]">
                Our Mission: Make Nutrition{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green via-brand-green-dark to-brand-green">
                  Effortless
                </span>
              </h1>
            </AnimateIn>

            <AnimateIn delay={0.2}>
              <p className="text-lg sm:text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
                We believe everyone deserves access to smart nutrition tools — without the complexity, the guesswork, or the tedious data entry.
              </p>
            </AnimateIn>
          </div>
        </section>

        {/* ───────── STORY ───────── */}
        <section className="relative py-20 sm:py-28">
          {/* Subtle divider line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-brand-green/30 to-transparent" />

          <div className="mx-auto max-w-3xl px-6">
            <AnimateIn>
              <div className="relative p-8 sm:p-12 rounded-3xl bg-brand-card border border-brand-border/50">
                {/* Corner accent */}
                <div className="absolute top-0 left-8 w-12 h-1 bg-gradient-to-r from-brand-green to-brand-green/0 rounded-b-full" />

                <h2 className="font-[family-name:var(--font-outfit)] text-2xl sm:text-3xl font-bold text-white mb-6">
                  Why We Built NourishAI
                </h2>

                <div className="space-y-5 text-gray-400 leading-relaxed">
                  <p>
                    NourishAI was built by fitness enthusiasts who were tired of tedious food logging. We spent years manually searching databases, guessing portion sizes, and fighting clunky interfaces — all just to know if we hit our protein target.
                  </p>
                  <p>
                    We believe tracking macros should not feel like homework. It should be fast, accurate, and maybe even a little satisfying. So we asked ourselves: what if you could just take a photo of your food and be done?
                  </p>
                  <p>
                    With advances in AI vision technology, that question became our answer. NourishAI uses Claude AI to analyze your meals in under three seconds — identifying individual food items, estimating portions, and calculating precise macro breakdowns. No more typing. No more guessing.
                  </p>
                  <p className="text-white font-medium">
                    Just snap, review, and move on with your day.
                  </p>
                </div>
              </div>
            </AnimateIn>
          </div>
        </section>

        {/* ───────── VALUES / PRINCIPLES ───────── */}
        <section className="relative py-20 sm:py-28 overflow-hidden">
          {/* Background accent */}
          <div className="absolute top-1/2 right-0 w-[400px] h-[400px] bg-brand-green/3 rounded-full blur-[100px] pointer-events-none" />

          <div className="mx-auto max-w-7xl px-6">
            <AnimateIn className="text-center mb-16">
              <p className="text-sm font-semibold text-brand-green uppercase tracking-widest mb-4">
                Our Principles
              </p>
              <h2 className="font-[family-name:var(--font-outfit)] text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                What We{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-macro-carbs">
                  Stand For
                </span>
              </h2>
            </AnimateIn>

            <div className="grid sm:grid-cols-2 gap-5">
              {VALUES.map((value, i) => (
                <AnimateIn key={value.title} delay={i * 0.1}>
                  <div className="group relative p-7 rounded-2xl bg-brand-card border border-brand-border/50 card-hover h-full">
                    {/* Top accent bar */}
                    <div
                      className="absolute top-0 left-7 right-7 h-px"
                      style={{
                        background: `linear-gradient(90deg, transparent, var(--${value.accent === "brand-green" ? "brand-green" : value.accent === "brand-orange" ? "brand-orange" : value.accent === "macro-protein" ? "macro-protein" : "macro-carbs"})20%, transparent)`,
                      }}
                    />

                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center mb-5"
                      style={{
                        background: `color-mix(in srgb, var(--${value.accent === "brand-green" ? "brand-green" : value.accent === "brand-orange" ? "brand-orange" : value.accent === "macro-protein" ? "macro-protein" : "macro-carbs"}) 10%, transparent)`,
                      }}
                    >
                      {value.icon}
                    </div>

                    <h3 className="font-[family-name:var(--font-outfit)] text-xl font-bold text-white mb-3">
                      {value.title}
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </AnimateIn>
              ))}
            </div>
          </div>
        </section>

        {/* ───────── TECHNOLOGY ───────── */}
        <section className="relative py-20 sm:py-28">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-brand-border/50 to-transparent" />

          <div className="mx-auto max-w-5xl px-6">
            <AnimateIn className="text-center mb-16">
              <p className="text-sm font-semibold text-brand-orange uppercase tracking-widest mb-4">
                Under the Hood
              </p>
              <h2 className="font-[family-name:var(--font-outfit)] text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                The Technology{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-orange-dark">
                  Behind NourishAI
                </span>
              </h2>
            </AnimateIn>

            <div className="grid sm:grid-cols-2 gap-4">
              {TECH_ITEMS.map((item, i) => (
                <AnimateIn key={item.label} delay={i * 0.08}>
                  <div className="flex items-start gap-4 p-6 rounded-2xl bg-brand-card/50 border border-brand-border/30 hover:border-brand-border/60 transition-colors">
                    {/* Colored dot indicator */}
                    <div className="mt-1.5 shrink-0">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      />
                    </div>
                    <div>
                      <h3 className="font-[family-name:var(--font-outfit)] text-base font-bold text-white mb-1">
                        {item.label}
                      </h3>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </AnimateIn>
              ))}
            </div>
          </div>
        </section>

        {/* ───────── BUILT IN COLORADO ───────── */}
        <section className="relative py-20 sm:py-28 overflow-hidden">
          {/* Decorative orb */}
          <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-brand-green/3 rounded-full blur-[140px] pointer-events-none" />

          <div className="mx-auto max-w-4xl px-6">
            <AnimateIn>
              <div className="relative p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-brand-card to-brand-card/80 border border-brand-border/50 text-center overflow-hidden">
                {/* Decorative corner SVGs */}
                <svg
                  className="absolute top-0 left-0 w-24 h-24 text-brand-green/5"
                  viewBox="0 0 100 100"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <circle cx="0" cy="0" r="80" />
                </svg>
                <svg
                  className="absolute bottom-0 right-0 w-32 h-32 text-brand-orange/5"
                  viewBox="0 0 100 100"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <circle cx="100" cy="100" r="90" />
                </svg>

                <div className="relative">
                  <div className="inline-flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-brand-green/10 border border-brand-green/20 flex items-center justify-center">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#34C759"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <span className="font-[family-name:var(--font-outfit)] text-lg font-bold text-white">
                      Canon City, Colorado
                    </span>
                  </div>

                  <h2 className="font-[family-name:var(--font-outfit)] text-2xl sm:text-3xl font-bold text-white mb-5">
                    Built in Colorado
                  </h2>

                  <p className="text-gray-400 leading-relaxed max-w-2xl mx-auto">
                    NourishAI is designed and built in Canon City, Colorado. We combine cutting-edge AI with a passion for health and fitness to create tools that make nutrition tracking effortless for athletes and gym-goers everywhere.
                  </p>
                </div>
              </div>
            </AnimateIn>
          </div>
        </section>

        {/* ───────── DOWNLOAD CTA ───────── */}
        <section className="relative py-24 sm:py-32 overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none">
            <div className="absolute top-0 left-[10%] w-48 h-48 bg-brand-green/8 rounded-full blur-3xl" />
            <div className="absolute bottom-[10%] right-0 w-40 h-40 bg-brand-orange/8 rounded-full blur-3xl" />
          </div>

          <div className="relative mx-auto max-w-3xl px-6 text-center">
            <AnimateIn>
              <h2 className="font-[family-name:var(--font-outfit)] text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight mb-6">
                Ready to Make Nutrition{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green via-macro-carbs to-brand-green">
                  Effortless?
                </span>
              </h2>
            </AnimateIn>

            <AnimateIn delay={0.1}>
              <p className="text-lg text-gray-400 mb-10 max-w-lg mx-auto leading-relaxed">
                Download NourishAI and start tracking your macros in seconds, not minutes.
              </p>
            </AnimateIn>

            <AnimateIn delay={0.2}>
              <a
                href="/#download"
                className="inline-flex items-center justify-center gap-3 rounded-2xl bg-white px-10 py-5 text-lg font-bold text-brand-dark hover:bg-gray-100 transition-all min-h-[44px] shadow-lg shadow-white/10"
              >
                <svg width="22" height="26" viewBox="0 0 20 24" fill="currentColor">
                  <path d="M16.52 12.46c-.03-3.12 2.55-4.62 2.67-4.7-1.45-2.13-3.72-2.42-4.53-2.45-1.93-.2-3.76 1.14-4.74 1.14-.98 0-2.5-1.11-4.1-1.08-2.11.03-4.06 1.23-5.15 3.12-2.2 3.81-.56 9.46 1.58 12.55 1.05 1.52 2.3 3.22 3.94 3.16 1.58-.06 2.18-1.02 4.09-1.02 1.91 0 2.46 1.02 4.13.99 1.7-.03 2.78-1.55 3.82-3.08 1.2-1.77 1.7-3.48 1.73-3.57-.04-.02-3.32-1.27-3.35-5.06h-.09zM13.44 3.26C14.31 2.2 14.91.78 14.76-.62c-1.2.05-2.65.8-3.51 1.81-.77.89-1.44 2.31-1.26 3.67 1.33.1 2.69-.68 3.45-1.6z" />
                </svg>
                Download on the App Store
              </a>
              <p className="text-xs text-gray-600 mt-4">
                Free to download. No credit card required.
              </p>
            </AnimateIn>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
