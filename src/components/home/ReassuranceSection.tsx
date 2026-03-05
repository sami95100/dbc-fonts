"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Star, SlidersHorizontal, RotateCcw, ShieldCheck } from "lucide-react";
import { useInView } from "@/hooks/useInView";

const TRUST_ITEMS = [
  { key: "verifiedRefurbishers", icon: Star },
  { key: "checkpoints", icon: SlidersHorizontal },
  { key: "freeReturn", icon: RotateCcw },
  { key: "warrantyMonths", icon: ShieldCheck },
] as const;

export function ReassuranceSection() {
  const locale = useLocale();
  const t = useTranslations("home");
  const { ref: inViewRef, isInView } = useInView({ threshold: 0.2, waitForScroll: true });

  return (
    <section
      ref={inViewRef}
      className={`py-12 md:py-16 lg:py-20 transition-all duration-700 ease-out ${isInView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
    >
      <div className="mx-auto max-w-[980px] px-[22px] md:px-[44px] lg:px-0">
        {/* Title - centered, multi-line */}
        <h2 className="text-center text-[28px] font-bold leading-[1.2] tracking-tight text-gray-900 md:text-[36px] lg:text-[44px]">
          <span className="block">{t("reassurance.line1")}</span>
          <span className="block">{t("reassurance.line2")}</span>
          <span>
            {t("reassurance.line3")}{" "}
            <Link
              href={`/${locale}/standard-dbc-labs`}
              className={`font-display text-primary transition-opacity hover:opacity-80 highlight-underline ${isInView ? "is-visible" : ""}`}
            >
              {t("reassurance.highlight")}
            </Link>
            .
          </span>
        </h2>

        {/* Trust items - centered */}
        <div className="mx-auto mt-10 flex max-w-md flex-col gap-6 md:mt-12">
          {TRUST_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.key} className="flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center">
                  <Icon className="h-6 w-6 text-gray-900" strokeWidth={1.5} />
                </div>
                <span className="text-base font-semibold text-gray-900 md:text-lg">
                  {t(`trust.${item.key}`)}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
