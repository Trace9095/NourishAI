import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BrandContent } from "@/components/BrandContent";

export const metadata: Metadata = {
  title: "Brand | NourishAI",
  description: "NourishAI brand guidelines, color palette, typography, and logos.",
  robots: { index: false, follow: false },
};

export default function BrandPage() {
  return (
    <>
      <Header />
      <main id="main-content" className="pt-24">
        <BrandContent />
      </main>
      <Footer />
    </>
  );
}
