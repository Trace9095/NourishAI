import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "NourishAI terms of use and end user license agreement — usage terms, subscription billing, auto-renewal disclosures, and acceptable use policies.",
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="min-h-dvh pt-24 pb-16 px-6">
        <div className="mx-auto max-w-3xl">
          <Link href="/" className="text-sm text-brand-green hover:underline mb-8 inline-block min-h-[44px] flex items-center">&larr; Back to Home</Link>
          <h1 className="font-[family-name:var(--font-outfit)] text-4xl font-extrabold text-white mb-8">Terms of Use</h1>
          <div className="prose prose-invert prose-gray max-w-none space-y-6 text-gray-400 text-sm leading-relaxed">
            <p><strong className="text-white">Last updated:</strong> March 2026</p>
            <p>By downloading, installing, or using NourishAI (&ldquo;the App&rdquo;) or visiting nourishhealthai.com (&ldquo;the Website&rdquo;), you agree to these Terms of Use (&ldquo;Terms&rdquo;). These Terms constitute the End User License Agreement (EULA) for the App.</p>

            <h2 className="font-[family-name:var(--font-outfit)] text-xl font-bold text-white pt-4">1. License</h2>
            <p>Epic AI grants you a limited, non-exclusive, non-transferable, revocable license to use the NourishAI App on Apple-branded devices you own or control, subject to these Terms and Apple&apos;s App Store Terms of Service.</p>

            <h2 className="font-[family-name:var(--font-outfit)] text-xl font-bold text-white pt-4">2. Use of Service</h2>
            <p>NourishAI provides AI-powered nutrition tracking tools. You must be at least 17 years old to use the App. The AI-generated nutrition data is an estimate and should not replace professional medical or dietary advice.</p>

            <h2 className="font-[family-name:var(--font-outfit)] text-xl font-bold text-white pt-4">3. Health &amp; Medical Disclaimer</h2>
            <p><strong className="text-white">NourishAI is not a medical device and does not provide medical advice.</strong> All nutrition information, calorie targets, and macro recommendations are estimates based on general formulas (including the Mifflin-St Jeor equation and USDA Dietary Guidelines) and are provided for informational and general wellness purposes only.</p>
            <p>Always consult a qualified healthcare professional, registered dietitian, or licensed nutritionist before making significant changes to your diet, starting a new nutrition plan, or if you have any medical condition, are pregnant, nursing, or have a history of disordered eating. NourishAI is not liable for any health outcomes resulting from use of the App.</p>

            <h2 className="font-[family-name:var(--font-outfit)] text-xl font-bold text-white pt-4">4. Subscriptions &amp; In-App Purchases</h2>

            <h3 className="font-[family-name:var(--font-outfit)] text-lg font-semibold text-white pt-2">Subscription Plans</h3>
            <ul className="list-disc pl-6 space-y-1">
              <li><strong className="text-gray-300">NourishAI Pro · Monthly</strong> — $7.99 per month (billed monthly). Subscription length: 1 month.</li>
              <li><strong className="text-gray-300">NourishAI Pro · Annual</strong> — $39.99 per year (billed annually). Subscription length: 1 year.</li>
              <li><strong className="text-gray-300">Free Tier</strong> — $0.00. Limited to 1 AI scan per week. No subscription required.</li>
            </ul>

            <h3 className="font-[family-name:var(--font-outfit)] text-lg font-semibold text-white pt-2">Free Trial</h3>
            <p>A 7-day free trial is available for new subscribers. Your Apple ID account will not be charged during the trial period. After the trial ends, your subscription begins at the selected plan price.</p>

            <h3 className="font-[family-name:var(--font-outfit)] text-lg font-semibold text-white pt-2">Auto-Renewal Disclosure</h3>
            <p>Subscriptions automatically renew at the end of each subscription period (monthly or annually) unless you cancel at least 24 hours before the end of the current period. Your Apple ID account will be charged for renewal within 24 hours prior to the end of the current period at the current subscription price.</p>
            <p>Subscription prices may change with advance notice. Price changes take effect at the start of your next billing cycle, and Apple will notify you of price changes per their policies.</p>

            <h3 className="font-[family-name:var(--font-outfit)] text-lg font-semibold text-white pt-2">How to Cancel</h3>
            <p>You can manage or cancel your subscription at any time through your Apple ID account settings:</p>
            <ol className="list-decimal pl-6 space-y-1">
              <li>Open <strong className="text-gray-300">Settings</strong> on your iPhone</li>
              <li>Tap your <strong className="text-gray-300">Apple ID</strong> (your name at the top)</li>
              <li>Tap <strong className="text-gray-300">Subscriptions</strong></li>
              <li>Select <strong className="text-gray-300">NourishAI</strong></li>
              <li>Tap <strong className="text-gray-300">Cancel Subscription</strong></li>
            </ol>
            <p>Cancellation takes effect at the end of the current billing period. You retain Pro access until then. No partial refunds are issued for unused time.</p>

            <h3 className="font-[family-name:var(--font-outfit)] text-lg font-semibold text-white pt-2">Refunds</h3>
            <p>All purchases are processed by Apple. Refunds are handled by Apple per their refund policy. To request a refund, visit <a href="https://reportaproblem.apple.com" target="_blank" rel="noopener noreferrer" className="text-brand-green hover:underline">reportaproblem.apple.com</a>.</p>

            <h2 className="font-[family-name:var(--font-outfit)] text-xl font-bold text-white pt-4">5. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul className="list-disc pl-6 space-y-1">
              <li>Reverse engineer, decompile, or attempt to extract source code</li>
              <li>Use automated tools to spam or abuse the AI scanning feature</li>
              <li>Circumvent usage limits or subscription verification</li>
              <li>Use the service for any illegal purpose</li>
            </ul>

            <h2 className="font-[family-name:var(--font-outfit)] text-xl font-bold text-white pt-4">6. Intellectual Property</h2>
            <p>All content, design, and code in NourishAI are proprietary to Epic AI. You may not reproduce, distribute, or create derivative works without written permission.</p>

            <h2 className="font-[family-name:var(--font-outfit)] text-xl font-bold text-white pt-4">7. Limitation of Liability</h2>
            <p>To the maximum extent permitted by law, Epic AI shall not be liable for any indirect, incidental, special, or consequential damages arising from use of the App, including but not limited to health outcomes, data loss, or interruption of service.</p>

            <h2 className="font-[family-name:var(--font-outfit)] text-xl font-bold text-white pt-4">8. Governing Law</h2>
            <p>These Terms are governed by the laws of the State of Colorado, United States. Any dispute shall be subject to the exclusive jurisdiction of the courts of Fremont County, Colorado.</p>

            <h2 className="font-[family-name:var(--font-outfit)] text-xl font-bold text-white pt-4">9. Changes</h2>
            <p>We may update these Terms at any time. Continued use of the App after changes constitutes acceptance of updated terms.</p>

            <h2 className="font-[family-name:var(--font-outfit)] text-xl font-bold text-white pt-4">10. Contact</h2>
            <p>Questions? Email <a href="mailto:support@nourishhealthai.com" className="text-brand-green hover:underline">support@nourishhealthai.com</a> or visit our <Link href="/contact" className="text-brand-green hover:underline">contact page</Link>.</p>
            <p className="text-xs text-gray-600 pt-4">NourishAI · Epic AI · Canon City, Colorado · USA</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
