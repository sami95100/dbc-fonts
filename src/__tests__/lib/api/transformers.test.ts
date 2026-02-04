import { describe, it, expect } from "vitest";
import {
  apiModelToProduct,
  getPrimaryImageUrl,
  getImageUrls,
} from "@/lib/api/transformers";
import type {
  PhoneModel,
  ModelPrices,
  ModelOptions,
  ModelImagesByColor,
} from "@/types/product";

// ============================================
// MOCK DATA
// ============================================

const mockModel: PhoneModel = {
  id: "test-model-123",
  name: "iPhone 14 Pro Max",
  brand: "Apple",
  slug: "iphone-14-pro-max",
  price_parfait: 450,
  price_tres_bon: 420,
  price_correct: 390,
  price_imparfait: 360,
  backmarket_price: 515,
  price_from: 360,
};

const mockPrices: ModelPrices = {
  price_parfait: 450,
  price_tres_bon: 420,
  price_correct: 390,
  price_imparfait: 360,
};

const mockOptions: ModelOptions = {
  storages: [
    { value: "128GB", available: true },
    { value: "256GB", available: true },
  ],
  colors: [
    { value: "Black", available: true },
    { value: "Silver", available: true },
  ],
  sims: [{ value: "Dual SIM", available: true }],
  batteries: [
    { value: "Batterie standard", price_delta: 0 },
    { value: "Batterie neuve", price_delta: 30 },
  ],
};

const mockImages: ModelImagesByColor = {
  Black: [
    { id: "img-1", url: "https://example.com/black1.jpg", is_primary: true, sort_order: 0 },
    { id: "img-2", url: "https://example.com/black2.jpg", is_primary: false, sort_order: 1 },
  ],
  Silver: [
    { id: "img-3", url: "https://example.com/silver1.jpg", is_primary: true, sort_order: 0 },
  ],
};

// ============================================
// TESTS: apiModelToProduct
// ============================================

describe("apiModelToProduct", () => {
  it("transforms a model with all data correctly", () => {
    const result = apiModelToProduct({
      model: mockModel,
      prices: mockPrices,
      options: mockOptions,
      images: mockImages,
    });

    expect(result.id).toBe("test-model-123");
    expect(result.name).toBe("iPhone 14 Pro Max");
    expect(result.brand).toBe("Apple");
    expect(result.slug).toBe("iphone-14-pro-max");
    expect(result.brandSlug).toBe("apple");
    expect(result.category).toBe("smartphones");
  });

  it("builds colors with hex codes", () => {
    const result = apiModelToProduct({
      model: mockModel,
      prices: mockPrices,
      options: mockOptions,
    });

    expect(result.colors).toHaveLength(2);
    expect(result.colors[0]).toEqual({ name: "Black", hex: "#1d1d1f" });
    expect(result.colors[1]).toEqual({ name: "Silver", hex: "#e3e4e5" });
  });

  it("builds storages from options", () => {
    const result = apiModelToProduct({
      model: mockModel,
      prices: mockPrices,
      options: mockOptions,
    });

    expect(result.storages).toHaveLength(2);
    expect(result.storages[0]).toEqual({ value: "128GB", available: true });
    expect(result.storages[1]).toEqual({ value: "256GB", available: true });
  });

  it("builds conditions from prices", () => {
    const result = apiModelToProduct({
      model: mockModel,
      prices: mockPrices,
      options: mockOptions,
    });

    expect(result.conditions).toHaveLength(4);

    const imparfait = result.conditions.find((c) => c.id === "imparfait");
    expect(imparfait?.price).toBe(360);
    expect(imparfait?.name).toBe("Acceptable");

    const parfait = result.conditions.find((c) => c.id === "parfait");
    expect(parfait?.price).toBe(450);
    expect(parfait?.name).toBe("Excellent");
  });

  it("marks tres-bon as best seller", () => {
    const result = apiModelToProduct({
      model: mockModel,
      prices: mockPrices,
      options: mockOptions,
    });

    const tresBon = result.conditions.find((c) => c.id === "tres-bon");
    expect(tresBon?.isBestSeller).toBe(true);
  });

  it("calculates priceFrom correctly", () => {
    const result = apiModelToProduct({
      model: mockModel,
      prices: mockPrices,
      options: mockOptions,
    });

    expect(result.priceFrom).toBe(360); // Uses model.price_from
  });

  it("uses backmarket_price as priceNew", () => {
    const result = apiModelToProduct({
      model: mockModel,
      prices: mockPrices,
      options: mockOptions,
    });

    expect(result.priceNew).toBe(515);
  });

  it("builds battery options correctly", () => {
    const result = apiModelToProduct({
      model: mockModel,
      prices: mockPrices,
      options: mockOptions,
    });

    expect(result.batteryOptions.standard.price).toBe(0);
    expect(result.batteryOptions.new.price).toBe(30);
  });

  it("handles missing battery options with defaults", () => {
    const optionsWithoutBattery: ModelOptions = {
      ...mockOptions,
      batteries: [],
    };

    const result = apiModelToProduct({
      model: mockModel,
      prices: mockPrices,
      options: optionsWithoutBattery,
    });

    expect(result.batteryOptions.standard.price).toBe(0);
    expect(result.batteryOptions.new.price).toBe(30); // Default
  });

  it("sets inStock based on conditions availability", () => {
    const result = apiModelToProduct({
      model: mockModel,
      prices: mockPrices,
      options: mockOptions,
    });

    expect(result.inStock).toBe(true);
  });

  it("sets inStock to false when no prices", () => {
    const emptyPrices: ModelPrices = {
      price_parfait: null,
      price_tres_bon: null,
      price_correct: null,
      price_imparfait: null,
    };

    const result = apiModelToProduct({
      model: mockModel,
      prices: emptyPrices,
      options: mockOptions,
    });

    expect(result.inStock).toBe(false);
  });

  it("includes primary image URL when images provided", () => {
    const result = apiModelToProduct({
      model: mockModel,
      prices: mockPrices,
      options: mockOptions,
      images: mockImages,
    });

    // Fallback sur les images passees quand model.primary_image_url est absent
    expect(result.primaryImageUrl).toBe("https://example.com/black1.jpg");
  });

  it("uses model.primary_image_url when available", () => {
    const modelWithPrimaryImage = {
      ...mockModel,
      primary_image_url: "https://api.example.com/primary.jpg",
    };

    const result = apiModelToProduct({
      model: modelWithPrimaryImage,
      prices: mockPrices,
      options: mockOptions,
      images: mockImages,
    });

    // Priorite a model.primary_image_url
    expect(result.primaryImageUrl).toBe("https://api.example.com/primary.jpg");
  });

  it("handles unknown color with default hex", () => {
    const optionsWithUnknownColor: ModelOptions = {
      ...mockOptions,
      colors: [{ value: "Neon Pink", available: true }],
    };

    const result = apiModelToProduct({
      model: mockModel,
      prices: mockPrices,
      options: optionsWithUnknownColor,
    });

    expect(result.colors[0].hex).toBe("#999999"); // Default gray
  });
});

