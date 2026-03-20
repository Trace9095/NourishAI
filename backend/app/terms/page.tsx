import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "NourishAI terms of service — usage terms, subscription billing, and acceptable use policies.",
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="min-h-dvh pt-24 pb-16 px-6">
        <div className="mx-auto max-w-3xl">
          <Link href="/" className="text-sm text-brand-green hover:underline mb-8 inline-block min-h-[44px] flex items-center">&larr; Back to Home</Link>
        <h1 className="font-[family-name:var(--font-outfit)] text-4xl font-extrabold text-white mb-8">Terms of Service</h1>
        <div className="prose prose-invert prose-gray max-w-none space-y-6 text-gray-400 text-sm leading-relaxed">
          <p><strong className="text-white">Last updated:</strong> March 2026</p>
          <p>By using NourishAI (&ldquo;the App&rdquo;) or visiting nourishhealthai.com (&ldquo;the Website&rdquo;), you agree to these Terms of Service.</p>

          <h2 className="font-[family-name:var(--font-outfit)] text-xl font-bold text-white pt-4">Use of Service</h2>
          <p>NourishAI provides AI-powered nutrition tracking tools. You must be at least 17 years old to use the App. The AI-generated nutrition data is an estimate and should not replace professional medical or dietary advice.</p>

          <h2 className="font-[family-name:var(--font-outfit)] text-xl font-bold text-white pt-4">Subscriptions</h2>
          <p>NourishAI offers a free tier and a Pro subscription ($7.99/month or $39.99/year). Subscriptions are billed through Apple&apos;s App Store. You can cancel anytime through your Apple ID settings. Refunds are handled by Apple per their refund policy.</p>

          <h2 className="font-[family-name:var(--font-outfit)] text-xl font-bold text-white pt-4">Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-6 space-y-1">
            <li>Reverse engineer, decompile, or attempt to extract source code</li>
            <li>Use automated tools to spam or abuse the AI scanning feature</li>
            <li>Circumvent usage limits or subscription verification</li>
            <li>Use the service for any illegal purpose</li>
          </ul>

          <h2 className="font-[family-name:var(--font-outfit)] text-xl font-bold text-white pt-4">Disclaimer</h2>
          <p>NourishAI is provided &ldquo;as is&rdquo; without warranty. AI-generated nutrition estimates may not be 100% accurate. Always consult a healthcare professional for dietary decisions. We are not liable for any health outcomes based on information from the App.</p>

          <h2 className="font-[family-name:var(--font-outfit)] text-xl font-bold text-white pt-4">Intellectual Property</h2>
          <p>All content, design, and code in NourishAI are proprietary. You may not reproduce, distribute, or create derivative works without written permission.</p>

          <h2 className="font-[family-name:var(--font-outfit)] text-xl font-bold text-white pt-4">Changes</h2>
          <p>We may update these terms at any time. Continued use of the App constitutes acceptance of updated terms.</p>

          <h2 className="font-[family-name:var(--font-outfit)] text-xl font-bold text-white pt-4">Contact</h2>
          <p>Questions? Email <a href="mailto:support@nourishhealthai.com" className="text-brand-green hover:underline">support@nourishhealthai.com</a>.</p>
        </div>
      </div>
    </main>
      <Footer />
    </>
  );
}
