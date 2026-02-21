/**
 * Types for Product Configurator
 * Shared types used across all configurator components
 */

import type { ModelImagesByColor, ModelImagesByCondition } from "@/types/product";
import type { AvailableOption } from "@/lib/api/products";
import type {
  Product,
  ProductCondition,
  ProductStorage,
  ProductColor,
  ProductSim,
} from "@/data/mock/products";

// Re-export for convenience
export type { ProductCondition, ProductStorage, ProductColor, ProductSim };

// Mapping grade ID (stored in cart) -> API name (expected by backend)
export const GRADE_ID_TO_API: Record<string, string> = {
  parfait: "Parfait",
  "tres-bon": "Tres bon",
  correct: "Correct",
  imparfait: "Imparfait",
};

// Reverse mapping: API name -> grade ID (for converting backend responses to frontend IDs)
export const API_TO_GRADE_ID: Record<string, string> = Object.fromEntries(
  Object.entries(GRADE_ID_TO_API).map(([id, api]) => [api, id])
);

// ============================================
// Product Types
// ============================================

export interface BatteryOptions {
  standard: { price: number };
  new: { price: number };
}

/**
 * ConfigurableProduct extends Product with API-specific fields
 * This ensures compatibility with getProductImage and other helpers
 */
export interface ConfigurableProduct extends Product {
  // Extended fields from API
  _primaryImageUrl?: string;
  _images?: ModelImagesByColor;
}

// ============================================
// Selection State
// ============================================

export type BatteryType = "standard" | "new";

export interface ProductSelection {
  condition: string;
  storage: string;
  color: string;
  battery: BatteryType;
  sim: string;
}

// ============================================
// Variant Info (from API)
// ============================================

export interface VariantInfo {
  sku: string | null;
  foxwaySku: string | null;
  price: number | null;
  quantity: number;
  batteryFallback: boolean;
  needsShopProcessing: boolean;
  /** True if the variant in stock already has a new battery installed */
  hasNewBattery: boolean;
  /** Fulfillment type: foxway_direct, foxway_shop, or shop_stock */
  fulfillmentType: string | null;
}

// ============================================
// Cart Confirmation
// ============================================

export interface CartConfirmationItem {
  productName: string;
  imageUrl: string;
  price: number;
  storage: string;
  color: string;
}

// ============================================
// Component Props
// ============================================

export interface RadioOptionProps {
  selected: boolean;
  onClick: () => void;
  label: string;
  sublabel?: string;
  price?: string;
  badge?: string;
  disabled?: boolean;
  soldOut?: boolean;
  soldOutLabel?: string;
}

export interface ImageBadge {
  icon: "scratches" | "verified" | "battery" | "screen" | "coque";
  label: string;
}

export interface ConfigSectionProps {
  title: string;
  description?: string;
  imageUrl?: string;
  imageUrls?: string[]; // Multiple images support
  imageAlt?: string;
  /** Optional label displayed on image (e.g., "Coque", "Ecran") */
  imageLabel?: string;
  /** Badges to display on the image (like BackMarket's condition badges) */
  imageBadges?: ImageBadge[];
  /** Show "Image d'illustration" label */
  showIllustrationLabel?: boolean;
  children: React.ReactNode;
}

export interface ImageGalleryProps {
  images: string[];
  productName: string;
  fallbackImage: string;
}

export interface ColorSelectorProps {
  colors: ProductColor[];
  selectedColor: string;
  onColorChange: (color: string) => void;
  label?: string;
  /** Available color options from stock check */
  availableColors?: AvailableOption[];
}

export interface TrustBadgeItem {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
}

export interface TrustBadgesProps {
  items: TrustBadgeItem[];
}

export interface StickyBottomBarProps {
  price: number;
  isOutOfStock: boolean;
  isLoading: boolean;
  onAddToCart: () => void;
  ctaLabel: string;
  outOfStockLabel: string;
}

// ============================================
// Section Props (for reusable sections)
// ============================================

export interface ConditionSectionProps {
  conditions: ProductCondition[];
  selectedCondition: string;
  onConditionChange: (conditionId: string) => void;
  conditionImages?: ModelImagesByCondition;
  /** Fallback image URL from category images (condition slot) - used when no model-specific images */
  fallbackImageUrl?: string;
  /** Available grade options from stock check (to show soldOut state) */
  availableConditions?: AvailableOption[];
}

export interface BatterySectionProps {
  selectedBattery: BatteryType;
  onBatteryChange: (battery: BatteryType) => void;
  standardPrice: number;
  newBatteryPrice: number;
  /** Available battery options from stock check */
  availableBatteries?: AvailableOption[];
  /** Image URL from category images (battery slot) */
  imageUrl?: string;
}

export interface StorageSectionProps {
  storages: ProductStorage[];
  selectedStorage: string;
  onStorageChange: (storage: string) => void;
  /** Image URL from category images (storage slot) */
  imageUrl?: string;
  /** Available storage options from stock check */
  availableStorages?: AvailableOption[];
}

export interface SimSectionProps {
  sims: ProductSim[];
  selectedSim: string;
  onSimChange: (sim: string) => void;
  /** Image URL from category images (sim slot) */
  imageUrl?: string;
  /** Available options from stock check (to show soldOut state) */
  availableSims?: AvailableOption[];
}

export interface HeroSectionProps {
  product: ConfigurableProduct;
  selection: ProductSelection;
  variantInfo: VariantInfo | null;
  isLoading: boolean;
  images: string[];
  onColorChange: (color: string) => void;
  onAddToCart: () => void;
}
