import { HeroSection, PromoDeals, ShoppingGuides, GradeExplainer, ServicesSection, StoresSection } from "@/components/home";

export default function HomePage() {
  return (
    <>
      {/* Hero Section */}
      <HeroSection />

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
