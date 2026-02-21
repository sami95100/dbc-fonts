"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { MapPin, Search, X, Loader2, Package } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { DpdParcelShop } from "@/types/order";

interface DpdApiShop {
  id: string;
  company: string;
  street: string;
  city: string;
  house_number: string;
  postcode: string;
  pickup_network_type: string;
  hours: Array<{
    day: number;
    openMorning: string;
    closeMorning: string;
    openAfternoon: string;
    closeAfternoon: string;
  }>;
}

interface DpdParcelShopPickerProps {
  locale: string;
  country: string;
  onSelect: (shop: DpdParcelShop) => void;
  selectedShop: DpdParcelShop | null;
}

const COUNTRY_NAMES: Record<string, string> = {
  FR: "France",
  BE: "Belgique",
  CH: "Suisse",
  LU: "Luxembourg",
};


export function DpdParcelShopPicker({
  locale,
  country,
  onSelect,
  selectedShop,
}: DpdParcelShopPickerProps) {
  const t = useTranslations("checkout");
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<DpdApiShop[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => setMounted(true), []);

  // Lock body scroll when modal open
  useEffect(() => {
    if (!showModal) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowModal(false);
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = original;
      window.removeEventListener("keydown", handleKey);
    };
  }, [showModal]);

  const handleSearch = async () => {
    const q = search.trim();
    if (!q) return;

    setIsSearching(true);
    setSearchError(false);
    setHasSearched(true);

    try {
      const countryName = COUNTRY_NAMES[country] || country;
      const address = `${q}, ${countryName}`;
      const res = await fetch(
        `/api/dpd-shops?address=${encodeURIComponent(address)}&lang=${locale}`
      );
      const data = await res.json();

      if (data.status === "ok" && data.data?.items) {
        setResults(data.data.items);
      } else {
        setResults([]);
      }
    } catch {
      setSearchError(true);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelect = (shop: DpdApiShop) => {
    onSelect({
      parcelShopId: shop.id,
      company: shop.company,
      street: shop.street,
      houseNo: shop.house_number,
      zipCode: shop.postcode,
      city: shop.city,
      country: country,
    });
    setShowModal(false);
  };

  const formatHours = (shop: DpdApiShop) => {
    const today = new Date().getDay() || 7; // 1=Mon ... 7=Sun
    const todayHours = shop.hours.find((h) => h.day === today);
    if (!todayHours || !todayHours.openMorning) return null;

    let hours = `${todayHours.openMorning}-${todayHours.closeMorning}`;
    if (todayHours.openAfternoon) {
      hours += `, ${todayHours.openAfternoon}-${todayHours.closeAfternoon}`;
    }
    return hours;
  };

  const openModal = () => {
    setShowModal(true);
    setResults([]);
    setSearch("");
    setHasSearched(false);
    setSearchError(false);
  };

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
            onClick={openModal}
            className="text-sm font-medium text-green-700 underline hover:text-green-800"
          >
            {t("changeParcelShop")}
          </button>
        </div>
      ) : (
        <Button
          type="button"
          variant="outline"
          onClick={openModal}
          className="w-full gap-2 rounded-lg border-dashed border-gray-300 py-6 text-gray-600 hover:border-green-700 hover:text-green-700"
        >
          <MapPin className="h-5 w-5" />
          {t("selectParcelShop")}
        </Button>
      )}

      {/* Modal via portal */}
      {showModal &&
        mounted &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/60 sm:items-center sm:p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowModal(false);
            }}
          >
            <div className="flex h-[92vh] w-full flex-col rounded-t-xl bg-white shadow-2xl sm:h-[85vh] sm:max-w-lg sm:rounded-xl">
              {/* Header */}
              <div className="flex shrink-0 items-center justify-between border-b border-gray-200 px-4 py-3">
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

              {/* Search bar */}
              <div className="shrink-0 border-b border-gray-100 px-4 py-3">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSearch();
                  }}
                  className="flex gap-2"
                >
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={t("searchPlaceholder")}
                    autoFocus
                  />
                  <Button
                    type="submit"
                    disabled={isSearching || !search.trim()}
                    className="shrink-0 bg-green-700 hover:bg-green-800"
                  >
                    {isSearching ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </Button>
                </form>
              </div>

              {/* Results */}
              <div className="flex-1 overflow-y-auto">
                {isSearching && (
                  <div className="flex items-center justify-center gap-2 py-12 text-sm text-gray-500">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t("searching")}
                  </div>
                )}

                {searchError && (
                  <p className="px-4 py-8 text-center text-sm text-red-600">
                    {t("searchError")}
                  </p>
                )}

                {!isSearching && !searchError && hasSearched && results.length === 0 && (
                  <p className="px-4 py-8 text-center text-sm text-gray-500">
                    {t("noResults")}
                  </p>
                )}

                {!isSearching && results.length > 0 && (
                  <div className="divide-y divide-gray-100">
                    {results.map((shop) => {
                      const todayHours = formatHours(shop);
                      const isBox = shop.pickup_network_type === "dpd_box";

                      return (
                        <button
                          key={shop.id}
                          type="button"
                          onClick={() => handleSelect(shop)}
                          className="flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-gray-50 active:bg-gray-100"
                        >
                          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-red-50">
                            {isBox ? (
                              <Package className="h-4 w-4 text-red-600" />
                            ) : (
                              <MapPin className="h-4 w-4 text-red-600" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {shop.company}
                            </p>
                            <p className="text-xs text-gray-500">
                              {shop.street} {shop.house_number}, {shop.postcode}{" "}
                              {shop.city}
                            </p>
                            <div className="mt-1 flex items-center gap-2">
                              <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-600">
                                {isBox ? t("dpdBox") : t("pickupPoint")}
                              </span>
                              {todayHours && (
                                <span className="text-[10px] text-gray-400">
                                  {new Date().toLocaleDateString(locale, { weekday: "short" })}: {todayHours}
                                </span>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Initial state */}
                {!isSearching && !searchError && !hasSearched && (
                  <div className="flex flex-col items-center justify-center gap-2 py-12 text-gray-400">
                    <Search className="h-8 w-8" />
                    <p className="text-sm">{t("searchPlaceholder")}</p>
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}
