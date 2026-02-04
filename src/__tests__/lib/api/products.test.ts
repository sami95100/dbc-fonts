import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getModels,
  getModel,
  getModelBySlug,
  getModelOptions,
  getModelPrices,
  getModelImages,
  findVariant,
} from "@/lib/api/products";

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("Products API", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  describe("getModels", () => {
    it("fetches models list without params", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          items: [{ id: "1", name: "iPhone 14" }],
          total: 1,
          page: 1,
          pages: 1,
          per_page: 20,
        }),
      });

      const result = await getModels();

      expect(result.data).not.toBeNull();
      expect(result.data?.items).toHaveLength(1);
      expect(result.error).toBeNull();
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/models"),
        expect.any(Object)
      );
    });

    it("fetches models with brand filter", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ items: [], total: 0, page: 1, pages: 1, per_page: 20 }),
      });

      await getModels({ brand: "Apple" });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("brand=Apple"),
        expect.any(Object)
      );
    });

    it("handles pagination params", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ items: [], total: 0, page: 2, pages: 3, per_page: 10 }),
      });

      await getModels({ page: 2, perPage: 10 });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("page=2"),
        expect.any(Object)
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("per_page=10"),
        expect.any(Object)
      );
    });
  });

  describe("getModel", () => {
    it("fetches model by ID", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: "123", name: "iPhone 14 Pro" }),
      });

      const result = await getModel("123");

      expect(result.data?.id).toBe("123");
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/models/123"),
        expect.any(Object)
      );
    });

    it("returns error for 404", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Model not found" }),
      });

      const result = await getModel("non-existent");

      expect(result.data).toBeNull();
      expect(result.error?.error).toBe("Model not found");
    });
  });

  describe("getModelBySlug", () => {
    it("fetches model by slug", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: "123", slug: "iphone-14-pro" }),
      });

      const result = await getModelBySlug("iphone-14-pro");

      expect(result.data?.slug).toBe("iphone-14-pro");
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/models/by-slug/iphone-14-pro"),
        expect.any(Object)
      );
    });
  });

  describe("getModelOptions", () => {
    it("fetches model options", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          storages: [{ value: "128GB", available: true }],
          colors: [{ value: "Black", available: true }],
          sims: [],
          batteries: [],
        }),
      });

      const result = await getModelOptions("123");

      expect(result.data?.storages).toHaveLength(1);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/models/123/options"),
        expect.any(Object)
      );
    });
  });

  describe("getModelPrices", () => {
    it("fetches model prices", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          price_parfait: 450,
          price_tres_bon: 420,
          price_correct: 390,
          price_imparfait: 360,
        }),
      });

      const result = await getModelPrices("123");

      expect(result.data?.price_parfait).toBe(450);
    });
  });

  describe("getModelImages", () => {
    it("fetches all images without color filter", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          Black: [{ id: "img-1", url: "https://example.com/black.jpg" }],
          Silver: [{ id: "img-2", url: "https://example.com/silver.jpg" }],
        }),
      });

      const result = await getModelImages("123");

      expect(Object.keys(result.data || {})).toHaveLength(2);
    });

    it("fetches images with color filter", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          Black: [{ id: "img-1", url: "https://example.com/black.jpg" }],
        }),
      });

      await getModelImages("123", "Black");

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("color=Black"),
        expect.any(Object)
      );
    });
  });

  describe("findVariant", () => {
    it("finds variant with config", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          variant: { id: "var-1", sku: "SKU123" },
          sku: "SKU123",
          price: 450,
          quantity: 5,
          battery_fallback: false,
          needs_shop_processing: false,
        }),
      });

      const result = await findVariant("123", {
        storage: "128GB",
        color: "Black",
      });

      expect(result.data?.sku).toBe("SKU123");
      expect(result.data?.price).toBe(450);
    });

    it("sends POST request with body", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          variant: null,
          sku: null,
          price: null,
          quantity: 0,
          battery_fallback: false,
          needs_shop_processing: false,
        }),
      });

      await findVariant("123", {
        storage: "256GB",
        color: "Silver",
        grade: "Parfait",
        battery: "Batterie neuve",
      });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining("/models/123/find-variant"),
        expect.objectContaining({
          method: "POST",
          body: expect.stringContaining("256GB"),
        })
      );
    });

    it("handles no variant found", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          variant: null,
          error: "No variant available",
        }),
      });

      const result = await findVariant("123", { storage: "2TB" });

      expect(result.error).not.toBeNull();
    });
  });

  describe("error handling", () => {
    it("handles network errors", async () => {
      mockFetch.mockRejectedValueOnce(new Error("Network error"));

      const result = await getModels();

      expect(result.data).toBeNull();
      expect(result.error?.error).toBe("Network error");
    });

    it("handles API errors with message", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: "Internal server error" }),
      });

      const result = await getModel("123");

      expect(result.data).toBeNull();
      expect(result.error?.error).toBe("Internal server error");
    });
  });
});
