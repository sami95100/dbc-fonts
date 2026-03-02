import { getTranslations } from "next-intl/server";
import { Breadcrumb } from "@/components/products/Breadcrumb";
import { TrustBar } from "@/components/products/TrustBar";
import { FilteredProductGrid } from "@/components/products/FilteredProductGrid";
import { getModels } from "@/lib/api/products";
import { getFilters } from "@/lib/api/filters";
import { apiModelsToProductList } from "@/lib/api/transformers";
import { BRANDS } from "@/data/mock/brands";
import { getCategoryBySlug, getSubcategoryBySlug } from "@/data/mock/categories";
import { cn } from "@/lib/utils";

interface AudioBrandPageProps {
  params: Promise<{
    locale: string;
    brand: string;
  }>;
}

export default async function AudioBrandPage({ params }: AudioBrandPageProps) {
  const { locale, brand } = await params;
  const t = await getTranslations({ locale, namespace: "products" });
  const tCat = await getTranslations({ locale, namespace: "categories" });

  const category = getCategoryBySlug("audio");
  const subcategory = getSubcategoryBySlug("audio", brand);

  const brandData = BRANDS.find((b) => b.slug === brand);
  const brandName = brandData?.name || brand.charAt(0).toUpperCase() + brand.slice(1);

  const subcategoryName = subcategory?.name;
  const pageTitle = subcategoryName || brandName;

  const [modelsResponse, filtersResponse] = await Promise.all([
    getModels({ brand: brandName, category: "accessory", perPage: 50 }),
    getFilters({ brand: brandName }),
  ]);

  const products = modelsResponse.data?.items
    ? apiModelsToProductList(modelsResponse.data.items)
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
            { label: tCat("audio"), href: `/${locale}/products/audio` },
            { label: pageTitle },
          ]}
        />

        <div className="mb-6">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 md:text-4xl">
            {pageTitle} {t("refurbished")}
          </h1>
          <p className="text-gray-600">
            {t("discoverSelection", { name: pageTitle })}
          </p>
        </div>

        {category?.subcategories && (
          <div className="mb-8 flex flex-wrap gap-3">
            {category.subcategories.map((sub) => (
              <a
                key={sub.id}
                href={`/${locale}/products/audio/${sub.slug}`}
                className={cn("rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                  sub.slug === brand
                    ? "border-green-700 bg-green-700 text-white"
                    : "border-gray-200 bg-white text-gray-700 hover:border-green-700 hover:bg-green-700 hover:text-white"
                )}
              >
                {sub.name}
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
