"use client";

import { memo, useMemo } from "react";
import { useLocale } from "next-intl";
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

// Mapping condition ID -> image label
const CONDITION_IMAGE_LABELS: Record<string, { fr: string; en: string }> = {
  parfait: { fr: "Coque", en: "Case" },
  "tres-bon": { fr: "Coque", en: "Case" },
  correct: { fr: "Coque", en: "Case" },
  imparfait: { fr: "Coque", en: "Case" },
};

// Badges per condition (different wear descriptions)
const CONDITION_BADGES: Record<string, { fr: ImageBadge[]; en: ImageBadge[] }> = {
  parfait: {
    fr: [
      { icon: "scratches", label: "Aucun signe d'usure" },
      { icon: "verified", label: "Pieces verifiees" },
      { icon: "battery", label: "Batterie optimale" },
    ],
    en: [
      { icon: "scratches", label: "No signs of wear" },
      { icon: "verified", label: "Verified parts" },
      { icon: "battery", label: "Optimal battery" },
    ],
  },
  "tres-bon": {
    fr: [
      { icon: "scratches", label: "Micro-rayures invisibles" },
      { icon: "verified", label: "Pieces verifiees" },
      { icon: "battery", label: "Batterie pour usage normal" },
    ],
    en: [
      { icon: "scratches", label: "Invisible micro-scratches" },
      { icon: "verified", label: "Verified parts" },
      { icon: "battery", label: "Battery for normal use" },
    ],
  },
  correct: {
    fr: [
      { icon: "scratches", label: "Legers signes d'usure" },
      { icon: "verified", label: "Pieces verifiees" },
      { icon: "battery", label: "Batterie pour usage normal" },
    ],
    en: [
      { icon: "scratches", label: "Light signs of wear" },
      { icon: "verified", label: "Verified parts" },
      { icon: "battery", label: "Battery for normal use" },
    ],
  },
  imparfait: {
    fr: [
      { icon: "scratches", label: "Signes visibles d'usure" },
      { icon: "verified", label: "Pieces verifiees" },
      { icon: "battery", label: "Batterie pour usage normal" },
    ],
    en: [
      { icon: "scratches", label: "Visible signs of wear" },
      { icon: "verified", label: "Verified parts" },
      { icon: "battery", label: "Battery for normal use" },
    ],
  },
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
  const locale = useLocale();
  const isFr = locale === "fr";

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
  const imageBadges = CONDITION_BADGES[selectedCondition]?.[isFr ? "fr" : "en"] || [];
  const imageLabel = CONDITION_IMAGE_LABELS[selectedCondition]?.[isFr ? "fr" : "en"];

  if (conditions.length === 0) return null;

  const title = isFr
    ? "Selectionnez la condition"
    : "Select condition";

  const description = isFr
    ? "Tous les appareils sont testes et verifies par des pros, garantis 100% fonctionnels."
    : "All devices are tested and verified by professionals, guaranteed 100% functional.";

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
          label={locale === "fr" ? condition.nameFr : condition.name}
          sublabel={locale === "fr" ? condition.descriptionFr : condition.description}
          price={
            condition.available
              ? `${condition.price} EUR`
              : undefined
          }
          soldOut={!condition.available}
          soldOutLabel={locale === "fr" ? "Deja vendu" : "Sold out"}
          badge={
            condition.isBestSeller && condition.available
              ? locale === "fr"
                ? "Best-seller"
                : "Best seller"
              : undefined
          }
          disabled={!condition.available}
        />
      ))}
    </ConfigSection>
  );
}

export const ConditionSection = memo(ConditionSectionComponent);
