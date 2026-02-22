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

  // Handle open/close with animation
  const handleOpen = () => {
    setOpen(true);
    requestAnimationFrame(() => setVisible(true));
  };

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => setOpen(false), 300);
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
        "fixed inset-0 z-[9999] h-full bg-white transition-transform duration-300 ease-out overflow-hidden",
        visible ? "translate-y-0" : "translate-y-full"
      )}
    >
      {/* Close button - top left */}
      <div className="flex justify-start px-3 pt-3">
        <button
          type="button"
          onClick={handleClose}
          className="p-2 text-gray-900"
          aria-label="Fermer"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Navigation links */}
      <nav className="flex flex-col gap-1 overflow-y-auto px-6 pt-2 pb-8">
        {/* Home */}
        <Link
          href={`/${locale}`}
          onClick={handleClose}
          className="py-2 text-2xl font-bold text-gray-900"
        >
          {t("home")}
        </Link>

        {/* Categories */}
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.id}
            href={`/${locale}/products/${cat.slug}`}
            onClick={handleClose}
            className="py-2 text-2xl font-bold text-gray-900"
          >
            {tc(cat.slug)}
          </Link>
        ))}

        {/* Divider */}
        <div className="my-4 border-t border-gray-200" />

        {/* Secondary links */}
        <Link
          href={`/${locale}/help`}
          onClick={handleClose}
          className="py-2 text-lg text-gray-500"
        >
          {t("help")}
        </Link>
        <Link
          href={`/${locale}/account`}
          onClick={handleClose}
          className="py-2 text-lg text-gray-500"
        >
          {t("account")}
        </Link>

        {/* Language switcher */}
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={() => switchLanguage("fr")}
            className={cn(
              "rounded-full px-5 py-2 text-sm font-medium transition-colors",
              locale === "fr"
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-700"
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
                : "bg-gray-100 text-gray-700"
            )}
          >
            EN
          </button>
        </div>
      </nav>
    </div>
  ) : null;

  return (
    <div className="relative z-10 md:hidden">
      {/* Hamburger button */}
      <button
        type="button"
        className="p-2 text-gray-900"
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
