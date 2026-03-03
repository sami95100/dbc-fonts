import { getTranslations } from "next-intl/server";
import { Breadcrumb } from "@/components/products/Breadcrumb";
import { TrustBar } from "@/components/products/TrustBar";
import { FilteredProductGrid } from "@/components/products/FilteredProductGrid";
import { getModels } from "@/lib/api/products";
import { getFilters } from "@/lib/api/filters";
import { apiModelsToProductList, applySmartphoneListingRules } from "@/lib/api/transformers";
import { getCategoryBySlug } from "@/data/mock/categories";

interface SmartphonesPageProps {
  params: Promise<{
    locale: string;
  }>;
}

export default async function SmartphonesPage({ params }: SmartphonesPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "products" });
  const tCat = await getTranslations({ locale, namespace: "categories" });

  const category = getCategoryBySlug("smartphones");

  // Charger tous les smartphones (category=mobile)
  const [modelsResponse, filtersResponse] = await Promise.all([
    getModels({ category: "mobile", perPage: 50 }),
    getFilters({}),
  ]);

  const products = modelsResponse.data?.items
    ? applySmartphoneListingRules(apiModelsToProductList(modelsResponse.data.items), {
      includeFeaturedIphones: true,
    })
    : [];

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
            { label: tCat("smartphones") },
          ]}
        />

        <div className="mb-3 md:mb-6">
          <h1 className="mb-1 text-2xl font-bold text-gray-900 md:mb-2 md:text-4xl">
            {t("smartphonesTitle")}
          </h1>
          <p className="hidden text-gray-600 md:block">
            {t("smartphonesSubtitle")}
          </p>
        </div>

        {/* Sous-categories par marque */}
        {category?.subcategories && (
          <div className="mb-4 flex gap-2 overflow-x-auto scrollbar-hide md:mb-8 md:flex-wrap md:gap-3 md:overflow-visible">
            {category.subcategories.map((sub) => (
              <a
                key={sub.id}
                href={`/${locale}/products/smartphones/${sub.slug}`}
                className="shrink-0 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:border-green-700 hover:bg-green-700 hover:text-white"
              >
                {tCat(`sub.smartphones.${sub.slug}`)}
              </a>
            ))}
          </div>
        )}

        <FilteredProductGrid
          initialProducts={products}
          initialFilters={filters}
          locale={locale}
          category="mobile"
        />
      </div>
    </>
  );
}
