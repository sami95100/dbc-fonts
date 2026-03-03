import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Smartphone, Star } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import type { Product } from "@/data/mock/products";

interface ProductCardProps {
  product: Product;
}

const CATEGORY_SLUG_MAP: Record<string, string> = {
  smartphones: "smartphones",
  tablets: "tablets",
  laptops: "laptops",
  smartwatches: "smartwatches",
  audio: "audio",
};

function ProductCardComponent({ product }: ProductCardProps) {
  const locale = useLocale();
  const t = useTranslations("common");
  const tPromo = useTranslations("promo");

  const imageUrl = product.primaryImageUrl;

  const categorySlug = CATEGORY_SLUG_MAP[product.category] || "smartphones";
  const productHref =
    product.externalProductUrl ||
    `/${locale}/products/${categorySlug}/${product.brandSlug}/${product.slug}`;

  return (
    <Link
      href={productHref}
      className="group block rounded-2xl border border-gray-100 bg-white p-4 transition-shadow hover:shadow-lg"
      prefetch={!product.externalProductUrl}
    >
      {/* Mobile: Horizontal layout / Desktop: Vertical layout */}
      <div className="flex gap-4 sm:block">
        {/* Product Image wrapper - no overflow so badge isn't clipped */}
        <div className="relative w-28 shrink-0 sm:mb-4 sm:w-full">
          {product.isPromo && (
            <span className="absolute top-0 -right-1 z-10 -translate-y-1/2 rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold text-white">
              {tPromo("badge")}
            </span>
          )}
          <div className="relative aspect-square overflow-hidden rounded-xl">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name}
              fill
              className="object-contain"
              sizes="(max-width: 640px) 112px, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-50">
              <Smartphone className="h-12 w-12 text-gray-300" />
            </div>
          )}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex min-w-0 flex-1 flex-col sm:block">
          {/* Review stars (fixed height to keep titles aligned) */}
          <div className="mb-1 h-4">
            {product.reviewCount > 0 && (
              <div className="flex items-center gap-1">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={
                        star <= Math.round(product.rating)
                          ? "h-3 w-3 fill-highlight text-highlight"
                          : "h-3 w-3 fill-gray-200 text-gray-200"
                      }
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500">({product.reviewCount})</span>
              </div>
            )}
          </div>

          {/* Product name */}
          <h3 className="mb-1 font-semibold text-gray-900 group-hover:text-gray-700">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-xs text-gray-500">{t("from")}</span>
            <span className="text-lg font-bold text-gray-900">
              {product.priceFrom.toLocaleString(locale)} €
            </span>
          </div>

          {/* Original price */}
          {product.priceNew > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400 line-through">
                {product.priceNew.toLocaleString(locale)} € {t("new")}
              </span>
            </div>
          )}

          {/* Color dots - at bottom on mobile, after image on desktop */}
          <div className="mt-auto flex items-center gap-1 pt-2 sm:mt-0 sm:pt-0 sm:order-first sm:mb-3">
            {product.colors.slice(0, 4).map((color, index) => (
              <span
                key={index}
                className="h-3 w-3 rounded-full border border-gray-200"
                style={{ backgroundColor: color.hex }}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-xs text-gray-500">+{product.colors.length - 4}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export const ProductCard = memo(ProductCardComponent);
