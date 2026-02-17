"use client";

import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { FilterDropdown, type FilterOption } from "./FilterDropdown";
import { PriceRangeFilter } from "./PriceRangeFilter";
import type { FilterValues } from "@/lib/api/filters";

export interface ActiveFilters {
  minPrice?: number;
  maxPrice?: number;
  years: number[];
  storages: string[];
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

  const handleClearAll = () => {
    onFiltersChange({
      minPrice: undefined,
      maxPrice: undefined,
      years: [],
      storages: [],
    });
  };

  const hasActiveFilters =
    activeFilters.minPrice !== undefined ||
    activeFilters.maxPrice !== undefined ||
    activeFilters.years.length > 0 ||
    activeFilters.storages.length > 0;

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

        {/* Bouton reset */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleClearAll}
            className="flex items-center gap-1 rounded-full border border-gray-200 bg-white px-3 py-2.5 text-sm font-normal text-gray-700 hover:bg-gray-50"
          >
            <X className="h-4 w-4" />
            {t("clear")}
          </button>
        )}
      </div>
    </div>
  );
}
