"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { CATEGORIES } from "@/data/mock/categories";

export function CategoryNav() {
  const locale = useLocale();
  const t = useTranslations("categories");

  return (
    <nav className="border-b border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/${locale}/products/${cat.slug}`}
              className="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2.5 text-sm text-gray-700 transition-colors hover:bg-accent/10 hover:text-accent"
            >
              {t(cat.slug)}
            </Link>
          ))}

          <Link
            href={`/${locale}/products/other`}
            className="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2.5 text-sm text-gray-700 transition-colors hover:bg-accent/10 hover:text-accent"
          >
            {t("other")}
          </Link>
        </div>
      </div>
    </nav>
  );
}
