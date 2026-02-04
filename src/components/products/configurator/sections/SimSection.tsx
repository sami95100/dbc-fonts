"use client";

import { memo, useMemo } from "react";
import { useTranslations } from "next-intl";
import { ConfigSection } from "../ConfigSection";
import { RadioOption } from "../RadioOption";
import type { SimSectionProps } from "../types";

/**
 * SimSection - SIM type selection
 *
 * Allows users to select the SIM configuration (eSIM, Dual SIM, etc.).
 * Shows description for each option explaining the SIM slots available.
 * Uses availableSims from API to show real-time stock availability.
 *
 * Reusable for any device with SIM options (iPhone, Samsung).
 *
 * @example
 * <SimSection
 *   sims={product.sims}
 *   selectedSim={selectedSim}
 *   onSimChange={setSelectedSim}
 *   availableSims={availableOptions?.sims}
 * />
 */
function SimSectionComponent({
  sims,
  selectedSim,
  onSimChange,
  imageUrl,
  availableSims,
}: SimSectionProps) {
  const t = useTranslations("product.configurator");

  // Build a map of SIM availability from stock check
  const simAvailabilityMap = useMemo(() => {
    if (!availableSims) return null;
    const map = new Map<string, boolean>();
    for (const sim of availableSims) {
      map.set(sim.value, sim.available);
    }
    return map;
  }, [availableSims]);

  if (!sims || sims.length === 0) return null;

  return (
    <ConfigSection title={t("sim.title")} description={t("sim.description")} imageUrl={imageUrl}>
      {sims.map((sim) => {
        // Use stock-based availability if available, otherwise fall back to product.sims availability
        const isAvailable = simAvailabilityMap
          ? simAvailabilityMap.get(sim.value) ?? sim.available
          : sim.available;

        // Get localized label and description
        const normalizedValue = sim.value.toUpperCase();
        const label = t(`sim.${normalizedValue}`);
        const sublabel = t(`sim.desc_${normalizedValue}`);

        return (
          <RadioOption
            key={sim.value}
            selected={selectedSim === sim.value}
            onClick={() => isAvailable && onSimChange(sim.value)}
            label={label}
            sublabel={sublabel}
            soldOut={!isAvailable}
            soldOutLabel={t("soldOut")}
            disabled={!isAvailable}
          />
        );
      })}
    </ConfigSection>
  );
}

export const SimSection = memo(SimSectionComponent);
