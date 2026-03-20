import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nourishhealthai.com"),
  title: {
    default: "NourishAI — AI-Powered Nutrition Tracking",
    template: "%s | NourishAI",
  },
  description:
    "NourishAI — your AI-powered nutrition coach. Personalized meal plans, nutrition tracking, and health insights powered by artificial intelligence.",
  keywords: [
    "nutrition tracking",
    "macro tracker",
    "AI food scanner",
    "calorie counter",
    "protein tracker",
    "fitness nutrition",
    "food photo analysis",
    "meal tracker",
    "HealthKit nutrition",
  ],
  authors: [{ name: "NourishAI", url: "https://nourishhealthai.com" }],
  creator: "NourishAI",
  publisher: "NourishAI",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nourishhealthai.com",
    siteName: "NourishAI",
    title: "NourishAI — AI-Powered Nutrition Tracking",
    description:
      "Snap a photo of your food, get instant macro breakdown. Track calories, protein, carbs, and fat effortlessly.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NourishAI — AI-Powered Nutrition Tracking",
    description:
      "Snap a photo of your food, get instant macro breakdown. AI-powered nutrition tracking for fitness-focused people.",
    images: ["/opengraph-image"],
  },
  alternates: {
    canonical: "https://nourishhealthai.com",
    types: {
      "text/markdown": "/llms.txt",
      "application/rss+xml": "/feed.xml",
    },
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "NourishAI",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const jsonLdApp = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "MobileApplication",
  name: "NourishAI",
  operatingSystem: "iOS 17+",
  applicationCategory: "HealthApplication",
  url: "https://nourishhealthai.com",
  description:
    "AI-powered nutrition tracking app. Snap a photo of your food for instant macro breakdown. Track calories, protein, carbs, and fat with personalized meal plans and an AI nutritionist.",
  featureList: [
    "AI food photo recognition",
    "Macro and calorie tracking",
    "Personalized meal plans",
    "AI nutritionist chat",
    "Barcode scanner",
    "Menu scanner",
    "Grocery list builder",
    "HealthKit integration",
  ],
  offers: [
    {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      name: "Free",
      description: "Free tier with 1 AI scan per week",
    },
    {
      "@type": "Offer",
      price: "7.99",
      priceCurrency: "USD",
      name: "Pro Monthly",
      description: "Unlimited AI scans + pro nutritionist chat",
    },
    {
      "@type": "Offer",
      price: "39.99",
      priceCurrency: "USD",
      name: "Pro Annual",
      description: "Unlimited AI scans + pro nutritionist chat, billed annually",
    },
  ],
  creator: {
    "@type": "Organization",
    name: "NourishAI",
    url: "https://nourishhealthai.com",
  },
});

const jsonLdOrg = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://nourishhealthai.com/#organization",
  name: "NourishAI",
  url: "https://nourishhealthai.com",
  logo: "https://nourishhealthai.com/icon-512.png",
  description:
    "NourishAI builds AI-powered nutrition tracking tools for fitness-focused people. Our flagship app uses computer vision and generative AI to make macro tracking effortless.",
  sameAs: [
    "https://apps.apple.com/us/app/nourishai",
    "https://nourishhealthai.com",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    url: "https://nourishhealthai.com/contact",
  },
});

const jsonLdFaq = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "How does NourishAI track nutrition?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "NourishAI uses AI-powered food photo recognition — snap a photo of your meal and the app instantly identifies the food and breaks down its calories, protein, carbs, and fat. You can also enter food manually, scan barcodes, or describe your meal in text for an AI estimate.",
      },
    },
    {
      "@type": "Question",
      name: "Is NourishAI free to use?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. NourishAI has a free tier that includes 1 AI food scan per week plus manual tracking. The Pro plan ($7.99/month or $39.99/year) unlocks unlimited AI scans, the AI nutritionist chat, and advanced meal planning features.",
      },
    },
    {
      "@type": "Question",
      name: "How accurate is the AI nutrition advice?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "NourishAI uses Claude AI (by Anthropic) for food analysis and nutritional guidance. Estimates are based on USDA food databases and computer vision recognition. Results are highly accurate for common foods and restaurant dishes. For medical dietary needs, always consult a registered dietitian.",
      },
    },
    {
      "@type": "Question",
      name: "Does NourishAI work with my dietary restrictions?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. NourishAI supports personalized macro goals for any dietary approach — including keto, vegan, vegetarian, paleo, high-protein, and custom macros. Set your goals in your profile and the AI tailors meal suggestions accordingly.",
      },
    },
    {
      "@type": "Question",
      name: "Does NourishAI sync with Apple Health?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. NourishAI integrates with HealthKit on iOS to read your steps and active calories, giving you a complete picture of your daily energy balance alongside your nutrition data.",
      },
    },
    {
      "@type": "Question",
      name: "Is my nutrition data private?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. Your food log and health data are stored locally on your device using SwiftData. Only your account information and scan usage are stored on our servers. We never sell your health data.",
      },
    },
  ],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdApp }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdOrg }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdFaq }}
        />
      </head>
      <body className="grain">
        <a href="#main-content" className="skip-to-content">
          Skip to content
        </a>
        {children}
        <CookieConsentBanner />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
