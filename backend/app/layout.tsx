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
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const jsonLdString = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "MobileApplication",
  name: "NourishAI",
  operatingSystem: "iOS",
  applicationCategory: "HealthApplication",
  description:
    "AI-powered nutrition tracking app. Snap a photo of your food for instant macro breakdown.",
  offers: [
    {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      description: "Free tier with 1 AI scan per week",
    },
    {
      "@type": "Offer",
      price: "7.99",
      priceCurrency: "USD",
      description: "Pro monthly subscription with unlimited AI scans",
    },
  ],
  creator: {
    "@type": "Organization",
    name: "NourishAI",
    url: "https://nourishhealthai.com",
  },
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
          dangerouslySetInnerHTML={{ __html: jsonLdString }}
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
