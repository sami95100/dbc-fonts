"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

export function PromoBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const locale = useLocale();
  const t = useTranslations("promo");

  if (!isVisible) return null;

  return (
    <div className="relative bg-[#e8e4ff] py-2">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 text-sm">
        <span className="font-semibold text-yellow-600">{t("flashSale")}</span>
        <span className="text-gray-800">{t("message")}</span>
        <Link
          href={`/${locale}/deals`}
          className="font-medium text-gray-900 underline hover:no-underline"
        >
          {t("cta")}
        </Link>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
        aria-label="Close"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  );
}
