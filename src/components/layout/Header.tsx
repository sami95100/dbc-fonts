"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { User, ShoppingCart } from "lucide-react";
import { DbcLogo } from "@/components/ui/dbc-logo";
import { SearchBar } from "./SearchBar";
import { MobileMenu } from "./MobileMenu";
import { useCartStore } from "@/stores/cart-store";
import { useAuthStore } from "@/stores/auth-store";

export function Header() {
  const locale = useLocale();
  const t = useTranslations("nav");
  const [mounted, setMounted] = useState(false);
  const itemCount = useCartStore((state) => state.getItemCount());
  const isAuthenticated = useAuthStore((s) => !!s.user);

  // Prevent hydration mismatch - cart comes from localStorage
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between gap-4 md:h-20">
          {/* Mobile menu */}
          <MobileMenu />

          {/* Logo */}
          <Link href={`/${locale}`} className="flex shrink-0 items-center">
            <DbcLogo className="h-6 w-auto text-gray-900 md:h-8" />
          </Link>

          {/* Search - Hidden on mobile */}
          <div className="hidden flex-1 justify-center md:flex">
            <SearchBar />
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1 md:gap-2">
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
              className="relative p-2.5 hover:text-gray-600"
              aria-label={t("account")}
            >
              <User className="h-6 w-6" aria-hidden="true" />
              {mounted && isAuthenticated && (
                <span className="absolute right-0.5 top-0.5 h-2.5 w-2.5 rounded-full bg-accent" />
              )}
            </Link>

            {/* Cart */}
            <Link
              href={`/${locale}/cart`}
              className="relative p-2.5 hover:text-gray-600"
              aria-label={t("cart")}
            >
              <ShoppingCart className="h-6 w-6" aria-hidden="true" />
              {mounted && itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-medium text-white">
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
