"use client";

import { Smartphone, Tablet, Laptop, Gamepad2, Watch } from "lucide-react";
import { cn } from "@/lib/utils";
import type { BuybackCategory } from "@/types/buyback";
import { BUYBACK_CATEGORIES } from "@/types/buyback";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  smartphone: Smartphone,
  tablet: Tablet,
  laptop: Laptop,
  "gamepad-2": Gamepad2,
  watch: Watch,
};

const LABELS: Record<BuybackCategory, string> = {
  smartphone: "Smartphone",
  tablet: "Tablette",
  macbook: "MacBook",
  console: "Console",
  smartwatch: "Montre connectee",
};

interface CategoryStepProps {
  onSelect: (category: BuybackCategory) => void;
}

export function CategoryStep({ onSelect }: CategoryStepProps) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
      {BUYBACK_CATEGORIES.map((cat) => {
        const Icon = ICONS[cat.icon];
        return (
          <button
            key={cat.key}
            type="button"
            onClick={() => cat.available && onSelect(cat.key)}
            disabled={!cat.available}
            className={cn(
              "group relative flex flex-col items-center gap-3 rounded-2xl border p-6 transition-all duration-200",
              cat.available
                ? "border-gray-200 bg-white hover:border-gray-900 hover:shadow-md cursor-pointer"
                : "border-gray-100 bg-gray-50 cursor-not-allowed opacity-60"
            )}
          >
            {Icon && (
              <Icon
                className={cn(
                  "h-8 w-8 transition-colors",
                  cat.available ? "text-gray-900" : "text-gray-400"
                )}
              />
            )}
            <span
              className={cn(
                "text-sm font-semibold",
                cat.available ? "text-gray-900" : "text-gray-400"
              )}
            >
              {LABELS[cat.key]}
            </span>
            {!cat.available && (
              <span className="absolute -top-2 right-2 rounded-full bg-gray-200 px-2 py-0.5 text-[10px] font-medium text-gray-500">
                Bientot
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
