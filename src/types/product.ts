export type ProductCategory = 'mobile' | 'laptop' | 'tablet' | 'wearable' | 'accessory';

export interface PhoneModel {
  id: string;
  name: string;
  brand: string;
  slug: string;
  category?: ProductCategory;
  image_url?: string;
  default_color?: string | null;
  primary_image_url?: string | null;
  source_item_group_id?: string;
  source_dimension_group_id?: string;
  // Prix de vente par grade (API publique)
  price_parfait?: number | null;
  price_tres_bon?: number | null;
  price_correct?: number | null;
  price_imparfait?: number | null;
  backmarket_price?: number | null;
  price_from?: number | null;
  // Review stats (enriched by API)
  review_avg?: number;
  review_count?: number;
}

export interface ModelImage {
  id: string;
  url: string;
  is_primary: boolean;
  sort_order: number;
}

export interface ModelImagesByColor {
  [color: string]: ModelImage[];
}

export interface ModelImagesByCondition {
  [condition: string]: ModelImage[];
}

export interface PhoneVariant {
  id: string;
  model_id: string;
  source_id: string;
  sku: string;
  product_name: string;
  storage: string;
  color: string;
  sim_type: string;
  grade: string;
  grade_display: string[];
  price: number;
  quantity: number;
  is_brand_new_battery: boolean;
  needs_shop_processing: boolean;
  sell_priority: number | null;
  is_active: boolean;
  foxway_sku?: string;
}

export interface ModelOption {
  id: string;
  model_id: string;
  option_type: "storage" | "color" | "battery" | "sim";
  option_value: string;
  price_delta: number;
  sort_order: number;
  is_active: boolean;
}

export interface ModelPrices {
  price_parfait: number | null;
  price_tres_bon: number | null;
  price_correct: number | null;
  price_imparfait: number | null;
}

export interface ModelOptions {
  storages: Array<{ value: string; available: boolean }>;
  colors: Array<{ value: string; available: boolean }>;
  sims: Array<{ value: string; available: boolean }>;
  batteries: Array<{ value: string; price_delta: number }>;
}

export interface VariantSearchResult {
  variant: PhoneVariant | null;
  sku: string | null;
  price: number | null;
  quantity: number;
  sell_priority: number | null;
  battery_fallback: boolean;
  needs_shop_processing: boolean;
}

export type Grade = "Parfait" | "Tres bon" | "Correct" | "Imparfait";

export const GRADES: Grade[] = ["Parfait", "Tres bon", "Correct", "Imparfait"];

export const GRADE_KEYS: Record<Grade, keyof ModelPrices> = {
  Parfait: "price_parfait",
  "Tres bon": "price_tres_bon",
  Correct: "price_correct",
  Imparfait: "price_imparfait",
};
