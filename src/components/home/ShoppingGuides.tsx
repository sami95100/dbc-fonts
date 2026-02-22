"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect, useCallback } from "react";
import { useInView } from "@/hooks/useInView";

const GUIDES = [
  {
    key: "specialist",
    image: "/awa.png",
    hasSubtitle: false,
    dark: false,
  },
  {
    key: "advice",
    image: "/sam sam.png",
    hasSubtitle: false,
    dark: false,
  },
  {
    key: "shipping",
    image: "/uber-direct.png",
    hasSubtitle: false,
    dark: true,
  },
  {
    key: "shippingEurope",
    image: "",
    hasSubtitle: false,
    dark: true,
  },
] as const;

export function ShoppingGuides() {
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
      left: direction === "left" ? -500 : 500,
      behavior: "smooth",
    });
  };

  return (
    <section ref={inViewRef} className={`py-8 md:py-12 lg:py-16 transition-all duration-700 ease-out ${isInView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>
      <div className="mx-auto max-w-7xl px-4">
        {/* Title */}
        <h2 className="mb-8 text-[28px] font-bold leading-tight tracking-tight text-gray-900 md:mb-10 md:text-[32px] lg:text-[36px]">
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
          className="flex w-full gap-3 overflow-x-auto scroll-smooth px-4 pb-6 scrollbar-hide md:gap-4 md:px-8"
        >
          {GUIDES.map((guide) => (
            <div
              key={guide.key}
              className={`relative h-[345px] w-[280px] shrink-0 cursor-pointer overflow-hidden rounded-3xl shadow-md transition-shadow duration-300 hover:shadow-xl md:h-[400px] md:w-[320px] lg:h-[462px] lg:w-[370px] ${guide.dark ? "bg-gray-900" : "bg-white"}`}
            >
              {/* Image - full card */}
              {guide.image ? (
                <Image
                  src={guide.image}
                  alt={t(`guides.${guide.key}.title`)}
                  fill
                  className={guide.dark ? "object-cover" : "object-contain object-bottom"}
                  sizes="(max-width: 768px) 280px, (max-width: 1024px) 320px, 370px"
                />
              ) : null}

              {/* Text overlay - top left */}
              <div className="absolute left-0 top-0 p-5 md:p-6">
                <p className={`mb-2 text-xs font-semibold uppercase tracking-[0.15em] ${guide.dark ? "text-gray-400" : "text-gray-500"}`}>
                  {t(`guides.${guide.key}.tag`)}
                </p>
                <h3 className={`text-lg font-bold leading-snug md:text-xl ${guide.dark ? "text-white" : "text-gray-900"}`}>
                  {t(`guides.${guide.key}.title`)}
                </h3>
                {guide.hasSubtitle && (
                  <p className={`mt-2 text-xs md:text-sm ${guide.dark ? "text-gray-300" : "text-gray-500"}`}>
                    {t(`guides.${guide.key}.subtitle`)}
                  </p>
                )}
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
