"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (password.length > 128) {
      setError("Password must be 128 characters or fewer");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/admin");
        }, 2000);
      } else {
        setError(data.error || "Failed to reset password");
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // No token in URL
  if (!token) {
    return (
      <div className="space-y-6">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center">
          <p className="text-red-400 text-sm font-medium">
            Invalid reset link. Please request a new password reset.
          </p>
        </div>
        <Link
          href="/admin/forgot-password"
          className="block w-full py-3 rounded-xl bg-brand-green text-brand-dark font-semibold text-center hover:bg-brand-green/90 transition-colors min-h-[44px]"
        >
          Request New Reset Link
        </Link>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <div className="space-y-6">
        <div className="bg-brand-green/10 border border-brand-green/20 rounded-xl p-4 text-center">
          <p className="text-brand-green text-sm font-medium">
            Password reset successfully! Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New password"
          className="w-full px-4 py-3 rounded-xl bg-brand-card border border-brand-border/30 text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-green/50 transition-colors"
          autoFocus
          required
          minLength={8}
          maxLength={128}
        />
      </div>
      <div>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
          className="w-full px-4 py-3 rounded-xl bg-brand-card border border-brand-border/30 text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-green/50 transition-colors"
          required
          minLength={8}
          maxLength={128}
        />
      </div>

      {error && <p className="text-red-400 text-sm text-center">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl bg-brand-green text-brand-dark font-semibold hover:bg-brand-green/90 transition-colors disabled:opacity-50 min-h-[44px]"
      >
        {loading ? "Resetting..." : "Reset Password"}
      </button>

      <Link
        href="/admin"
        className="block text-center text-sm text-gray-500 hover:text-brand-green transition-colors min-h-[44px] flex items-center justify-center"
      >
        Back to Login
      </Link>
    </form>
  );
}

export default function ResetPasswordPage() {
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
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h1 className="font-[family-name:var(--font-outfit)] text-2xl font-bold">
            Set New Password
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Enter your new password below
          </p>
        </div>

        <Suspense
          fallback={
            <div className="text-center text-gray-500">Loading...</div>
          }
        >
          <ResetPasswordForm />
        </Suspense>
      </div>
    </main>
  );
}
