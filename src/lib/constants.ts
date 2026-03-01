export const COUNTRY_CODES = ["FR", "BE", "CH", "LU"] as const;

export type CountryCode = (typeof COUNTRY_CODES)[number];

// --- Delivery ---

export type DeliveryMethod = "home" | "uber" | "stuart" | "dpd" | "pickup";

export type FulfillmentType = "foxway_direct" | "foxway_shop" | "shop_stock";

export const STORE_ADDRESS = {
  name: "DBC 17",
  address: "110 Av. de Villiers",
  postalCode: "75017",
  city: "Paris",
  country: "FR",
} as const;
