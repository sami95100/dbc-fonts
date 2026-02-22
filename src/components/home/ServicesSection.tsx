"use client";

import { useTranslations } from "next-intl";
import { useInView } from "@/hooks/useInView";

const SERVICES = [
  {
    key: "sale",
    image: "",
    dark: false,
  },
  {
    key: "repair",
    image: "",
    dark: false,
  },
  {
    key: "tradeIn",
    image: "",
    dark: false,
  },
] as const;

export function ServicesSection() {
  const t = useTranslations("home");
  const { ref: inViewRef, isInView } = useInView();

  return (
    <section ref={inViewRef} className={`py-8 md:py-12 lg:py-16 transition-all duration-700 ease-out ${isInView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>
      <div className="mx-auto max-w-7xl px-4">
        {/* Title */}
        <h2 className="mb-8 text-[28px] font-bold leading-tight tracking-tight text-gray-900 md:mb-10 md:text-[32px] lg:text-[36px]">
          {t("services.title")}{" "}
          <span className="font-normal text-gray-500">{t("services.titleAccent")}</span>
        </h2>
      </div>

      {/* Cards - same dimensions as ShoppingGuides */}
      <div className="flex w-full gap-3 overflow-x-auto scroll-smooth px-4 pb-6 scrollbar-hide md:gap-4 md:px-8">
        {SERVICES.map((service) => (
          <div
            key={service.key}
            className="relative h-[345px] w-[280px] shrink-0 cursor-pointer overflow-hidden rounded-3xl bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg md:h-[400px] md:w-[320px] lg:h-[462px] lg:w-[370px]"
          >
            {/* Text overlay - top left */}
            <div className="absolute left-0 top-0 p-5 md:p-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-gray-500">
                {t(`services.${service.key}.tag`)}
              </p>
              <h3 className="text-lg font-bold leading-snug text-gray-900 md:text-xl">
                {t(`services.${service.key}.title`)}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
