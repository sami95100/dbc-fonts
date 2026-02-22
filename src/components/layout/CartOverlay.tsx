"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { X, Package, Bookmark, Settings, User, Trash2, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";

interface CartOverlayProps {
  open: boolean;
  onClose: () => void;
}

export function CartOverlay({ open, onClose }: CartOverlayProps) {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const locale = useLocale();
  const t = useTranslations("cart");
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const getSubtotal = useCartStore((s) => s.getSubtotal);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => setVisible(true));
      document.body.style.overflow = "hidden";
    } else {
      setVisible(false);
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!mounted || !open) return null;

  const hasItems = items.length > 0;

  const overlay = (
    <div
      className={cn(
        "fixed inset-0 z-[9999] flex flex-col bg-white transition-all duration-400 ease-out",
        visible ? "opacity-100" : "opacity-0"
      )}
    >
      {/* Close button - top right */}
      <div className="flex justify-end px-5 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="p-2 text-gray-500 transition-colors hover:text-gray-900"
          aria-label={t("title")}
        >
          <X className="h-6 w-6" strokeWidth={1.5} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-8 pt-2 pb-8 md:px-12">
        {hasItems ? (
          /* Cart with items */
          <>
            <h1
              className={cn(
                "font-display text-[28px] font-semibold text-gray-900 transition-all duration-500 ease-out md:text-[32px]",
                visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              )}
              style={{ transitionDelay: visible ? "50ms" : "0ms" }}
            >
              {t("title")}
            </h1>

            {/* Cart items */}
            <div className="mt-8 flex flex-col divide-y divide-gray-100">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className={cn(
                    "flex gap-4 py-5 transition-all duration-500 ease-out",
                    visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                  )}
                  style={{ transitionDelay: visible ? `${(index + 2) * 50}ms` : "0ms" }}
                >
                  {/* Product image */}
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-50">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.model}
                        fill
                        className="object-contain p-1"
                        sizes="80px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Package className="h-8 w-8 text-gray-300" />
                      </div>
                    )}
                  </div>

                  {/* Product details */}
                  <div className="flex flex-1 flex-col">
                    <h3 className="text-base font-semibold text-gray-900">{item.model}</h3>
                    <p className="mt-0.5 text-sm text-gray-500">
                      {item.storage} - {item.color} - {item.grade}
                    </p>
                    <div className="mt-3 flex items-center justify-between">
                      {/* Quantity controls */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:border-gray-400 disabled:opacity-30"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-sm font-medium text-gray-900">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:border-gray-400"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      {/* Price + remove */}
                      <div className="flex items-center gap-3">
                        <span className="text-base font-semibold text-gray-900">
                          {(item.price * item.quantity).toFixed(2)} &euro;
                        </span>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1 text-gray-400 transition-colors hover:text-red-500"
                          aria-label={t("remove")}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Subtotal + checkout */}
            <div
              className={cn(
                "mt-6 border-t border-gray-200 pt-6 transition-all duration-500 ease-out",
                visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              )}
              style={{ transitionDelay: visible ? `${(items.length + 2) * 50}ms` : "0ms" }}
            >
              <div className="flex items-center justify-between">
                <span className="text-lg font-medium text-gray-500">{t("subtotal")}</span>
                <span className="text-xl font-bold text-gray-900">{getSubtotal().toFixed(2)} &euro;</span>
              </div>
              <Link
                href={`/${locale}/checkout`}
                onClick={onClose}
                className="mt-4 flex w-full items-center justify-center rounded-full bg-green-700 px-6 py-3.5 text-base font-semibold text-white transition-colors hover:bg-green-800"
              >
                {t("checkout")}
              </Link>
              <button
                onClick={onClose}
                className="mt-3 w-full text-center text-sm font-medium text-accent transition-colors hover:underline"
              >
                {t("continueShopping")}
              </button>
            </div>
          </>
        ) : (
          /* Empty cart - Apple style */
          <>
            <h1
              className={cn(
                "font-display text-[28px] font-semibold text-gray-900 transition-all duration-500 ease-out md:text-[32px]",
                visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              )}
              style={{ transitionDelay: visible ? "50ms" : "0ms" }}
            >
              {t("emptyTitle")}
            </h1>

            <p
              className={cn(
                "mt-4 text-base leading-relaxed text-gray-500 transition-all duration-500 ease-out",
                visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              )}
              style={{ transitionDelay: visible ? "100ms" : "0ms" }}
            >
              <Link
                href={`/${locale}/account`}
                onClick={onClose}
                className="font-medium text-accent underline"
              >
                {t("signInLink")}
              </Link>
              {t("signInPromptSuffix")}
            </p>

            {/* My profile section */}
            <div
              className={cn(
                "mt-10 transition-all duration-500 ease-out",
                visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
              )}
              style={{ transitionDelay: visible ? "150ms" : "0ms" }}
            >
              <p className="mb-4 text-sm font-medium text-gray-400">
                {t("myProfile")}
              </p>
              <div className="flex flex-col">
                <Link
                  href={`/${locale}/account`}
                  onClick={onClose}
                  className="flex items-center gap-4 border-b border-gray-100 py-3 text-base font-semibold text-gray-900 transition-colors hover:text-gray-500"
                >
                  <Package className="h-5 w-5 text-gray-400" strokeWidth={1.5} />
                  {t("orders")}
                </Link>
                <Link
                  href={`/${locale}/account`}
                  onClick={onClose}
                  className="flex items-center gap-4 border-b border-gray-100 py-3 text-base font-semibold text-gray-900 transition-colors hover:text-gray-500"
                >
                  <Bookmark className="h-5 w-5 text-gray-400" strokeWidth={1.5} />
                  {t("savedItems")}
                </Link>
                <Link
                  href={`/${locale}/account`}
                  onClick={onClose}
                  className="flex items-center gap-4 border-b border-gray-100 py-3 text-base font-semibold text-gray-900 transition-colors hover:text-gray-500"
                >
                  <Settings className="h-5 w-5 text-gray-400" strokeWidth={1.5} />
                  {t("accountLink")}
                </Link>
                <Link
                  href={`/${locale}/account`}
                  onClick={onClose}
                  className="flex items-center gap-4 py-3 text-base font-semibold text-gray-900 transition-colors hover:text-gray-500"
                >
                  <User className="h-5 w-5 text-gray-400" strokeWidth={1.5} />
                  {t("signIn")}
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );

  return createPortal(overlay, document.body);
}
