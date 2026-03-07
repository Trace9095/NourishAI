"use client";

import { useState } from "react";
import Image from "next/image";

const BRAND_COLORS = [
  { name: "Primary Green", hex: "#34C759", css: "bg-brand-green", usage: "Primary actions, CTAs, active states" },
  { name: "Accent Orange", hex: "#FF9500", css: "bg-brand-accent", usage: "Highlights, warnings, premium badge" },
  { name: "Dark Background", hex: "#0A0A14", css: "bg-brand-dark", usage: "Page backgrounds" },
  { name: "Card Background", hex: "#12121A", css: "bg-brand-card", usage: "Card and surface backgrounds" },
  { name: "Protein Red", hex: "#FF6B6B", css: "bg-macro-protein", usage: "Protein macro indicators" },
  { name: "Carbs Teal", hex: "#4ECDC4", css: "bg-macro-carbs", usage: "Carbohydrate macro indicators" },
  { name: "Fat Yellow", hex: "#FFE66D", css: "bg-macro-fat", usage: "Fat macro indicators" },
  { name: "Calories Orange", hex: "#FF9500", css: "bg-macro-calories", usage: "Calorie macro indicators" },
  { name: "Water Blue", hex: "#5AC8FA", css: "bg-macro-water", usage: "Water and hydration indicators" },
];

const REFERRAL_LINKS = [
  {
    category: "NourishAI",
    links: [
      { name: "NourishAI", url: "https://nourishhealthai.com", description: "AI nutrition tracking" },
    ],
  },
  {
    category: "Social",
    links: [
      { name: "App Store", url: "#", description: "Download NourishAI on iOS" },
      { name: "Instagram", url: "#", description: "@nourishai" },
    ],
  },
];

