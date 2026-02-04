import Link from "next/link";
import { TrustBar } from "@/components/products/TrustBar";
import { CATEGORIES } from "@/data/mock/categories";

interface ProductsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ProductsPage({ params }: ProductsPageProps) {
  const { locale } = await params;

  return (
    <>
      <TrustBar />

      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900 md:text-4xl">
            {locale === "fr" ? "Nos produits reconditionnes" : "Our refurbished products"}
          </h1>
          <p className="text-gray-600">
            {locale === "fr"
              ? "Choisissez une categorie pour decouvrir nos produits"
              : "Choose a category to discover our products"}
          </p>
        </div>

        {/* Categories grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={`/${locale}/products/${category.slug}`}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 transition-all hover:border-gray-300 hover:shadow-lg"
            >
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-900 group-hover:text-gray-700">
                  {locale === "fr" ? category.nameFr : category.name}
                </h2>
              </div>

              {/* Subcategories */}
              {category.subcategories && category.subcategories.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {category.subcategories.slice(0, 4).map((sub) => (
                    <span
                      key={sub.id}
                      className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600"
                    >
                      {locale === "fr" ? sub.nameFr : sub.name}
                    </span>
                  ))}
                  {category.subcategories.length > 4 && (
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-600">
                      +{category.subcategories.length - 4}
                    </span>
                  )}
                </div>
              )}

              {/* Arrow */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition-transform group-hover:translate-x-1">
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
