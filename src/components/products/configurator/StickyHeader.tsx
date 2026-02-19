"use client";

import { useState, useEffect, memo } from "react";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getImageUrls } from "@/lib/api/transformers";
import type { ProductSelection, ConfigurableProduct } from "./types";
import type { ModelImagesByColor } from "@/types/product";

interface StickyHeaderProps {
  product: ConfigurableProduct;
  selection: ProductSelection;
  totalPrice: number;
  priceNew: number;
  isOutOfStock: boolean;
  isLoading: boolean;
  onAddToCart: () => void;
  /** Images by color for dynamic image display */
  colorImages?: ModelImagesByColor;
}

// Mapping battery ID -> configurator translation key
const BATTERY_KEYS: Record<string, string> = {
  standard: "batteryStandardLabel",
  new: "batteryNewLabel",
};

function StickyHeaderComponent({
  product,
  selection,
  totalPrice,
  priceNew,
  isOutOfStock,
  isLoading,
  onAddToCart,
  colorImages,
}: StickyHeaderProps) {
  const t = useTranslations("product.configurator");
  const tCommon = useTranslations("common");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const threshold = 200;
      const fullReveal = 350;

      if (scrollY < threshold) {
        setIsVisible(false);
        setScrollProgress(0);
      } else if (scrollY >= threshold && scrollY < fullReveal) {
        setIsVisible(true);
        // Progress from 0 to 1 as we scroll from threshold to fullReveal
        const progress = (scrollY - threshold) / (fullReveal - threshold);
        setScrollProgress(Math.min(1, Math.max(0, progress)));
      } else {
        setIsVisible(true);
        setScrollProgress(1);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const conditionLabel = t(`conditions.${selection.condition}`);
  const batteryLabel = BATTERY_KEYS[selection.battery] ? t(BATTERY_KEYS[selection.battery]) : selection.battery;

  const savings = priceNew - totalPrice;

  // Get image URL for selected color (or fallback to primary)
  const productImages = colorImages ? getImageUrls(colorImages, selection.color) : [];
  const imageUrl = productImages[0] || product.primaryImageUrl || `/images/products/apple/${product.slug}/image.png`;

  // Calculate animated values based on scroll progress
  const translateY = -100 + (scrollProgress * 100); // -100% to 0%
  const opacity = scrollProgress;
  const progressBarWidth = scrollProgress * 100;

  return (
    <div
      className="fixed left-0 right-0 top-0 z-50 overflow-hidden"
      style={{
        transform: `translateY(${translateY}%)`,
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible && scrollProgress > 0.5 ? "auto" : "none",
        transition: "opacity 0.15s ease-out",
      }}
    >
      {/* Progress bar at top */}
      <div className="h-0.5 w-full bg-gray-100">
        <div
          className="h-full bg-green-500 transition-all duration-75 ease-out"
          style={{ width: `${progressBarWidth}%` }}
        />
      </div>

      {/* Header content */}
      <div
        className="border-b border-gray-200 bg-white shadow-sm"
        style={{
          opacity,
          transition: "opacity 0.1s ease-out",
        }}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
          {/* Left: Product image + config summary */}
          <div
            className="flex min-w-0 flex-1 items-center gap-4"
            style={{
              transform: `translateX(${(1 - scrollProgress) * -20}px)`,
              opacity: scrollProgress,
              transition: "transform 0.1s ease-out, opacity 0.1s ease-out",
            }}
          >
            {/* Product thumbnail */}
            <div className="hidden h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-50 sm:block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt={product.name}
                className="h-full w-full object-contain"
              />
            </div>

            {/* Config summary */}
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-gray-900">
                {conditionLabel} - {batteryLabel} - {selection.storage} - {selection.color}
              </p>
              <p className="text-xs text-gray-500">{product.name}</p>
            </div>
          </div>

          {/* Right: Price + CTA */}
          <div
            className="flex shrink-0 items-center gap-4"
            style={{
              transform: `translateX(${(1 - scrollProgress) * 20}px)`,
              opacity: scrollProgress,
              transition: "transform 0.1s ease-out, opacity 0.1s ease-out",
            }}
          >
            {/* Price */}
            <div className="hidden text-right sm:block">
              <p className="text-lg font-bold text-gray-900">
                {totalPrice.toLocaleString("fr-FR")} €
                <span className="ml-1 text-xs font-normal text-gray-500">
                  {t("beforeTradeIn")}
                </span>
              </p>
              {priceNew > 0 && (
                <div className="flex items-center justify-end gap-2 text-xs">
                  <span className="text-gray-400 line-through">
                    {priceNew.toLocaleString("fr-FR")} € {tCommon("new")}
                  </span>
                  {savings > 0 && (
                    <span className="rounded bg-green-100 px-1.5 py-0.5 font-medium text-green-700">
                      {t("savingsAmount", { amount: savings.toLocaleString("fr-FR") })}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Mobile price */}
            <p className="text-lg font-bold text-gray-900 sm:hidden">
              {totalPrice.toLocaleString("fr-FR")} €
            </p>

            {/* CTA Button */}
            <Button
              onClick={onAddToCart}
              disabled={isOutOfStock || isLoading}
              className="shrink-0 whitespace-nowrap rounded-full bg-green-700 px-6 py-2 text-sm font-medium text-white hover:bg-green-800 disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isOutOfStock ? (
                t("soldOut")
              ) : (
                tCommon("addToCart")
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export const StickyHeader = memo(StickyHeaderComponent);
