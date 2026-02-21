"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect, useCallback } from "react";

const GUIDES = [
  {
    key: "specialist",
    image: "/awa.png",
  },
  {
    key: "advice",
    image: "/sam sam.png",
  },
] as const;

export function ShoppingGuides() {
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
      left: direction === "left" ? -500 : 500,
      behavior: "smooth",
    });
  };

  return (
    <section className="bg-gray-100 py-8 md:py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4">
        {/* Title */}
        <h2 className="mb-8 text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
          {t("guides.title")}{" "}
          <span className="font-normal text-gray-500">{t("guides.titleAccent")}</span>
        </h2>
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
          className="flex gap-5 overflow-x-auto scroll-smooth px-4 scrollbar-hide md:overflow-hidden md:px-8"
        >
          {GUIDES.map((guide) => (
            <div
              key={guide.key}
              className="group relative w-[280px] shrink-0 cursor-pointer overflow-hidden rounded-3xl bg-white transition-shadow duration-300 hover:shadow-lg md:w-[350px] lg:w-[400px]"
            >
              {/* Image - full card */}
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-b-3xl">
                <Image
                  src={guide.image}
                  alt={t(`guides.${guide.key}.title`)}
                  fill
                  className="object-contain object-bottom"
                  sizes="(max-width: 768px) 320px, (max-width: 1024px) 440px, 520px"
                />
              </div>

              {/* Text overlay - top left */}
              <div className="absolute left-0 top-0 p-6 md:p-8">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
                  {t(`guides.${guide.key}.tag`)}
                </p>
                <h3 className="text-xl font-bold leading-snug text-gray-900 md:text-2xl">
                  {t(`guides.${guide.key}.title`)}
                </h3>
              </div>
            </div>
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
