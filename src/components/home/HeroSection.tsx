"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect, useCallback } from "react";

const CATEGORIES = [
  { slug: "smartphones", key: "iphone", count: 150, image: "/iphonepro-removebg-preview.png" },
  { slug: "android", key: "android", count: 90, image: "/android.png" },
  { slug: "tablets", key: "tablets", count: 45, image: "/ipadpro-removebg-preview.png" },
  { slug: "laptops", key: "laptops", label: "laptopsShort", count: 60, image: "/macpro-removebg-preview.png" },
  { slug: "smartwatches", key: "smartwatches", label: "smartwatchesShort", count: 30, image: "/apple watch 1.png" },
  { slug: "accessories", key: "accessories", count: 25, image: "/accesoire.png" },
] as const;

export function HeroSection() {
  const locale = useLocale();
  const t = useTranslations("home");
  const tCat = useTranslations("categories");
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
    const scrollAmount = 300;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-8 md:py-12 lg:py-16">
      {/* Header row */}
      <div className="mx-auto mb-8 max-w-7xl px-4 md:mb-12">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <h1 className="whitespace-pre-line text-4xl font-bold tracking-tight text-gray-900 md:text-5xl lg:text-6xl">
            {t("hero.titleBlack")}{"\n"}
            <span className="text-green-400">{t("hero.titleGreen")}</span>
          </h1>
          <div className="flex flex-col gap-2 md:items-end md:pt-2">
            <Link
              href={`/${locale}/account`}
              className="group inline-flex items-center gap-1 text-sm font-medium text-green-700 hover:text-green-800"
            >
              {t("hero.proAccount")}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
            <Link
              href={`/${locale}/products`}
              className="group inline-flex items-center gap-1 text-sm font-medium text-green-700 hover:text-green-800"
            >
              {t("hero.catalog")}
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
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
          className="flex items-end gap-4 overflow-x-auto scroll-smooth px-4 scrollbar-hide md:px-8"
        >
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${locale}/products/${cat.slug}`}
              className="group flex w-[117px] shrink-0 flex-col md:w-[137px] lg:w-[157px]"
            >
              <div className="relative aspect-square w-full overflow-hidden">
                <Image
                  src={cat.image}
                  alt={tCat(cat.key)}
                  fill
                  className="object-contain transition-transform duration-300 group-hover:scale-[1.03]"
                  sizes="(max-width: 768px) 117px, (max-width: 1024px) 137px, 157px"
                />
              </div>
              <div className="py-2 text-center">
                <p className="text-xs font-bold text-gray-900">
                  {tCat("label" in cat && cat.label ? cat.label : cat.key)}
                </p>
                <p className="mt-0.5 text-xs text-green-700">
                  {cat.count}+ {t("hero.available")}
                </p>
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
