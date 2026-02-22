"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect, useCallback } from "react";

const PROMO_PRODUCTS = [
  {
    slug: "apple/iphone-16-pro-max",
    name: "iPhone 16 Pro Max",
    image: "/images/products/apple/iphone-16-pro-max/image.png",
    priceFrom: 899,
    colors: ["#1d1d1f", "#f5f5f7", "#4b4845", "#d4c5b3"],
    badge: "-15%",
  },
  {
    slug: "apple/iphone-16-pro",
    name: "iPhone 16 Pro",
    image: "/images/products/apple/iphone-16-pro/image.png",
    priceFrom: 683,
    colors: ["#1d1d1f", "#f5f5f7", "#4b4845"],
    badge: "-20%",
  },
  {
    slug: "apple/iphone-15-pro-max",
    name: "iPhone 15 Pro Max",
    image: "/images/products/apple/iphone-15-pro-max/image.png",
    priceFrom: 639,
    colors: ["#1d1d1f", "#f5f5f7", "#4b4845", "#d4c5b3"],
    badge: "-25%",
  },
  {
    slug: "apple/iphone-16",
    name: "iPhone 16",
    image: "/images/products/apple/iphone-16/image.png",
    priceFrom: 549,
    colors: ["#1d1d1f", "#f5f5f7", "#e3c8d0", "#c8d8e3"],
    badge: "-10%",
  },
  {
    slug: "apple/iphone-15",
    name: "iPhone 15",
    image: "/images/products/apple/iphone-15/image.png",
    priceFrom: 449,
    colors: ["#1d1d1f", "#f5f5f7", "#e3c8d0"],
    badge: "-30%",
  },
] as const;

export function PromoDeals() {
  const locale = useLocale();
  const t = useTranslations("home");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction === "left" ? -280 : 280,
      behavior: "smooth",
    });
  };

  return (
    <section className="relative overflow-hidden bg-gray-100 py-8 md:py-12 lg:py-16">

      {/* Title */}
      <div className="relative mx-auto max-w-7xl px-4">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
            {t("promoDeals.title")}{" "}
            <br className="md:hidden" />
            <span className="italic text-green-700">
              {t("promoDeals.titleAccent")}
            </span>
          </h2>
        </div>
      </div>

      {/* Carousel - full width */}
      <div className="relative">
        {/* Left arrow */}
        <button
          onClick={() => scroll("left")}
          className={`absolute left-4 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition-opacity hover:bg-gray-50 md:flex ${
            canScrollLeft ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          aria-label={t("hero.previous")}
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>

        {/* Scroll container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth px-4 scrollbar-hide md:overflow-hidden md:px-8"
        >
            {PROMO_PRODUCTS.map((product) => (
              <Link
                key={product.slug}
                href={`/${locale}/products/${product.slug}`}
                className="group flex w-[220px] shrink-0 flex-col rounded-2xl bg-white p-4 transition-shadow hover:shadow-md md:w-[260px] lg:w-[300px]"
              >
                {/* Product name */}
                <h3 className="text-lg font-bold text-gray-900">
                  {product.name}
                </h3>

                {/* Product image */}
                <div className="relative my-4 aspect-square w-full overflow-hidden">
                  <span className="absolute right-2 top-2 z-10 rounded-full px-2.5 py-1 text-xs font-bold" style={{ backgroundColor: "#D8E143", color: "#034638" }}>
                    {product.badge}
                  </span>
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 220px, (max-width: 1024px) 260px, 300px"
                  />
                </div>

                {/* Color dots */}
                <div className="mb-4 flex items-center justify-center gap-1.5">
                  {product.colors.map((color) => (
                    <span
                      key={color}
                      className="h-3 w-3 rounded-full border border-gray-200"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                {/* Price + CTA */}
                <div className="flex items-end justify-between">
                  <p className="text-sm text-gray-600">
                    {product.priceFrom} &euro;
                  </p>
                  <span className="rounded-full bg-green-700 px-4 py-2 text-sm font-semibold text-white transition-colors group-hover:bg-green-800">
                    {t("promoDeals.buy")}
                  </span>
                </div>
              </Link>
            ))}
          </div>

        {/* Right arrow */}
        <button
          onClick={() => scroll("right")}
          className={`absolute right-4 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition-opacity hover:bg-gray-50 md:flex ${
            canScrollRight ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          aria-label={t("hero.next")}
        >
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </button>
      </div>
    </section>
  );
}
