"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Menu, Home, ArrowLeftRight, HelpCircle, User } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { DbcLogo } from "@/components/ui/dbc-logo";
import { CATEGORIES } from "@/data/mock/categories";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const locale = useLocale();
  const t = useTranslations("nav");
  const tc = useTranslations("categories");

  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button type="button" className="p-2.5 md:hidden" aria-label={t("menu")}>
          <Menu className="h-6 w-6" aria-hidden="true" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] p-0">
        <SheetHeader className="border-b border-gray-100 px-5 py-4">
          <SheetTitle asChild>
            <Link href={`/${locale}`} onClick={close}>
              <DbcLogo className="h-6 w-auto text-gray-900" />
            </Link>
          </SheetTitle>
        </SheetHeader>

        <nav className="flex flex-1 flex-col overflow-y-auto">
          {/* Main nav */}
          <div className="border-b border-gray-100 px-3 py-3">
            <Link
              href={`/${locale}`}
              onClick={close}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-900 transition-colors hover:bg-accent/10 hover:text-accent"
            >
              <Home className="h-4 w-4" aria-hidden="true" />
              {t("home")}
            </Link>
          </div>

          {/* Categories */}
          <div className="border-b border-gray-100 px-3 py-3">
            <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-accent">
              {t("products")}
            </p>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/${locale}/products/${cat.slug}`}
                onClick={close}
                className="flex items-center rounded-lg px-3 py-2.5 text-sm text-gray-700 transition-colors hover:bg-accent/10 hover:text-accent"
              >
                {tc(cat.slug)}
              </Link>
            ))}
          </div>

          {/* Secondary nav */}
          <div className="px-3 py-3">
            <Link
              href={`/${locale}/sell`}
              onClick={close}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition-colors hover:bg-accent/10 hover:text-accent"
            >
              <ArrowLeftRight className="h-4 w-4" aria-hidden="true" />
              {t("sell")}
            </Link>
            <Link
              href={`/${locale}/help`}
              onClick={close}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition-colors hover:bg-accent/10 hover:text-accent"
            >
              <HelpCircle className="h-4 w-4" aria-hidden="true" />
              {t("help")}
            </Link>
            <Link
              href={`/${locale}/account`}
              onClick={close}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-gray-700 transition-colors hover:bg-accent/10 hover:text-accent"
            >
              <User className="h-4 w-4" aria-hidden="true" />
              {t("account")}
            </Link>
          </div>

          {/* Social */}
          <div className="mt-auto border-t border-gray-100 px-5 py-4">
            <div className="flex gap-4">
              <a
                href="https://www.tiktok.com/@dbclille"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-accent/10 hover:text-accent"
                aria-label="TikTok"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
              </a>
              <a
                href="https://www.snapchat.com/add/dbc_story"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-accent/10 hover:text-accent"
                aria-label="Snapchat"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.15-.055-.225-.015-.243.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-1.107-.435-1.257-.93-1.197-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.383.074.42.194.789.3 1.104.3.234 0 .384-.06.465-.105l-.046-.569c-.098-1.626-.225-3.651.307-4.837C7.392 1.077 10.739.807 11.727.807l.419-.015h.06z" />
                </svg>
              </a>
            </div>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
