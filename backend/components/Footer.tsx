import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-brand-border/30 bg-brand-darker/50">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-brand-green/10 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
                <path
                  d="M16 3c-6.5 3.5-11 10.5-11 17.5 0 3.8 1.7 7 4.8 9.1 1.8-5.2 4.4-9.4 6.2-11.6 1.8 2.2 4.4 6.4 6.2 11.6 3.1-2.1 4.8-5.3 4.8-9.1C27 13.5 22.5 6.5 16 3z"
                  fill="#34C759"
                />
                <circle cx="16" cy="27" r="2" fill="#FF9500" />
              </svg>
            </div>
            <span className="font-[family-name:var(--font-outfit)] text-lg font-bold text-white">
              Nourish<span className="text-brand-green">AI</span>
            </span>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-white transition-colors min-h-[44px] flex items-center">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors min-h-[44px] flex items-center">
              Terms of Service
            </Link>
            <Link href="/accessibility" className="hover:text-white transition-colors min-h-[44px] flex items-center">
              Accessibility
            </Link>
          </nav>

          {/* Built by */}
          <div className="text-sm text-gray-600">
            Built by{" "}
            <a
              href="https://epicai.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-brand-green transition-colors"
            >
              Epic AI
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-brand-border/20 flex items-center justify-center gap-3 text-xs text-gray-700">
          <span>&copy; {year} NourishAI. All rights reserved.</span>
          <Link
            href="/admin"
            className="text-gray-700 hover:text-gray-500 transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
            aria-label="Admin login"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </Link>
        </div>
      </div>
    </footer>
  );
}
