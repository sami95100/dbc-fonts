"use client";

import { memo, useMemo } from "react";
import { useLocale } from "next-intl";
import { ConfigSection } from "../ConfigSection";
import { RadioOption } from "../RadioOption";
import type { StorageSectionProps } from "../types";

/**
 * StorageSection - Storage capacity selection
 *
 * Allows users to select storage capacity (64GB, 128GB, 256GB, etc.).
 * Uses availableStorages from API to show real-time stock availability.
 * Out of stock options are shown as "Déjà vendu".
 *
 * Reusable for any device with storage options (iPhone, Samsung, Mac, iPad).
 *
 * @example
 * <StorageSection
 *   storages={product.storages}
 *   selectedStorage={selectedStorage}
 *   onStorageChange={setSelectedStorage}
 *   availableStorages={availableOptions?.storages}
 * />
 */
function StorageSectionComponent({
  storages,
  selectedStorage,
  onStorageChange,
  imageUrl,
  availableStorages,
}: StorageSectionProps) {
  const locale = useLocale();

  // Build a map of storage availability from stock check
  const storageAvailabilityMap = useMemo(() => {
    if (!availableStorages) return null;
    const map = new Map<string, boolean>();
    for (const storage of availableStorages) {
      map.set(storage.value, storage.available);
    }
    return map;
  }, [availableStorages]);

  if (storages.length === 0) return null;

  const title = locale === "fr"
    ? "Selectionnez la capacite de stockage"
    : "Select storage capacity";

  const soldOutLabel = locale === "fr" ? "Deja vendu" : "Already sold";

  return (
    <ConfigSection title={title} imageUrl={imageUrl}>
      {storages.map((storage) => {
        // Use stock-based availability if available, otherwise fall back to product.storages availability
        const isAvailable = storageAvailabilityMap
          ? storageAvailabilityMap.get(storage.value) ?? storage.available
          : storage.available;

        return (
          <RadioOption
            key={storage.value}
            selected={selectedStorage === storage.value}
            onClick={() => isAvailable && onStorageChange(storage.value)}
            label={storage.value}
            soldOut={!isAvailable}
            soldOutLabel={soldOutLabel}
            disabled={!isAvailable}
          />
        );
      })}
    </ConfigSection>
  );
}

export const StorageSection = memo(StorageSectionComponent);
