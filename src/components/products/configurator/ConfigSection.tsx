"use client";

import { memo, useState, useEffect } from "react";
import Image from "next/image";
import type { ConfigSectionProps, ImageBadge } from "./types";

// Badge icons
function ScratchesIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" d="M4 4l4 4M8 4l-4 4M12 8l4 4M16 8l-4 4M8 16l4 4M12 16l-4 4" />
    </svg>
  );
}

function VerifiedIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function BatteryIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <rect x="2" y="7" width="18" height="10" rx="2" />
      <path d="M22 10v4" strokeLinecap="round" />
      <path d="M6 10v4M10 10v4M14 10v4" strokeLinecap="round" />
    </svg>
  );
}

function ScreenIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <rect x="5" y="3" width="14" height="18" rx="2" />
      <path d="M12 18h.01" strokeLinecap="round" />
    </svg>
  );
}

function CoqueIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
      <rect x="6" y="2" width="12" height="20" rx="3" />
      <path d="M9 6h6M9 18h6" strokeLinecap="round" />
    </svg>
  );
}

function getBadgeIcon(icon: ImageBadge["icon"], className: string) {
  switch (icon) {
    case "scratches":
      return <ScratchesIcon className={className} />;
    case "verified":
      return <VerifiedIcon className={className} />;
    case "battery":
      return <BatteryIcon className={className} />;
    case "screen":
      return <ScreenIcon className={className} />;
    case "coque":
      return <CoqueIcon className={className} />;
    default:
      return null;
  }
}

/**
 * ConfigSection - Layout component for product configuration sections
 *
 * Displays a section with optional image(s) on the left and content on the right.
 * Supports single image (imageUrl) or multiple images (imageUrls) with gallery.
 * Now supports badges overlay on images (like BackMarket's condition badges).
 */
function ConfigSectionComponent({
  title,
  description,
  imageUrl,
  imageUrls,
  imageAlt,
  imageLabel,
  imageBadges,
  showIllustrationLabel,
  children,
}: ConfigSectionProps) {
  // Combine imageUrl and imageUrls into a single array
  const images = imageUrls?.length ? imageUrls : imageUrl ? [imageUrl] : [];
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Reset to first image when images change
  useEffect(() => {
    setSelectedIndex(0);
  }, [images.length, images[0]]);

  const currentImage = images[selectedIndex];
  const hasMultipleImages = images.length > 1;
  const hasBadges = imageBadges && imageBadges.length > 0;

  return (
    <section className="grid gap-6 border-t border-gray-200 py-10 first:border-t-0 lg:grid-cols-2 lg:items-center lg:gap-12 lg:py-12">
      {/* Image Gallery */}
      <div className="space-y-3">
        {/* Main Image with badges overlay */}
        <div className="relative aspect-square max-w-md overflow-hidden rounded-3xl bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100">
          {currentImage ? (
            <>
              <Image
                src={currentImage}
                alt={imageAlt || title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 400px"
                unoptimized={currentImage.startsWith("http")}
              />

              {/* "Image d'illustration" label */}
              {showIllustrationLabel && (
                <div className="absolute right-3 top-3">
                  <span className="rounded-md bg-white/90 px-2 py-1 text-xs font-medium text-gray-600 shadow-sm backdrop-blur-sm">
                    Image d&apos;illustration
                  </span>
                </div>
              )}

              {/* Image label and badges overlay */}
              {(imageLabel || hasBadges) && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 pt-16">
                  {imageLabel && (
                    <h3 className="mb-3 text-2xl font-bold text-white">{imageLabel}</h3>
                  )}
                  {hasBadges && (
                    <div className="flex flex-wrap gap-2">
                      {imageBadges.map((badge, idx) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-medium text-gray-800 shadow-sm"
                        >
                          {getBadgeIcon(badge.icon, "h-4 w-4")}
                          {badge.label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="h-24 w-24 rounded-full bg-gray-200" />
            </div>
          )}
        </div>

        {/* Thumbnails and navigation */}
        {hasMultipleImages && (
          <div className="flex max-w-md items-center justify-between">
            {/* Dot indicators */}
            <div className="flex gap-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedIndex(index)}
                  className={`h-2.5 w-2.5 rounded-full transition-colors ${
                    selectedIndex === index ? "bg-gray-900" : "bg-gray-300"
                  }`}
                  aria-label={`Image ${index + 1}`}
                />
              ))}
            </div>

            {/* Arrow navigation */}
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-white transition-colors hover:bg-gray-700"
                aria-label="Image precedente"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={() => setSelectedIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-white transition-colors hover:bg-gray-700"
                aria-label="Image suivante"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div>
        <h2 className="mb-3 text-xl font-bold text-gray-900 md:text-2xl">
          {title}
        </h2>

        {description && (
          <div className="mb-4 flex items-start gap-2.5 rounded-xl bg-gray-50 p-3">
            <InfoIcon className="mt-0.5 h-4 w-4 shrink-0 text-gray-500" />
            <p className="text-xs text-gray-500">{description}</p>
          </div>
        )}

        <div className="space-y-4">{children}</div>
      </div>
    </section>
  );
}

// Info icon component
function InfoIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

export const ConfigSection = memo(ConfigSectionComponent);
