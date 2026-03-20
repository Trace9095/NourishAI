import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ContactForm } from "@/components/ContactForm";
import { AnimateIn } from "@/components/AnimateIn";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the NourishAI team. Questions, feedback, bug reports, or partnership inquiries.",
};

const FAQ_ITEMS = [
  {
    question: "Is NourishAI really free?",
    answer:
      "Yes, manual entry, barcode scanning, and HealthKit sync are free forever. AI photo scanning is limited to 1/week on free, unlimited on Pro.",
    link: "/#pricing",
    linkText: "View Pricing",
  },
  {
    question: "How accurate is the AI?",
    answer:
      "Our AI uses Claude, one of the most advanced AI models available. It achieves 95%+ accuracy on common foods.",
    link: "/features",
    linkText: "Explore Features",
  },
  {
    question: "Does NourishAI work offline?",
    answer:
      "Yes! All your nutrition data is stored locally on your device. Only AI photo scanning requires an internet connection.",
  },
  {
    question: "Can I cancel my subscription?",
    answer:
      "Yes, cancel anytime through your Apple ID settings. No questions asked.",
  },
  {
    question: "Is my data private?",
    answer:
      "Absolutely. Nutrition data is stored locally on your device. We only process photos temporarily for AI analysis and never store them.",
    link: "/privacy",
    linkText: "Read Privacy Policy",
  },
];

export default function ContactPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="min-h-dvh pt-24 pb-16 px-6">
        <div className="mx-auto max-w-7xl">
          {/* Back link */}
          <Link
            href="/"
            className="text-sm text-brand-green hover:underline mb-8 inline-flex items-center gap-1 min-h-[44px]"
          >
            &larr; Back to Home
          </Link>

          {/* Header section */}
          <AnimateIn className="mb-12">
            <p className="text-sm font-semibold text-brand-green uppercase tracking-widest mb-4">
              Contact
            </p>
            <h1 className="font-[family-name:var(--font-outfit)] text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-4">
              Get in Touch
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl">
              Questions, feedback, or partnership inquiries? We&apos;d love to
              hear from you.
            </p>
          </AnimateIn>

          {/* Form + Sidebar */}
          <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 mb-24">
            {/* Form — takes 3 columns on large screens */}
            <AnimateIn className="lg:col-span-3" delay={0.1}>
              <ContactForm />
            </AnimateIn>

            {/* Sidebar — takes 2 columns */}
            <AnimateIn className="lg:col-span-2" delay={0.2}>
              <div className="rounded-2xl bg-brand-card border border-brand-border/50 p-8 sm:p-10 h-fit">
                <h2 className="font-[family-name:var(--font-outfit)] text-xl font-bold text-white mb-8">
                  Contact Info
                </h2>

                <div className="space-y-6">
                  {/* Email */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-green/10 flex items-center justify-center flex-shrink-0">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#34C759"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="2" y="4" width="20" height="16" rx="2" />
                        <path d="M22 7l-10 6L2 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Email</p>
                      <a
                        href="mailto:hello@nourishhealthai.com"
                        className="text-white hover:text-brand-green transition-colors"
                      >
                        hello@nourishhealthai.com
                      </a>
                    </div>
                  </div>

                  {/* Company */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-brand-orange/10 flex items-center justify-center flex-shrink-0">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#FF9500"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Company</p>
                      <p className="text-white">NourishAI</p>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-macro-protein/10 flex items-center justify-center flex-shrink-0">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#FF6B6B"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Location</p>
                      <p className="text-white">Canon City, Colorado</p>
                    </div>
                  </div>

                  {/* Response time */}
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-macro-carbs/10 flex items-center justify-center flex-shrink-0">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#4ECDC4"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">
                        Response Time
                      </p>
                      <p className="text-white">
                        We typically respond within 24 hours
                      </p>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-brand-border/30 my-8" />

                {/* Quick links */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-4">
                    Quick Links
                  </h3>
                  <div className="flex flex-col gap-2">
                    <Link
                      href="/privacy"
                      className="text-sm text-gray-400 hover:text-white transition-colors min-h-[44px] flex items-center"
                    >
                      Privacy Policy
                    </Link>
                    <Link
                      href="/terms"
                      className="text-sm text-gray-400 hover:text-white transition-colors min-h-[44px] flex items-center"
                    >
                      Terms of Service
                    </Link>
                    <Link
                      href="/accessibility"
                      className="text-sm text-gray-400 hover:text-white transition-colors min-h-[44px] flex items-center"
                    >
                      Accessibility Statement
                    </Link>
                  </div>
                </div>
              </div>
            </AnimateIn>
          </div>

          {/* FAQ Section */}
          <AnimateIn className="mb-16">
            <div className="text-center mb-12">
              <p className="text-sm font-semibold text-brand-green uppercase tracking-widest mb-4">
                FAQ
              </p>
              <h2 className="font-[family-name:var(--font-outfit)] text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="mx-auto max-w-3xl space-y-4">
              {FAQ_ITEMS.map((item, i) => (
                <AnimateIn key={item.question} delay={i * 0.06}>
                  <div className="rounded-2xl bg-brand-card border border-brand-border/50 p-6 sm:p-8">
                    <h3 className="font-[family-name:var(--font-outfit)] text-lg font-bold text-white mb-3">
                      {item.question}
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {item.answer}
                    </p>
                    {"link" in item && item.link && (
                      <Link
                        href={item.link}
                        className="mt-4 inline-flex items-center gap-2 rounded-lg bg-brand-green/10 border border-brand-green/20 px-4 py-2 text-sm font-medium text-brand-green hover:bg-brand-green/20 transition-colors min-h-[44px]"
                      >
                        {item.linkText}
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      </Link>
                    )}
                  </div>
                </AnimateIn>
              ))}
            </div>
          </AnimateIn>
        </div>
      </main>
      <Footer />
    </>
  );
}
