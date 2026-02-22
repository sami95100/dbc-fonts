"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Search, ShoppingCart } from "lucide-react";
import { DbcLogo } from "@/components/ui/dbc-logo";
import { MobileMenu } from "./MobileMenu";
import { TopBar } from "./TopBar";
import { CartOverlay } from "./CartOverlay";
import { SearchOverlay } from "./SearchOverlay";
import { useCartStore } from "@/stores/cart-store";

export function Header() {
  const locale = useLocale();
  const t = useTranslations("nav");
  const tSearch = useTranslations("search");
  const [mounted, setMounted] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const itemCount = useCartStore((state) => state.getItemCount());

  useEffect(() => {
    setMounted(true);
  }, []);

  const closeCart = useCallback(() => setCartOpen(false), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  return (
    <>
      <div
        className="z-40 bg-gray-100"
        style={{ paddingTop: "var(--sat)" }}
      >
        {/* Status bar overlay — opaque for Safari iOS 26 tab tinting */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-50 bg-[#FF3300]"
          style={{ height: "var(--sat)" }}
        />

        {/* TopBar - desktop only */}
        <TopBar />

        {/* Main nav */}
        <header className="border-b border-gray-200/50">
          <div className="mx-auto max-w-7xl px-4">
            <div className="flex h-16 items-center justify-between gap-4 md:h-20">
              {/* Left: Logo */}
              <Link href={`/${locale}`} className="flex shrink-0 items-center">
                <DbcLogo className="h-6 w-auto text-green-700 md:h-8" />
              </Link>

              {/* Spacer */}
              <div className="flex-1" />

              {/* Right actions */}
              <div className="flex items-center gap-1 md:gap-2">
                {/* Search - opens overlay */}
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2.5 text-gray-900 transition-colors hover:text-gray-500"
                  aria-label={tSearch("placeholder")}
                >
                  <Search className="h-6 w-6" aria-hidden="true" />
                </button>

                {/* Help - desktop only */}
                <Link
                  href={`/${locale}/help`}
                  className="hidden items-center gap-1 px-3 py-2 text-sm text-gray-900 hover:text-gray-500 lg:flex"
                >
                  {t("help")}
                </Link>

                {/* Cart - opens overlay */}
                <button
                  onClick={() => setCartOpen(true)}
                  className="relative p-2.5 text-gray-900 transition-colors hover:text-gray-500"
                  aria-label={t("cart")}
                >
                  <ShoppingCart className="h-6 w-6" aria-hidden="true" />
                  {mounted && itemCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-medium text-white">
                      {itemCount}
                    </span>
                  )}
                </button>

                {/* Hamburger menu */}
                <MobileMenu />
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* Overlays (Apple-style) */}
      <SearchOverlay open={searchOpen} onClose={closeSearch} />
      <CartOverlay open={cartOpen} onClose={closeCart} />
    </>
  );
}
