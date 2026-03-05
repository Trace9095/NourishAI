import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 — Page Not Found",
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-brand-green/10 flex items-center justify-center mx-auto mb-8">
          <svg width="36" height="36" viewBox="0 0 32 32" fill="none">
            <path
              d="M16 3c-6.5 3.5-11 10.5-11 17.5 0 3.8 1.7 7 4.8 9.1 1.8-5.2 4.4-9.4 6.2-11.6 1.8 2.2 4.4 6.4 6.2 11.6 3.1-2.1 4.8-5.3 4.8-9.1C27 13.5 22.5 6.5 16 3z"
              fill="#34C759"
              opacity="0.5"
            />
            <circle cx="16" cy="27" r="2" fill="#FF9500" opacity="0.5" />
          </svg>
        </div>

        <h1 className="font-[family-name:var(--font-outfit)] text-6xl font-extrabold text-white mb-4">
          404
        </h1>
        <p className="text-lg text-gray-400 mb-8">
          This page doesn&apos;t exist. Maybe it went off-diet.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-xl bg-brand-green px-6 py-3 text-sm font-semibold text-brand-dark hover:bg-brand-green-dark transition-colors min-h-[44px]"
          >
            Go Home
          </Link>
          <button
            onClick={undefined}
            className="inline-flex items-center justify-center rounded-xl border border-brand-border px-6 py-3 text-sm font-medium text-gray-400 hover:text-white hover:border-gray-500 transition-colors min-h-[44px]"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}
