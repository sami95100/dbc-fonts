"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { CATEGORIES } from "@/data/mock/categories";

// Catégories spéciales (pas dans les données de base)
const SPECIAL_CATEGORIES = [
  { key: "deals", href: "/deals", highlight: true },
  { key: "giftIdeas", href: "/gift-ideas", icon: "gift" },
];

export function CategoryNav() {
  const locale = useLocale();
  const t = useTranslations("categories");

  return (
    <nav className="border-b border-gray-100 bg-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-hide">
          {/* Special categories (deals, gift ideas) */}
          {SPECIAL_CATEGORIES.map((cat) => (
            <Link
              key={cat.key}
              href={`/${locale}${cat.href}`}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm transition-colors ${
                cat.highlight
                  ? "text-red-500 hover:bg-red-50"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {cat.key === "deals" && (
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {cat.icon === "gift" && (
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
                  />
                </svg>
              )}
              {t(cat.key)}
            </Link>
          ))}

          {/* Dynamic categories from data */}
          {CATEGORIES.map((cat) => {
            // Toutes les catégories vont vers /products/{slug}
            const href = `/products/${cat.slug}`;

            return (
              <Link
                key={cat.id}
                href={`/${locale}${href}`}
                className="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-100"
              >
                {locale === "fr" ? cat.nameFr : cat.name}
              </Link>
            );
          })}

          {/* Other */}
          <Link
            href={`/${locale}/products/other`}
            className="flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-gray-700 transition-colors hover:bg-gray-100"
          >
            {t("other")}
          </Link>
        </div>
      </div>
    </nav>
  );
}
