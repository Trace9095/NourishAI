import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "NourishAI privacy policy — how we handle your data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 px-6">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm text-brand-green hover:underline mb-8 inline-block min-h-[44px] flex items-center">&larr; Back to Home</Link>
        <h1 className="font-[family-name:var(--font-outfit)] text-4xl font-extrabold text-white mb-8">Privacy Policy</h1>
        <div className="prose prose-invert prose-gray max-w-none space-y-6 text-gray-400 text-sm leading-relaxed">
          <p><strong className="text-white">Last updated:</strong> March 2026</p>
          <p>NourishAI (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;us&rdquo;) is operated by Epic AI. This Privacy Policy explains how we collect, use, and protect your information when you use the NourishAI iOS app and website (nourishhealthai.com).</p>

          <h2 className="font-[family-name:var(--font-outfit)] text-xl font-bold text-white pt-4">Information We Collect</h2>
          <p><strong className="text-gray-300">Device Information:</strong> We generate a unique device identifier to manage your account and track AI scan usage. We do not collect your name, email, or personal contact information unless you voluntarily provide it via our contact form.</p>
          <p><strong className="text-gray-300">Nutrition Data:</strong> Food photos sent for AI analysis are processed in real-time and are not stored permanently on our servers. Your food logs, macro data, and health information are stored locally on your device using Apple&apos;s SwiftData framework.</p>
          <p><strong className="text-gray-300">HealthKit Data:</strong> With your explicit permission, we read and write nutrition data to Apple Health. We never share HealthKit data with third parties or use it for advertising.</p>
          <p><strong className="text-gray-300">Subscription Data:</strong> Subscription status is managed through Apple&apos;s StoreKit. We verify subscription receipts server-side but do not store payment information.</p>
          <p><strong className="text-gray-300">Analytics:</strong> We use Vercel Analytics to understand website usage. Analytics are consent-gated and anonymized.</p>

          <h2 className="font-[family-name:var(--font-outfit)] text-xl font-bold text-white pt-4">How We Use Your Information</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>To provide AI-powered food analysis</li>
            <li>To enforce usage limits (free tier: 1 scan/week)</li>
            <li>To verify subscription status</li>
            <li>To improve our AI accuracy and service quality</li>
          </ul>

          <h2 className="font-[family-name:var(--font-outfit)] text-xl font-bold text-white pt-4">Data Storage & Security</h2>
          <p>Your nutrition data is stored locally on your device. Server-side data (device ID, scan counts, subscription status) is stored in a secure PostgreSQL database hosted on Neon via Vercel. All communications use HTTPS/TLS encryption.</p>

          <h2 className="font-[family-name:var(--font-outfit)] text-xl font-bold text-white pt-4">Third-Party Services</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li><strong className="text-gray-300">Anthropic (Claude AI):</strong> Food photo analysis. Photos are processed in real-time per Anthropic&apos;s usage policy.</li>
            <li><strong className="text-gray-300">OpenFoodFacts:</strong> Barcode lookup for packaged foods (free, open-source database).</li>
            <li><strong className="text-gray-300">Vercel:</strong> Website hosting and serverless functions.</li>
            <li><strong className="text-gray-300">Apple:</strong> StoreKit for subscriptions, HealthKit for health data.</li>
          </ul>

          <h2 className="font-[family-name:var(--font-outfit)] text-xl font-bold text-white pt-4">Your Rights</h2>
          <p>You can delete all local data by uninstalling the app. To request deletion of server-side data, contact us at CEO@epicai.ai.</p>

          <h2 className="font-[family-name:var(--font-outfit)] text-xl font-bold text-white pt-4">Contact</h2>
          <p>Questions about this policy? Email <a href="mailto:CEO@epicai.ai" className="text-brand-green hover:underline">CEO@epicai.ai</a>.</p>
        </div>
      </div>
    </div>
  );
}
