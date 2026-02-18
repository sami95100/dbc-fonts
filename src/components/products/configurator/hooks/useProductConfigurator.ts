"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  findVariant,
  getModelConditionImages,
  getAvailableOptions,
  type AvailableOptions,
} from "@/lib/api/products";
import { getImageUrls } from "@/lib/api/transformers";
import { getProductImage } from "@/data/mock/products";
import { useCartStore } from "@/stores/cart-store";
import type { CartItem } from "@/types/cart";
import type { ModelImagesByCondition } from "@/types/product";
import {
  GRADE_ID_TO_API,
  type ConfigurableProduct,
  type ProductSelection,
  type VariantInfo,
  type BatteryType,
  type CartConfirmationItem,
} from "../types";

interface UseProductConfiguratorOptions {
  product: ConfigurableProduct;
}

interface UseProductConfiguratorReturn {
  // Selection state
  selection: ProductSelection;
  setCondition: (condition: string) => void;
  setStorage: (storage: string) => void;
  setColor: (color: string) => void;
  setBattery: (battery: BatteryType) => void;
  setSim: (sim: string) => void;

  // Variant info from API
  variantInfo: VariantInfo | null;
  isLoadingVariant: boolean;

  // Available options (with stock info)
  availableOptions: AvailableOptions | null;

  // Images
  colorImages: string[];
  fallbackImage: string;
  conditionImages: ModelImagesByCondition | null;

  // Computed values
  totalPrice: number;
  basePrice: number;
  batteryExtra: number;
  savings: number;
  isOutOfStock: boolean;

  // Actions
  handleAddToCart: () => boolean;

  // Cart confirmation
  lastAddedItem: CartConfirmationItem | null;
  clearLastAdded: () => void;
}

/**
 * useProductConfigurator - Custom hook for product configuration logic
 *
 * Encapsulates all the state and logic for product configuration:
 * - Selection state (condition, storage, color, battery)
 * - Variant search via API
 * - Price calculations
 * - Image handling
 *
 * This separates business logic from UI, making components cleaner
 * and allowing easy reuse across different product types.
 *
 * @example
 * const {
 *   selection,
 *   setCondition,
 *   setStorage,
 *   variantInfo,
 *   totalPrice,
 *   colorImages,
 * } = useProductConfigurator({ product });
 */
