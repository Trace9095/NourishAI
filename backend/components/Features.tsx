import { AnimateIn } from "./AnimateIn";

const FEATURES = [
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
    ),
    title: "AI Photo Scan",
    description: "Snap a photo of any meal. Our AI identifies every food item and calculates precise macros in under 3 seconds.",
    color: "brand-green",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF9500" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2v14a2 2 0 0 0 2 2h14" />
        <path d="M2 6h6M2 10h4M2 14h2" />
        <rect x="10" y="6" width="8" height="10" rx="1" />
      </svg>
    ),
    title: "Barcode Scanner",
    description: "Scan any packaged food for instant nutrition data from our database of 500K+ products. Fast, free, always accurate.",
    color: "brand-orange",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FF6B6B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
    title: "Smart Dashboard",
    description: "Beautiful macro rings show calories, protein, carbs, and fat at a glance. Know exactly where you stand throughout the day.",
    color: "macro-protein",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4ECDC4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    title: "HealthKit Sync",
    description: "Seamlessly read and write nutrition data to Apple Health. Your macros, weight, and activity all in one ecosystem.",
    color: "macro-carbs",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5AC8FA" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="6" y="2" width="12" height="20" rx="6" />
        <circle cx="12" cy="8" r="2" />
        <path d="M12 10v4" />
      </svg>
    ),
    title: "Apple Watch",
    description: "Check your macros and log water intake right from your wrist. Quick-add meals without reaching for your phone.",
    color: "macro-water",
  },
  {
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFE66D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    title: "Progress Tracking",
    description: "Weight trends, macro averages, daily streaks, and weekly summaries. See your consistency and celebrate your wins.",
    color: "macro-fat",
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <AnimateIn className="text-center mb-16">
          <p className="text-sm font-semibold text-brand-green uppercase tracking-widest mb-4">
            Features
          </p>
          <h2 className="font-[family-name:var(--font-outfit)] text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Everything You Need to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-macro-carbs">
              Hit Your Macros
            </span>
          </h2>
        </AnimateIn>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feature, i) => (
            <AnimateIn key={feature.title} delay={i * 0.08}>
              <div className="group relative p-6 rounded-2xl bg-brand-card border border-brand-border/50 card-hover h-full">
                <div className={`w-12 h-12 rounded-xl bg-${feature.color}/10 flex items-center justify-center mb-5`}>
                  {feature.icon}
                </div>
                <h3 className="font-[family-name:var(--font-outfit)] text-lg font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
