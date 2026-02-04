"use client";

import { memo, useMemo } from "react";
import { useTranslations, useLocale } from "next-intl";
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
      title: locale === "fr" ? "Livraison standard offerte" : "Free standard delivery",
    },
    {
      icon: <ReturnIcon />,
      title: locale === "fr" ? "Retour gratuit sous 30 jours" : "Free 30-day returns",
      subtitle: locale === "fr" ? "Garantie commerciale 12 mois" : "12-month warranty",
    },
    {
      icon: <ShieldIcon />,
      title: locale === "fr" ? "Pacte Qualite" : "Quality Pledge",
    },
  ], [locale]);

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
                  {product.priceNew} EUR {locale === "fr" ? "neuf" : "new"}
                </span>
              )}
            </div>
            {savings > 0 && (
              <p className="mt-1 text-sm font-medium text-green-600">
                {locale === "fr" ? `Economisez ${savings} EUR` : `Save ${savings} EUR`}
              </p>
            )}
            {isOutOfStock && (
              <p className="mt-1 text-sm font-medium text-gray-500">
                {locale === "fr" ? "Deja vendu" : "Already sold"}
              </p>
            )}
          </div>
          <Button
            size="lg"
            disabled={isOutOfStock || isLoading}
            onClick={onAddToCart}
            className="hidden rounded-xl bg-gray-900 px-8 py-6 text-lg font-semibold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-300 lg:inline-flex"
          >
            {isLoading ? (
              <LoadingSpinner />
            ) : isOutOfStock ? (
              locale === "fr" ? "Deja vendu" : "Already sold"
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
            {locale === "fr"
              ? `Payez en 4 echeances de ${Math.round(totalPrice / 4).toFixed(2).replace(".", ",")}€ sans frais.`
              : `Pay in 4 installments of €${Math.round(totalPrice / 4).toFixed(2)} interest-free.`}
          </span>
          <a href="#" className="ml-1 text-blue-600 underline">
            {locale === "fr" ? "En savoir plus" : "Learn more"}
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
        <svg
          key={i}
          className={`h-4 w-4 ${i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function LoadingSpinner() {
  return (
    <span className="flex items-center gap-2">
      <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" aria-hidden="true">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
    </span>
  );
}

export const HeroSection = memo(HeroSectionComponent);
