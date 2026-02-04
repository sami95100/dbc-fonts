/**
 * Transformers pour convertir les donnees API vers les types frontend.
 */

import type {
  PhoneModel,
  ModelPrices,
  ModelOptions,
  ModelImagesByColor,
  ModelImagesByCondition,
} from "@/types/product";
import type {
  Product,
  ProductColor,
  ProductCondition,
  ProductStorage,
  ProductSim,
} from "@/data/mock/products";

// ==================================
// Mapping couleurs API → hex codes
// ==================================

const COLOR_HEX_MAP: Record<string, string> = {
  // Noir/Black variants
  Black: "#1d1d1f",
  Noir: "#1d1d1f",
  "Titane noir": "#1d1d1f",
  "Gris sideral": "#1d1d1f",
  "Space Gray": "#1d1d1f",
  "Space Black": "#1d1d1f",
  Minuit: "#1d1d1f",

  // Blanc/White variants
  White: "#f5f5f7",
  Blanc: "#f5f5f7",
  "Titane blanc": "#f5f5f7",
  Silver: "#e3e4e5",
  Argent: "#e3e4e5",
  "Lumiere stellaire": "#f5f5f7",

  // Gold variants
  Gold: "#f5e6ce",
  Or: "#f5e6ce",
  "Titane naturel": "#4b4845",
  "Titane sable": "#d4c5b3",

  // Blue variants
  Blue: "#004c99",
  Bleu: "#004c99",
  "Pacific Blue": "#004c99",
  "Sierra Blue": "#8bb8e8",

  // Purple variants
  Purple: "#9d8bc4",
  Violet: "#9d8bc4",
  "Deep Purple": "#5c4d8e",

  // Pink/Rose variants
  Pink: "#f5d1d8",
  Rose: "#f5d1d8",

  // Green variants
  Green: "#a8c69f",
  Vert: "#a8c69f",
  "Alpine Green": "#3c4a3e",

  // Red variants
  Red: "#bf0013",
  Rouge: "#bf0013",
  "(PRODUCT)RED": "#bf0013",

  // Yellow variants
  Yellow: "#f5e050",
  Jaune: "#f5e050",

  // Other variants
  Coral: "#ff6b6b",
  Corail: "#ff6b6b",
};

function getColorHex(colorName: string): string {
  return COLOR_HEX_MAP[colorName] || "#999999";
}

// ==================================
// Conditions depuis prix API
// Toujours retourner les 4 grades, avec available=false si pas de prix
// ==================================

function buildConditions(prices: ModelPrices): ProductCondition[] {
  // Ordre: Imparfait (moins cher) -> Correct -> Tres bon -> Parfait (plus cher)
  const conditions: ProductCondition[] = [
    {
      id: "imparfait",
      name: "Acceptable",
      nameFr: "Imparfait",
      description: "Visible signs of wear",
      descriptionFr: "Signes d'usure visibles",
      price: prices.price_imparfait,
      available: prices.price_imparfait !== null && prices.price_imparfait !== undefined,
    },
    {
      id: "correct",
      name: "Good",
      nameFr: "Correct",
      description: "Light signs of wear",
      descriptionFr: "Legers signes d'usure",
      price: prices.price_correct,
      available: prices.price_correct !== null && prices.price_correct !== undefined,
    },
    {
      id: "tres-bon",
      name: "Very good",
      nameFr: "Tres bon",
      description: "Micro-scratches invisible during use",
      descriptionFr: "Micro-rayures invisibles",
      price: prices.price_tres_bon,
      available: prices.price_tres_bon !== null && prices.price_tres_bon !== undefined,
      isBestSeller: true,
    },
    {
      id: "parfait",
      name: "Excellent",
      nameFr: "Parfait",
      description: "Like new",
      descriptionFr: "Comme neuf",
      price: prices.price_parfait,
      available: prices.price_parfait !== null && prices.price_parfait !== undefined,
    },
  ];

  return conditions;
}

// ==================================
// Transformer principal
// ==================================

export interface TransformModelParams {
  model: PhoneModel;
  prices: ModelPrices;
  options: ModelOptions;
  images?: ModelImagesByColor;
}

/**
 * Transforme les donnees API en objet Product pour le frontend.
 */
