"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { X } from "lucide-react";

export function PromoBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const locale = useLocale();
  const t = useTranslations("promo");

  if (!isVisible) return null;

  return (
    <div className="relative bg-highlight py-2">
      <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 text-sm">
        <span className="font-bold text-primary">{t("flashSale")}</span>
        <span className="text-primary/80">{t("message")}</span>
        <Link
          href={`/${locale}/products/smartphones`}
          className="font-medium text-primary underline hover:no-underline"
        >
          {t("cta")}
        </Link>
      </div>
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-primary/50 hover:text-primary"
        aria-label="Close"
      >
        <X className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  );
}
