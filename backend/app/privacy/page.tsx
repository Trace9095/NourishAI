import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "NourishAI privacy policy — how we collect, use, and protect your data. Local-first nutrition tracking with privacy by design.",
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen pt-24 pb-16 px-6">
        <div className="mx-auto max-w-3xl">
          <Link href="/" className="text-sm text-brand-green hover:underline mb-8 inline-block min-h-[44px] flex items-center">&larr; Back to Home</Link>
          <h1 className="font-[family-name:var(--font-outfit)] text-4xl font-extrabold text-white mb-8">Privacy Policy</h1>
          <div className="prose prose-invert prose-gray max-w-none space-y-6 text-gray-400 text-sm leading-relaxed">
            <p><strong className="text-white">Last updated:</strong> March 2026</p>
            <p>NourishAI (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) is based in Canon City, Colorado. This Privacy Policy explains how we collect, use, and protect your information when you use the NourishAI iOS app and website (nourishhealthai.com).</p>

            <h2 className="font-[family-name:var(--font-outfit)] text-xl font-bold text-white pt-4">Our Privacy Philosophy</h2>
            <p>NourishAI is built with a <strong className="text-gray-300">local-first architecture</strong>. This means your nutrition data — food logs, macro tracking, body measurements, health information — is stored on your device, not on our servers. We designed it this way because your nutrition data is personal, and we believe you should own it completely.</p>

            <h2 className="font-[family-name:var(--font-outfit)] text-xl font-bold text-white pt-4">Information We Collect</h2>
            <p><strong className="text-gray-300">Device Information:</strong> We generate a unique device identifier (UUID) to manage your account and track AI scan usage. This identifier cannot be used to identify you personally. We do not collect your name, email, phone number, or personal contact information unless you voluntarily provide it via our contact form.</p>
            <p><strong className="text-gray-300">Food Photos for AI Analysis:</strong> When you use the AI photo scanning feature, your photo is sent to our server, forwarded to the Anthropic API for analysis, and immediately discarded. Photos are never stored, logged, cached, or used for training purposes. The entire process takes under 3 seconds.</p>
            <p><strong className="text-gray-300">Nutrition Data:</strong> Your food logs, macro data, daily nutrition totals, and health information are stored locally on your device using Apple&apos;s SwiftData framework. We have zero access to this data.</p>
            <p><strong className="text-gray-300">HealthKit Data:</strong> With your explicit permission, we read your weight, height, steps, and active energy from Apple Health, and write nutrition data (calories, protein, carbs, fat) back to Apple Health. HealthKit data is never sent to our servers, never shared with third parties, and never used for advertising — in compliance with Apple&apos;s HealthKit guidelines.</p>
            <p><strong className="text-gray-300">Subscription Data:</strong> Subscription status is managed through Apple&apos;s StoreKit 2. We verify subscription receipts server-side but do not store your payment method, credit card number, or Apple ID.</p>
            <p><strong className="text-gray-300">Usage Data:</strong> We track the number and type of AI scans performed (photo, text, barcode) per device for rate limiting purposes. We do not track what foods you scan or the results returned.</p>
            <p><strong className="text-gray-300">Website Analytics:</strong> We use Vercel Analytics and Speed Insights to understand website usage patterns. Analytics are consent-gated (you must opt in via our cookie banner) and collect only anonymized, aggregated data. No personal identifiers are tracked.</p>

            <h2 className="font-[family-name:var(--font-outfit)] text-xl font-bold text-white pt-4">How We Use Your Information</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>To provide AI-powered food analysis when you request it</li>
              <li>To enforce usage limits (free tier: 1 AI scan/week)</li>
              <li>To verify subscription status and prevent abuse</li>
              <li>To respond to contact form submissions</li>
              <li>To improve our service quality and fix bugs</li>
            </ul>
            <p>We do <strong className="text-gray-300">not</strong> use your information to: sell to third parties, serve targeted advertising, build user profiles, train AI models, or make automated decisions about you.</p>

            <h2 className="font-[family-name:var(--font-outfit)] text-xl font-bold text-white pt-4">Data Storage & Security</h2>
            <p>Server-side data (device UUID, scan counts, subscription status) is stored in a secure PostgreSQL database hosted on Neon via Vercel&apos;s infrastructure. All data is encrypted in transit (HTTPS/TLS 1.3) and at rest. Our servers are located in the United States.</p>
            <p>We implement the following security measures:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>HTTPS with TLS 1.3 for all communications</li>
              <li>Rate limiting on all API endpoints to prevent abuse</li>
              <li>Input validation and sanitization on all user inputs</li>
              <li>Content Security Policy (CSP) headers to prevent XSS</li>
              <li>HSTS with 2-year max-age and preload</li>
              <li>No storage of sensitive data (passwords hashed with PBKDF2)</li>
            </ul>

            <h2 className="font-[family-name:var(--font-outfit)] text-xl font-bold text-white pt-4">Data Retention</h2>
            <p><strong className="text-gray-300">Local data:</strong> Stored on your device indefinitely until you delete the app or clear app data.</p>
            <p><strong className="text-gray-300">Server-side data:</strong> Device registration and scan usage data is retained for as long as your account is active. Contact form submissions are retained for 2 years for customer service purposes.</p>
            <p><strong className="text-gray-300">Food photos:</strong> Never retained. Processed in real-time and immediately discarded.</p>

            <h2 className="font-[family-name:var(--font-outfit)] text-xl font-bold text-white pt-4">Third-Party Services</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong className="text-gray-300">Anthropic (Claude AI):</strong> Processes food photos for nutrition analysis. Photos are sent via API and not retained by Anthropic per their data processing terms. <a href="https://www.anthropic.com/privacy" target="_blank" rel="noopener noreferrer" className="text-brand-green hover:underline">Anthropic Privacy Policy</a></li>
              <li><strong className="text-gray-300">OpenFoodFacts:</strong> Open-source barcode database for packaged food lookups. No personal data is shared. <a href="https://world.openfoodfacts.org/terms-of-use" target="_blank" rel="noopener noreferrer" className="text-brand-green hover:underline">OpenFoodFacts Terms</a></li>
              <li><strong className="text-gray-300">Vercel:</strong> Website hosting, serverless functions, and analytics. <a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-brand-green hover:underline">Vercel Privacy Policy</a></li>
              <li><strong className="text-gray-300">Resend:</strong> Email delivery for contact form responses. <a href="https://resend.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-brand-green hover:underline">Resend Privacy Policy</a></li>
              <li><strong className="text-gray-300">Apple:</strong> StoreKit 2 for subscription management, HealthKit for health data integration.</li>
              <li><strong className="text-gray-300">Neon:</strong> PostgreSQL database hosting. <a href="https://neon.tech/privacy" target="_blank" rel="noopener noreferrer" className="text-brand-green hover:underline">Neon Privacy Policy</a></li>
            </ul>

            <h2 className="font-[family-name:var(--font-outfit)] text-xl font-bold text-white pt-4">Children&apos;s Privacy</h2>
            <p>NourishAI is not intended for children under 17. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us and we will delete it.</p>

            <h2 className="font-[family-name:var(--font-outfit)] text-xl font-bold text-white pt-4">Your Rights</h2>
            <p>Depending on your jurisdiction, you may have the following rights:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong className="text-gray-300">Access:</strong> Request a copy of the data we hold about your device</li>
              <li><strong className="text-gray-300">Deletion:</strong> Request deletion of all server-side data associated with your device</li>
              <li><strong className="text-gray-300">Portability:</strong> Your local nutrition data syncs to Apple Health, which supports data export</li>
              <li><strong className="text-gray-300">Opt-out:</strong> Decline analytics cookies via our consent banner</li>
            </ul>
            <p>To exercise any of these rights, email <a href="mailto:CEO@epicai.ai" className="text-brand-green hover:underline">CEO@epicai.ai</a>. We will respond within 30 days.</p>
            <p>You can delete all local data by uninstalling the app. To request deletion of server-side data (device UUID, scan counts), contact us and we will process the request within 48 hours.</p>

            <h2 className="font-[family-name:var(--font-outfit)] text-xl font-bold text-white pt-4">California Privacy Rights (CCPA)</h2>
            <p>California residents have the right to know what personal information we collect, request deletion, and opt out of the sale of personal information. We do not sell personal information. To make a CCPA request, email <a href="mailto:CEO@epicai.ai" className="text-brand-green hover:underline">CEO@epicai.ai</a>.</p>

            <h2 className="font-[family-name:var(--font-outfit)] text-xl font-bold text-white pt-4">Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We will notify you of significant changes by posting a notice on our website. Your continued use of NourishAI after changes constitutes acceptance of the updated policy.</p>

            <h2 className="font-[family-name:var(--font-outfit)] text-xl font-bold text-white pt-4">Contact</h2>
            <p>Questions about this policy? Email <a href="mailto:CEO@epicai.ai" className="text-brand-green hover:underline">CEO@epicai.ai</a> or visit our <Link href="/contact" className="text-brand-green hover:underline">contact page</Link>.</p>
            <p className="text-xs text-gray-600 pt-4">NourishAI · Canon City, Colorado · USA</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
