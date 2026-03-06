"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { hasConsented, setConsent } from "@/lib/cookie-consent";

export function CookieConsentBanner() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    // Only show if user hasn't consented yet
    if (!hasConsented()) {
      // Small delay so it doesn't flash immediately
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  function acceptAll() {
    setConsent(true, true);
    setVisible(false);
  }

  function acceptSelected() {
    setConsent(analytics, marketing);
    setVisible(false);
  }

  function rejectAll() {
    setConsent(false, false);
    setVisible(false);
  }

  // Don't show on admin pages (Gold Standard #28)
  if (pathname?.startsWith("/admin")) return null;
  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[70] p-4 md:p-6">
      <div className="mx-auto max-w-2xl bg-brand-card border border-brand-border/30 rounded-2xl p-6 shadow-2xl shadow-black/50">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-brand-green/10 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#34C759" strokeWidth="2">
              <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
              <path d="M8 14s1.5 2 4 2 4-2 4-2" />
              <line x1="9" y1="9" x2="9.01" y2="9" />
              <line x1="15" y1="9" x2="15.01" y2="9" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-white font-semibold text-sm mb-1">Cookie Preferences</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              We use cookies to improve your experience. Necessary cookies are always active. You can choose to enable analytics and marketing cookies.
            </p>
          </div>
        </div>

        {/* Detailed toggles */}
        {showDetails && (
          <div className="mt-4 space-y-3 border-t border-brand-border/20 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-xs font-medium">Necessary</p>
                <p className="text-gray-600 text-xs">Required for the site to function</p>
              </div>
              <div className="w-10 h-6 bg-brand-green rounded-full flex items-center justify-end px-0.5">
                <div className="w-5 h-5 bg-white rounded-full" />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-xs font-medium">Analytics</p>
                <p className="text-gray-600 text-xs">Help us understand how you use the site</p>
              </div>
              <button
                onClick={() => setAnalytics(!analytics)}
                className={`w-10 h-6 rounded-full flex items-center px-0.5 transition-colors ${
                  analytics ? "bg-brand-green justify-end" : "bg-gray-700 justify-start"
                }`}
              >
                <div className="w-5 h-5 bg-white rounded-full" />
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white text-xs font-medium">Marketing</p>
                <p className="text-gray-600 text-xs">Personalized content and recommendations</p>
              </div>
              <button
                onClick={() => setMarketing(!marketing)}
                className={`w-10 h-6 rounded-full flex items-center px-0.5 transition-colors ${
                  marketing ? "bg-brand-green justify-end" : "bg-gray-700 justify-start"
                }`}
              >
                <div className="w-5 h-5 bg-white rounded-full" />
              </button>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="mt-4 flex flex-col sm:flex-row gap-2">
          <button
            onClick={acceptAll}
            className="flex-1 px-4 py-2.5 bg-brand-green text-brand-dark text-xs font-semibold rounded-lg hover:bg-brand-green/90 transition-colors min-h-[44px]"
          >
            Accept All
          </button>
          {showDetails ? (
            <button
              onClick={acceptSelected}
              className="flex-1 px-4 py-2.5 border border-brand-border/30 text-gray-300 text-xs font-medium rounded-lg hover:border-brand-green/30 transition-colors min-h-[44px]"
            >
              Save Preferences
            </button>
          ) : (
            <button
              onClick={() => setShowDetails(true)}
              className="flex-1 px-4 py-2.5 border border-brand-border/30 text-gray-300 text-xs font-medium rounded-lg hover:border-brand-green/30 transition-colors min-h-[44px]"
            >
              Customize
            </button>
          )}
          <button
            onClick={rejectAll}
            className="flex-1 px-4 py-2.5 text-gray-500 text-xs font-medium rounded-lg hover:text-gray-300 transition-colors min-h-[44px]"
          >
            Reject All
          </button>
        </div>
      </div>
    </div>
  );
}