// ============================================
// TESTS: getPrimaryImageUrl
// ============================================

describe("getPrimaryImageUrl", () => {
  it("returns primary image URL for a color", () => {
    const result = getPrimaryImageUrl(mockImages, "Black");
    expect(result).toBe("https://example.com/black1.jpg");
  });

  it("returns first image if no primary", () => {
    const imagesNoPrimary: ModelImagesByColor = {
      Black: [
        { id: "img-1", url: "https://example.com/black1.jpg", is_primary: false, sort_order: 0 },
        { id: "img-2", url: "https://example.com/black2.jpg", is_primary: false, sort_order: 1 },
      ],
    };

    const result = getPrimaryImageUrl(imagesNoPrimary, "Black");
    expect(result).toBe("https://example.com/black1.jpg");
  });

  it("returns null for unknown color", () => {
    const result = getPrimaryImageUrl(mockImages, "Purple");
    expect(result).toBeNull();
  });

  it("returns null for undefined images", () => {
    const result = getPrimaryImageUrl(undefined, "Black");
    expect(result).toBeNull();
  });

  it("returns null for empty color images", () => {
    const emptyImages: ModelImagesByColor = {
      Black: [],
    };

    const result = getPrimaryImageUrl(emptyImages, "Black");
    expect(result).toBeNull();
  });
});

// ============================================
// TESTS: getImageUrls
// ============================================

describe("getImageUrls", () => {
  it("returns all image URLs sorted by sort_order", () => {
    const result = getImageUrls(mockImages, "Black");
    expect(result).toEqual([
      "https://example.com/black1.jpg",
      "https://example.com/black2.jpg",
    ]);
  });

  it("returns empty array for unknown color", () => {
    const result = getImageUrls(mockImages, "Purple");
    expect(result).toEqual([]);
  });

  it("returns empty array for undefined images", () => {
    const result = getImageUrls(undefined, "Black");
    expect(result).toEqual([]);
  });

  it("sorts images by sort_order", () => {
    const unsortedImages: ModelImagesByColor = {
      Black: [
        { id: "img-2", url: "https://example.com/black2.jpg", is_primary: false, sort_order: 1 },
        { id: "img-1", url: "https://example.com/black1.jpg", is_primary: true, sort_order: 0 },
        { id: "img-3", url: "https://example.com/black3.jpg", is_primary: false, sort_order: 2 },
      ],
    };

    const result = getImageUrls(unsortedImages, "Black");
    expect(result).toEqual([
      "https://example.com/black1.jpg",
      "https://example.com/black2.jpg",
      "https://example.com/black3.jpg",
    ]);
  });
});
