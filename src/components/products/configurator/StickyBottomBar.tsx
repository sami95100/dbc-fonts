"use client";

import { memo } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { StickyBottomBarProps } from "./types";

/**
 * StickyBottomBar - Mobile sticky add-to-cart bar
 *
 * Fixed to the bottom of the screen on mobile devices.
 * Shows current price and add-to-cart button.
 * Hidden on desktop (lg:hidden).
 *
 * @example
 * <StickyBottomBar
 *   price={totalPrice}
 *   isOutOfStock={quantity === 0}
 *   isLoading={isLoadingVariant}
 *   onAddToCart={handleAddToCart}
 *   ctaLabel="Ajouter au panier"
 *   outOfStockLabel="Deja vendu"
 * />
 */
function StickyBottomBarComponent({
  price,
  isOutOfStock,
  isLoading,
  onAddToCart,
  ctaLabel,
  outOfStockLabel,
}: StickyBottomBarProps) {
  return (
    <>
      {/* Sticky bar - mobile only */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white p-4 shadow-lg lg:hidden">
        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="text-xl font-bold text-gray-900">{price} EUR</span>
            {isOutOfStock && (
              <p className="text-sm text-gray-500">{outOfStockLabel}</p>
            )}
          </div>
          <Button
            size="lg"
            disabled={isOutOfStock || isLoading}
            onClick={onAddToCart}
            className="flex-1 rounded-xl bg-green-700 py-4 font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            {isLoading ? (
              <LoadingSpinner />
            ) : isOutOfStock ? (
              outOfStockLabel
            ) : (
              ctaLabel
            )}
          </Button>
        </div>
      </div>

      {/* Spacer to prevent content from being hidden behind sticky bar */}
      <div className="h-24 lg:hidden" aria-hidden="true" />
    </>
  );
}

function LoadingSpinner() {
  return <Loader2 className="h-5 w-5 animate-spin" />;
}

export const StickyBottomBar = memo(StickyBottomBarComponent);
