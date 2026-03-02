import { getTranslations } from "next-intl/server";
import { Breadcrumb } from "@/components/products/Breadcrumb";
import { TrustBar } from "@/components/products/TrustBar";
import { FilteredProductGrid } from "@/components/products/FilteredProductGrid";
import { getModels, getModelOptions, getModelPrices } from "@/lib/api/products";
import { getFilters } from "@/lib/api/filters";
import { apiModelToProduct } from "@/lib/api/transformers";
import { getCategoryBySlug } from "@/data/mock/categories";

interface SmartwatchesPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function SmartwatchesPage({ params }: SmartwatchesPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "products" });
  const tCat = await getTranslations({ locale, namespace: "categories" });

  const category = getCategoryBySlug("smartwatches");

  const [modelsResponse, filtersResponse] = await Promise.all([
    getModels({ category: "wearable", perPage: 50 }),
    getFilters({}),
  ]);

  let products: Awaited<ReturnType<typeof apiModelToProduct>>[] = [];

  if (modelsResponse.data && modelsResponse.data.items.length > 0) {
    const transformedProducts = await Promise.all(
      modelsResponse.data.items.map(async (model) => {
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

    products = transformedProducts.filter(
      (p): p is NonNullable<typeof p> => p !== null
    );
  }

  const defaultFilters = {
    price: { min: 0, max: 2000 },
    brands: [],
    years: [],
    storages: [],
    colors: [],
  };

  const filters = filtersResponse.data || defaultFilters;

  return (
    <>
      <TrustBar />

      <div className="mx-auto max-w-7xl px-4 py-6">
        <Breadcrumb
          items={[
            { label: tCat("smartwatches") },
          ]}
        />

        <div className="mb-6">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 md:text-4xl">
            {t("smartwatchesTitle")}
          </h1>
          <p className="text-gray-600">
            {t("smartwatchesSubtitle")}
          </p>
        </div>

        {category?.subcategories && (
          <div className="mb-8 flex flex-wrap gap-3">
            {category.subcategories.map((sub) => (
              <a
                key={sub.id}
                href={`/${locale}/products/smartwatches/${sub.slug}`}
                className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-green-700 hover:bg-green-700 hover:text-white"
              >
                {sub.name}
              </a>
            ))}
          </div>
        )}

        <FilteredProductGrid
          initialProducts={products}
          initialFilters={filters}
          locale={locale}
        />
      </div>
    </>
  );
}
