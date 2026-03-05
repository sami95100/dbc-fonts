export type BuybackCategory = "smartphone" | "tablet" | "macbook" | "console" | "smartwatch";

export interface BuybackCategoryConfig {
  key: BuybackCategory;
  icon: string;
  available: boolean;
}

export const BUYBACK_CATEGORIES: BuybackCategoryConfig[] = [
  { key: "smartphone", icon: "smartphone", available: true },
  { key: "tablet", icon: "tablet", available: false },
  { key: "macbook", icon: "laptop", available: false },
  { key: "console", icon: "gamepad-2", available: false },
  { key: "smartwatch", icon: "watch", available: false },
];

export type ScreenCondition = "perfect" | "light_scratches" | "deep_scratches" | "cracked";
export type BodyCondition = "perfect" | "light_wear" | "dents_scratches" | "cracked";

export interface FunctionalityChecklist {
  powers_on: boolean;
  touchscreen_works: boolean;
  buttons_work: boolean;
  cameras_work: boolean;
  sound_works: boolean;
  biometrics_works: boolean;
  battery_healthy: boolean;
}

export type BuybackStep =
  | "category"
  | "brand"
  | "model"
  | "storage"
  | "screen"
  | "body"
  | "checklist"
  | "offer"
  | "delivery-choice"
  | "store-select"
  | "appointment"
  | "bank-info"
  | "personal-info"
  | "shipping-method"
  | "confirmation";

export interface BuybackSelection {
  category: BuybackCategory | null;
  brand: string | null;
  model: BuybackModel | null;
  storage: string | null;
  screenCondition: ScreenCondition | null;
  bodyCondition: BodyCondition | null;
  checklist: FunctionalityChecklist | null;
}

export interface BuybackModel {
  id: string;
  name: string;
  brand: string;
  image_url: string | null;
}

export interface BuybackEstimate {
  id: string;
  model_name: string;
  brand: string;
  storage: string;
  price: number;
  image_url: string | null;
  depreciation_info: string | null;
}

export type DeliveryMethod = "postal" | "store";
export type ShippingOption = "kit" | "own_packaging";

export interface BuybackPersonalInfo {
  birthDate: string;
  address: string;
  addressComplement: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface BuybackBankInfo {
  iban: string;
}

export interface AppointmentSlot {
  date: string;
  time: string;
  storeKey: string;
}

export interface BuybackOrder {
  id: string;
  reference: string;
  status: "confirmed" | "shipping" | "delivered" | "paid";
  model_name: string;
  storage: string;
  price: number;
  image_url: string | null;
  created_at: string;
  shipping_deadline: string;
  delivery_method: DeliveryMethod;
  store_key?: string;
  appointment?: AppointmentSlot;
  screen_condition: string;
  body_condition: string;
  functionality: string;
}
