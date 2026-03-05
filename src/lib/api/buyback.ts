import { publicApi } from "./client";
import { getLocalImageBySlug } from "@/data/local-product-images";
import type {
  BuybackModel,
  BuybackEstimate,
  ScreenCondition,
  BodyCondition,
  FunctionalityChecklist,
  BuybackPersonalInfo,
  BuybackBankInfo,
  ShippingOption,
  AppointmentSlot,
  BuybackOrder,
} from "@/types/buyback";

// Mock data for MVP - will be replaced by real API calls

const MOCK_BRANDS: Record<string, string[]> = {
  smartphone: ["Apple", "Samsung", "Huawei", "Xiaomi", "Google", "OnePlus"],
};

function makeModel(id: string, name: string, brand: string): BuybackModel {
  const image_url = getLocalImageBySlug(id) ?? null;
  return { id, name, brand, image_url };
}

const MOCK_MODELS: Record<string, BuybackModel[]> = {
  Apple: [
    makeModel("iphone-16-pro-max", "iPhone 16 Pro Max", "Apple"),
    makeModel("iphone-16-pro", "iPhone 16 Pro", "Apple"),
    makeModel("iphone-16", "iPhone 16", "Apple"),
    makeModel("iphone-16e", "iPhone 16e", "Apple"),
    makeModel("iphone-15-pro-max", "iPhone 15 Pro Max", "Apple"),
    makeModel("iphone-15-pro", "iPhone 15 Pro", "Apple"),
    makeModel("iphone-15-plus", "iPhone 15 Plus", "Apple"),
    makeModel("iphone-15", "iPhone 15", "Apple"),
    makeModel("iphone-14-pro-max", "iPhone 14 Pro Max", "Apple"),
    makeModel("iphone-14-pro", "iPhone 14 Pro", "Apple"),
    makeModel("iphone-14-plus", "iPhone 14 Plus", "Apple"),
    makeModel("iphone-14", "iPhone 14", "Apple"),
    makeModel("iphone-13-pro-max", "iPhone 13 Pro Max", "Apple"),
    makeModel("iphone-13-pro", "iPhone 13 Pro", "Apple"),
    makeModel("iphone-13-mini", "iPhone 13 Mini", "Apple"),
    makeModel("iphone-13", "iPhone 13", "Apple"),
    makeModel("iphone-12-pro-max", "iPhone 12 Pro Max", "Apple"),
    makeModel("iphone-12-pro", "iPhone 12 Pro", "Apple"),
    makeModel("iphone-12-mini", "iPhone 12 Mini", "Apple"),
    makeModel("iphone-12", "iPhone 12", "Apple"),
    makeModel("iphone-11-pro-max", "iPhone 11 Pro Max", "Apple"),
    makeModel("iphone-11-pro", "iPhone 11 Pro", "Apple"),
    makeModel("iphone-11", "iPhone 11", "Apple"),
    makeModel("iphone-se-2022", "iPhone SE (2022)", "Apple"),
    makeModel("iphone-se-2020", "iPhone SE (2020)", "Apple"),
    makeModel("iphone-xr", "iPhone XR", "Apple"),
    makeModel("iphone-xs-max", "iPhone XS Max", "Apple"),
    makeModel("iphone-xs", "iPhone XS", "Apple"),
    makeModel("iphone-x", "iPhone X", "Apple"),
  ],
  Samsung: [
    makeModel("galaxy-s24-ultra", "Galaxy S24 Ultra", "Samsung"),
    makeModel("galaxy-s24-plus", "Galaxy S24+", "Samsung"),
    makeModel("galaxy-s24", "Galaxy S24", "Samsung"),
    makeModel("galaxy-s23-ultra", "Galaxy S23 Ultra", "Samsung"),
    makeModel("galaxy-s23-plus", "Galaxy S23+", "Samsung"),
    makeModel("galaxy-s23", "Galaxy S23", "Samsung"),
    makeModel("galaxy-s22-ultra", "Galaxy S22 Ultra", "Samsung"),
    makeModel("galaxy-s22-plus", "Galaxy S22+", "Samsung"),
    makeModel("galaxy-s22", "Galaxy S22", "Samsung"),
    makeModel("galaxy-s21-ultra", "Galaxy S21 Ultra", "Samsung"),
    makeModel("galaxy-s21", "Galaxy S21", "Samsung"),
    makeModel("galaxy-z-flip-5", "Galaxy Z Flip 5", "Samsung"),
    makeModel("galaxy-z-fold-5", "Galaxy Z Fold 5", "Samsung"),
    makeModel("galaxy-a54", "Galaxy A54", "Samsung"),
    makeModel("galaxy-a53", "Galaxy A53", "Samsung"),
    makeModel("galaxy-a34", "Galaxy A34", "Samsung"),
    makeModel("galaxy-a15", "Galaxy A15", "Samsung"),
    makeModel("galaxy-a14", "Galaxy A14", "Samsung"),
    makeModel("galaxy-a13", "Galaxy A13", "Samsung"),
    makeModel("galaxy-a12", "Galaxy A12", "Samsung"),
    makeModel("galaxy-a05s", "Galaxy A05s", "Samsung"),
    makeModel("galaxy-a05", "Galaxy A05", "Samsung"),
    makeModel("galaxy-a04s", "Galaxy A04s", "Samsung"),
    makeModel("galaxy-a03s", "Galaxy A03s", "Samsung"),
  ],
  Google: [
    makeModel("google-pixel-9-pro", "Pixel 9 Pro", "Google"),
    makeModel("google-pixel-9", "Pixel 9", "Google"),
    makeModel("google-pixel-8-pro", "Pixel 8 Pro", "Google"),
    makeModel("google-pixel-8", "Pixel 8", "Google"),
    makeModel("google-pixel-8a", "Pixel 8a", "Google"),
    makeModel("google-pixel-7-pro", "Pixel 7 Pro", "Google"),
    makeModel("google-pixel-7", "Pixel 7", "Google"),
    makeModel("google-pixel-7a", "Pixel 7a", "Google"),
    makeModel("google-pixel-6-pro", "Pixel 6 Pro", "Google"),
    makeModel("google-pixel-6", "Pixel 6", "Google"),
  ],
  Huawei: [
    makeModel("huawei-p60-pro", "P60 Pro", "Huawei"),
    makeModel("huawei-p40-pro", "P40 Pro", "Huawei"),
    makeModel("huawei-p30-pro", "P30 Pro", "Huawei"),
    makeModel("huawei-p30-lite", "P30 Lite", "Huawei"),
    makeModel("huawei-mate-20-pro", "Mate 20 Pro", "Huawei"),
  ],
  Xiaomi: [
    makeModel("xiaomi-14-ultra", "Xiaomi 14 Ultra", "Xiaomi"),
    makeModel("xiaomi-14", "Xiaomi 14", "Xiaomi"),
    makeModel("xiaomi-13t-pro", "Xiaomi 13T Pro", "Xiaomi"),
    makeModel("xiaomi-13t", "Xiaomi 13T", "Xiaomi"),
    makeModel("xiaomi-12t-pro", "Xiaomi 12T Pro", "Xiaomi"),
    makeModel("xiaomi-12t", "Xiaomi 12T", "Xiaomi"),
    makeModel("redmi-note-13-pro", "Redmi Note 13 Pro", "Xiaomi"),
    makeModel("redmi-note-12-pro", "Redmi Note 12 Pro", "Xiaomi"),
  ],
  OnePlus: [
    makeModel("oneplus-12", "OnePlus 12", "OnePlus"),
    makeModel("oneplus-11", "OnePlus 11", "OnePlus"),
    makeModel("oneplus-10-pro", "OnePlus 10 Pro", "OnePlus"),
    makeModel("oneplus-nord-3", "OnePlus Nord 3", "OnePlus"),
  ],
};

