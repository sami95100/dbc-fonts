"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect, useCallback } from "react";
import { useInView } from "@/hooks/useInView";

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
  const { ref: inViewRef, isInView } = useInView();

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
      left: direction === "left" ? -320 : 320,
      behavior: "smooth",
    });
  };

  return (
    <section ref={inViewRef} className={`relative py-8 md:py-12 lg:py-16 transition-[opacity,transform] duration-[0.6s] ease-[cubic-bezier(0.25,0.1,0.25,1)] will-change-[opacity,transform] ${isInView ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`}>

      {/* Title */}
      <div className="relative mx-auto max-w-7xl px-4">
        <div className="mb-8 md:mb-10">
          <h2 className="text-[28px] font-bold leading-tight tracking-tight text-gray-900 md:text-[32px] lg:text-[36px]">
            {t("promoDeals.title")}{" "}
            <span className="font-normal text-gray-500">{t("promoDeals.titleAccent")}</span>
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
          className="flex gap-3 overflow-x-auto scroll-smooth px-4 pb-6 scrollbar-hide md:gap-4 md:px-8"
        >
            {PROMO_PRODUCTS.map((product) => (
              <Link
                key={product.slug}
                href={`/${locale}/products/${product.slug}`}
                className="group flex w-[280px] shrink-0 flex-col overflow-hidden rounded-3xl bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg md:w-[320px] lg:w-[370px]"
              >
                {/* Product name */}
                <div className="px-6 pt-6">
                  <h3 className="text-[19px] font-semibold leading-tight text-gray-900">
                    {product.name}
                  </h3>
                </div>

                {/* Product image */}
                <div className="relative mx-auto my-4 aspect-[3/4] w-[55%]">
                  <span className="absolute -right-8 -top-2 z-10 rounded-full bg-highlight px-3 py-1.5 text-sm font-bold text-primary">
                    {product.badge}
                  </span>
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 140px, (max-width: 1024px) 160px, 180px"
                  />
                </div>

                {/* Color dots */}
                <div className="flex items-center justify-center gap-2 pb-4">
                  {product.colors.map((color) => (
                    <span
                      key={color}
                      className="h-3 w-3 rounded-full border border-gray-200"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                {/* Price + CTA */}
                <div className="flex items-end justify-between px-6 pb-6">
                  <div>
                    <p className="text-xs text-gray-500">{t("promoDeals.from")}</p>
                    <p className="text-lg font-bold text-gray-900">
                      {product.priceFrom} &euro;
                    </p>
                  </div>
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
