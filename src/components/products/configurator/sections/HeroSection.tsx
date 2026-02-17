"use client";

import { memo, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Star, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ImageGallery } from "../ImageGallery";
import { TrustBadges, DeliveryIcon, ReturnIcon, ShieldIcon } from "../TrustBadges";
import type { HeroSectionProps } from "../types";

/**
 * HeroSection - Main product display section
 *
 * Displays:
 * - Product image gallery (left)
 * - Product info: name, rating, price, CTA, PayPal, trust badges, colors (right)
 *
 * Reusable for any product type.
 *
 * @example
 * <HeroSection
 *   product={product}
 *   selection={selection}
 *   variantInfo={variantInfo}
 *   isLoading={isLoading}
 *   images={colorImages}
 *   onColorChange={setSelectedColor}
 *   onAddToCart={handleAddToCart}
 * />
 */
function HeroSectionComponent({
  product,
  selection,
  variantInfo,
  isLoading,
  images,
  onColorChange,
  onAddToCart,
}: HeroSectionProps) {
  const t = useTranslations("product");
  const tCommon = useTranslations("common");
  const locale = useLocale();

  // Calculate prices
  const currentCondition = product.conditions.find((c) => c.id === selection.condition);
  const basePrice = currentCondition?.price || product.priceFrom;
  const batteryExtra = selection.battery === "new" ? product.batteryOptions.new.price : 0;
  const totalPrice = basePrice + batteryExtra;

  const savings = product.priceNew - totalPrice;
  const isOutOfStock = variantInfo ? variantInfo.quantity === 0 : false;

  // Trust badges config
  const trustBadges = useMemo(() => [
    {
      icon: <DeliveryIcon />,
      title: t("configurator.freeDelivery"),
    },
    {
      icon: <ReturnIcon />,
      title: t("configurator.freeReturns"),
      subtitle: t("configurator.warrantyMonths"),
    },
    {
      icon: <ShieldIcon />,
      title: t("configurator.qualityPledge"),
    },
  ], [t]);

  return (
    <section className="grid gap-8 py-8 lg:grid-cols-2 lg:items-start">
      {/* Left: Image Gallery */}
      <ImageGallery
        images={images}
        productName={product.name}
        fallbackImage={`/images/products/${product.id}/main.png`}
      />

      {/* Right: Product Info */}
      <div>
        {/* Title & Rating */}
        <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
          {product.name}
        </h1>
        <div className="mt-2 flex items-center gap-2">
          <StarRating rating={product.rating} />
          <span className="text-sm text-gray-600">
            {product.rating}/5 ({product.reviewCount.toLocaleString(locale)} {t("reviews")})
          </span>
        </div>

        {/* Price & CTA */}
        <div className="mt-6 flex items-center gap-4">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-gray-900">{totalPrice} EUR</span>
              {product.priceNew > 0 && (
                <span className="text-lg text-gray-400 line-through">
                  {product.priceNew} EUR {tCommon("new")}
                </span>
              )}
            </div>
            {savings > 0 && (
              <p className="mt-1 text-sm font-medium text-green-600">
                {t("savings", { amount: savings })}
              </p>
            )}
            {isOutOfStock && (
              <p className="mt-1 text-sm font-medium text-gray-500">
                {t("configurator.alreadySold")}
              </p>
            )}
          </div>
          <Button
            size="lg"
            disabled={isOutOfStock || isLoading}
            onClick={onAddToCart}
            className="hidden rounded-xl bg-green-700 px-8 py-6 text-lg font-semibold text-white hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-gray-300 lg:inline-flex"
          >
            {isLoading ? (
              <LoadingSpinner />
            ) : isOutOfStock ? (
              t("configurator.alreadySold")
            ) : (
              t("addToCart")
            )}
          </Button>
        </div>

        {/* PayPal */}
        <div className="mt-3 flex items-center gap-0.5 text-xs text-gray-500">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/paypal1.svg" alt="" className="h-4 w-auto" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/paypal.svg" alt="PayPal" className="h-4 w-auto" />
          <span className="ml-1">
            {t("configurator.payInstallments", { amount: Math.round(totalPrice / 4).toFixed(2) })}
          </span>
          <a href="#" className="ml-1 text-blue-600 underline">
            {t("configurator.learnMore")}
          </a>
        </div>

        {/* Trust badges */}
        <div className="mt-6">
          <TrustBadges items={trustBadges} />
        </div>
      </div>
    </section>
  );
}

// Star rating component
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center" aria-label={`Rating: ${rating} out of 5`}>
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={cn("h-4 w-4", i < Math.floor(rating) ? "fill-current text-yellow-400" : "text-gray-300")}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

function LoadingSpinner() {
  return (
    <span className="flex items-center gap-2">
      <Loader2 className="h-5 w-5 animate-spin" />
    </span>
  );
}

export const HeroSection = memo(HeroSectionComponent);
