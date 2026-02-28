import { publicApi } from "./client";

// ============================================
// Types
// ============================================

export interface TradeInModel {
  id: string;
  name: string;
  brand: string;
  primary_image_url: string | null;
}

export interface TradeInAnswers {
  screen: "perfect" | "minor_scratches" | "cracked";
  chassis: "perfect" | "minor_wear" | "dents";
  battery: "above_85" | "80_to_85" | "below_80";
  functionality: "all_works" | "minor_issues";
}

export interface TradeInEstimate {
  model_name: string;
  brand: string;
  storage: string;
  condition_grade: "bon_etat" | "correct" | "casse";
  price: number;
  image_url: string | null;
}

// ============================================
// API Functions
// ============================================

/**
 * Liste les marques avec des modeles de reprise actifs
 */
export async function getTradeInBrands() {
  return publicApi.get<string[]>("/trade-in/brands");
}

/**
 * Liste les modeles de reprise pour une marque
 */
export async function getTradeInModels(brand: string) {
  return publicApi.get<TradeInModel[]>(
    `/trade-in/models?brand=${encodeURIComponent(brand)}`
  );
}

/**
 * Stockages disponibles pour la reprise d'un modele
 */
export async function getTradeInStorages(modelId: string) {
  return publicApi.get<string[]>(`/trade-in/models/${modelId}/storages`);
}

/**
 * Calcule l'estimation de reprise
 */
export async function getTradeInEstimate(params: {
  model_id: string;
  storage: string;
  answers: TradeInAnswers;
}) {
  return publicApi.post<TradeInEstimate>("/trade-in/estimate", params);
}