// Correct storages per model
const MOCK_STORAGES: Record<string, string[]> = {
  // iPhone 16 series
  "iphone-16-pro-max": ["256 Go", "512 Go", "1 To"],
  "iphone-16-pro": ["128 Go", "256 Go", "512 Go", "1 To"],
  "iphone-16": ["128 Go", "256 Go", "512 Go"],
  "iphone-16e": ["128 Go", "256 Go", "512 Go"],
  // iPhone 15 series
  "iphone-15-pro-max": ["256 Go", "512 Go", "1 To"],
  "iphone-15-pro": ["128 Go", "256 Go", "512 Go", "1 To"],
  "iphone-15-plus": ["128 Go", "256 Go", "512 Go"],
  "iphone-15": ["128 Go", "256 Go", "512 Go"],
  // iPhone 14 series
  "iphone-14-pro-max": ["128 Go", "256 Go", "512 Go", "1 To"],
  "iphone-14-pro": ["128 Go", "256 Go", "512 Go", "1 To"],
  "iphone-14-plus": ["128 Go", "256 Go", "512 Go"],
  "iphone-14": ["128 Go", "256 Go", "512 Go"],
  // iPhone 13 series
  "iphone-13-pro-max": ["128 Go", "256 Go", "512 Go", "1 To"],
  "iphone-13-pro": ["128 Go", "256 Go", "512 Go", "1 To"],
  "iphone-13-mini": ["128 Go", "256 Go", "512 Go"],
  "iphone-13": ["128 Go", "256 Go", "512 Go"],
  // iPhone 12 series
  "iphone-12-pro-max": ["128 Go", "256 Go", "512 Go"],
  "iphone-12-pro": ["128 Go", "256 Go", "512 Go"],
  "iphone-12-mini": ["64 Go", "128 Go", "256 Go"],
  "iphone-12": ["64 Go", "128 Go", "256 Go"],
  // iPhone 11 series
  "iphone-11-pro-max": ["64 Go", "256 Go", "512 Go"],
  "iphone-11-pro": ["64 Go", "256 Go", "512 Go"],
  "iphone-11": ["64 Go", "128 Go", "256 Go"],
  // iPhone SE / older
  "iphone-se-2022": ["64 Go", "128 Go", "256 Go"],
  "iphone-se-2020": ["64 Go", "128 Go", "256 Go"],
  "iphone-xr": ["64 Go", "128 Go", "256 Go"],
  "iphone-xs-max": ["64 Go", "256 Go", "512 Go"],
  "iphone-xs": ["64 Go", "256 Go", "512 Go"],
  "iphone-x": ["64 Go", "256 Go"],
  // Samsung Galaxy S series
  "galaxy-s24-ultra": ["256 Go", "512 Go", "1 To"],
  "galaxy-s24-plus": ["256 Go", "512 Go"],
  "galaxy-s24": ["128 Go", "256 Go"],
  "galaxy-s23-ultra": ["256 Go", "512 Go", "1 To"],
  "galaxy-s23-plus": ["256 Go", "512 Go"],
  "galaxy-s23": ["128 Go", "256 Go"],
  "galaxy-s22-ultra": ["128 Go", "256 Go", "512 Go"],
  "galaxy-s22-plus": ["128 Go", "256 Go"],
  "galaxy-s22": ["128 Go", "256 Go"],
  "galaxy-s21-ultra": ["128 Go", "256 Go", "512 Go"],
  "galaxy-s21": ["128 Go", "256 Go"],
  "galaxy-z-flip-5": ["256 Go", "512 Go"],
  "galaxy-z-fold-5": ["256 Go", "512 Go", "1 To"],
  "galaxy-a54": ["128 Go", "256 Go"],
  "galaxy-a53": ["128 Go", "256 Go"],
  "galaxy-a34": ["128 Go", "256 Go"],
  // Samsung Galaxy A (entry)
  "galaxy-a15": ["128 Go"],
  "galaxy-a14": ["64 Go", "128 Go"],
  "galaxy-a13": ["32 Go", "64 Go", "128 Go"],
  "galaxy-a12": ["32 Go", "64 Go", "128 Go"],
  "galaxy-a05s": ["64 Go", "128 Go"],
  "galaxy-a05": ["64 Go", "128 Go"],
  "galaxy-a04s": ["32 Go", "64 Go"],
  "galaxy-a03s": ["32 Go", "64 Go"],
  // Google Pixel
  "google-pixel-9-pro": ["128 Go", "256 Go", "512 Go", "1 To"],
  "google-pixel-9": ["128 Go", "256 Go"],
  "google-pixel-8-pro": ["128 Go", "256 Go", "512 Go", "1 To"],
  "google-pixel-8": ["128 Go", "256 Go"],
  "google-pixel-8a": ["128 Go", "256 Go"],
  "google-pixel-7-pro": ["128 Go", "256 Go"],
  "google-pixel-7": ["128 Go", "256 Go"],
  "google-pixel-7a": ["128 Go"],
  "google-pixel-6-pro": ["128 Go", "256 Go"],
  "google-pixel-6": ["128 Go", "256 Go"],
  // Huawei
  "huawei-p60-pro": ["256 Go", "512 Go"],
  "huawei-p40-pro": ["128 Go", "256 Go"],
  "huawei-p30-pro": ["128 Go", "256 Go"],
  "huawei-p30-lite": ["128 Go"],
  "huawei-mate-20-pro": ["128 Go"],
  // Xiaomi
  "xiaomi-14-ultra": ["256 Go", "512 Go"],
  "xiaomi-14": ["256 Go", "512 Go"],
  "xiaomi-13t-pro": ["256 Go", "512 Go"],
  "xiaomi-13t": ["128 Go", "256 Go"],
  "xiaomi-12t-pro": ["128 Go", "256 Go"],
  "xiaomi-12t": ["128 Go", "256 Go"],
  "redmi-note-13-pro": ["128 Go", "256 Go"],
  "redmi-note-12-pro": ["128 Go", "256 Go"],
  // OnePlus
  "oneplus-12": ["256 Go", "512 Go"],
  "oneplus-11": ["128 Go", "256 Go"],
  "oneplus-10-pro": ["128 Go", "256 Go"],
  "oneplus-nord-3": ["128 Go", "256 Go"],
};

