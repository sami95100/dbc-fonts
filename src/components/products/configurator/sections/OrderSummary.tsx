"use client";

import { memo, useMemo, useState, useCallback } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Check, Truck, RotateCcw, Cable, Calendar, ShoppingCart, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { getImageUrls } from "@/lib/api/transformers";
import type { ProductSelection, ConfigurableProduct } from "../types";
import type { ModelImagesByColor } from "@/types/product";
import type { AvailableOption } from "@/lib/api/products";

interface OrderSummaryProps {
  product: ConfigurableProduct;
  selection: ProductSelection;
  totalPrice: number;
  priceNew: number;
  isOutOfStock: boolean;
  isLoading: boolean;
  onAddToCart: () => boolean | void;
  /** Show SIM in summary (default: true if product has sims) */
  showSim?: boolean;
  /** Show battery in summary (default: true) */
  showBattery?: boolean;
  /** Images by color for product display */
  colorImages?: ModelImagesByColor;
  /** Available battery options from stock check */
  availableBatteries?: AvailableOption[];
}

function OrderSummaryComponent({
  product,
  selection,
  totalPrice,
  priceNew,
  isOutOfStock,
  isLoading,
  onAddToCart,
  showSim = true,
  showBattery = true,
  colorImages,
  availableBatteries,
}: OrderSummaryProps) {
  const t = useTranslations("product.configurator");
  const tDelivery = useTranslations("product.delivery");
  const tCommon = useTranslations("common");

  const [isAdded, setIsAdded] = useState(false);

  const conditionLabel = t(`conditions.${selection.condition}`);
  const batteryLabel = selection.battery === "new" ? t("batteryNewLabel") : t("batteryStandardLabel");
  const simLabel = selection.sim ? t(`sim.${selection.sim.toUpperCase()}`) : selection.sim;

  const savings = priceNew - totalPrice;

  const handleAddToCart = useCallback(() => {
    const result = onAddToCart();
    // Treat void (undefined) or true as success
    if (result !== false) {
      setIsAdded(true);
      setTimeout(() => setIsAdded(false), 2000);
    }
  }, [onAddToCart]);

  // Check if extended delivery is needed (new battery selected but not in stock)
  const needsExtendedDelivery = useMemo(() => {
    if (selection.battery !== "new") return false;
    if (!availableBatteries || availableBatteries.length === 0) return false;

    const newBattery = availableBatteries.find(
      (b) => b.value.toLowerCase().includes("neuve")
    );
    return !(newBattery?.available ?? false);
  }, [selection.battery, availableBatteries]);

  // Get color dot
  const selectedColor = product.colors.find((c) => c.name === selection.color);

  // Get product image for selected color
  const productImages = colorImages ? getImageUrls(colorImages, selection.color) : [];
  const productImage = productImages[0] || product.primaryImageUrl || `/images/products/apple/${product.slug}/image.png`;

  return (
    <section className="grid gap-6 border-t border-gray-200 py-10 lg:grid-cols-2 lg:items-center lg:gap-12 lg:py-12">
      {/* Left: Product Image */}
      <div className="space-y-3">
        <div className="relative aspect-square overflow-hidden rounded-3xl bg-white">
          <Image
            src={productImage}
            alt={`${product.name} - ${selection.color}`}
            fill
            className="object-contain p-8"
            sizes="(max-width: 1024px) 100vw, 400px"
            unoptimized={productImage.startsWith("http")}
          />
        </div>
      </div>

      {/* Right: Content */}
      <div>
        <h2 className="mb-4 text-xl font-bold text-gray-900 md:text-2xl">
          {t("yourSelection")}
        </h2>

        {/* Product name + color dot */}
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
          {selectedColor && (
            <span
              className="h-4 w-4 rounded-full border border-gray-200"
              style={{ backgroundColor: selectedColor.hex }}
              title={selectedColor.name}
            />
          )}
        </div>

        {/* Selection tags */}
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700">
            {conditionLabel}
          </span>
          {showBattery && (
            <span className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700">
              {batteryLabel}
            </span>
          )}
          <span className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700">
            {selection.storage}
          </span>
          {showSim && selection.sim && product.sims && product.sims.length > 0 && (
            <span className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700">
              {simLabel}
            </span>
          )}
          <span className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700">
            {selection.color}
          </span>
        </div>

        {/* Price */}
        <div className="mt-5">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">
              {totalPrice.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
            </span>
            <span className="text-sm text-gray-500">
              {t("beforeTradeIn")}
            </span>
          </div>
          {priceNew > 0 && (
            <div className="mt-1 flex items-center gap-2">
              <span className="text-sm text-gray-400 line-through">
                {priceNew.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} € {tCommon("new")}
              </span>
              {savings > 0 && (
                <span className="rounded bg-green-100 px-2 py-0.5 text-sm font-medium text-green-700">
                  {t("saveAmount")} {savings.toLocaleString("fr-FR", { minimumFractionDigits: 2 })} €
                </span>
              )}
            </div>
          )}
        </div>

        {/* Add to cart button */}
        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock || isLoading || isAdded}
          className={cn(
            "mt-5 w-full rounded-xl py-6 text-base font-semibold text-white transition-all duration-300",
            isAdded
              ? "bg-green-600 scale-[1.02]"
              : "bg-green-700 hover:bg-green-800 active:scale-[0.98]",
            "disabled:opacity-50"
          )}
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              {tCommon("loading")}
            </span>
          ) : isAdded ? (
            <span className="flex items-center justify-center gap-2">
              <Check className="h-5 w-5" />
              {t("addedToCart")}
            </span>
          ) : isOutOfStock ? (
            <span className="text-red-200">{t("alreadySold")}</span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              {tCommon("addToCart")}
            </span>
          )}
        </Button>

        {/* 30 days return policy */}
        <div className="mt-4 flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3">
          <Check className="h-5 w-5 shrink-0 text-green-600" />
          <span className="text-sm text-gray-700">
            {t("changeMind")}
          </span>
        </div>

        {/* Shipping & Returns info */}
        <div className="mt-3 space-y-2">
          {/* Shipping - shows extended delivery if battery replacement needed */}
          {needsExtendedDelivery ? (
            <div className="flex items-center gap-3 rounded-xl bg-blue-50 px-4 py-3">
              <Calendar className="h-5 w-5 shrink-0 text-blue-600" />
              <span className="text-sm text-gray-700">
                {tDelivery("extended")}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-3 rounded-xl bg-blue-50 px-4 py-3">
              <Truck className="h-5 w-5 shrink-0 text-blue-600" />
              <span className="text-sm text-gray-700">
                {tDelivery("standard")}
              </span>
            </div>
          )}

          {/* Returns & Warranty */}
          <div className="flex items-center gap-3 rounded-xl bg-blue-50 px-4 py-3">
            <RotateCcw className="h-5 w-5 shrink-0 text-blue-600" />
            <div className="text-sm text-gray-700">
              <span className="font-medium">
                {tDelivery("returnFree")}
              </span>
              <span className="mx-2 text-gray-400">•</span>
              <span className="text-gray-500">
                {tDelivery("warranty")}
              </span>
            </div>
          </div>
        </div>

        {/* Included with */}
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-900">
            {t("includedWith")}
          </p>
          <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-700">
            <Cable className="h-4 w-4" />
            {t("chargingCable")}
          </div>
        </div>
      </div>
    </section>
  );
}

export const OrderSummary = memo(OrderSummaryComponent);
