export interface SubCategory {
  id: string;
  name: string;
  nameFr: string;
  slug: string;
  brands?: string[]; // Marques disponibles pour cette sous-catégorie
}

export interface Category {
  id: string;
  name: string;
  nameFr: string;
  slug: string;
  apiCategory: string; // Valeur pour l'API backend (mobile, tablet, laptop, etc.)
  icon?: string;
  subcategories?: SubCategory[];
}

export const CATEGORIES: Category[] = [
  {
    id: "1",
    name: "Smartphones",
    nameFr: "Smartphones",
    slug: "smartphones",
    apiCategory: "mobile",
    subcategories: [
      { id: "1-1", name: "iPhone", nameFr: "iPhone", slug: "apple", brands: ["Apple"] },
      { id: "1-2", name: "Samsung", nameFr: "Samsung", slug: "samsung", brands: ["Samsung"] },
      { id: "1-3", name: "Google Pixel", nameFr: "Google Pixel", slug: "google", brands: ["Google"] },
      { id: "1-4", name: "Xiaomi", nameFr: "Xiaomi", slug: "xiaomi", brands: ["Xiaomi"] },
      { id: "1-5", name: "OnePlus", nameFr: "OnePlus", slug: "oneplus", brands: ["OnePlus"] },
      { id: "1-6", name: "Huawei", nameFr: "Huawei", slug: "huawei", brands: ["Huawei"] },
      { id: "1-7", name: "Sony", nameFr: "Sony", slug: "sony", brands: ["Sony"] },
      { id: "1-8", name: "Oppo", nameFr: "Oppo", slug: "oppo", brands: ["Oppo"] },
    ],
  },
  {
    id: "2",
    name: "Tablets",
    nameFr: "Tablettes",
    slug: "tablets",
    apiCategory: "tablet",
    subcategories: [
      { id: "2-1", name: "iPad", nameFr: "iPad", slug: "apple", brands: ["Apple"] },
      { id: "2-2", name: "Samsung Galaxy Tab", nameFr: "Samsung Galaxy Tab", slug: "samsung", brands: ["Samsung"] },
      { id: "2-3", name: "Other tablets", nameFr: "Autres tablettes", slug: "other" },
    ],
  },
  {
    id: "3",
    name: "Laptops",
    nameFr: "Ordinateurs portables",
    slug: "laptops",
    apiCategory: "laptop",
    subcategories: [
      { id: "3-1", name: "MacBook", nameFr: "MacBook", slug: "apple", brands: ["Apple"] },
      { id: "3-2", name: "Windows laptops", nameFr: "PC portables", slug: "windows" },
    ],
  },
  {
    id: "4",
    name: "Smartwatches",
    nameFr: "Montres connectees",
    slug: "smartwatches",
    apiCategory: "wearable",
    subcategories: [
      { id: "4-1", name: "Apple Watch", nameFr: "Apple Watch", slug: "apple", brands: ["Apple"] },
      { id: "4-2", name: "Samsung Galaxy Watch", nameFr: "Samsung Galaxy Watch", slug: "samsung", brands: ["Samsung"] },
    ],
  },
  {
    id: "5",
    name: "Audio",
    nameFr: "Audio",
    slug: "audio",
    apiCategory: "accessory",
    subcategories: [
      { id: "5-1", name: "AirPods", nameFr: "AirPods", slug: "airpods", brands: ["Apple"] },
      { id: "5-2", name: "Headphones", nameFr: "Casques", slug: "headphones" },
      { id: "5-3", name: "Speakers", nameFr: "Enceintes", slug: "speakers" },
    ],
  },
];

export const TOP_NAV_LINKS = [
  { name: "Notre Pacte Qualite", nameFr: "Notre Pacte Qualite", href: "/quality" },
  { name: "Repair", nameFr: "Reparation", href: "/repair" },
  { name: "Stop fast tech", nameFr: "Stop fast tech", href: "/stop-fast-tech" },
  { name: "The Mag", nameFr: "Le Mag", href: "/mag" },
];

// Helpers
export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function getSubcategoryBySlug(
  categorySlug: string,
  subcategorySlug: string
): SubCategory | undefined {
  const category = getCategoryBySlug(categorySlug);
  return category?.subcategories?.find((s) => s.slug === subcategorySlug);
}

export function getCategoryByApiCategory(apiCategory: string): Category | undefined {
  return CATEGORIES.find((c) => c.apiCategory === apiCategory);
}
