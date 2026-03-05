"use client";

import { useState } from "react";
import Link from "next/link";

const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#pricing", label: "Pricing" },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-brand-dark border-b border-brand-border/50">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 min-w-[44px] min-h-[44px]"
          aria-label="NourishAI home"
        >
          <div className="relative w-9 h-9 rounded-full bg-brand-green/10 flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 32 32" fill="none">
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
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-gray-400 hover:text-white transition-colors min-h-[44px] flex items-center"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#download"
            className="inline-flex items-center justify-center rounded-full bg-brand-green px-6 py-2.5 text-sm font-semibold text-brand-dark hover:bg-brand-green-dark transition-colors min-h-[44px]"
          >
            Download App
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <div className="relative w-6 h-5 flex flex-col justify-between">
            <span
              className={`block h-0.5 w-6 bg-white transition-all duration-300 origin-center ${
                menuOpen ? "rotate-45 translate-y-[9px]" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-white transition-opacity duration-300 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-white transition-all duration-300 origin-center ${
                menuOpen ? "-rotate-45 -translate-y-[9px]" : ""
              }`}
            />
          </div>
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`md:hidden bg-brand-dark border-t border-brand-border/50 transition-all duration-300 overflow-hidden ${
          menuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 py-4 flex flex-col gap-2">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-base text-gray-300 hover:text-white py-3 min-h-[44px] flex items-center transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#download"
            onClick={() => setMenuOpen(false)}
            className="mt-2 inline-flex items-center justify-center rounded-full bg-brand-green px-6 py-3 text-sm font-semibold text-brand-dark min-h-[44px]"
          >
            Download App
          </a>
        </div>
      </div>
    </header>
  );
}
