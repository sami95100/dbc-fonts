import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import type { Product } from "@/data/mock/products";
import { getProductImage } from "@/data/mock/products";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
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
                <svg
                  key={i}
                  className={`h-3.5 w-3.5 ${
                    i < Math.floor(product.rating)
                      ? "text-yellow-400"
                      : "text-gray-200"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
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
