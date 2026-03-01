"use client";

import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilterDropdown, type FilterOption } from "./FilterDropdown";
import { PriceRangeFilter } from "./PriceRangeFilter";
import type { FilterValues } from "@/lib/api/filters";

export interface ActiveFilters {
  minPrice?: number;
  maxPrice?: number;
  years: number[];
  storages: string[];
  colors: string[];
}

interface FilterBarProps {
  availableFilters: FilterValues;
  activeFilters: ActiveFilters;
  onFiltersChange: (filters: ActiveFilters) => void;
  className?: string;
}

export function FilterBar({
  availableFilters,
  activeFilters,
  onFiltersChange,
  className,
}: FilterBarProps) {
  const t = useTranslations("catalog.filters");
  const tColor = useTranslations("product.configurator.colorNames");

  // Convertir les annees en options
  const yearOptions: FilterOption[] = availableFilters.years.map((year) => ({
    value: String(year),
    label: String(year),
  }));

  // Convertir les stockages en options
  const storageOptions: FilterOption[] = availableFilters.storages.map(
    (storage) => ({
      value: storage,
      label: storage,
    })
  );

  // Convertir les couleurs en options (traduites, sans "nd")
  const colorOptions: FilterOption[] = (availableFilters.colors || [])
    .filter((c) => c !== "nd")
    .map((color) => {
      let label = color;
      try { label = tColor(color); } catch { /* fallback au nom brut */ }
      return { value: color, label };
    });

  const handlePriceChange = (min?: number, max?: number) => {
    onFiltersChange({
      ...activeFilters,
      minPrice: min,
      maxPrice: max,
    });
  };

  const handleYearsChange = (values: string[]) => {
    onFiltersChange({
      ...activeFilters,
      years: values.map((v) => parseInt(v, 10)),
    });
  };

  const handleStoragesChange = (values: string[]) => {
    onFiltersChange({
      ...activeFilters,
      storages: values,
    });
  };

  const handleColorsChange = (values: string[]) => {
    onFiltersChange({
      ...activeFilters,
      colors: values,
    });
  };

  const handleClearAll = () => {
    onFiltersChange({
      minPrice: undefined,
      maxPrice: undefined,
      years: [],
      storages: [],
      colors: [],
    });
  };

  const hasActiveFilters =
    activeFilters.minPrice !== undefined ||
    activeFilters.maxPrice !== undefined ||
    activeFilters.years.length > 0 ||
    activeFilters.storages.length > 0 ||
    activeFilters.colors.length > 0;

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-2">
        {/* Filtre Prix */}
        <PriceRangeFilter
          label={t("price")}
          min={availableFilters.price.min || 0}
          max={availableFilters.price.max || 2000}
          currentMin={activeFilters.minPrice}
          currentMax={activeFilters.maxPrice}
          onChange={handlePriceChange}
        />

        {/* Filtre Annee */}
        {yearOptions.length > 0 && (
          <FilterDropdown
            label={t("year")}
            options={yearOptions}
            selected={activeFilters.years.map(String)}
            onChange={handleYearsChange}
            multiSelect
          />
        )}

        {/* Filtre Stockage */}
        {storageOptions.length > 0 && (
          <FilterDropdown
            label={t("storage")}
            options={storageOptions}
            selected={activeFilters.storages}
            onChange={handleStoragesChange}
            multiSelect
          />
        )}

        {/* Filtre Couleur */}
        {colorOptions.length > 0 && (
          <FilterDropdown
            label={t("color")}
            options={colorOptions}
            selected={activeFilters.colors}
            onChange={handleColorsChange}
            multiSelect
          />
        )}

        {/* Bouton reset */}
        {hasActiveFilters && (
          <Button
            type="button"
            variant="outline"
            onClick={handleClearAll}
            className="flex items-center gap-1 rounded-full px-3 py-2.5 text-sm font-normal"
          >
            <X className="h-4 w-4" />
            {t("clear")}
          </Button>
        )}
      </div>
    </div>
  );
}
