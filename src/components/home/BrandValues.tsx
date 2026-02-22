"use client";

import { useTranslations } from "next-intl";
import { DoorOpen, Users, Zap, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";
import { useInView } from "@/hooks/useInView";

const VALUES = [
  { key: "access", icon: DoorOpen, color: "bg-highlight/10 text-highlight" },
  { key: "community", icon: Users, color: "bg-accent/10 text-accent" },
  { key: "urban", icon: Zap, color: "bg-highlight/10 text-highlight" },
  { key: "future", icon: Leaf, color: "bg-accent/10 text-accent" },
] as const;

export function BrandValues() {
  const t = useTranslations("home.values");
  const { ref, isInView } = useInView();

  return (
    <section ref={ref} className={`py-8 md:py-12 lg:py-16 transition-all duration-700 ease-out ${isInView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-8 text-[28px] font-bold leading-tight tracking-tight text-gray-900 md:mb-10 md:text-[32px] lg:text-[36px]">
          {t("title")}{" "}
          <span className="font-normal text-gray-500">{t("titleAccent")}</span>
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map(({ key, icon: Icon, color }, index) => (
            <div
              key={key}
              className={cn(
                "group rounded-3xl border border-gray-200 bg-white p-6",
                "transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5",
                isInView && "animate-fade-in-up",
                isInView && index === 1 && "animate-delay-100",
                isInView && index === 2 && "animate-delay-200",
                isInView && index === 3 && "animate-delay-300",
              )}
            >
              <div
                className={cn(
                  "mb-4 flex h-14 w-14 items-center justify-center rounded-2xl",
                  color
                )}
              >
                <Icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="mb-2 font-display text-lg font-semibold text-gray-900">
                {t(`${key}.title`)}
              </h3>
              <p className="text-sm leading-relaxed text-gray-600">
                {t(`${key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
