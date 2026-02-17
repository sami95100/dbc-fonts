import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { Product } from "@/data/mock/products";
import { getProductImage } from "@/data/mock/products";

interface ProductCardProps {
  product: Product;
}

function ProductCardComponent({ product }: ProductCardProps) {
  const locale = useLocale();
  const t = useTranslations("common");

  const imagePath = getProductImage(product);

  // Determiner la categorie pour l'URL
  const categorySlug = product.category === "tablets" ? "tablets" : "smartphones";

  return (
    <Link
      href={`/${locale}/products/${categorySlug}/${product.brandSlug}/${product.slug}`}
      className="group block rounded-2xl border border-gray-100 bg-white p-4 transition-shadow hover:shadow-lg"
    >
      {/* Mobile: Horizontal layout / Desktop: Vertical layout */}
      <div className="flex gap-4 sm:block">
        {/* Product Image */}
        <div className="relative aspect-square w-28 shrink-0 overflow-hidden rounded-xl sm:mb-4 sm:w-full">
          <Image
            src={imagePath}
            alt={product.name}
            fill
            className="object-contain"
            sizes="(max-width: 640px) 112px, (max-width: 1024px) 33vw, 25vw"
          />
        </div>

        {/* Product Info */}
        <div className="flex min-w-0 flex-1 flex-col sm:block">
          {/* Product name */}
          <h3 className="mb-1 font-semibold text-gray-900 group-hover:text-gray-700">
            {product.name}
          </h3>

          {/* Rating */}
          <div className="mb-2 flex items-center gap-1">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-3.5 w-3.5",
                    i < Math.floor(product.rating)
                      ? "fill-current text-yellow-400"
                      : "text-gray-200"
                  )}
                />
              ))}
            </div>
            <span className="text-xs text-gray-500">
              {product.rating}/5 ({product.reviewCount.toLocaleString("fr-FR")})
            </span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-xs text-gray-500">{t("from")}</span>
            <span className="text-lg font-bold text-gray-900">
              {product.priceFrom.toLocaleString("fr-FR")} €
            </span>
          </div>

          {/* Original price */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400 line-through">
              {product.priceNew.toLocaleString("fr-FR")} € {t("new")}
            </span>
          </div>

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
