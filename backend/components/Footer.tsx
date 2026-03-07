import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-brand-border/30 bg-brand-dark">
      {/* Subtle top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px bg-gradient-to-r from-transparent via-brand-green/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 pt-16 pb-8">
        {/* Main footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 mb-12">
          {/* Brand column */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-brand-green/10 flex items-center justify-center">
                <svg width="20" height="20" viewBox="0 0 32 32" fill="none">
                  <path
                    d="M16 3c-6.5 3.5-11 10.5-11 17.5 0 3.8 1.7 7 4.8 9.1 1.8-5.2 4.4-9.4 6.2-11.6 1.8 2.2 4.4 6.4 6.2 11.6 3.1-2.1 4.8-5.3 4.8-9.1C27 13.5 22.5 6.5 16 3z"
                    fill="#34C759"
                  />
                  <circle cx="16" cy="27" r="2" fill="#FF9500" />
                </svg>
              </div>
              <span className="font-[family-name:var(--font-outfit)] text-xl font-bold text-white">
                Nourish<span className="text-brand-green">AI</span>
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              AI-powered nutrition tracking for athletes and fitness enthusiasts.
              Snap a photo, get your macros.
            </p>
            {/* App Store badge placeholder */}
            <a
              href="#"
              className="inline-flex items-center gap-2 mt-5 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors min-h-[44px]"
            >
              <svg width="20" height="24" viewBox="0 0 384 512" fill="white">
                <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
              </svg>
              <div className="text-left">
                <div className="text-[10px] text-gray-400 leading-none">Download on the</div>
                <div className="text-sm font-semibold text-white leading-tight">App Store</div>
              </div>
            </a>
          </div>

          {/* Product column */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Product</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/#features" className="text-gray-500 text-sm hover:text-brand-green transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="text-gray-500 text-sm hover:text-brand-green transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="text-gray-500 text-sm hover:text-brand-green transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-500 text-sm hover:text-brand-green transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Company column */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-500 text-sm hover:text-brand-green transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-500 text-sm hover:text-brand-green transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-500 text-sm hover:text-brand-green transition-colors"
                >
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal column */}
          <div>
            <h4 className="text-white text-sm font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/privacy" className="text-gray-500 text-sm hover:text-brand-green transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-500 text-sm hover:text-brand-green transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/accessibility" className="text-gray-500 text-sm hover:text-brand-green transition-colors">
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-brand-border/20 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span>&copy; {year} NourishAI. All rights reserved.</span>
            <span className="text-gray-700">·</span>
            <span>Canon City, Colorado</span>
          </div>

          <Link
            href="/admin"
            className="text-gray-700 hover:text-gray-500 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Admin login"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </Link>
        </div>
      </div>
    </footer>
  );
}
