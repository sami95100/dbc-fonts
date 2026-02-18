"use client";

import { memo, useMemo } from "react";
import { useTranslations } from "next-intl";
import { ConfigSection } from "../ConfigSection";
import { RadioOption } from "../RadioOption";
import { getConditionImageUrls } from "@/lib/api/transformers";
import type { ConditionSectionProps, ImageBadge } from "../types";

// Mapping condition ID -> API condition name
const CONDITION_ID_TO_API: Record<string, string> = {
  parfait: "Parfait",
  "tres-bon": "Tres bon",
  correct: "Correct",
  imparfait: "Imparfait",
};

// Badges per condition (keys resolved via useTranslations)
const CONDITION_BADGE_KEYS: Record<string, { icon: ImageBadge["icon"]; labelKey: string }[]> = {
  parfait: [
    { icon: "scratches", labelKey: "conditionBadges.noWear" },
    { icon: "verified", labelKey: "conditionBadges.verifiedParts" },
    { icon: "battery", labelKey: "conditionBadges.optimalBattery" },
  ],
  "tres-bon": [
    { icon: "scratches", labelKey: "conditionBadges.microScratches" },
    { icon: "verified", labelKey: "conditionBadges.verifiedParts" },
    { icon: "battery", labelKey: "conditionBadges.normalBattery" },
  ],
  correct: [
    { icon: "scratches", labelKey: "conditionBadges.lightWear" },
    { icon: "verified", labelKey: "conditionBadges.verifiedParts" },
    { icon: "battery", labelKey: "conditionBadges.normalBattery" },
  ],
  imparfait: [
    { icon: "scratches", labelKey: "conditionBadges.visibleWear" },
    { icon: "verified", labelKey: "conditionBadges.verifiedParts" },
    { icon: "battery", labelKey: "conditionBadges.normalBattery" },
  ],
};

/**
 * ConditionSection - Product condition selection with images gallery
 *
 * Allows users to select the cosmetic condition of the device.
 * Displays a gallery of images for each condition when available.
 * Conditions: Parfait, Tres bon, Correct, Imparfait
 */
function ConditionSectionComponent({
  conditions,
  selectedCondition,
  onConditionChange,
  conditionImages,
  fallbackImageUrl,
}: ConditionSectionProps) {
  const t = useTranslations("product.configurator");

  // Get all image URLs for selected condition
  const selectedConditionImages = useMemo(() => {
    if (!conditionImages) return [];
    const apiCondition = CONDITION_ID_TO_API[selectedCondition] || selectedCondition;
    return getConditionImageUrls(conditionImages, apiCondition);
  }, [conditionImages, selectedCondition]);

  // Use fallback image if no model-specific images
  const displayImages = selectedConditionImages.length > 0
    ? selectedConditionImages
    : fallbackImageUrl
      ? [fallbackImageUrl]
      : undefined;

  // Get badges and label for current condition
  const imageBadges = (CONDITION_BADGE_KEYS[selectedCondition] || []).map(b => ({ icon: b.icon, label: t(b.labelKey) }));
  const imageLabel = t("conditionBadges.caseLabel");

  if (conditions.length === 0) return null;

  const title = t("conditionTitle");
  const description = t("conditionDesc");

  return (
    <ConfigSection
      title={title}
      description={description}
      imageUrls={displayImages}
      imageAlt={`Condition ${selectedCondition}`}
      imageLabel={imageLabel}
      imageBadges={imageBadges}
      showIllustrationLabel
    >
      {conditions.map((condition) => (
        <RadioOption
          key={condition.id}
          selected={selectedCondition === condition.id}
          onClick={() => condition.available && onConditionChange(condition.id)}
          label={t(`conditions.${condition.id}`)}
          sublabel={t(`conditionDesc_${condition.id}`)}
          price={
            condition.available
              ? `${condition.price} EUR`
              : undefined
          }
          soldOut={!condition.available}
          soldOutLabel={t("soldOut")}
          badge={
            condition.isBestSeller && condition.available
              ? t("bestSellerBadge")
              : undefined
          }
          disabled={!condition.available}
        />
      ))}
    </ConfigSection>
  );
}

export const ConditionSection = memo(ConditionSectionComponent);
