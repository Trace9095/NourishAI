import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Page Not Found | NourishAI",
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-brand-green/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-brand-accent/5 rounded-full blur-[120px]" />
      </div>

      <div className="text-center max-w-lg relative">
        {/* Animated leaf icon */}
        <div className="w-24 h-24 rounded-full bg-brand-green/10 flex items-center justify-center mx-auto mb-8 animate-float">
          <svg width="44" height="44" viewBox="0 0 32 32" fill="none">
            <path
              d="M16 3c-6.5 3.5-11 10.5-11 17.5 0 3.8 1.7 7 4.8 9.1 1.8-5.2 4.4-9.4 6.2-11.6 1.8 2.2 4.4 6.4 6.2 11.6 3.1-2.1 4.8-5.3 4.8-9.1C27 13.5 22.5 6.5 16 3z"
              fill="#34C759"
              opacity="0.6"
            />
            <circle cx="16" cy="27" r="2" fill="#FF9500" opacity="0.6" />
          </svg>
        </div>

        {/* Big 404 */}
        <h1 className="font-[family-name:var(--font-outfit)] text-8xl md:text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-700 mb-4">
          404
        </h1>

        <h2 className="font-[family-name:var(--font-outfit)] text-xl md:text-2xl font-bold text-white mb-3">
          Page Not Found
        </h2>

        <p className="text-gray-400 mb-10 max-w-sm mx-auto">
          This page doesn&apos;t exist. Maybe it went off-diet. Let&apos;s get you back on track.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-green px-8 py-3.5 text-sm font-semibold text-brand-dark hover:bg-brand-green-dark transition-colors min-h-[44px]"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Go Home
          </Link>
          <Link
            href="/features"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-brand-border/50 px-8 py-3.5 text-sm font-medium text-gray-300 hover:text-white hover:border-brand-green/30 transition-colors min-h-[44px]"
          >
            Explore Features
          </Link>
        </div>

        {/* Quick nav */}
        <div className="border-t border-brand-border/20 pt-8">
          <p className="text-gray-600 text-xs uppercase tracking-widest mb-4">Quick Links</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link href="/features" className="text-gray-400 hover:text-brand-green transition-colors min-h-[44px] flex items-center">
              Features
            </Link>
            <Link href="/about" className="text-gray-400 hover:text-brand-green transition-colors min-h-[44px] flex items-center">
              About
            </Link>
            <Link href="/blog" className="text-gray-400 hover:text-brand-green transition-colors min-h-[44px] flex items-center">
              Blog
            </Link>
            <Link href="/contact" className="text-gray-400 hover:text-brand-green transition-colors min-h-[44px] flex items-center">
              Contact
            </Link>
            <Link href="/privacy" className="text-gray-400 hover:text-brand-green transition-colors min-h-[44px] flex items-center">
              Privacy
            </Link>
          </div>
        </div>

        {/* Contact info */}
        <p className="text-gray-700 text-xs mt-8">
          Need help? Email us at{" "}
          <a href="mailto:CEO@epicai.ai" className="text-gray-500 hover:text-brand-green transition-colors">
            CEO@epicai.ai
          </a>
        </p>
      </div>
    </div>
  );
}
