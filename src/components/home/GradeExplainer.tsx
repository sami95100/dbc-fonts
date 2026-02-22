"use client";

import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, Diamond, Smartphone, ShieldCheck, Gift, Sparkles, AlertTriangle, Check } from "lucide-react";
import { useRef, useState, useEffect, useCallback } from "react";
import { useInView } from "@/hooks/useInView";

const GRADES = [
  {
    key: "imparfait",
    badges: [
      { icon: "smartphone", key: "compatibleParts" },
      { icon: "alert", key: "noFaceId" },
    ],
  },
  {
    key: "correct",
    badges: [
      { icon: "diamond", key: "fewTraces" },
      { icon: "smartphone", key: "appleScreen" },
    ],
  },
  {
    key: "tresBon",
    badges: [
      { icon: "check", key: "fullyFunctional" },
      { icon: "diamond", key: "minorTraces" },
    ],
  },
  {
    key: "parfait",
    badges: [
      { icon: "sparkles", key: "noWear" },
      { icon: "smartphone", key: "appleScreen" },
    ],
  },
] as const;

const ICON_MAP = {
  diamond: Diamond,
  smartphone: Smartphone,
  shield: ShieldCheck,
  gift: Gift,
  sparkles: Sparkles,
  alert: AlertTriangle,
  check: Check,
} as const;

export function GradeExplainer() {
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
      left: direction === "left" ? -400 : 400,
      behavior: "smooth",
    });
  };

  return (
    <section ref={inViewRef} className={`py-8 md:py-12 lg:py-16 transition-all duration-700 ease-out ${isInView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-8 text-[28px] font-bold leading-tight tracking-tight text-gray-900 md:mb-10 md:text-[32px] lg:text-[36px]">
          {t("grades.title")}{" "}
          <span className="font-normal text-gray-500">{t("grades.titleAccent")}</span>
        </h2>
      </div>

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
          className="flex gap-3 overflow-x-auto scroll-smooth px-4 pb-4 scrollbar-hide md:gap-4 md:overflow-x-hidden md:px-8"
        >
          {GRADES.map((grade) => (
            <div
              key={grade.key}
              className="relative flex w-[280px] shrink-0 flex-col overflow-hidden rounded-3xl bg-white shadow-sm md:w-[320px] lg:w-[340px]"
            >
              {/* Image placeholder */}
              <div className="relative flex aspect-[4/3] w-full items-center justify-center bg-gray-50">
                <Smartphone className="h-16 w-16 text-gray-300" />
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col px-5 pb-6 pt-5">
                {/* Badges */}
                <div className="mb-4 flex flex-col gap-2">
                  {grade.badges.map((badge) => {
                    const Icon = ICON_MAP[badge.icon];
                    return (
                      <span
                        key={badge.key}
                        className="inline-flex w-fit items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-700"
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {t(`grades.badges.${badge.key}`)}
                      </span>
                    );
                  })}
                </div>

                {/* Grade name */}
                <h4 className="text-2xl font-bold text-gray-900 md:text-3xl">
                  {t(`grades.${grade.key}.name`)}
                </h4>

                {/* Description */}
                <p className="mt-1 text-sm text-gray-500">
                  {t(`grades.${grade.key}.description`)}
                </p>

                {/* Warranty */}
                <p className="mt-2 text-sm font-semibold text-gray-900">
                  {t(`grades.${grade.key}.warranty`)}
                </p>
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
