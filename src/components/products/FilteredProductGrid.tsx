"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ProductGrid } from "./ProductGrid";
import { FilterBarWrapper } from "@/components/filters";
import { getModels, getModelOptions, getModelPrices } from "@/lib/api/products";
import { getFilters, type FilterValues } from "@/lib/api/filters";
import { apiModelToProduct } from "@/lib/api/transformers";
import type { Product } from "@/data/mock/products";

interface FilteredProductGridProps {
  brand?: string;
  initialProducts: Product[];
  initialFilters: FilterValues;
  locale: string;
}

function FilteredProductGridInner({
  brand,
  initialProducts,
  initialFilters,
  locale,
}: FilteredProductGridProps) {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [filters] = useState<FilterValues>(initialFilters);
  const [loading, setLoading] = useState(false);

  // Extraire les filtres de l'URL
  const minPrice = searchParams.get("min_price");
  const maxPrice = searchParams.get("max_price");
  const years = searchParams.getAll("year");
  const storages = searchParams.getAll("storage");

  // Recharger les produits quand les filtres changent
  useEffect(() => {
    const hasFilters = minPrice || maxPrice || years.length > 0 || storages.length > 0;

    if (!hasFilters) {
      setProducts(initialProducts);
      return;
    }

    async function fetchFilteredProducts() {
      setLoading(true);
      try {
        const response = await getModels({
          brand,
          minPrice: minPrice ? parseInt(minPrice, 10) : undefined,
          maxPrice: maxPrice ? parseInt(maxPrice, 10) : undefined,
          year: years.length > 0 ? parseInt(years[0], 10) : undefined,
          storage: storages.length > 0 ? storages[0] : undefined,
          perPage: 50,
        });

        if (response.data && response.data.items.length > 0) {
          const transformedProducts = await Promise.all(
            response.data.items.map(async (model) => {
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

          setProducts(validProducts);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error("Error fetching filtered products:", error);
        setProducts(initialProducts);
      } finally {
        setLoading(false);
      }
    }

    fetchFilteredProducts();
  }, [brand, minPrice, maxPrice, years.join(","), storages.join(","), initialProducts]);

  return (
    <>
      {/* Filters */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <FilterBarWrapper availableFilters={filters} />
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {products.length} {locale === "fr" ? "produit(s) trouve(s)" : "product(s) found"}
          </span>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-80 animate-pulse rounded-lg bg-gray-100"
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-gray-500">
            {locale === "fr"
              ? "Aucun produit ne correspond a vos criteres"
              : "No products match your criteria"}
          </p>
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </>
  );
}

export function FilteredProductGrid(props: FilteredProductGridProps) {
  return (
    <Suspense
      fallback={
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-80 animate-pulse rounded-lg bg-gray-100"
            />
          ))}
        </div>
      }
    >
      <FilteredProductGridInner {...props} />
    </Suspense>
  );
}
