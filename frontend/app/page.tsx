import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import StatsSection from "@/components/landing/StatsSection";
import ModulesSection from "@/components/landing/ModulesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import PricingSection from "@/components/landing/PricingSection";
import CtaSection from "@/components/landing/CtaSection";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-dark-900">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <StatsSection />
        <ModulesSection />
        <HowItWorksSection />
        <PricingSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