function calculateMockPrice(
  modelId: string,
  storage: string,
  screen: ScreenCondition,
  body: BodyCondition,
  checklist: FunctionalityChecklist
): number {
  const basePrices: Record<string, number> = {
    "iphone-16-pro-max": 750, "iphone-16-pro": 650, "iphone-16": 500, "iphone-16e": 380,
    "iphone-15-pro-max": 600, "iphone-15-pro": 500, "iphone-15-plus": 420, "iphone-15": 400,
    "iphone-14-pro-max": 480, "iphone-14-pro": 400, "iphone-14-plus": 340, "iphone-14": 320,
    "iphone-13-pro-max": 380, "iphone-13-pro": 330, "iphone-13-mini": 230, "iphone-13": 250,
    "iphone-12-pro-max": 280, "iphone-12-pro": 240, "iphone-12-mini": 150, "iphone-12": 180,
    "iphone-11-pro-max": 200, "iphone-11-pro": 170, "iphone-11": 120,
    "iphone-se-2022": 120, "iphone-se-2020": 80, "iphone-xr": 100, "iphone-xs-max": 130, "iphone-xs": 110, "iphone-x": 90,
    "galaxy-s24-ultra": 650, "galaxy-s24-plus": 480, "galaxy-s24": 400,
    "galaxy-s23-ultra": 500, "galaxy-s23-plus": 380, "galaxy-s23": 320,
    "galaxy-s22-ultra": 380, "galaxy-s22-plus": 280, "galaxy-s22": 230,
    "galaxy-s21-ultra": 280, "galaxy-s21": 180,
    "galaxy-z-flip-5": 380, "galaxy-z-fold-5": 600,
    "galaxy-a54": 130, "galaxy-a53": 100, "galaxy-a34": 90,
    "galaxy-a15": 60, "galaxy-a14": 50, "galaxy-a13": 40, "galaxy-a12": 35,
    "galaxy-a05s": 45, "galaxy-a05": 40, "galaxy-a04s": 30, "galaxy-a03s": 25,
    "google-pixel-9-pro": 500, "google-pixel-9": 380,
    "google-pixel-8-pro": 350, "google-pixel-8": 250, "google-pixel-8a": 200,
    "google-pixel-7-pro": 250, "google-pixel-7": 180, "google-pixel-7a": 140,
    "google-pixel-6-pro": 180, "google-pixel-6": 130,
    "huawei-p60-pro": 300, "huawei-p40-pro": 150, "huawei-p30-pro": 100, "huawei-p30-lite": 50, "huawei-mate-20-pro": 80,
    "xiaomi-14-ultra": 400, "xiaomi-14": 300, "xiaomi-13t-pro": 250, "xiaomi-13t": 180,
    "xiaomi-12t-pro": 200, "xiaomi-12t": 150, "redmi-note-13-pro": 120, "redmi-note-12-pro": 90,
    "oneplus-12": 350, "oneplus-11": 250, "oneplus-10-pro": 180, "oneplus-nord-3": 130,
  };

  let price = basePrices[modelId] ?? 100;

  // Storage bonus
  if (storage.includes("256")) price += 30;
  if (storage.includes("512")) price += 70;
  if (storage.includes("1 To")) price += 120;

  // Screen condition penalty
  if (screen === "light_scratches") price *= 0.9;
  if (screen === "deep_scratches") price *= 0.7;
  if (screen === "cracked") price *= 0.4;

  // Body condition penalty
  if (body === "light_wear") price *= 0.95;
  if (body === "dents_scratches") price *= 0.8;
  if (body === "cracked") price *= 0.5;

  // Functionality issues
  const checks = Object.values(checklist);
  const failCount = checks.filter((v) => !v).length;
  if (failCount > 0) price *= Math.max(0.3, 1 - failCount * 0.1);

  return Math.round(price);
}

