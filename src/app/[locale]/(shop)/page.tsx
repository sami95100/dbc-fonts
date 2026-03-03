import { HeroSection, ReassuranceSection, PromoDeals, ShoppingGuides, GradeExplainer, ServicesSection, StoresSection } from "@/components/home";

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <HeroSection />

      {/* Reassurance - Pacte Qualité DBC */}
      <ReassuranceSection />

      {/* Promo Deals */}
      <PromoDeals />

      {/* Shopping Guides */}
      <ShoppingGuides />

      {/* Grade Explainer */}
      <GradeExplainer />

      {/* Services: Vente, Réparation, Reprise */}
      <ServicesSection />

      {/* Stores */}
      <StoresSection />
    </>
  );
}
