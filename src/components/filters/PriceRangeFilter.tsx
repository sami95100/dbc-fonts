"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

interface PriceRangeFilterProps {
  label: string;
  min: number;
  max: number;
  currentMin?: number;
  currentMax?: number;
  onChange: (min: number | undefined, max: number | undefined) => void;
  className?: string;
}

export function PriceRangeFilter({
  label,
  min,
  max,
  currentMin,
  currentMax,
  onChange,
  className,
}: PriceRangeFilterProps) {
  const t = useTranslations("catalog.filters");
  const [isOpen, setIsOpen] = useState(false);
  const [localMin, setLocalMin] = useState(currentMin?.toString() || "");
  const [localMax, setLocalMax] = useState(currentMax?.toString() || "");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Synchroniser les valeurs locales avec les props
  useEffect(() => {
    setLocalMin(currentMin?.toString() || "");
    setLocalMax(currentMax?.toString() || "");
  }, [currentMin, currentMax]);

  // Fermer le dropdown quand on clique ailleurs
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleApply = () => {
    const minValue = localMin ? parseInt(localMin, 10) : undefined;
    const maxValue = localMax ? parseInt(localMax, 10) : undefined;
    onChange(minValue, maxValue);
    setIsOpen(false);
  };

  const handleReset = () => {
    setLocalMin("");
    setLocalMax("");
    onChange(undefined, undefined);
    setIsOpen(false);
  };

  const hasSelection = currentMin !== undefined || currentMax !== undefined;

  const displayLabel = hasSelection
    ? `${currentMin || min} - ${currentMax || max}`
    : label;

  return (
    <div ref={dropdownRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-1 rounded-full border px-3 py-1.5 text-sm font-normal transition-colors",
          hasSelection
            ? "border-green-700 bg-green-700 text-white"
            : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
        )}
      >
        {displayLabel}
        <ChevronDown
          className={cn(
            "ml-1 h-4 w-4 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-2 w-[280px] rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
          <div className="mb-3 text-sm font-medium text-gray-900">
            {t("priceRange")}
          </div>

          <div className="mb-4 flex items-center gap-2">
            <div className="flex-1">
              <label className="mb-1 block text-xs text-gray-500">Min</label>
              <div className="relative">
                <Input
                  type="number"
                  value={localMin}
                  onChange={(e) => setLocalMin(e.target.value)}
                  placeholder={String(min)}
                  className="pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                  EUR
                </span>
              </div>
            </div>

            <div className="mt-5 text-gray-400">-</div>

            <div className="flex-1">
              <label className="mb-1 block text-xs text-gray-500">Max</label>
              <div className="relative">
                <Input
                  type="number"
                  value={localMax}
                  onChange={(e) => setLocalMax(e.target.value)}
                  placeholder={String(max)}
                  className="pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                  EUR
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 rounded-md border border-gray-200 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              {t("clear")}
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="flex-1 rounded-md bg-green-700 py-2 text-sm font-medium text-white hover:bg-green-800"
            >
              {t("apply")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
