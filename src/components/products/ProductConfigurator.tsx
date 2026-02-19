"use client";

import { useTranslations } from "next-intl";
import { Product } from "@/data/mock/products";
import type { ModelImagesByColor } from "@/types/product";
import {
  useProductConfigurator,
  HeroSection,
  ConditionSection,
  BatterySection,
  StorageSection,
  SimSection,
  ColorSection,
  DescriptionSection,
  OrderSummary,
  StickyBottomBar,
  StickyHeader,
} from "./configurator";
import { AddToCartSheet } from "./configurator/AddToCartSheet";

// ============================================
// Types
// ============================================

interface ExtendedProduct extends Product {
  _primaryImageUrl?: string;
  _images?: ModelImagesByColor;
}

interface ProductConfiguratorProps {
  /** The product to configure */
  product: ExtendedProduct;

  /** Show battery selection section (default: auto-detect based on category) */
  showBattery?: boolean;

  /** Show storage selection section (default: true) */
  showStorage?: boolean;

  /** Show condition selection section (default: true) */
  showCondition?: boolean;

  /** Category image URL for battery section */
  batteryImageUrl?: string;

  /** Category image URL for storage section */
  storageImageUrl?: string;

  /** Category image URL for condition section (fallback if no model-specific images) */
  conditionImageUrl?: string;

  /** Category image URL for SIM section */
  simImageUrl?: string;
}

// ============================================
// Component
// ============================================

/**
 * ProductConfigurator - Main product configuration component
 *
 * Orchestrates all configuration sections for a product.
 * Supports different product types through conditional rendering:
 * - iPhone/Samsung: condition, battery, storage
 * - Mac: condition, storage (no battery)
 * - iPad: condition, storage (no battery)
 *
 * @example
 * // iPhone with all options
 * <ProductConfigurator product={iphone} />
 *
 * // Mac without battery option
 * <ProductConfigurator product={mac} showBattery={false} />
 */
export function ProductConfigurator({
  product,
  showBattery,
  showStorage = true,
  showCondition = true,
  batteryImageUrl,
  storageImageUrl,
  conditionImageUrl,
  simImageUrl,
}: ProductConfiguratorProps) {
  const t = useTranslations("product");

  // Auto-detect if battery section should be shown
  // Only show for mobile devices (smartphones), not tablets, laptops, etc.
  const isMobileDevice = product.category === "smartphones" || product.category === "mobile";
  const shouldShowBattery = showBattery ?? isMobileDevice;

  // Use custom hook for all configuration logic
  const {
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
    conditionImages,
    totalPrice,
    basePrice,
    isOutOfStock,
    handleAddToCart,
    lastAddedItem,
    clearLastAdded,
  } = useProductConfigurator({ product });

  // Calculate prices for battery section
  const standardPrice = basePrice;
  const newBatteryPrice = basePrice + product.batteryOptions.new.price;

  return (
    <div className="mx-auto max-w-6xl">
      {/* Sticky Header (visible on scroll) */}
      <StickyHeader
        product={product}
        selection={selection}
        totalPrice={totalPrice}
        priceNew={product.priceNew}
        isOutOfStock={isOutOfStock}
        isLoading={isLoadingVariant}
        onAddToCart={handleAddToCart}
        colorImages={product._images}
      />

      {/* Hero Section: Image gallery + Product info */}
      <HeroSection
        product={product}
        selection={selection}
        variantInfo={variantInfo}
        isLoading={isLoadingVariant}
        images={colorImages}
        onColorChange={setColor}
        onAddToCart={handleAddToCart}
      />

      {/* Condition Section */}
      {showCondition && product.conditions.length > 0 && (
        <ConditionSection
          conditions={product.conditions}
          selectedCondition={selection.condition}
          onConditionChange={setCondition}
          conditionImages={conditionImages || undefined}
          fallbackImageUrl={conditionImageUrl}
        />
      )}

      {/* Battery Section (only for mobile devices) */}
      {shouldShowBattery && (
        <BatterySection
          selectedBattery={selection.battery}
          onBatteryChange={setBattery}
          standardPrice={standardPrice}
          newBatteryPrice={newBatteryPrice}
          availableBatteries={availableOptions?.batteries}
          imageUrl={batteryImageUrl}
        />
      )}

      {/* Storage Section (optional) */}
      {showStorage && product.storages.length > 0 && (
        <StorageSection
          storages={product.storages}
          selectedStorage={selection.storage}
          onStorageChange={setStorage}
          imageUrl={storageImageUrl}
          availableStorages={availableOptions?.storages}
        />
      )}

      {/* SIM Section (optional - only if sims available) */}
      {product.sims && product.sims.length > 0 && (
        <SimSection
          sims={product.sims}
          selectedSim={selection.sim}
          onSimChange={setSim}
          imageUrl={simImageUrl}
          availableSims={availableOptions?.sims}
        />
      )}

      {/* Color Section (at the end) */}
      {product.colors.length > 0 && (
        <ColorSection
          colors={product.colors}
          selectedColor={selection.color}
          onColorChange={setColor}
          colorImages={product._images}
          availableColors={availableOptions?.colors}
        />
      )}

      {/* Description Section (accordion) */}
      {product.description && (
        <DescriptionSection description={product.description} />
      )}

      {/* Order Summary - Recap with Add to Cart */}
      <OrderSummary
        product={product}
        selection={selection}
        totalPrice={totalPrice}
        priceNew={product.priceNew}
        isOutOfStock={isOutOfStock}
        isLoading={isLoadingVariant}
        onAddToCart={handleAddToCart}
        showSim={!!(product.sims && product.sims.length > 0)}
        showBattery={shouldShowBattery}
        colorImages={product._images}
        availableBatteries={shouldShowBattery ? availableOptions?.batteries : undefined}
      />

      {/* Sticky Bottom Bar (mobile) */}
      <StickyBottomBar
        price={totalPrice}
        isOutOfStock={isOutOfStock}
        isLoading={isLoadingVariant}
        onAddToCart={handleAddToCart}
        ctaLabel={t("addToCart")}
        outOfStockLabel={t("configurator.alreadySold")}
      />

      {/* Add to Cart confirmation sheet */}
      <AddToCartSheet item={lastAddedItem} onClose={clearLastAdded} />
    </div>
  );
}
