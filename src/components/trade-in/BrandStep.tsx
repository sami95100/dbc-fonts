"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface BrandStepProps {
  brands: string[];
  onSelect: (brand: string) => void;
}

export function BrandStep({ brands, onSelect }: BrandStepProps) {
  const t = useTranslations("tradeIn");

  return (
    <div>
      <h2 className="mb-6 text-lg font-semibold text-gray-900">
        {t("brandStep.title")}
      </h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {brands.map((brand) => (
          <button
            key={brand}
            type="button"
            onClick={() => onSelect(brand)}
            className={cn(
              "flex items-center justify-center rounded-2xl border border-gray-200 bg-white p-6",
              "text-base font-semibold text-gray-900",
              "transition-all duration-150 hover:border-primary hover:shadow-md",
              "cursor-pointer"
            )}
          >
            {brand}
          </button>
        ))}
      </div>
    </div>
  );
}
