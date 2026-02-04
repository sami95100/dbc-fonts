import { HeroSection } from "@/components/home";
import { ProductGrid } from "@/components/products/ProductGrid";
import { getModels, getModelOptions, getModelPrices } from "@/lib/api/products";
import { apiModelToProduct } from "@/lib/api/transformers";
import { MOCK_PRODUCTS } from "@/data/mock/products";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  // Charger quelques modeles pour la section "Meilleures offres"
  const modelsResponse = await getModels({ perPage: 8 });

  let featuredProducts = MOCK_PRODUCTS.filter((p) => p.category === "smartphones").slice(0, 8);

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

    const validProducts = transformedProducts.filter(
      (p): p is NonNullable<typeof p> => p !== null
    );

    if (validProducts.length > 0) {
      featuredProducts = validProducts;
    }
  }

  return (
    <>
      {/* Hero Section */}
      <HeroSection locale={locale} />

      {/* Featured Products */}
      <section className="bg-white py-8 md:py-12">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-6 text-xl font-bold text-gray-900 md:text-2xl">
            {locale === "fr" ? "Decouvrez nos meilleures offres" : "Discover our best deals"}
          </h2>
          <ProductGrid products={featuredProducts} />
        </div>
      </section>
    </>
  );
}
