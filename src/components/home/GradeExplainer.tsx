"use client";

import { useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight, Diamond, Smartphone, ShieldCheck, Gift, Sparkles, AlertTriangle, Check } from "lucide-react";
import { useRef, useState, useEffect, useCallback } from "react";

const GRADES = [
  {
    key: "imparfait",
    color: "bg-gray-800",
    badges: [
      { icon: "smartphone", key: "compatibleParts" },
      { icon: "alert", key: "noFaceId" },
    ],
  },
  {
    key: "correct",
    color: "bg-green-700",
    badges: [
      { icon: "diamond", key: "fewTraces" },
      { icon: "smartphone", key: "appleScreen" },
    ],
  },
  {
    key: "tresBon",
    color: "bg-green-700",
    badges: [
      { icon: "check", key: "fullyFunctional" },
      { icon: "diamond", key: "minorTraces" },
    ],
  },
  {
    key: "parfait",
    color: "bg-gray-900",
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
    <section className="py-8 md:py-12 lg:py-16">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
          {t("grades.title")}
        </h2>
        <p className="mb-8 text-sm text-gray-500 md:text-base">
          {t("grades.subtitle")}
        </p>
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
          className="flex gap-5 overflow-x-auto scroll-smooth px-4 pb-4 scrollbar-hide md:overflow-x-hidden md:px-8"
        >
          {GRADES.map((grade) => (
            <div
              key={grade.key}
              className={`relative flex w-[280px] shrink-0 flex-col overflow-hidden rounded-3xl md:w-[320px] lg:w-[340px] ${grade.color}`}
            >
              {/* Image placeholder */}
              <div className="relative flex aspect-[4/3] w-full items-center justify-center">
                <div className="flex h-48 w-32 items-center justify-center rounded-3xl border border-white/20 bg-white/10">
                  <Smartphone className="h-16 w-16 text-white/40" />
                </div>
                {/* "Exemple d'image" badge */}
                <span className="absolute right-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-900">
                  {t("grades.imageExample")}
                </span>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col px-5 pb-6">
                {/* Section label */}
                <h3 className="mb-3 text-2xl font-bold text-white md:text-3xl">
                  {t(`grades.${grade.key}.section`)}
                </h3>

                {/* Badges */}
                <div className="mb-4 flex flex-col gap-2">
                  {grade.badges.map((badge) => {
                    const Icon = ICON_MAP[badge.icon];
                    return (
                      <span
                        key={badge.key}
                        className="inline-flex w-fit items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-gray-900"
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {t(`grades.badges.${badge.key}`)}
                      </span>
                    );
                  })}
                </div>

                {/* Grade name */}
                <h4 className="text-2xl font-bold text-white md:text-3xl">
                  {t(`grades.${grade.key}.name`)}
                </h4>

                {/* Description */}
                <p className="mt-1 text-sm text-white/80">
                  {t(`grades.${grade.key}.description`)}
                </p>

                {/* Warranty */}
                <p className="mt-2 text-sm font-semibold text-white">
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
