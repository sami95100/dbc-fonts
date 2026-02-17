"use client";

import { memo } from "react";
import { useTranslations } from "next-intl";
import { ConfigSection } from "../ConfigSection";
import { ColorSelector } from "../ColorSelector";
import type { ProductColor } from "@/data/mock/products";
import type { ModelImagesByColor } from "@/types/product";
import { getImageUrls } from "@/lib/api/transformers";

import type { AvailableOption } from "@/lib/api/products";

export interface ColorSectionProps {
  colors: ProductColor[];
  selectedColor: string;
  onColorChange: (color: string) => void;
  colorImages?: ModelImagesByColor;
  /** Available color options from stock check */
  availableColors?: AvailableOption[];
}

/**
 * ColorSection - Product color selection with images gallery
 *
 * Allows users to select the color of the device.
 * Displays a gallery of images for each color when available.
 *
 * Reusable for any device type (iPhone, Samsung, Mac, etc.)
 *
 * @example
 * <ColorSection
 *   colors={product.colors}
 *   selectedColor={selectedColor}
 *   onColorChange={setSelectedColor}
 *   colorImages={colorImages}
 * />
 */
function ColorSectionComponent({
  colors,
  selectedColor,
  onColorChange,
  colorImages,
  availableColors,
}: ColorSectionProps) {
  const t = useTranslations("product.configurator");

  // Get all image URLs for selected color
  const selectedColorImages = colorImages
    ? getImageUrls(colorImages, selectedColor)
    : [];

  if (colors.length === 0) return null;

  const title = t("colorTitle");

  return (
    <ConfigSection
      title={title}
      imageUrls={selectedColorImages.length > 0 ? selectedColorImages : undefined}
      imageAlt={`${selectedColor}`}
    >
      <ColorSelector
        colors={colors}
        selectedColor={selectedColor}
        onColorChange={onColorChange}
        availableColors={availableColors}
      />
    </ConfigSection>
  );
}

export const ColorSection = memo(ColorSectionComponent);
