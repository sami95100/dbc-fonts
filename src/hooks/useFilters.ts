"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useMemo } from "react";
import type { ActiveFilters } from "@/components/filters";

/**
 * Hook pour gerer les filtres via les URL search params.
 * Permet de partager les filtres via l'URL et maintient le SEO.
 */
export function useFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Lire les filtres depuis l'URL
  const filters: ActiveFilters = useMemo(() => {
    const minPrice = searchParams.get("min_price");
    const maxPrice = searchParams.get("max_price");
    const years = searchParams.getAll("year");
    const storages = searchParams.getAll("storage");

    return {
      minPrice: minPrice ? parseInt(minPrice, 10) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice, 10) : undefined,
      years: years.map((y) => parseInt(y, 10)),
      storages,
    };
  }, [searchParams]);

  // Mettre a jour les filtres dans l'URL
  const setFilters = useCallback(
    (newFilters: ActiveFilters) => {
      const params = new URLSearchParams();

      if (newFilters.minPrice !== undefined) {
        params.set("min_price", String(newFilters.minPrice));
      }
      if (newFilters.maxPrice !== undefined) {
        params.set("max_price", String(newFilters.maxPrice));
      }
      newFilters.years.forEach((year) => {
        params.append("year", String(year));
      });
      newFilters.storages.forEach((storage) => {
        params.append("storage", storage);
      });

      const query = params.toString();
      router.push(`${pathname}${query ? `?${query}` : ""}`, { scroll: false });
    },
    [router, pathname]
  );

  // Effacer tous les filtres
  const clearFilters = useCallback(() => {
    router.push(pathname, { scroll: false });
  }, [router, pathname]);

  // Verifier si des filtres sont actifs
  const hasFilters = useMemo(() => {
    return (
      filters.minPrice !== undefined ||
      filters.maxPrice !== undefined ||
      filters.years.length > 0 ||
      filters.storages.length > 0
    );
  }, [filters]);

  return {
    filters,
    setFilters,
    clearFilters,
    hasFilters,
  };
}
