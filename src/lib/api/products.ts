import { api, publicApi } from "./client";
import type {
  PhoneModel,
  PhoneVariant,
  ModelOption,
  ModelPrices,
  ModelOptions,
  ModelImage,
  ModelImagesByColor,
  ModelImagesByCondition,
  VariantSearchResult,
} from "@/types/product";

// ==================================
// Types pour les réponses API
// ==================================

interface ProductsResponse {
  items: PhoneVariant[];
  total: number;
  page: number;
  pages: number;
}

interface ModelsResponse {
  items: PhoneModel[];
  total: number;
  page: number;
  pages: number;
  per_page: number;
}

// ==================================
// API Admin (avec auth - pour le backoffice)
// ==================================

export async function getProducts(params?: {
  modelId?: string;
  sourceId?: string;
  inStock?: boolean;
  search?: string;
  page?: number;
  perPage?: number;
}) {
  const searchParams = new URLSearchParams();

  if (params?.modelId) searchParams.set("model_id", params.modelId);
  if (params?.sourceId) searchParams.set("source_id", params.sourceId);
  if (params?.inStock) searchParams.set("in_stock", "1");
  if (params?.search) searchParams.set("search", params.search);
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.perPage) searchParams.set("per_page", String(params.perPage));

  const query = searchParams.toString();
  return api.get<ProductsResponse>(`/products${query ? `?${query}` : ""}`);
}

// ==================================
// API Publique (sans auth - pour le e-commerce)
// ==================================

/**
 * Liste les modèles actifs pour le catalogue avec filtres
 */
export async function getModels(params?: {
  brand?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  year?: number;
  storage?: string;
  search?: string;
  page?: number;
  perPage?: number;
}) {
  const searchParams = new URLSearchParams();

  if (params?.brand) searchParams.set("brand", params.brand);
  if (params?.category) searchParams.set("category", params.category);
  if (params?.minPrice) searchParams.set("min_price", String(params.minPrice));
  if (params?.maxPrice) searchParams.set("max_price", String(params.maxPrice));
  if (params?.year) searchParams.set("year", String(params.year));
  if (params?.storage) searchParams.set("storage", params.storage);
  if (params?.search) searchParams.set("search", params.search);
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.perPage) searchParams.set("per_page", String(params.perPage));

  const query = searchParams.toString();
  return publicApi.get<ModelsResponse>(`/models${query ? `?${query}` : ""}`);
}

/**
 * Détail d'un modèle par ID
 */
export async function getModel(modelId: string) {
  return publicApi.get<PhoneModel>(`/models/${modelId}`);
}

/**
 * Détail d'un modèle par slug URL-friendly
 */
export async function getModelBySlug(slug: string) {
  return publicApi.get<PhoneModel>(`/models/by-slug/${slug}`);
}

/**
 * Options groupées d'un modèle (storages, colors, sims, batteries)
 */
export async function getModelOptions(modelId: string) {
  return publicApi.get<ModelOptions>(`/models/${modelId}/options`);
}

/**
 * Prix par grade d'un modèle
 */
export async function getModelPrices(modelId: string) {
  return publicApi.get<ModelPrices>(`/models/${modelId}/prices`);
}

/**
 * Images groupées par couleur d'un modèle
 */
export async function getModelImages(modelId: string, color?: string) {
  const query = color ? `?color=${encodeURIComponent(color)}` : "";
  return publicApi.get<ModelImagesByColor>(`/models/${modelId}/images${query}`);
}

/**
 * Images groupées par condition d'un modèle (Parfait, Tres bon, Correct, Imparfait)
 */
export async function getModelConditionImages(modelId: string, condition?: string) {
  const query = condition ? `?condition=${encodeURIComponent(condition)}` : "";
  return publicApi.get<ModelImagesByCondition>(`/models/${modelId}/condition-images${query}`);
}

/**
 * Recherche la meilleure variante disponible selon les critères
 */
export async function findVariant(
  modelId: string,
  config: {
    storage: string;
    color?: string;
    grade?: string;
    battery?: string;
    sim_type?: string;
  }
) {
  return publicApi.post<VariantSearchResult>(
    `/models/${modelId}/find-variant`,
    config
  );
}

/**
 * Récupère les méthodes de livraison disponibles selon le type de fulfillment
 */
export interface ShippingMethod {
  id: string;
  method: "home" | "uber" | "dpd" | "pickup";
  carrier_name: string | null;
  price: number;
  min_days: number;
  max_days: number;
  carrier_id: number;
  display_order: number;
}

export async function getShippingMethods(fulfillmentType: string) {
  return publicApi.get<ShippingMethod[]>(
    `/shipping-methods?fulfillment_type=${encodeURIComponent(fulfillmentType)}`
  );
}

/**
 * Devis Uber Direct pour une adresse de livraison
 */
export interface UberQuote {
  quote_id: string;
  fee: number;
  currency: string;
  duration_minutes: number;
  expires_at: string;
}

export async function getUberQuote(address: {
  address: string;
  postal_code: string;
  city: string;
  country: string;
}) {
  return publicApi.post<UberQuote>("/uber/quote", address);
}

/**
 * Type pour la réponse des options disponibles
 */
export interface AvailableOption {
  value: string;
  available: boolean;
  quantity: number;
}

export interface AvailableOptions {
  storages: AvailableOption[];
  colors: AvailableOption[];
  sims: AvailableOption[];
  batteries: AvailableOption[];
  grades: AvailableOption[];
}

/**
 * Récupère les options disponibles en stock selon la sélection actuelle.
 * Permet de savoir quelles options afficher comme "Déjà vendu".
 */
