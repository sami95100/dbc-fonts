"use client";

import { useState, useEffect, memo } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { ImageGalleryProps } from "./types";

/**
 * ImageGallery - Product image gallery with thumbnails
 *
 * Displays a main image with vertical thumbnail navigation.
 * Automatically resets to first image when images array changes.
 * Sticky on desktop for better UX while scrolling.
 *
 * @example
 * <ImageGallery
 *   images={colorImages}
 *   productName="iPhone 15 Pro"
 *   fallbackImage="/images/placeholder.png"
 * />
 */
function ImageGalleryComponent({
  images,
  productName,
  fallbackImage,
}: ImageGalleryProps) {
  const t = useTranslations("product");
  const [currentIndex, setCurrentIndex] = useState(0);

  // Reset to first image when images change
  useEffect(() => {
    setCurrentIndex(0);
  }, [images]);

  const displayImages = images.length > 0 ? images : [fallbackImage];
  const currentImage = displayImages[currentIndex] || displayImages[0];
  const showThumbnails = displayImages.length > 1;

  return (
    <div className="lg:sticky lg:top-24">
      <div className="flex gap-4">
        {/* Vertical thumbnails */}
        {showThumbnails && (
          <div className="flex flex-col gap-2" role="tablist" aria-label={t("productImages")}>
            {displayImages.map((img, idx) => (
              <button
                key={`${img}-${idx}`}
                type="button"
                role="tab"
                aria-selected={currentIndex === idx}
                aria-label={t("viewImage", { current: idx + 1, total: displayImages.length })}
                onClick={() => setCurrentIndex(idx)}
                className={cn(
                  "relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-150",
                  currentIndex === idx
                    ? "border-green-700"
                    : "border-gray-200 hover:border-gray-300"
                )}
              >
                <Image
                  src={img}
                  alt={`${productName} thumbnail ${idx + 1}`}
                  fill
                  className="object-contain p-1"
                  sizes="64px"
                  unoptimized={img.startsWith("http")}
                />
              </button>
            ))}
          </div>
        )}

        {/* Main image */}
        <div
          className="relative flex-1 aspect-square overflow-hidden rounded-2xl"
          role="tabpanel"
        >
          <Image
            src={currentImage}
            alt={productName}
            fill
            className="object-contain p-8"
            sizes="(max-width: 768px) 100vw, 50vw"
            priority
            unoptimized={currentImage.startsWith("http")}
          />
        </div>
      </div>

      {/* Mobile dot indicators */}
      {showThumbnails && (
        <div className="mt-4 flex justify-center gap-2 lg:hidden" role="tablist">
          {displayImages.map((_, idx) => (
            <button
              key={idx}
              type="button"
              role="tab"
              aria-selected={currentIndex === idx}
              aria-label={t("goToImage", { index: idx + 1 })}
              onClick={() => setCurrentIndex(idx)}
              className={cn(
                "h-2 w-2 rounded-full transition-colors",
                currentIndex === idx ? "bg-green-700" : "bg-gray-300"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export const ImageGallery = memo(ImageGalleryComponent);
