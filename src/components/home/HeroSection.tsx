"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect, useCallback } from "react";
import { useInView } from "@/hooks/useInView";

const CATEGORIES = [
  { slug: "smartphones", key: "iphone", count: 150, image: "/iphonepro-removebg-preview.png", imageScale: "scale-100" },
  { slug: "android", key: "android", count: 90, image: "/android.png", imageScale: "scale-[0.80]" },
  { slug: "tablets", key: "tablets", count: 45, image: "/ipadpro-removebg-preview.png", imageScale: "scale-100" },
  { slug: "laptops", key: "laptops", label: "laptopsShort", count: 60, image: "/macpro-removebg-preview.png", imageScale: "scale-100" },
  { slug: "smartwatches", key: "smartwatches", label: "smartwatchesShort", count: 30, image: "/apple watch 1.png", imageScale: "scale-100" },
  { slug: "accessories", key: "accessories", count: 25, image: "/accesoire.png", imageScale: "scale-[0.85]" },
] as const;

export function HeroSection() {
  const locale = useLocale();
  const t = useTranslations("home");
  const tCat = useTranslations("categories");
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
    const scrollAmount = 300;
    el.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section ref={inViewRef} className={`pt-16 pb-8 md:pt-20 md:pb-12 lg:pt-24 lg:pb-16 transition-[opacity,transform] duration-[0.6s] ease-[cubic-bezier(0.25,0.1,0.25,1)] will-change-[opacity,transform] ${isInView ? "translate-y-0 opacity-100" : "translate-y-5 opacity-0"}`}>
      {/* Header row */}
      <div className="mx-auto mb-8 max-w-[980px] px-[22px] md:mb-10 md:px-[44px] lg:px-0">
        <h1 className="whitespace-pre-line text-4xl font-bold tracking-tight text-gray-900 md:text-[48px] md:leading-[1.07] lg:text-[56px]">
          {t("hero.titleBlack")}{"\n"}
          <span className="text-green-400">{t("hero.titleGreen")}</span>
        </h1>
        <div className="mt-4 flex flex-col gap-2 md:mt-6 md:flex-row md:gap-6">
          <Link
            href={`/${locale}/account`}
            className="group inline-flex items-center gap-1 text-sm font-medium text-green-700 hover:text-green-800 md:text-base"
          >
            {t("hero.proAccount")}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
          <Link
            href={`/${locale}/products`}
            className="group inline-flex items-center gap-1 text-sm font-medium text-green-700 hover:text-green-800 md:text-base"
          >
            {t("hero.catalog")}
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      {/* Carousel */}
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

        {/* Scroll container — 3 visible + 4th cut in half on mobile */}
        <div
          ref={scrollRef}
          className="flex items-end gap-4 overflow-x-auto px-[22px] scrollbar-hide md:gap-6 md:px-[44px] lg:justify-center lg:gap-8 lg:px-[calc((100vw-980px)/2)]"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${locale}/products/${cat.slug}`}
              className="group flex w-[calc((100vw-92px)/3.5)] shrink-0 flex-col md:w-[150px] lg:w-[140px]"
            >
              <div className="relative aspect-[4/3] w-full overflow-hidden md:aspect-square">
                <Image
                  src={cat.image}
                  alt={tCat(cat.key)}
                  fill
                  unoptimized
                  className={`object-contain transition-transform duration-300 group-hover:scale-[1.03] ${cat.imageScale}`}
                  sizes="(max-width: 768px) 120px, (max-width: 1024px) 180px, 200px"
                />
              </div>
              <div className="pt-3 text-center md:pt-2">
                <p className="text-[14px] font-semibold text-gray-900 md:text-[15px]">
                  {tCat("label" in cat && cat.label ? cat.label : cat.key)}
                </p>
                <p className="mt-1 text-[12px] text-gray-500">
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
