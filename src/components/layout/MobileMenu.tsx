"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/data/mock/categories";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const locale = useLocale();
  const t = useTranslations("nav");
  const tc = useTranslations("categories");

  const router = useRouter();
  const pathname = usePathname();

  const handleOpen = () => {
    setOpen(true);
    requestAnimationFrame(() => setVisible(true));
  };

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => setOpen(false), 400);
  };

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const switchLanguage = (langCode: string) => {
    const newPathname = pathname.replace(`/${locale}`, `/${langCode}`);
    router.push(newPathname);
    handleClose();
  };

  const overlay = open ? (
    <div
      className={cn(
        "fixed inset-0 z-[9999] flex flex-col bg-white transition-all duration-400 ease-out",
        visible ? "opacity-100" : "opacity-0"
      )}
    >
      {/* Close button - top right (Apple style) */}
      <div className="flex justify-end px-5 pt-4">
        <button
          type="button"
          onClick={handleClose}
          className="p-2 text-gray-500 transition-colors hover:text-gray-900"
          aria-label="Fermer"
        >
          <X className="h-6 w-6" strokeWidth={1.5} />
        </button>
      </div>

      {/* Navigation links - Apple style staggered fade-in */}
      <nav className="flex-1 overflow-y-auto px-8 pt-4 pb-8 md:px-12">
        {/* Primary links - categories */}
        <div className="flex flex-col">
          {CATEGORIES.map((cat, index) => (
            <Link
              key={cat.id}
              href={`/${locale}/products/${cat.slug}`}
              onClick={handleClose}
              className={cn(
                "border-b border-gray-100 py-3 font-display text-[28px] font-semibold text-gray-900 transition-all duration-500 ease-out hover:text-gray-500 md:text-[32px]",
                visible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              )}
              style={{ transitionDelay: visible ? `${(index + 1) * 50}ms` : "0ms" }}
            >
              {tc(cat.slug)}
            </Link>
          ))}
        </div>

        {/* Divider */}
        <div className="my-6 border-t border-gray-200" />

        {/* Secondary links - smaller, gray (Apple style) */}
        <div className="flex flex-col gap-3">
          <Link
            href={`/${locale}`}
            onClick={handleClose}
            className={cn(
              "text-lg font-medium text-gray-500 transition-all duration-500 ease-out hover:text-gray-900",
              visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            )}
            style={{ transitionDelay: visible ? `${(CATEGORIES.length + 1) * 50}ms` : "0ms" }}
          >
            {t("home")}
          </Link>
          <Link
            href={`/${locale}/account`}
            onClick={handleClose}
            className={cn(
              "text-lg font-medium text-gray-500 transition-all duration-500 ease-out hover:text-gray-900",
              visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            )}
            style={{ transitionDelay: visible ? `${(CATEGORIES.length + 2) * 50}ms` : "0ms" }}
          >
            {t("account")}
          </Link>
          <Link
            href={`/${locale}/help`}
            onClick={handleClose}
            className={cn(
              "text-lg font-medium text-gray-500 transition-all duration-500 ease-out hover:text-gray-900",
              visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
            )}
            style={{ transitionDelay: visible ? `${(CATEGORIES.length + 3) * 50}ms` : "0ms" }}
          >
            {t("help")}
          </Link>
        </div>

        {/* Language switcher */}
        <div
          className={cn(
            "mt-8 flex gap-3 transition-all duration-500 ease-out",
            visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          )}
          style={{ transitionDelay: visible ? `${(CATEGORIES.length + 4) * 50}ms` : "0ms" }}
        >
          <button
            type="button"
            onClick={() => switchLanguage("fr")}
            className={cn(
              "rounded-full px-5 py-2 text-sm font-medium transition-colors",
              locale === "fr"
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
          >
            FR
          </button>
          <button
            type="button"
            onClick={() => switchLanguage("en")}
            className={cn(
              "rounded-full px-5 py-2 text-sm font-medium transition-colors",
              locale === "en"
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            )}
          >
            EN
          </button>
        </div>
      </nav>
    </div>
  ) : null;

  return (
    <div className="relative z-10">
      {/* Hamburger button */}
      <button
        type="button"
        className="p-2.5 text-gray-900 transition-colors hover:text-gray-500"
        aria-label={t("menu")}
        onClick={handleOpen}
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Portal: overlay rendered at document.body to escape stacking context */}
      {overlay && createPortal(overlay, document.body)}
    </div>
  );
}
