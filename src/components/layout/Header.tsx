"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { SearchBar } from "./SearchBar";
import { useCartStore } from "@/stores/cart-store";

export function Header() {
  const locale = useLocale();
  const t = useTranslations("nav");
  const itemCount = useCartStore((state) => state.getItemCount());

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between gap-4 md:h-20">
          {/* Mobile menu button */}
          <button className="p-2 md:hidden" aria-label="Menu">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Logo */}
          <Link href={`/${locale}`} className="flex shrink-0 items-center">
            <span className="text-xl font-bold tracking-tight md:text-2xl">
              DBC
            </span>
          </Link>

          {/* Search - Hidden on mobile */}
          <div className="hidden flex-1 justify-center md:flex">
            <SearchBar />
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1 md:gap-2">
            {/* Sell button - Hidden on mobile */}
            <Link
              href={`/${locale}/sell`}
              className="hidden items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-medium hover:bg-gray-50 lg:flex"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                />
              </svg>
              {t("sell")}
            </Link>

            {/* Help - Hidden on mobile */}
            <Link
              href={`/${locale}/help`}
              className="hidden items-center gap-1 px-3 py-2 text-sm hover:text-gray-600 lg:flex"
            >
              {t("help")}
            </Link>

            {/* Account */}
            <Link
              href={`/${locale}/account`}
              className="p-2 hover:text-gray-600"
              aria-label={t("account")}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </Link>

            {/* Cart */}
            <Link
              href={`/${locale}/cart`}
              className="relative p-2 hover:text-gray-600"
              aria-label={t("cart")}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500 text-xs font-medium text-white">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile search */}
        <div className="pb-3 md:hidden">
          <SearchBar />
        </div>
      </div>
    </header>
  );
}
