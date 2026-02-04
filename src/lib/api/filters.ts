import { publicApi } from "./client";

/**
 * Types pour les filtres
 */
export interface FilterValues {
  price: {
    min: number | null;
    max: number | null;
  };
  brands: string[];
  years: number[];
  storages: string[];
}

/**
 * Recupere les valeurs disponibles pour les filtres
 */
export async function getFilters(params?: { brand?: string }) {
  const searchParams = new URLSearchParams();

  if (params?.brand) searchParams.set("brand", params.brand);

  const query = searchParams.toString();
  return publicApi.get<FilterValues>(`/filters${query ? `?${query}` : ""}`);
}