export function BrandContent() {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  function copyColor(hex: string) {
    navigator.clipboard.writeText(hex);
    setCopiedColor(hex);
    setTimeout(() => setCopiedColor(null), 2000);
  }

  return (
    <div className="mx-auto max-w-5xl px-6 pb-24 space-y-16">
      {/* Header */}
      <div className="text-center">
        <span className="text-brand-green text-sm font-semibold tracking-widest uppercase">
          Brand Guidelines
        </span>
        <h1 className="font-[family-name:var(--font-outfit)] text-3xl md:text-5xl font-bold text-white mt-4">
          Nourish<span className="text-brand-green">AI</span> Brand Kit
        </h1>
        <p className="text-gray-400 mt-4 max-w-2xl mx-auto">
          Official color palette, typography, logos, and brand guidelines for NourishAI.
        </p>
      </div>

      {/* Logo */}
      <section>
        <h2 className="font-[family-name:var(--font-outfit)] text-2xl font-bold text-white mb-6">Logo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-brand-card border border-brand-border/20 rounded-2xl p-8 flex items-center justify-center">
            <Image
              src="/images/logo-wordmark.svg"
              alt="NourishAI Logo Wordmark"
              width={240}
              height={60}
              quality={90}
            />
          </div>
          <div className="bg-white rounded-2xl p-8 flex items-center justify-center">
            <Image
              src="/images/logo-wordmark.svg"
              alt="NourishAI Logo on Light"
              width={240}
              height={60}
              quality={90}
            />
          </div>
          <div className="bg-brand-card border border-brand-border/20 rounded-2xl p-8 flex items-center justify-center">
            <Image
              src="/images/logo.svg"
              alt="NourishAI Icon"
              width={80}
              height={80}
              quality={90}
            />
          </div>
          <div className="bg-brand-card border border-brand-border/20 rounded-2xl p-8 flex flex-col items-center gap-4">
            <p className="text-gray-500 text-sm">Downloads</p>
            <div className="flex gap-4">
              <a
                href="/images/logo.svg"
                download="nourishai-logo.svg"
                className="px-4 py-2 bg-brand-dark border border-brand-border/30 rounded-lg text-sm text-gray-300 hover:text-white hover:border-brand-green/30 transition-colors min-h-[44px] flex items-center"
              >
                SVG Icon
              </a>
              <a
                href="/images/logo-wordmark.svg"
                download="nourishai-wordmark.svg"
                className="px-4 py-2 bg-brand-dark border border-brand-border/30 rounded-lg text-sm text-gray-300 hover:text-white hover:border-brand-green/30 transition-colors min-h-[44px] flex items-center"
              >
                SVG Wordmark
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Color Palette */}
      <section>
        <h2 className="font-[family-name:var(--font-outfit)] text-2xl font-bold text-white mb-6">Color Palette</h2>
        <p className="text-gray-400 mb-8 text-sm">Click any color to copy its hex value.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {BRAND_COLORS.map((color) => (
            <button
              key={color.hex}
              onClick={() => copyColor(color.hex)}
              className="bg-brand-card border border-brand-border/20 rounded-xl overflow-hidden text-left hover:border-brand-green/30 transition-colors group"
            >
              <div
                className="h-20 w-full"
                style={{ backgroundColor: color.hex }}
              />
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium text-sm">{color.name}</span>
                  <span className="text-gray-500 font-mono text-xs group-hover:text-brand-green transition-colors">
                    {copiedColor === color.hex ? "Copied!" : color.hex}
                  </span>
                </div>
                <p className="text-gray-600 text-xs mt-1">{color.usage}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Typography */}
      <section>
        <h2 className="font-[family-name:var(--font-outfit)] text-2xl font-bold text-white mb-6">Typography</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-brand-card border border-brand-border/20 rounded-2xl p-8">
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-4">Headlines</p>
            <p className="font-[family-name:var(--font-outfit)] text-4xl font-bold text-white mb-2">Outfit</p>
            <p className="font-[family-name:var(--font-outfit)] text-xl text-gray-400">
              ABCDEFGHIJKLMNOPQRSTUVWXYZ
            </p>
            <p className="font-[family-name:var(--font-outfit)] text-xl text-gray-400">
              abcdefghijklmnopqrstuvwxyz
            </p>
            <p className="font-[family-name:var(--font-outfit)] text-xl text-gray-400">
              0123456789
            </p>
            <div className="mt-4 flex gap-2 flex-wrap">
              {["400", "500", "600", "700", "800"].map((w) => (
                <span
                  key={w}
                  className="px-3 py-1 bg-brand-dark rounded text-xs text-gray-400"
                  style={{ fontWeight: parseInt(w) }}
                >
                  {w}
                </span>
              ))}
            </div>
          </div>
          <div className="bg-brand-card border border-brand-border/20 rounded-2xl p-8">
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-4">Body Text</p>
            <p className="text-4xl font-bold text-white mb-2">Inter</p>
            <p className="text-xl text-gray-400">
              ABCDEFGHIJKLMNOPQRSTUVWXYZ
            </p>
            <p className="text-xl text-gray-400">
              abcdefghijklmnopqrstuvwxyz
            </p>
            <p className="text-xl text-gray-400">
              0123456789
            </p>
            <div className="mt-4 flex gap-2 flex-wrap">
              {["400", "500", "600", "700"].map((w) => (
                <span
                  key={w}
                  className="px-3 py-1 bg-brand-dark rounded text-xs text-gray-400"
                  style={{ fontWeight: parseInt(w) }}
                >
                  {w}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="bg-brand-card border border-brand-border/20 rounded-2xl p-8 mt-6">
          <p className="text-gray-500 text-xs uppercase tracking-wider mb-4">iOS App</p>
          <p className="text-2xl font-bold text-white mb-2">SF Pro</p>
          <p className="text-gray-400 text-sm">
            The iOS app uses Apple&apos;s system font SF Pro for native feel and Dynamic Type support.
          </p>
        </div>
      </section>

      {/* Referral Links */}
      <section>
        <h2 className="font-[family-name:var(--font-outfit)] text-2xl font-bold text-white mb-6">Referral Links</h2>
        <div className="space-y-8">
          {REFERRAL_LINKS.map((category) => (
            <div key={category.category}>
              <h3 className="text-gray-500 text-xs uppercase tracking-wider mb-4">{category.category}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {category.links.map((link) => (
                  <a
                    key={link.url}
                    href={`${link.url}${link.url.includes("?") ? "&" : "?"}utm_source=nourishai&utm_medium=brand_page&utm_campaign=referral`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-brand-card border border-brand-border/20 rounded-xl p-4 hover:border-brand-green/30 transition-colors flex items-center justify-between gap-4 min-h-[44px]"
                  >
                    <div>
                      <p className="text-white font-medium text-sm">{link.name}</p>
                      <p className="text-gray-600 text-xs">{link.description}</p>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-600 flex-shrink-0">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Usage Guidelines */}
      <section>
        <h2 className="font-[family-name:var(--font-outfit)] text-2xl font-bold text-white mb-6">Usage Guidelines</h2>
        <div className="bg-brand-card border border-brand-border/20 rounded-2xl p-8 space-y-4">
          <div className="flex gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="2" className="flex-shrink-0 mt-0.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <p className="text-gray-300 text-sm">Use the NourishAI logo on dark backgrounds for best visibility</p>
          </div>
          <div className="flex gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="2" className="flex-shrink-0 mt-0.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <p className="text-gray-300 text-sm">Maintain adequate clear space around the logo</p>
          </div>
          <div className="flex gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="2" className="flex-shrink-0 mt-0.5">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
            </svg>
            <p className="text-gray-300 text-sm">NourishAI is one word with a capital A and I</p>
          </div>
          <div className="flex gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF6B6B" strokeWidth="2" className="flex-shrink-0 mt-0.5">
              <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            <p className="text-gray-300 text-sm">Do not stretch, rotate, or recolor the logo</p>
          </div>
          <div className="flex gap-3">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FF6B6B" strokeWidth="2" className="flex-shrink-0 mt-0.5">
              <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            <p className="text-gray-300 text-sm">Do not place the logo on busy or low-contrast backgrounds</p>
          </div>
        </div>
      </section>
    </div>
  );
}
