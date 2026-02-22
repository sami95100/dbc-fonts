"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

export function PromoBanner() {
  const locale = useLocale();
  const t = useTranslations("promo.paypal");

  return (
    <div className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-5 md:px-6 md:py-6">
        {/* Text */}
        <div>
          <p className="whitespace-pre-line text-sm leading-relaxed text-gray-900 md:text-base">
            {t("message")}
          </p>
          <Link
            href={`/${locale}/products`}
            className="mt-1 inline-block text-sm font-medium text-blue-600 hover:underline md:text-base"
          >
            {t("cta")}
          </Link>
        </div>

        {/* PayPal logo */}
        <Image
          src="/paypal.svg"
          alt="PayPal"
          width={120}
          height={32}
          className="h-6 w-auto shrink-0 md:h-8"
        />
      </div>
    </div>
  );
}
