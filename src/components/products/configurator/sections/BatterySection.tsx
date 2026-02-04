"use client";

import { memo, useMemo } from "react";
import { useTranslations } from "next-intl";
import { ConfigSection } from "../ConfigSection";
import { RadioOption } from "../RadioOption";
import type { BatterySectionProps } from "../types";

/**
 * BatterySection - Battery option selection
 *
 * Logic:
 * - If ONLY "Batterie neuve" is in stock → standard is NOT available (can't downgrade)
 * - If "Batterie standard" is in stock → both options available (can always upgrade)
 * - New battery is always available (shop can replace battery)
 *
 * @example
 * <BatterySection
 *   selectedBattery={selectedBattery}
 *   onBatteryChange={setSelectedBattery}
 *   standardPrice={890}
 *   newBatteryPrice={920}
 *   availableBatteries={availableOptions?.batteries}
 * />
 */
function BatterySectionComponent({
  selectedBattery,
  onBatteryChange,
  standardPrice,
  newBatteryPrice,
  availableBatteries,
  imageUrl,
}: BatterySectionProps) {
  const t = useTranslations("product.configurator");
  const tDelivery = useTranslations("product.delivery");

  // Check what's actually available in stock
  const { standardAvailable, hasNewBatteryInStock } = useMemo(() => {
    if (!availableBatteries || availableBatteries.length === 0) {
      // No stock info, assume both available but no new battery in stock
      return { standardAvailable: true, hasNewBatteryInStock: false };
    }

    const standardBattery = availableBatteries.find(
      (b) => b.value.toLowerCase().includes("standard")
    );
    const newBattery = availableBatteries.find(
      (b) => b.value.toLowerCase().includes("neuve")
    );

    const hasStandardInStock = standardBattery?.available ?? false;
    const hasNewInStock = newBattery?.available ?? false;

    // If ONLY new batteries are in stock, standard is NOT available
    // (you can't downgrade a phone that already has new battery)
    const onlyNewBattery = hasNewInStock && !hasStandardInStock;

    return {
      standardAvailable: !onlyNewBattery,
      hasNewBatteryInStock: hasNewInStock,
    };
  }, [availableBatteries]);

  // Show extended delivery message if user selects new battery but it's not in stock
  // (shop needs to replace battery = longer processing time)
  const showExtendedDelivery = selectedBattery === "new" && !hasNewBatteryInStock;

  return (
    <ConfigSection title={t("batteryTitle")} description={t("batteryDesc")} imageUrl={imageUrl}>
      <RadioOption
        selected={selectedBattery === "standard"}
        onClick={() => standardAvailable && onBatteryChange("standard")}
        label={t("batteryStandardLabel")}
        sublabel={t("batteryStandardSublabel")}
        price={standardAvailable ? `${standardPrice} EUR` : undefined}
        soldOut={!standardAvailable}
        soldOutLabel={t("soldOut")}
        disabled={!standardAvailable}
      />
      <RadioOption
        selected={selectedBattery === "new"}
        onClick={() => onBatteryChange("new")}
        label={t("batteryNewLabel")}
        sublabel={t("batteryNewSublabel")}
        price={`${newBatteryPrice} EUR`}
      />

      {/* Extended delivery message when battery replacement needed */}
      {showExtendedDelivery && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-blue-50 p-3">
          <svg className="h-5 w-5 shrink-0 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm text-blue-800">
            {tDelivery("extended")}
          </p>
        </div>
      )}
    </ConfigSection>
  );
}

export const BatterySection = memo(BatterySectionComponent);
