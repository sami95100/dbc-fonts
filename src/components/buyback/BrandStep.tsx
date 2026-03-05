"use client";

import { cn } from "@/lib/utils";

const BRAND_LOGOS: Record<string, string> = {
  Apple: "/images/brands/apple.svg",
  Samsung: "/images/brands/samsung.svg",
};

interface BrandStepProps {
  brands: string[];
  onSelect: (brand: string) => void;
}

export function BrandStep({ brands, onSelect }: BrandStepProps) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
      {brands.map((brand) => (
        <button
          key={brand}
          type="button"
          onClick={() => onSelect(brand)}
          className={cn(
            "flex items-center justify-center rounded-2xl border border-gray-200 bg-white p-6",
            "text-base font-semibold text-gray-900",
            "transition-all duration-200 hover:border-gray-900 hover:shadow-md"
          )}
        >
          {brand}
        </button>
      ))}
    </div>
  );
}
