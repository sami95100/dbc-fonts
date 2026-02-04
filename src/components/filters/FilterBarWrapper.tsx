"use client";

import { Suspense } from "react";
import { FilterBar, type ActiveFilters } from "./FilterBar";
import { useFilters } from "@/hooks/useFilters";
import type { FilterValues } from "@/lib/api/filters";

interface FilterBarWrapperProps {
  availableFilters: FilterValues;
  onFiltersChange?: (filters: ActiveFilters) => void;
}

function FilterBarInner({ availableFilters }: FilterBarWrapperProps) {
  const { filters, setFilters } = useFilters();

  return (
    <FilterBar
      availableFilters={availableFilters}
      activeFilters={filters}
      onFiltersChange={setFilters}
    />
  );
}

export function FilterBarWrapper(props: FilterBarWrapperProps) {
  return (
    <Suspense
      fallback={
        <div className="flex gap-2">
          <div className="h-8 w-16 animate-pulse rounded-full bg-gray-200" />
          <div className="h-8 w-20 animate-pulse rounded-full bg-gray-200" />
          <div className="h-8 w-24 animate-pulse rounded-full bg-gray-200" />
        </div>
      }
    >
      <FilterBarInner {...props} />
    </Suspense>
  );
}