// ============================================
// API Functions (mock for MVP, ready for backend)
// ============================================

export async function getBuybackBrands(category: string): Promise<{ data: string[] | null; error: { error: string } | null }> {
  // TODO: Replace with real API call
  // return publicApi.get<string[]>(`/buyback/brands?category=${category}`);
  const brands = MOCK_BRANDS[category];
  if (!brands) return { data: [], error: null };
  return { data: brands, error: null };
}

export async function getBuybackModels(brand: string): Promise<{ data: BuybackModel[] | null; error: { error: string } | null }> {
  // TODO: Replace with real API call
  // return publicApi.get<BuybackModel[]>(`/buyback/models?brand=${encodeURIComponent(brand)}`);
  const models = MOCK_MODELS[brand];
  if (!models) return { data: [], error: null };
  return { data: models, error: null };
}

export async function getBuybackStorages(modelId: string): Promise<{ data: string[] | null; error: { error: string } | null }> {
  // TODO: Replace with real API call
  // return publicApi.get<string[]>(`/buyback/models/${modelId}/storages`);
  const storages = MOCK_STORAGES[modelId];
  if (!storages) return { data: ["64 Go", "128 Go", "256 Go"], error: null };
  return { data: storages, error: null };
}

export async function getBuybackEstimate(params: {
  model_id: string;
  storage: string;
  screen: ScreenCondition;
  body: BodyCondition;
  checklist: FunctionalityChecklist;
}): Promise<{ data: BuybackEstimate | null; error: { error: string } | null }> {
  // TODO: Replace with real API call
  // return publicApi.post<BuybackEstimate>("/buyback/estimate", params);
  const model = Object.values(MOCK_MODELS).flat().find((m) => m.id === params.model_id);
  const price = calculateMockPrice(params.model_id, params.storage, params.screen, params.body, params.checklist);

  return {
    data: {
      id: `est-${Date.now()}`,
      model_name: model?.name ?? params.model_id,
      brand: model?.brand ?? "Unknown",
      storage: params.storage,
      price,
      image_url: model?.image_url ?? null,
      depreciation_info: price > 0 ? "Ce prix est garanti 7 jours." : null,
    },
    error: null,
  };
}

export async function submitBuybackOrder(params: {
  estimate_id: string;
  delivery_method: string;
  shipping_option?: string;
  store_key?: string;
  appointment?: AppointmentSlot;
  bank_info?: BuybackBankInfo;
  personal_info?: BuybackPersonalInfo;
}): Promise<{ data: { confirmation_id: string } | null; error: { error: string } | null }> {
  // TODO: Replace with real API call
  // return publicApi.post<{ confirmation_id: string }>("/buyback/orders", params);
  return {
    data: { confirmation_id: `DBC-${Math.random().toString(36).substring(2, 8).toUpperCase()}` },
    error: null,
  };
}

export async function getMyBuybackOrders(token: string): Promise<{ data: BuybackOrder[] | null; error: { error: string } | null }> {
  // TODO: Replace with real API call
  // return api.get<BuybackOrder[]>("/buyback/orders", { headers: { Authorization: `Bearer ${token}` } });
  return { data: [], error: null };
}
