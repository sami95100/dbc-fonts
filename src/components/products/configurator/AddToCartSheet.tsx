"use client";

import { memo, useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { Check, Smartphone, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CartConfirmationItem } from "./types";

interface AddToCartSheetProps {
  item: CartConfirmationItem | null;
  onClose: () => void;
}

function AddToCartSheetComponent({ item, onClose }: AddToCartSheetProps) {
  const locale = useLocale();
  const t = useTranslations("product.configurator");
  const tNav = useTranslations("nav");
  const tCommon = useTranslations("common");

  const [phase, setPhase] = useState<"closed" | "entering" | "open" | "leaving">("closed");
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Open: closed -> entering -> open
  // Close: open -> leaving -> closed
  useEffect(() => {
    if (item) {
      setPhase("entering");
      // Force a reflow before transitioning to "open"
      timerRef.current = setTimeout(() => setPhase("open"), 20);
    } else if (phase === "open" || phase === "entering") {
      setPhase("leaving");
      timerRef.current = setTimeout(() => setPhase("closed"), 400);
    }
    return () => clearTimeout(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item]);

  const handleClose = useCallback(() => {
    setPhase("leaving");
    setTimeout(onClose, 400);
  }, [onClose]);

  // Close on Escape key
  useEffect(() => {
    if (phase === "closed") return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [phase, handleClose]);

  if (phase === "closed") return null;

  const isOpen = phase === "open";

  return createPortal(
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/40 transition-opacity duration-400 ease-out",
          isOpen ? "opacity-100" : "opacity-0"
        )}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Wrapper for panel + close button */}
      <div
        className={cn(
          "fixed z-50 transition-all duration-400 ease-out",
          // Mobile: full-width bottom
          "inset-x-0 bottom-0",
          // Desktop: card bottom-right
          "md:inset-x-auto md:bottom-6 md:right-6 md:w-[420px]",
          // Animation
          isOpen
            ? "translate-y-0 opacity-100"
            : "translate-y-full md:translate-y-8 opacity-0"
        )}
      >
        {/* Close button — centered above the panel */}
        <div className="mb-3 flex justify-center">
          <button
            type="button"
            onClick={handleClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
            aria-label={tCommon("close")}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Panel */}
        <div
          role="dialog"
          aria-label={t("addedToCart")}
          className="rounded-t-2xl bg-white shadow-2xl md:rounded-2xl"
        >
          <div className="p-4 pb-6">
            {/* Success banner */}
            <div className="flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-600">
                <Check className="h-3.5 w-3.5 text-white" />
              </div>
              <p className="text-base font-semibold text-green-800">
                {t("addedToCartBanner")}
              </p>
            </div>

            {/* Product info */}
            {item && (
              <div className="flex items-center gap-4 py-4">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-50">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl}
                      alt={item.productName}
                      width={80}
                      height={80}
                      className="h-full w-full object-contain p-2"
                      unoptimized={item.imageUrl.startsWith("http")}
                    />
                  ) : (
                    <Smartphone className="h-10 w-10 text-gray-300" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-900">{item.productName}</p>
                  <p className="text-sm text-gray-500">
                    {item.storage} &bull; {item.color}
                  </p>
                  <p className="mt-1 text-lg font-bold text-gray-900">
                    {item.price.toLocaleString("fr-FR", { minimumFractionDigits: 2 })}&nbsp;&euro;
                  </p>
                </div>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="flex gap-3">
              <Button
                asChild
                className="flex-1 rounded-full bg-green-700 py-6 text-base font-semibold text-white hover:bg-green-800"
              >
                <Link href={`/${locale}/cart`} onClick={handleClose}>
                  {tNav("cart")}
                </Link>
              </Button>
              <Button
                asChild
                className="flex-1 rounded-full border border-gray-200 bg-white py-6 text-base font-semibold text-gray-900 hover:bg-gray-50"
              >
                <Link href={`/${locale}/checkout`} onClick={handleClose}>
                  {tNav("checkout")}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
}

export const AddToCartSheet = memo(AddToCartSheetComponent);
