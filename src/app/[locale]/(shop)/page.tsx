import { HeroSection, ReassuranceSection, PromoDeals, ShoppingGuides, GradeExplainer, StoresSection, ImpactSection, BuybackSection } from "@/components/home";

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <HeroSection />

      {/* Reassurance - Standard DBC Labs */}
      <ReassuranceSection />

      {/* Top ventes */}
      <PromoDeals />

      {/* Shopping Guides */}
      <ShoppingGuides />

      {/* Grade Explainer */}
      <GradeExplainer />

      {/* Buyback CTA */}
      <BuybackSection />

      {/* Stores */}
      <StoresSection />

      {/* Impact RSE */}
      <ImpactSection />
    </>
  );
}
