import { getTranslations } from "next-intl/server";
import { HeroSection, BrandValues } from "@/components/home";
import { ProductGrid } from "@/components/products/ProductGrid";
import { getModels, getModelOptions, getModelPrices } from "@/lib/api/products";
import { apiModelToProduct } from "@/lib/api/transformers";

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

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="bg-white py-12 md:py-16">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="mb-8 font-display text-2xl font-bold text-gray-900 md:text-3xl">
              {t("bestDeals")}
            </h2>
            <ProductGrid products={featuredProducts} />
          </div>
        </section>
      )}

      {/* Brand Values */}
      <BrandValues />
    </>
  );
}
