import { MacroRings } from "./MacroRings";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-brand-green/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-20 right-1/4 w-[400px] h-[400px] bg-brand-orange/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left — copy */}
          <div className="max-w-xl">
            <div
              className="inline-flex items-center gap-2 rounded-full border border-brand-green/20 bg-brand-green/5 px-4 py-1.5 mb-8"
              style={{ animation: "fadeInUp 0.6s ease both" }}
            >
              <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
              <span className="text-xs text-brand-green font-medium tracking-wide">
                AI-Powered Nutrition
              </span>
            </div>

            <h1
              className="font-[family-name:var(--font-outfit)] text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05] tracking-tight mb-6"
              style={{ animation: "fadeInUp 0.6s ease 0.1s both" }}
            >
              Snap. Track.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-brand-green-dark green-glow-text">
                Transform.
              </span>
            </h1>

            <p
              className="text-lg sm:text-xl text-gray-400 leading-relaxed mb-10 max-w-md"
              style={{ animation: "fadeInUp 0.6s ease 0.2s both" }}
            >
              Take a photo of your meal and get an instant macro breakdown.
              AI-powered nutrition tracking built for people who take fitness seriously.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4"
              style={{ animation: "fadeInUp 0.6s ease 0.3s both" }}
            >
              <a
                href="#download"
                className="inline-flex items-center justify-center gap-3 rounded-2xl bg-white px-8 py-4 text-base font-semibold text-brand-dark hover:bg-gray-100 transition-all min-h-[44px] shadow-lg shadow-white/10"
              >
                <svg width="20" height="24" viewBox="0 0 20 24" fill="currentColor">
                  <path d="M16.52 12.46c-.03-3.12 2.55-4.62 2.67-4.7-1.45-2.13-3.72-2.42-4.53-2.45-1.93-.2-3.76 1.14-4.74 1.14-.98 0-2.5-1.11-4.1-1.08-2.11.03-4.06 1.23-5.15 3.12-2.2 3.81-.56 9.46 1.58 12.55 1.05 1.52 2.3 3.22 3.94 3.16 1.58-.06 2.18-1.02 4.09-1.02 1.91 0 2.46 1.02 4.13.99 1.7-.03 2.78-1.55 3.82-3.08 1.2-1.77 1.7-3.48 1.73-3.57-.04-.02-3.32-1.27-3.35-5.06h-.09zM13.44 3.26C14.31 2.2 14.91.78 14.76-.62c-1.2.05-2.65.8-3.51 1.81-.77.89-1.44 2.31-1.26 3.67 1.33.1 2.69-.68 3.45-1.6z" />
                </svg>
                Download for iOS
              </a>
              <a
                href="#features"
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-brand-border px-8 py-4 text-base font-medium text-gray-300 hover:text-white hover:border-gray-500 transition-all min-h-[44px]"
              >
                Learn More
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7 17l9.2-9.2M17 17V7.8H7.8" />
                </svg>
              </a>
            </div>

            {/* Mini trust badges */}
            <div
              className="flex items-center gap-6 mt-10 pt-8 border-t border-brand-border/30"
              style={{ animation: "fadeInUp 0.6s ease 0.45s both" }}
            >
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span className="text-xs text-gray-500">Privacy First</span>
              </div>
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span className="text-xs text-gray-500">HealthKit Sync</span>
              </div>
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                  <line x1="12" y1="18" x2="12.01" y2="18" />
                </svg>
                <span className="text-xs text-gray-500">iOS 17+</span>
              </div>
            </div>
          </div>

          {/* Right — phone mockup with macro rings */}
          <div
            className="flex justify-center lg:justify-end"
            style={{ animation: "fadeInUp 0.8s ease 0.3s both" }}
          >
            <MacroRings />
          </div>
        </div>
      </div>
    </section>
  );
}
