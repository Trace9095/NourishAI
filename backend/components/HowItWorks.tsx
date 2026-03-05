import { AnimateIn } from "./AnimateIn";

const STEPS = [
  {
    number: "01",
    title: "Snap",
    description: "Take a photo of your meal with your iPhone camera. Works with any food — home-cooked, restaurant, packaged.",
    color: "#34C759",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
        <circle cx="12" cy="13" r="4" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Analyze",
    description: "Our AI instantly identifies every food item in your photo and calculates precise calories, protein, carbs, and fat.",
    color: "#FF9500",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a4 4 0 0 0-4 4v2H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2h-2V6a4 4 0 0 0-4-4z" />
        <circle cx="12" cy="15" r="2" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Track",
    description: "Confirm the results, and your macros are logged instantly. Watch your daily rings fill up as you progress toward your goals.",
    color: "#34C759",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative py-24 sm:py-32 bg-brand-darker/50">
      <div className="mx-auto max-w-7xl px-6">
        <AnimateIn className="text-center mb-20">
          <p className="text-sm font-semibold text-brand-orange uppercase tracking-widest mb-4">
            How It Works
          </p>
          <h2 className="font-[family-name:var(--font-outfit)] text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Three Steps to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-brand-orange-dark">
              Better Nutrition
            </span>
          </h2>
        </AnimateIn>

        <div className="relative grid md:grid-cols-3 gap-12 md:gap-8">
          {/* Connector line — desktop only */}
          <div className="hidden md:block absolute top-[72px] left-[16.67%] right-[16.67%] h-px">
            <div className="w-full h-full bg-gradient-to-r from-[#34C759] via-[#FF9500] to-[#34C759] opacity-30" />
          </div>

          {STEPS.map((step, i) => (
            <AnimateIn key={step.number} delay={i * 0.15} className="relative text-center">
              {/* Step circle */}
              <div className="relative mx-auto mb-8">
                <div
                  className="w-[88px] h-[88px] rounded-full flex items-center justify-center mx-auto border-2 relative z-10"
                  style={{
                    borderColor: step.color,
                    backgroundColor: `${step.color}10`,
                    color: step.color,
                  }}
                >
                  {step.icon}
                </div>
                <div
                  className="absolute inset-0 rounded-full blur-xl opacity-20 mx-auto"
                  style={{ backgroundColor: step.color }}
                />
              </div>

              {/* Number */}
              <span
                className="font-[family-name:var(--font-outfit)] text-xs font-bold tracking-[0.3em] uppercase mb-3 block"
                style={{ color: step.color }}
              >
                Step {step.number}
              </span>

              <h3 className="font-[family-name:var(--font-outfit)] text-2xl font-bold text-white mb-3">
                {step.title}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