export function useProductConfigurator({
  product,
}: UseProductConfiguratorOptions): UseProductConfiguratorReturn {
  // ============================================
  // Selection State
  // ============================================

  const [selection, setSelection] = useState<ProductSelection>({
    condition:
      product.conditions.find((c) => c.isBestSeller)?.id ||
      product.conditions[0]?.id ||
      "tres-bon",
    storage: product.storages.find((s) => s.available)?.value || "",
    color: product.colors[0]?.name || "",
    battery: "standard",
    sim: product.sims?.find((s) => s.available)?.value || "",
  });

  // Individual setters for convenience
  const setCondition = useCallback((condition: string) => {
    setSelection((prev) => ({ ...prev, condition }));
  }, []);

  const setStorage = useCallback((storage: string) => {
    setSelection((prev) => ({ ...prev, storage }));
  }, []);

  const setColor = useCallback((color: string) => {
    setSelection((prev) => ({ ...prev, color }));
  }, []);

  const setBattery = useCallback((battery: BatteryType) => {
    setSelection((prev) => ({ ...prev, battery }));
  }, []);

  const setSim = useCallback((sim: string) => {
    setSelection((prev) => ({ ...prev, sim }));
  }, []);

  // ============================================
  // Variant Search (API)
  // ============================================

  const [variantInfo, setVariantInfo] = useState<VariantInfo | null>(null);
  const [isLoadingVariant, setIsLoadingVariant] = useState(false);

  useEffect(() => {
    // Only call API if we have a valid UUID (not mock data)
    if (!product.id || product.id.length < 32) return;

    const controller = new AbortController();

    const searchVariant = async () => {
      setIsLoadingVariant(true);
      try {
        const gradeApi = GRADE_ID_TO_API[selection.condition] || selection.condition;
        const batteryValue =
          selection.battery === "new" ? "Batterie neuve" : "Batterie standard";

        const result = await findVariant(product.id, {
          storage: selection.storage,
          color: selection.color,
          grade: gradeApi,
          battery: batteryValue,
          sim_type: selection.sim || undefined,
        });

        if (!controller.signal.aborted && result.data) {
          setVariantInfo({
            sku: result.data.sku,
            foxwaySku: result.data.variant?.foxway_sku ?? null,
            price: result.data.price,
            quantity: result.data.quantity,
            batteryFallback: result.data.battery_fallback,
            needsShopProcessing: result.data.needs_shop_processing,
            hasNewBattery: result.data.variant?.is_brand_new_battery ?? false,
          });
        } else if (!controller.signal.aborted) {
          setVariantInfo(null);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Error finding variant:", error);
          setVariantInfo(null);
        }
      }
      if (!controller.signal.aborted) {
        setIsLoadingVariant(false);
      }
    };

    searchVariant();

    return () => {
      controller.abort();
    };
  }, [
    product.id,
    selection.storage,
    selection.color,
    selection.condition,
    selection.battery,
    selection.sim,
  ]);

  // ============================================
  // Available Options (stock-aware)
  // ============================================

  const [availableOptions, setAvailableOptions] = useState<AvailableOptions | null>(null);

  useEffect(() => {
    // Only call API if we have a valid UUID (not mock data)
    if (!product.id || product.id.length < 32) return;

    const controller = new AbortController();

    const fetchAvailableOptions = async () => {
      try {
        const gradeApi = GRADE_ID_TO_API[selection.condition] || selection.condition;

        // Only pass grade - backend will calculate availability for each option type
        // without constraining by other selections (more intuitive UX)
        const result = await getAvailableOptions(product.id, {
          grade: gradeApi,
        });

        if (!controller.signal.aborted && result.data) {
          setAvailableOptions(result.data);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error("Error fetching available options:", error);
        }
      }
    };

    fetchAvailableOptions();

    return () => {
      controller.abort();
    };
  }, [product.id, selection.condition]);

  // ============================================
  // Auto-select first available option when availability changes
  // ============================================

  useEffect(() => {
    if (!availableOptions) return;

    setSelection((prev) => {
      const updates: Partial<ProductSelection> = {};

      // Auto-select first available storage if current is unavailable
      if (availableOptions.storages.length > 0) {
        const currentStorageAvailable = availableOptions.storages.find(
          (s) => s.value === prev.storage && s.available
        );
        if (!currentStorageAvailable) {
          const firstAvailable = availableOptions.storages.find((s) => s.available);
          if (firstAvailable) {
            updates.storage = firstAvailable.value;
          }
        }
      }

      // Auto-select first available color if current is unavailable
      if (availableOptions.colors.length > 0) {
        const currentColorAvailable = availableOptions.colors.find(
          (c) => c.value === prev.color && c.available
        );
        if (!currentColorAvailable) {
          const firstAvailable = availableOptions.colors.find((c) => c.available);
          if (firstAvailable) {
            updates.color = firstAvailable.value;
          }
        }
      }

      // Auto-select first available SIM if current is unavailable
      if (availableOptions.sims.length > 0) {
        const currentSimAvailable = availableOptions.sims.find(
          (s) => s.value === prev.sim && s.available
        );
        if (!currentSimAvailable) {
          const firstAvailable = availableOptions.sims.find((s) => s.available);
          if (firstAvailable) {
            updates.sim = firstAvailable.value;
          }
        }
      }

      // Auto-select battery: prefer standard if available, else new
      if (availableOptions.batteries.length > 0) {
        const standardBattery = availableOptions.batteries.find(
          (b) => b.value.toLowerCase().includes("standard") && b.available
        );
        const newBattery = availableOptions.batteries.find(
          (b) => b.value.toLowerCase().includes("neuve") && b.available
        );

        // If only new battery available, switch to new
        if (!standardBattery && newBattery && prev.battery === "standard") {
          updates.battery = "new";
        }
        // If standard available and user hasn't explicitly chosen new, use standard
        else if (standardBattery && !prev.battery) {
          updates.battery = "standard";
        }
      }

      // Only update if there are changes
      if (Object.keys(updates).length > 0) {
        return { ...prev, ...updates };
      }
      return prev;
    });
  }, [availableOptions]);

  // ============================================
  // Images
  // ============================================

  const colorImages = useMemo(() => {
    if (product._images && selection.color) {
      return getImageUrls(product._images, selection.color);
    }
    return [];
  }, [product._images, selection.color]);

  const fallbackImage = useMemo(() => {
    return getProductImage(product);
  }, [product]);

  // ============================================
  // Condition Images (API)
  // ============================================

  const [conditionImages, setConditionImages] = useState<ModelImagesByCondition | null>(null);

  useEffect(() => {
    // Only call API if we have a valid UUID (not mock data)
    if (!product.id || product.id.length < 32) return;

    const loadConditionImages = async () => {
      try {
        const result = await getModelConditionImages(product.id);
        if (result.data) {
          setConditionImages(result.data);
        }
      } catch (error) {
        console.error("Error loading condition images:", error);
      }
    };

    loadConditionImages();
  }, [product.id]);

  // ============================================
  // Price Calculations
  // ============================================

  const currentCondition = useMemo(
    () => product.conditions.find((c) => c.id === selection.condition),
    [product.conditions, selection.condition]
  );

  const basePrice = currentCondition?.price || product.priceFrom;
  const batteryExtra =
    selection.battery === "new" ? product.batteryOptions.new.price : 0;
  const totalPrice = basePrice + batteryExtra;
  const savings = product.priceNew - totalPrice;

  const isOutOfStock = variantInfo ? variantInfo.quantity === 0 : false;

  // ============================================
  // Actions
  // ============================================

  const addItem = useCartStore((state) => state.addItem);
  const [lastAddedItem, setLastAddedItem] = useState<CartConfirmationItem | null>(null);

  const clearLastAdded = useCallback(() => setLastAddedItem(null), []);

  const handleAddToCart = useCallback((): boolean => {
    if (!variantInfo || !variantInfo.sku || isOutOfStock) return false;

    const cartItem: Omit<CartItem, "id"> = {
      variantId: variantInfo.sku,
      sku: variantInfo.sku,
      foxwaySku: variantInfo.foxwaySku || undefined,
      model: product.name,
      modelId: product.id,
      storage: selection.storage,
      color: selection.color,
      grade: selection.condition,
      battery: selection.battery,
      batteryFallback: variantInfo.batteryFallback,
      needsShopProcessing: variantInfo.needsShopProcessing,
      price: totalPrice,
      quantity: 1,
      imageUrl: colorImages[0] || fallbackImage,
    };

    addItem(cartItem);

    setLastAddedItem({
      productName: product.name,
      imageUrl: colorImages[0] || fallbackImage,
      price: totalPrice,
      storage: selection.storage,
      color: selection.color,
    });

    return true;
  }, [
    product.id,
    product.name,
    variantInfo,
    isOutOfStock,
    selection,
    totalPrice,
    colorImages,
    fallbackImage,
    addItem,
  ]);

  // ============================================
  // Return
  // ============================================

  return {
    selection,
    setCondition,
    setStorage,
    setColor,
    setBattery,
    setSim,
    variantInfo,
    isLoadingVariant,
    availableOptions,
    colorImages,
    fallbackImage,
    conditionImages,
    totalPrice,
    basePrice,
    batteryExtra,
    savings,
    isOutOfStock,
    handleAddToCart,
    lastAddedItem,
    clearLastAdded,
  };
}