export async function getAvailableOptions(
  modelId: string,
  selection: {
    grade?: string;
    storage?: string;
    color?: string;
    sim_type?: string;
    battery?: string;
  }
) {
  const searchParams = new URLSearchParams();

  if (selection.grade) searchParams.set("grade", selection.grade);
  if (selection.storage) searchParams.set("storage", selection.storage);
  if (selection.color) searchParams.set("color", selection.color);
  if (selection.sim_type) searchParams.set("sim_type", selection.sim_type);
  if (selection.battery) searchParams.set("battery", selection.battery);

  const query = searchParams.toString();
  return publicApi.get<AvailableOptions>(
    `/models/${modelId}/available-options${query ? `?${query}` : ""}`
  );
}

// ==================================
// Helper: Ancienne fonction pour compatibilité
// ==================================

export async function getModelOptionsRaw(modelId: string) {
  return api.get<ModelOption[]>(`/models/${modelId}/options`);
}

export function groupOptionsByType(options: ModelOption[]) {
  const storages: Array<{ value: string; available: boolean }> = [];
  const colors: Array<{ value: string; available: boolean }> = [];
  const sims: Array<{ value: string; available: boolean }> = [];
  const batteries: Array<{ value: string; price_delta: number }> = [];

  for (const opt of options) {
    if (!opt.is_active) continue;

    switch (opt.option_type) {
      case "storage":
        storages.push({ value: opt.option_value, available: true });
        break;
      case "color":
        colors.push({ value: opt.option_value, available: true });
        break;
      case "sim":
        sims.push({ value: opt.option_value, available: true });
        break;
      case "battery":
        batteries.push({
          value: opt.option_value,
          price_delta: opt.price_delta,
        });
        break;
    }
  }

  // Sort storages by size
  const storageSortOrder = [
    "64GB",
    "128GB",
    "256GB",
    "512GB",
    "1TB",
    "2TB",
  ];
  storages.sort(
    (a, b) =>
      storageSortOrder.indexOf(a.value) - storageSortOrder.indexOf(b.value)
  );

  return { storages, colors, sims, batteries };
}

// ==================================
// API Admin - Gestion des images par condition
// ==================================

/**
 * Récupère toutes les images de condition pour un modèle (admin)
 */
export async function getAdminConditionImages(modelId: string) {
  return api.get<ModelImagesByCondition>(`/models/${modelId}/conditions/images`);
}

/**
 * Récupère les images d'une condition spécifique (admin)
 */
export async function getAdminConditionImagesByGrade(modelId: string, condition: string) {
  return api.get<ModelImage[]>(`/models/${modelId}/conditions/${encodeURIComponent(condition)}/images`);
}

/**
 * Upload une image pour une condition (admin)
 */
export async function uploadConditionImage(
  modelId: string,
  condition: string,
  imageData: {
    image: string; // Base64 encoded image
    filename: string;
    is_primary?: boolean;
  }
) {
  return api.post<ModelImage>(
    `/models/${modelId}/conditions/${encodeURIComponent(condition)}/images`,
    imageData
  );
}

/**
 * Supprime une image de condition (admin)
 */
export async function deleteConditionImage(
  modelId: string,
  condition: string,
  imageId: string
) {
  return api.delete<{ success: boolean }>(
    `/models/${modelId}/conditions/${encodeURIComponent(condition)}/images/${imageId}`
  );
}

/**
 * Définit une image comme principale pour une condition (admin)
 */
export async function setPrimaryConditionImage(
  modelId: string,
  condition: string,
  imageId: string
) {
  return api.post<{ success: boolean }>(
    `/models/${modelId}/conditions/${encodeURIComponent(condition)}/images/${imageId}/primary`,
    {}
  );
}

/**
 * Réordonne les images d'une condition (admin)
 */
export async function reorderConditionImages(
  modelId: string,
  condition: string,
  imageIds: string[]
) {
  return api.post<{ success: boolean }>(
    `/models/${modelId}/conditions/${encodeURIComponent(condition)}/images/reorder`,
    { image_ids: imageIds }
  );
}

// ==================================
// API Publique - Images de catégories
// ==================================

export interface CategoryImage {
  id: string;
  url: string;
  type: 'battery' | 'storage' | 'condition' | 'color' | 'sim' | 'banner';
  alt_text?: string;
}

export type CategoryImagesByCategory = Record<string, CategoryImage[]>;

/**
 * Récupère les images d'une catégorie spécifique
 */
export async function getCategoryImages(category: string, type?: string) {
  const query = type ? `?type=${encodeURIComponent(type)}` : "";
  return publicApi.get<CategoryImage[]>(`/categories/${category}/images${query}`);
}

/**
 * Récupère toutes les images de toutes les catégories
 */
export async function getAllCategoryImages() {
  return publicApi.get<CategoryImagesByCategory>(`/categories/images`);
}

// ==================================
// Reviews
// ==================================

export interface ReviewData {
  id: number;
  author_name: string;
  rating: number;
  title: string | null;
  content: string | null;
  source_date: string | null;
  image_url: string | null;
  verified_purchase: boolean;
}

export interface ReviewStats {
  average: number;
  total: number;
  distribution: Record<number, number>;
}

export interface ReviewsResponse {
  reviews: ReviewData[];
  stats: ReviewStats;
  page: number;
  pages: number;
  per_page: number;
}

export async function getModelReviews(modelId: string, page: number = 1, perPage: number = 5) {
  return publicApi.get<ReviewsResponse>(`/models/${modelId}/reviews?page=${page}&per_page=${perPage}`);
}
