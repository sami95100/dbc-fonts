"use client";

import { memo, useMemo } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
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
  const t = useTranslations("product.configurator");

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

  const soldOutLabel = t("soldOut");

  return (
    <div
      className="flex flex-wrap gap-5"
      role="radiogroup"
      aria-label={t("colorSelection")}
    >
      {colors.map((color) => {
        const isSelected = selectedColor === color.name;

        // Use stock-based availability if available, otherwise assume available
        const isAvailable = colorAvailabilityMap
          ? colorAvailabilityMap.get(color.name) ?? true
          : true;

        const isLight =
          color.hex === "#FFFFFF" || color.hex === "#f5f5f7" || color.hex === "#e3e4e5";

        return (
          <div key={color.name} className="flex flex-col items-center gap-1.5">
            <button
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={`${color.name}${!isAvailable ? ` — ${soldOutLabel}` : ""}`}
              disabled={!isAvailable}
              onClick={() => isAvailable && onColorChange(color.name)}
              className={cn(
                "relative h-6 w-6 rounded-full transition-shadow duration-200",
                isAvailable
                  ? "cursor-pointer"
                  : "cursor-not-allowed opacity-40",
                isSelected && "ring-[2.5px] ring-primary ring-offset-[2.5px]"
              )}
              style={{
                backgroundColor: color.hex,
                boxShadow: "inset 0 3px 5px rgba(0,0,0,0.2)",
              }}
            >
              {!isAvailable && (
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="h-[2px] w-8 rotate-45 rounded-full bg-gray-400" />
                </span>
              )}
            </button>
            <span className={cn(
              "text-xs",
              isSelected ? "font-semibold text-gray-900" : "text-gray-500"
            )}>
              {color.name}
            </span>
          </div>
        );
      })}
    </div>
  );
}

export const ColorSelector = memo(ColorSelectorComponent);
