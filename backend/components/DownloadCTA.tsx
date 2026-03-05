import { AnimateIn } from "./AnimateIn";

export function DownloadCTA() {
  return (
    <section id="download" className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background decoration — macro color dots */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none">
        <div className="absolute top-0 left-[10%] w-48 h-48 bg-brand-green/8 rounded-full blur-3xl" />
        <div className="absolute bottom-[10%] right-0 w-40 h-40 bg-brand-orange/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-[20%] w-36 h-36 bg-macro-protein/5 rounded-full blur-3xl" />
        <div className="absolute top-[20%] right-[10%] w-32 h-32 bg-macro-carbs/5 rounded-full blur-3xl" />
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
            Join thousands of athletes and fitness enthusiasts who track their macros effortlessly with AI.
          </p>
        </AnimateIn>

        <AnimateIn delay={0.3}>
          <a
            href="#"
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
  );
}
