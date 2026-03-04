"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect, useCallback } from "react";
import { useInView } from "@/hooks/useInView";

export interface PromoProduct {
  slug: string;
  name: string;
  brand: string;
  imageUrl: string | null;
  priceFrom: number;
  colors: string[];
  badge: string | null;
}

interface PromoDealsCarouselProps {
  products: PromoProduct[];
}

export function PromoDealsCarousel({ products }: PromoDealsCarouselProps) {
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
  }, [checkScroll, products]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction === "left" ? -200 : 200,
      behavior: "smooth",
    });
  };

  if (products.length === 0) return null;

  return (
    <section
      ref={inViewRef}
      className={`relative py-8 md:py-12 transition-[opacity,transform] duration-[0.6s] ease-[cubic-bezier(0.25,0.1,0.25,1)] will-change-[opacity,transform] ${isInView ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`}
    >
      {/* Title */}
      <div className="mx-auto max-w-7xl px-5">
        <div className="mb-6">
          <h2 className="text-[24px] font-bold leading-tight tracking-tight text-gray-900 md:text-[28px]">
            {t("promoDeals.title")}{" "}
            <span className="font-normal text-gray-400">
              {t("promoDeals.titleAccent")}
            </span>
          </h2>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative">
        {/* Left arrow */}
        <button
          onClick={() => scroll("left")}
          className={`absolute left-2 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md transition-opacity md:flex ${canScrollLeft ? "opacity-100" : "pointer-events-none opacity-0"}`}
          aria-label={t("hero.previous")}
        >
          <ChevronLeft className="h-4 w-4 text-gray-600" />
        </button>

        {/* Scroll container */}
        <div
          ref={scrollRef}
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-5 pb-4 scrollbar-hide"
        >
          {products.map((product) => (
            <Link
              key={product.slug}
              href={`/${locale}/products/${product.slug}`}
              className="group relative flex w-[180px] shrink-0 snap-start flex-col rounded-2xl bg-white p-4 pb-4 shadow-sm ring-1 ring-gray-100 transition-all duration-300 hover:shadow-md hover:ring-gray-200 md:w-[200px]"
            >
              {/* Image with sticker badge */}
              <div className="relative mx-auto mt-2 flex aspect-square w-[85%] items-center justify-center overflow-visible">
                {/* Best-seller sticker — top-right of the iPhone image */}
                {product.badge && (
                  <div
                    className="absolute -right-2 -top-2 z-10 flex h-10 w-10 items-center justify-center md:h-12 md:w-12"
                    style={{ transform: "rotate(12deg)" }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/assets/taches/tache-10-highlight.svg"
                      alt=""
                      className="pointer-events-none absolute inset-0 h-full w-full"
                      aria-hidden="true"
                    />
                    <span className="relative text-center font-display text-[9px] font-bold leading-[1.1] text-primary md:text-[10px]">
                      Best<br />seller
                    </span>
                  </div>
                )}
                {product.imageUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    width={160}
                    height={160}
                    className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-xl bg-gray-50">
                    <span className="text-2xl text-gray-200">?</span>
                  </div>
                )}
              </div>

              {/* Name — centered */}
              <h3 className="mt-3 text-center text-[13px] font-semibold leading-tight text-gray-900">
                {product.name}
              </h3>

              {/* Color dots — centered, bigger */}
              {product.colors.length > 0 && (
                <div className="mt-2 flex flex-wrap items-center justify-center gap-1.5">
                  {product.colors.map((hex, i) => (
                    <span
                      key={i}
                      className="h-2.5 w-2.5 rounded-full ring-1 ring-gray-200"
                      style={{ backgroundColor: hex }}
                    />
                  ))}
                </div>
              )}

              {/* Price — bottom left */}
              <div className="mt-auto pt-3">
                <p className="text-[10px] text-gray-400">{t("promoDeals.from")}</p>
                <p className="text-[16px] font-bold leading-tight text-gray-900">
                  {product.priceFrom}&nbsp;€
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => scroll("right")}
          className={`absolute right-2 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-md transition-opacity md:flex ${canScrollRight ? "opacity-100" : "pointer-events-none opacity-0"}`}
          aria-label={t("hero.next")}
        >
          <ChevronRight className="h-4 w-4 text-gray-600" />
        </button>
      </div>
    </section>
  );
}
