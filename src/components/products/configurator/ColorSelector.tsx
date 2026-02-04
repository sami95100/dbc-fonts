"use client";

import { memo, useMemo } from "react";
import { useLocale } from "next-intl";
import type { ColorSelectorProps } from "./types";

/**
 * ColorSelector - Color card selector component
 *
 * Displays color options as selectable cards with color swatch and name.
 * Uses availableColors from API to show real-time stock availability.
 * Out of stock colors are shown with "Déjà vendu" badge.
 *
 * @example
 * <ColorSelector
 *   colors={product.colors}
 *   selectedColor={selectedColor}
 *   onColorChange={setSelectedColor}
 *   availableColors={availableOptions?.colors}
 * />
 */
function ColorSelectorComponent({
  colors,
  selectedColor,
  onColorChange,
  availableColors,
}: ColorSelectorProps) {
  const locale = useLocale();

  // Build a map of color availability from stock check
  const colorAvailabilityMap = useMemo(() => {
    if (!availableColors) return null;
    const map = new Map<string, boolean>();
    for (const color of availableColors) {
      map.set(color.value, color.available);
    }
    return map;
  }, [availableColors]);

  if (colors.length === 0) return null;

  const soldOutLabel = locale === "fr" ? "Deja vendu" : "Already sold";

  return (
    <div
      className="grid grid-cols-2 gap-3"
      role="radiogroup"
      aria-label="Color selection"
    >
      {colors.map((color) => {
        const isSelected = selectedColor === color.name;

        // Use stock-based availability if available, otherwise assume available
        const isAvailable = colorAvailabilityMap
          ? colorAvailabilityMap.get(color.name) ?? true
          : true;

        return (
          <button
            key={color.name}
            type="button"
            role="radio"
            aria-checked={isSelected}
            disabled={!isAvailable}
            onClick={() => isAvailable && onColorChange(color.name)}
            className={`
              flex items-center gap-3 rounded-xl border-2 px-4 py-3 text-left transition-all duration-150
              ${
                isSelected && isAvailable
                  ? "border-gray-900 bg-gray-50"
                  : isAvailable
                  ? "border-gray-200 bg-white hover:border-gray-300"
                  : "cursor-not-allowed border-gray-200 bg-gray-50 opacity-60"
              }
            `}
          >
            {/* Color swatch */}
            <span
              className={`
                h-6 w-6 flex-shrink-0 rounded-full border
                ${color.hex === "#FFFFFF" || color.hex === "#f5f5f7" || color.hex === "#e3e4e5"
                  ? "border-gray-300"
                  : "border-transparent"
                }
                ${!isAvailable ? "opacity-50" : ""}
              `}
              style={{ backgroundColor: color.hex }}
              aria-hidden="true"
            />

            {/* Color name + sold out badge */}
            <div className="flex flex-1 items-center justify-between">
              <span className={`text-sm font-medium ${!isAvailable ? "text-gray-400 line-through" : "text-gray-900"}`}>
                {color.name}
              </span>
              {!isAvailable && (
                <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
                  {soldOutLabel}
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}

export const ColorSelector = memo(ColorSelectorComponent);
