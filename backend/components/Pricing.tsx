import { AnimateIn } from "./AnimateIn";

const CHECK = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const DASH = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4B5563" strokeWidth="2" strokeLinecap="round">
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const FREE_FEATURES = [
  { text: "1 AI food scan per week", included: true },
  { text: "Manual food entry", included: true },
  { text: "Barcode scanner", included: true },
  { text: "Basic macro dashboard", included: true },
  { text: "HealthKit integration", included: true },
  { text: "Unlimited AI scans", included: false },
  { text: "Saved meals & favorites", included: false },
  { text: "Detailed analytics", included: false },
  { text: "Apple Watch app", included: false },
  { text: "Water tracking", included: false },
];

const PRO_FEATURES = [
  { text: "Everything in Free", included: true },
  { text: "Unlimited AI food scans", included: true },
  { text: "Saved meals & favorites", included: true },
  { text: "Detailed analytics & trends", included: true },
  { text: "Apple Watch companion", included: true },
  { text: "Water intake tracking", included: true },
  { text: "Weekly AI insights", included: true },
  { text: "Priority support", included: true },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <AnimateIn className="text-center mb-16">
          <p className="text-sm font-semibold text-brand-green uppercase tracking-widest mb-4">
            Pricing
          </p>
          <h2 className="font-[family-name:var(--font-outfit)] text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
            Start Free.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-macro-carbs">
              Go Pro
            </span>{" "}
            When Ready.
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            No credit card required. Try NourishAI free and upgrade when you want unlimited AI-powered nutrition tracking.
          </p>
        </AnimateIn>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Free tier */}
          <AnimateIn delay={0.1}>
            <div className="relative p-8 rounded-2xl bg-brand-card border border-brand-border/50 h-full flex flex-col">
              <div className="mb-8">
                <h3 className="font-[family-name:var(--font-outfit)] text-xl font-bold text-white mb-1">
                  Free
                </h3>
                <p className="text-sm text-gray-500">Get started with the basics</p>
              </div>

              <div className="mb-8">
                <span className="font-[family-name:var(--font-outfit)] text-5xl font-extrabold text-white">$0</span>
                <span className="text-gray-500 ml-2">forever</span>
              </div>

              <ul className="space-y-3.5 mb-8 flex-1">
                {FREE_FEATURES.map((f) => (
                  <li key={f.text} className="flex items-center gap-3">
                    {f.included ? CHECK : DASH}
                    <span className={`text-sm ${f.included ? "text-gray-300" : "text-gray-600"}`}>
                      {f.text}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href="#download"
                className="block w-full text-center py-3.5 rounded-xl border border-brand-border text-sm font-semibold text-gray-300 hover:text-white hover:border-gray-500 transition-all min-h-[44px]"
              >
                Download Free
              </a>
            </div>
          </AnimateIn>

          {/* Pro tier */}
          <AnimateIn delay={0.2}>
            <div className="relative p-8 rounded-2xl bg-brand-card border-2 border-brand-green/40 h-full flex flex-col overflow-hidden">
              {/* Glow */}
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-brand-green/10 rounded-full blur-3xl pointer-events-none" />

              {/* Popular badge */}
              <div className="absolute top-6 right-6 bg-brand-green/10 border border-brand-green/20 text-brand-green text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                Most Popular
              </div>

              <div className="mb-8 relative">
                <h3 className="font-[family-name:var(--font-outfit)] text-xl font-bold text-white mb-1">
                  Pro
                </h3>
                <p className="text-sm text-gray-500">Unlimited AI nutrition tracking</p>
              </div>

              <div className="mb-8 relative">
                <span className="font-[family-name:var(--font-outfit)] text-5xl font-extrabold text-white">$7.99</span>
                <span className="text-gray-500 ml-2">/month</span>
                <p className="text-xs text-gray-600 mt-1">or $39.99/year (save 58%)</p>
              </div>

              <ul className="space-y-3.5 mb-8 flex-1 relative">
                {PRO_FEATURES.map((f) => (
                  <li key={f.text} className="flex items-center gap-3">
                    {CHECK}
                    <span className="text-sm text-gray-300">{f.text}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#download"
                className="relative block w-full text-center py-3.5 rounded-xl bg-brand-green text-sm font-bold text-brand-dark hover:bg-brand-green-dark transition-all min-h-[44px] animate-pulse-glow"
              >
                Start Free Trial
              </a>
            </div>
          </AnimateIn>
        </div>
      </div>
    </section>
  );
}
