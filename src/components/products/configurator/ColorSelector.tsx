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
  const tColor = (name: string) => {
    try { return t(`colorNames.${name}`); } catch { return name; }
  };

  return (
    <div
      className="grid grid-cols-2 gap-3"
      role="radiogroup"
      aria-label={t("colorSelection")}
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
            className={cn(
              "flex items-center gap-3 rounded-2xl border p-4 text-left transition-all duration-150",
              isSelected && isAvailable
                ? "border-green-700 bg-green-50"
                : isAvailable
                ? "border-gray-200 bg-white hover:border-gray-300"
                : "cursor-not-allowed border-gray-200 bg-gray-50 opacity-60"
            )}
          >
            {/* Color swatch */}
            <span
              className="relative h-6 w-6 shrink-0 rounded-full"
              style={{
                backgroundColor: color.hex,
                boxShadow: "inset 0 3px 5px rgba(0,0,0,0.2)",
              }}
              aria-hidden="true"
            />

            {/* Color name + sold out badge */}
            <div className="flex flex-1 items-center justify-between">
              <span className={cn(
                "text-sm font-medium",
                !isAvailable ? "text-gray-400 line-through" : "text-gray-900"
              )}>
                {tColor(color.name)}
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
