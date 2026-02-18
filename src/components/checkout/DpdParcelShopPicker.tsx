"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { MapPin, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import type { DpdParcelShop } from "@/types/order";

interface DpdParcelShopPickerProps {
  locale: string;
  country: string;
  onSelect: (shop: DpdParcelShop) => void;
  selectedShop: DpdParcelShop | null;
}

export function DpdParcelShopPicker({
  locale,
  country,
  onSelect,
  selectedShop,
}: DpdParcelShopPickerProps) {
  const t = useTranslations("checkout");
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Portal needs document.body — only available after mount
  useEffect(() => setMounted(true), []);

  const handleMessage = useCallback(
    (event: MessageEvent) => {
      const data = event.data;
      if (!data || typeof data !== "object") return;

      const shop = data.dpdWidget || data;
      if (!shop.city && !shop.zipCode) return;

      onSelect({
        parcelShopId: String(shop.id || shop.parcelShopId || shop.pudoId || ""),
        company: shop.company || shop.name || "",
        street: shop.street || shop.address || "",
        houseNo: shop.houseNo || "",
        zipCode: shop.zipCode || shop.postCode || "",
        city: shop.city || "",
        country: shop.isoAlpha2 || shop.country || country,
      });
      setShowModal(false);
    },
    [onSelect, country]
  );

  useEffect(() => {
    if (!showModal) return;
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [showModal, handleMessage]);

  // Lock body scroll + close on Escape
  useEffect(() => {
    if (!showModal) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowModal(false);
    };
    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKey);
    };
  }, [showModal]);

  // Focus iframe once loaded so the DPD widget is interactive
  useEffect(() => {
    if (!showModal || !iframeRef.current) return;
    const iframe = iframeRef.current;
    const handleLoad = () => iframe.focus();
    iframe.addEventListener("load", handleLoad);
    return () => iframe.removeEventListener("load", handleLoad);
  }, [showModal]);

  const widgetLang = locale === "fr" ? "fr" : "en";
  const widgetUrl = `https://api.dpd.cz/widget/latest/index.html?lang=${widgetLang}&countries=${country}`;

  return (
    <div>
      {/* Selected shop display */}
      {selectedShop ? (
        <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
          <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-green-700" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">
              {t("selectedParcelShop")}
            </p>
            <p className="mt-1 text-sm text-gray-700">
              {selectedShop.company}
            </p>
            <p className="text-sm text-gray-500">
              {selectedShop.street} {selectedShop.houseNo}
              {", "}
              {selectedShop.zipCode} {selectedShop.city}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="text-sm font-medium text-green-700 underline hover:text-green-800"
          >
            {t("changeParcelShop")}
          </button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowModal(true)}
          className="w-full gap-2 rounded-lg border-dashed border-gray-300 py-6 text-gray-600 hover:border-green-700 hover:text-green-700"
        >
          <MapPin className="h-5 w-5" />
          {t("selectParcelShop")}
        </Button>
      )}

      {/* Modal via portal — rendered outside the component tree */}
      {showModal &&
        mounted &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowModal(false);
            }}
            onMouseDown={(e) => {
              // Prevent any interaction from reaching elements behind
              if (e.target === e.currentTarget) e.preventDefault();
            }}
          >
            <div
              className="relative h-[90vh] w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-2xl sm:h-[85vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
                <h3 className="font-semibold text-gray-900">
                  {t("selectParcelShop")}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Iframe */}
              <iframe
                ref={iframeRef}
                src={widgetUrl}
                className="h-[calc(90vh-52px)] w-full border-0 sm:h-[calc(85vh-52px)]"
                title="DPD Parcel Shop Finder"
                allow="geolocation"
              />
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
