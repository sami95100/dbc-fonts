export interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
}

export const BRANDS: Brand[] = [
  { id: "apple", name: "Apple", slug: "apple" },
  { id: "samsung", name: "Samsung", slug: "samsung" },
  { id: "google", name: "Google", slug: "google" },
  { id: "xiaomi", name: "Xiaomi", slug: "xiaomi" },
  { id: "oneplus", name: "OnePlus", slug: "oneplus" },
  { id: "huawei", name: "Huawei", slug: "huawei" },
  { id: "sony", name: "Sony", slug: "sony" },
  { id: "oppo", name: "Oppo", slug: "oppo" },
];
