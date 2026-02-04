"use client";

import { memo } from "react";
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
            className="flex-1 rounded-xl bg-gray-900 py-4 font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300"
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
  return (
    <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
        fill="none"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}

export const StickyBottomBar = memo(StickyBottomBarComponent);
