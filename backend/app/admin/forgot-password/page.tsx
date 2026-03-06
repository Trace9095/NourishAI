"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.status === 429) {
        setError("Too many requests. Please try again later.");
      } else {
        setSubmitted(true);
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      id="main-content"
      className="flex items-center justify-center min-h-screen px-6"
    >
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-green/10 flex items-center justify-center">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#34C759"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <h1 className="font-[family-name:var(--font-outfit)] text-2xl font-bold">
            Reset Password
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {submitted
              ? "Check your email for a reset link"
              : "Enter your admin email address"}
          </p>
        </div>

        {submitted ? (
          <div className="space-y-6">
            <div className="bg-brand-green/10 border border-brand-green/20 rounded-xl p-4 text-center">
              <p className="text-brand-green text-sm font-medium">
                If an account exists with that email, a password reset link has
                been sent. The link expires in 15 minutes.
              </p>
            </div>
            <Link
              href="/admin"
              className="block w-full py-3 rounded-xl bg-brand-card border border-brand-border/30 text-white font-semibold text-center hover:border-brand-green/50 transition-colors min-h-[44px]"
            >
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full px-4 py-3 rounded-xl bg-brand-card border border-brand-border/30 text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-green/50 transition-colors"
              autoFocus
              required
            />

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-brand-green text-brand-dark font-semibold hover:bg-brand-green/90 transition-colors disabled:opacity-50 min-h-[44px]"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <Link
              href="/admin"
              className="text-center text-sm text-gray-500 hover:text-brand-green transition-colors min-h-[44px] flex items-center justify-center"
            >
              Back to Login
            </Link>
          </form>
        )}
      </div>
    </main>
  );
}
