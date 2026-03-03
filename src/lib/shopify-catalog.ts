import catalog from "@/data/shopify-catalog.json";

export interface ShopifyCatalogItem {
  title?: string;
  handle: string;
  product_type?: string;
  images?: string[];
  colors?: string[];
  price_min?: number;
}

interface ShopifyEnrichment {
  colors: string[];
  primaryImageUrl?: string;
  priceMin?: number;
}

const SMARTPHONE_ITEMS: ShopifyCatalogItem[] = (catalog as ShopifyCatalogItem[]).filter((item) => {
  const type = item.product_type?.toLowerCase() ?? "";
  return type.includes("smartphone");
});

const CATALOG_BY_HANDLE = new Map<string, ShopifyCatalogItem>();

function normalizeHandle(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function addHandleIndex(handle: string, item: ShopifyCatalogItem): void {
  const normalized = normalizeHandle(handle);
  if (!normalized) return;
  if (!CATALOG_BY_HANDLE.has(normalized)) {
    CATALOG_BY_HANDLE.set(normalized, item);
  }
}

for (const item of SMARTPHONE_ITEMS) {
  addHandleIndex(item.handle, item);

  const normalized = normalizeHandle(item.handle);
  if (normalized.startsWith("samsung-")) {
    addHandleIndex(normalized.replace(/^samsung-/, ""), item);
  }
  if (normalized.startsWith("google-")) {
    addHandleIndex(normalized.replace(/^google-/, ""), item);
  }
  addHandleIndex(normalized.replace(/-5g$/, ""), item);
  addHandleIndex(normalized.replace(/-4g$/, ""), item);
}

function getCandidates(slug: string): string[] {
  const normalizedSlug = normalizeHandle(slug);
  return [
    normalizedSlug,
    `samsung-${normalizedSlug}`,
    `google-${normalizedSlug}`,
    normalizedSlug.replace(/-5g$/, ""),
    normalizedSlug.replace(/-4g$/, ""),
    `samsung-${normalizedSlug.replace(/-5g$/, "")}`,
    `samsung-${normalizedSlug.replace(/-4g$/, "")}`,
    `google-${normalizedSlug.replace(/-5g$/, "")}`,
    `google-${normalizedSlug.replace(/-4g$/, "")}`,
  ];
}

function getCandidatesForBrandModel(brandSlug: string, modelSlug: string): string[] {
  const normalizedBrand = normalizeHandle(brandSlug);
  const normalizedModel = normalizeHandle(modelSlug);
  const prefixed = `${normalizedBrand}-${normalizedModel}`;
  return [
    prefixed,
    normalizedModel,
    prefixed.replace(/-5g$/, ""),
    prefixed.replace(/-4g$/, ""),
    normalizedModel.replace(/-5g$/, ""),
    normalizedModel.replace(/-4g$/, ""),
  ];
}

function getShopifyStoreBaseUrl(): string | undefined {
  const raw = process.env.NEXT_PUBLIC_SHOPIFY_STORE_URL?.trim();
  if (!raw) return undefined;

  let base = raw;
  if (!/^https?:\/\//i.test(base)) {
    base = base.includes(".")
      ? `https://${base}`
      : `https://${base}.myshopify.com`;
  }

  return base.replace(/\/+$/, "");
}

export function getShopifyEnrichment(slug: string): ShopifyEnrichment | undefined {
  for (const candidate of getCandidates(slug)) {
    const item = CATALOG_BY_HANDLE.get(candidate);
    if (!item) continue;
    return {
      colors: item.colors ?? [],
      primaryImageUrl: item.images?.[0],
      priceMin: item.price_min,
    };
  }
  return undefined;
}

export function getShopifySmartphoneByHandle(handle: string): ShopifyCatalogItem | undefined {
  return CATALOG_BY_HANDLE.get(normalizeHandle(handle));
}

export function getShopifySmartphonesByBrand(brandSlug: string): ShopifyCatalogItem[] {
  const normalizedBrand = normalizeHandle(brandSlug);
  const prefix = `${normalizedBrand}-`;
  return SMARTPHONE_ITEMS.filter((item) => normalizeHandle(item.handle).startsWith(prefix));
}

export function getShopifySmartphoneByBrandModel(
  brandSlug: string,
  modelSlug: string
): ShopifyCatalogItem | undefined {
  for (const candidate of getCandidatesForBrandModel(brandSlug, modelSlug)) {
    const item = CATALOG_BY_HANDLE.get(candidate);
    if (item) return item;
  }
  return undefined;
}

export function getShopifyProductUrlByHandle(handle: string): string | undefined {
  const base = getShopifyStoreBaseUrl();
  if (!base) return undefined;
  return `${base}/products/${normalizeHandle(handle)}`;
}

export function getShopifyProductUrlByBrandModel(
  brandSlug: string,
  modelSlug: string
): string | undefined {
  const item = getShopifySmartphoneByBrandModel(brandSlug, modelSlug);
  if (!item) return undefined;
  return getShopifyProductUrlByHandle(item.handle);
}
