import { getTranslations } from "next-intl/server";
import { HeroSection, PromoDeals, ShoppingGuides, GradeExplainer, ServicesSection, StoresSection } from "@/components/home";
import { ProductGrid } from "@/components/products/ProductGrid";
import { getModels, getModelOptions, getModelPrices } from "@/lib/api/products";
import { apiModelToProduct } from "@/lib/api/transformers";
import { AnimatedSection } from "@/components/shared/AnimatedSection";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });

  // Charger les modeles depuis l'API pour la section "Meilleures offres"
  const modelsResponse = await getModels({ perPage: 8 });

  let featuredProducts: Awaited<ReturnType<typeof apiModelToProduct>>[] = [];

  if (modelsResponse.data && modelsResponse.data.items.length > 0) {
    const transformedProducts = await Promise.all(
      modelsResponse.data.items.slice(0, 8).map(async (model) => {
        const [optionsRes, pricesRes] = await Promise.all([
          getModelOptions(model.id),
          getModelPrices(model.id),
        ]);

        if (optionsRes.data && pricesRes.data) {
          return apiModelToProduct({
            model,
            prices: pricesRes.data,
            options: optionsRes.data,
          });
        }
        return null;
      })
    );

    featuredProducts = transformedProducts.filter(
      (p): p is NonNullable<typeof p> => p !== null
    );
  }

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

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <AnimatedSection className="py-8 md:py-12 lg:py-16">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="mb-8 text-[28px] font-bold leading-tight tracking-tight text-gray-900 md:mb-10 md:text-[32px] lg:text-[36px]">
              {t("bestDeals")}{" "}
              <span className="font-normal text-gray-500">{t("bestDealsAccent")}</span>
            </h2>
            <ProductGrid products={featuredProducts} />
          </div>
        </AnimatedSection>
      )}
    </>
  );
}
