import { Breadcrumb } from "@/components/products/Breadcrumb";
import { TrustBar } from "@/components/products/TrustBar";
import { FilteredProductGrid } from "@/components/products/FilteredProductGrid";
import { getModels, getModelOptions, getModelPrices } from "@/lib/api/products";
import { getFilters } from "@/lib/api/filters";
import { apiModelToProduct } from "@/lib/api/transformers";
import { getCategoryBySlug, getSubcategoryBySlug } from "@/data/mock/categories";
import { BRANDS } from "@/data/mock/brands";

interface TabletsBrandPageProps {
  params: Promise<{
    locale: string;
    brand: string;
  }>;
}

export default async function TabletsBrandPage({ params }: TabletsBrandPageProps) {
  const { locale, brand } = await params;

  const category = getCategoryBySlug("tablets");
  const subcategory = getSubcategoryBySlug("tablets", brand);

  // Trouver le nom de la marque
  const brandData = BRANDS.find((b) => b.slug === brand);
  const brandName = brandData?.name || brand.charAt(0).toUpperCase() + brand.slice(1);

  // Titre de la page
  const subcategoryName = locale === "fr" ? subcategory?.nameFr : subcategory?.name;
  const pageTitle = subcategoryName || `${brandName} tablets`;

  // Charger les modeles tablettes de cette marque
  const [modelsResponse, filtersResponse] = await Promise.all([
    getModels({ brand: brandName, category: "tablet", perPage: 50 }),
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
  };

  const filters = filtersResponse.data || defaultFilters;

  return (
    <>
      <TrustBar />

      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: locale === "fr" ? "Tablettes" : "Tablets", href: `/${locale}/products/tablets` },
            { label: pageTitle },
          ]}
        />

        {/* Title */}
        <div className="mb-6">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 md:text-4xl">
            {pageTitle} {locale === "fr" ? "reconditionnes" : "refurbished"}
          </h1>
          <p className="text-gray-600">
            {locale === "fr"
              ? `Decouvrez notre selection de ${pageTitle} reconditionnes`
              : `Discover our selection of refurbished ${pageTitle}`}
          </p>
        </div>

        {/* Autres sous-categories */}
        {category?.subcategories && (
          <div className="mb-8 flex flex-wrap gap-3">
            {category.subcategories.map((sub) => (
              <a
                key={sub.id}
                href={`/${locale}/products/tablets/${sub.slug}`}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  sub.slug === brand
                    ? "border-green-700 bg-green-700 text-white"
                    : "border-gray-200 bg-white text-gray-700 hover:border-green-700 hover:bg-green-700 hover:text-white"
                }`}
              >
                {locale === "fr" ? sub.nameFr : sub.name}
              </a>
            ))}
          </div>
        )}

        {/* Filtered Product Grid */}
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