export function apiModelToProduct(params: TransformModelParams): Product {
  const { model, prices, options, images } = params;

  // Construire les couleurs avec hex codes
  const colors: ProductColor[] = options.colors.map((c) => ({
    name: c.value,
    hex: getColorHex(c.value),
  }));

  // Construire les storages
  const storages: ProductStorage[] = options.storages.map((s) => ({
    value: s.value,
    available: s.available,
  }));

  // Construire les SIM avec descriptions
  const sims: ProductSim[] = options.sims.map((s) => ({
    value: s.value,
    available: s.available,
    description: s.value === "eSIM"
      ? "2 virtual SIM slots (no physical SIM slot)"
      : "SIM slots: 1 physical + 1 virtual",
    descriptionFr: s.value === "eSIM"
      ? "2 emplacements SIM virtuels (aucun emplacement SIM physique)"
      : "Emplacements SIM : 1 physique + 1 virtuel",
  }));

  // Construire les conditions depuis les prix
  const conditions = buildConditions(prices);

  // Trouver le prix minimum (filtre les prix null)
  const availablePrices = conditions
    .map((c) => c.price)
    .filter((p): p is number => p !== null && p > 0);
  const priceFrom =
    model.price_from ||
    (availablePrices.length > 0 ? Math.min(...availablePrices) : 0);

  // Prix neuf approximatif (BackMarket price ou estimation)
  const priceNew = model.backmarket_price || Math.round(priceFrom * 1.8);

  // Options de batterie
  const batteryStandardOption = options.batteries.find(
    (b) => b.value.toLowerCase().includes("standard")
  );
  const batteryNewOption = options.batteries.find(
    (b) => b.value.toLowerCase().includes("neuve") || b.value.toLowerCase().includes("new")
  );

  const batteryOptions = {
    standard: { price: batteryStandardOption?.price_delta || 0 },
    new: { price: batteryNewOption?.price_delta || 30 },
  };

  // Image primaire: priorite API (model.primary_image_url) > images param > undefined
  let primaryImageUrl: string | null | undefined = model.primary_image_url;

  // Fallback sur les images passees en parametre
  if (!primaryImageUrl && images && colors.length > 0) {
    const firstColorImages = images[colors[0].name];
    if (firstColorImages && firstColorImages.length > 0) {
      const primary = firstColorImages.find((img) => img.is_primary);
      primaryImageUrl = primary?.url || firstColorImages[0]?.url;
    }
  }

  // Mapper la categorie API vers le slug frontend
  const categoryMap: Record<string, string> = {
    mobile: "smartphones",
    tablet: "tablets",
    laptop: "laptops",
    wearable: "smartwatches",
    accessory: "audio",
  };
  const category = (model.category ? categoryMap[model.category] : undefined) || "smartphones";

  return {
    id: model.id,
    slug: model.slug,
    name: model.name,
    brand: model.brand,
    brandSlug: model.brand.toLowerCase(),
    category,
    priceFrom,
    priceNew,
    rating: 4.5, // Par defaut - a integrer plus tard
    reviewCount: Math.floor(Math.random() * 10000) + 1000, // Par defaut
    colors,
    storages,
    sims,
    conditions,
    batteryOptions,
    imageFolder: model.slug,
    inStock: conditions.length > 0,
    primaryImageUrl: primaryImageUrl || undefined,
    // Champs additionnels pour images dynamiques
    _images: images,
  } as Product & { _images?: ModelImagesByColor };
}

/**
 * Transforme une liste de modeles en Products simplifies (pour listing).
 * Ne charge pas les options/images - juste les infos de base.
 */
export function apiModelsToProductList(
  models: PhoneModel[]
): Partial<Product>[] {
  const categoryMap: Record<string, string> = {
    mobile: "smartphones",
    tablet: "tablets",
    laptop: "laptops",
    wearable: "smartwatches",
    accessory: "audio",
  };

  return models.map((model) => ({
    id: model.id,
    slug: model.slug,
    name: model.name,
    brand: model.brand,
    brandSlug: model.brand.toLowerCase(),
    category: (model.category ? categoryMap[model.category] : undefined) || "smartphones",
    priceFrom: model.price_from || model.price_imparfait || 0,
    priceNew: model.backmarket_price || 0,
    imageFolder: model.slug,
    inStock: true,
    primaryImageUrl: model.primary_image_url || undefined,
  }));
}

/**
 * Obtient l'URL de l'image primaire pour une couleur donnee.
 */
export function getPrimaryImageUrl(
  images: ModelImagesByColor | undefined,
  color: string
): string | null {
  if (!images) return null;

  const colorImages = images[color];
  if (!colorImages || colorImages.length === 0) return null;

  const primary = colorImages.find((img) => img.is_primary);
  return primary?.url || colorImages[0]?.url || null;
}

/**
 * Obtient toutes les URLs d'images pour une couleur donnee.
 * L'image principale est toujours en premier.
 */
export function getImageUrls(
  images: ModelImagesByColor | undefined,
  color: string
): string[] {
  if (!images) return [];

  const colorImages = images[color];
  if (!colorImages) return [];

  // Trier: image primaire en premier, puis par sort_order
  return [...colorImages]
    .sort((a, b) => {
      // Primaire en premier
      if (a.is_primary && !b.is_primary) return -1;
      if (!a.is_primary && b.is_primary) return 1;
      // Sinon par sort_order
      return a.sort_order - b.sort_order;
    })
    .map((img) => img.url);
}

/**
 * Obtient l'URL de l'image primaire pour une condition donnee.
 */
export function getConditionImageUrl(
  images: ModelImagesByCondition | undefined,
  condition: string
): string | null {
  if (!images) return null;

  const conditionImages = images[condition];
  if (!conditionImages || conditionImages.length === 0) return null;

  const primary = conditionImages.find((img) => img.is_primary);
  return primary?.url || conditionImages[0]?.url || null;
}

/**
 * Obtient toutes les URLs d'images pour une condition donnee.
 * L'image principale est toujours en premier.
 */
export function getConditionImageUrls(
  images: ModelImagesByCondition | undefined,
  condition: string
): string[] {
  if (!images) return [];

  const conditionImages = images[condition];
  if (!conditionImages) return [];

  // Trier: image primaire en premier, puis par sort_order
  return [...conditionImages]
    .sort((a, b) => {
      // Primaire en premier
      if (a.is_primary && !b.is_primary) return -1;
      if (!a.is_primary && b.is_primary) return 1;
      // Sinon par sort_order
      return a.sort_order - b.sort_order;
    })
    .map((img) => img.url);
}
