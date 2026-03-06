import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Accessibility Statement",
  description: "NourishAI accessibility commitment — our pledge to make nutrition tracking accessible to everyone.",
};

export default function AccessibilityPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="min-h-screen pt-24 pb-16 px-6">
      <div className="mx-auto max-w-3xl">
        <Link href="/" className="text-sm text-brand-green hover:underline mb-8 inline-block min-h-[44px] flex items-center">&larr; Back to Home</Link>
        <h1 className="font-[family-name:var(--font-outfit)] text-4xl font-extrabold text-white mb-8">Accessibility Statement</h1>
        <div className="prose prose-invert prose-gray max-w-none space-y-6 text-gray-400 text-sm leading-relaxed">
          <p><strong className="text-white">Last updated:</strong> March 2026</p>
          <p>NourishAI is committed to making our iOS app and website accessible to everyone, including people with disabilities. We strive to meet WCAG 2.1 Level AA standards.</p>

          <h2 className="font-[family-name:var(--font-outfit)] text-xl font-bold text-white pt-4">What We Do</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Semantic HTML with proper heading hierarchy</li>
            <li>Skip-to-content navigation link</li>
            <li>ARIA labels on interactive elements</li>
            <li>Minimum 44x44px touch targets on all buttons and links</li>
            <li>Sufficient color contrast ratios throughout</li>
            <li>Keyboard navigation support</li>
            <li>VoiceOver compatibility in our iOS app</li>
            <li>Dynamic Type support for adjustable text sizes</li>
            <li>Reduced motion support via prefers-reduced-motion</li>
          </ul>

          <h2 className="font-[family-name:var(--font-outfit)] text-xl font-bold text-white pt-4">iOS App Accessibility</h2>
          <p>Our iOS app supports Apple&apos;s built-in accessibility features including VoiceOver, Dynamic Type, Bold Text, Reduce Motion, and Increase Contrast.</p>

          <h2 className="font-[family-name:var(--font-outfit)] text-xl font-bold text-white pt-4">Known Limitations</h2>
          <p>The AI food photo scanning feature requires the use of the device camera, which may present challenges for users with certain visual impairments. Manual food entry and barcode scanning are available as alternative input methods.</p>

          <h2 className="font-[family-name:var(--font-outfit)] text-xl font-bold text-white pt-4">Feedback</h2>
          <p>We welcome your feedback on our accessibility efforts. If you encounter any barriers, please contact us at <a href="mailto:CEO@epicai.ai" className="text-brand-green hover:underline">CEO@epicai.ai</a> and we will work to resolve the issue promptly.</p>
        </div>
      </div>
    </main>
      <Footer />
    </>
  );
}
