import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
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
    "Snap a photo of your food, get instant macro breakdown. AI-powered nutrition tracking for gym-goers, macro trackers, and athletes.",
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
  authors: [{ name: "Epic AI", url: "https://epicai.ai" }],
  creator: "Epic AI",
  publisher: "Epic AI",
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
    types: {
      "text/markdown": "/llms.txt",
    },
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

// Static JSON-LD — hardcoded content, no user input, safe to serialize
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
    name: "Epic AI",
    url: "https://epicai.ai",
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
      </body>
    </html>
  );
}
