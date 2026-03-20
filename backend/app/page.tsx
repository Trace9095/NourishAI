import dynamic from "next/dynamic";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Stats } from "@/components/Stats";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import { Footer } from "@/components/Footer";

const Testimonials = dynamic(() =>
  import("@/components/Testimonials").then((m) => ({ default: m.Testimonials }))
);
const Pricing = dynamic(() =>
  import("@/components/Pricing").then((m) => ({ default: m.Pricing }))
);
const FAQ = dynamic(() =>
  import("@/components/FAQ").then((m) => ({ default: m.FAQ }))
);
const DownloadCTA = dynamic(() =>
  import("@/components/DownloadCTA").then((m) => ({ default: m.DownloadCTA }))
);

export default function Home() {
  return (
    <>
      <Header />
      <main id="main-content">
        <Hero />
        <Stats />
        <Features />
        <HowItWorks />
        <Testimonials />
        <Pricing />
        <FAQ />
        <DownloadCTA />
      </main>
      <Footer />
    </>
  );
}
