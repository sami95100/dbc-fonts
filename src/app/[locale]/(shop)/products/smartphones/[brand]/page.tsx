import { getTranslations } from "next-intl/server";
import { Breadcrumb } from "@/components/products/Breadcrumb";
import { TrustBar } from "@/components/products/TrustBar";
import { FilteredProductGrid } from "@/components/products/FilteredProductGrid";
import { getModels, getModelOptions, getModelPrices } from "@/lib/api/products";
import { getFilters } from "@/lib/api/filters";
import { apiModelToProduct } from "@/lib/api/transformers";
import { BRANDS } from "@/data/mock/brands";
import { getCategoryBySlug, getSubcategoryBySlug } from "@/data/mock/categories";
import { cn } from "@/lib/utils";

interface SmartphonesBrandPageProps {
  params: Promise<{
    locale: string;
    brand: string;
  }>;
}

export default async function SmartphonesBrandPage({ params }: SmartphonesBrandPageProps) {
  const { locale, brand } = await params;
  const t = await getTranslations({ locale, namespace: "products" });
  const tCat = await getTranslations({ locale, namespace: "categories" });

  const category = getCategoryBySlug("smartphones");
  const subcategory = getSubcategoryBySlug("smartphones", brand);

  const brandData = BRANDS.find((b) => b.slug === brand);
  const brandName = brandData?.name || brand.charAt(0).toUpperCase() + brand.slice(1);

  const subcategoryName = subcategory ? tCat(`sub.smartphones.${subcategory.slug}`) : undefined;
  const pageTitle = subcategoryName || brandName;

  // Charger les smartphones de cette marque
  const [modelsResponse, filtersResponse] = await Promise.all([
    getModels({ brand: brandName, category: "mobile", perPage: 50 }),
    getFilters({ brand: brandName }),
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
            { label: tCat("smartphones"), href: `/${locale}/products/smartphones` },
            { label: pageTitle },
          ]}
        />

        <div className="mb-3 md:mb-6">
          <h1 className="mb-1 text-2xl font-bold text-gray-900 md:mb-2 md:text-4xl">
            {pageTitle} {t("refurbished")}
          </h1>
          <p className="hidden text-gray-600 md:block">
            {t("discoverSelection", { name: pageTitle })}
          </p>
        </div>

        {/* Autres marques */}
        {category?.subcategories && (
          <div className="mb-4 flex gap-2 overflow-x-auto scrollbar-hide md:mb-8 md:flex-wrap md:gap-3 md:overflow-visible">
            {category.subcategories.map((sub) => (
              <a
                key={sub.id}
                href={`/${locale}/products/smartphones/${sub.slug}`}
                className={cn("shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                  sub.slug === brand
                    ? "border-green-700 bg-green-700 text-white"
                    : "border-gray-200 bg-white text-gray-700 hover:border-green-700 hover:bg-green-700 hover:text-white"
                )}
              >
                {tCat(`sub.smartphones.${sub.slug}`)}
              </a>
            ))}
          </div>
        )}

        <FilteredProductGrid
          brand={brandName}
          initialProducts={products}
          initialFilters={filters}
          locale={locale}
        />
      </div>
    </>
  );
}
