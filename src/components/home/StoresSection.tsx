"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useInView } from "@/hooks/useInView";
import { useState, useEffect, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, ArrowLeft, Phone, ExternalLink } from "lucide-react";

/* ─── Types ─────────────────────────────────────────────── */

interface DayHours {
  open: string;
  close: string;
  open2?: string;  // afternoon reopening (lunch break)
  close2?: string;
  closed?: boolean;
}

interface Store {
  key: string;
  city: string;
  address: string;
  phone: string;
  lat: number;
  lng: number;
  image: string;
  weeklyHours: DayHours[]; // index 0 = Sunday, 1 = Monday ... 6 = Saturday
}

/* ─── Store data ────────────────────────────────────────── */

const STORES: Store[] = [
  {
    key: "rosny2",
    city: "Rosny-sous-Bois",
    address: "CC Westfield Rosny 2, 1er etage Porte 1, 93110 Rosny-sous-Bois",
    phone: "07 43 63 83 46",
    lat: 48.8836,
    lng: 2.4776,
    image: "/rosny2.svg",
    weeklyHours: [
      { open: "10:00", close: "20:00" },  // Dim
      { open: "10:00", close: "20:30" },  // Lun
      { open: "10:00", close: "20:30" },  // Mar
      { open: "10:00", close: "20:30" },  // Mer
      { open: "10:00", close: "20:30" },  // Jeu
      { open: "10:00", close: "20:30" },  // Ven
      { open: "10:00", close: "20:30" },  // Sam
    ],
  },
  {
    key: "paris17",
    city: "Paris 17e",
    address: "110 Avenue de Villiers, 75017 Paris",
    phone: "06 95 06 48 67",
    lat: 48.88482,
    lng: 2.29858,
    image: "/paris 17 .svg",
    weeklyHours: [
      { open: "11:00", close: "19:30" },  // Dim
      { open: "11:00", close: "19:30" },  // Lun
      { open: "11:00", close: "19:30" },  // Mar
      { open: "11:00", close: "19:30" },  // Mer
      { open: "11:00", close: "19:30" },  // Jeu
      { open: "15:30", close: "19:30" },  // Ven
      { open: "11:00", close: "19:30" },  // Sam
    ],
  },
  {
    key: "paris12",
    city: "Paris 12e",
    address: "30 Avenue Daumesnil, 75012 Paris",
    phone: "07 43 39 55 26",
    lat: 48.84739,
    lng: 2.37481,
    image: "/paris 12.svg",
    weeklyHours: [
      { open: "11:00", close: "19:30" },  // Dim
      { open: "11:00", close: "19:30" },  // Lun
      { open: "11:00", close: "19:30" },  // Mar
      { open: "11:00", close: "19:30" },  // Mer
      { open: "11:00", close: "19:30" },  // Jeu
      { open: "15:00", close: "19:30" },  // Ven
      { open: "11:00", close: "19:30" },  // Sam
    ],
  },
  {
    key: "lille",
    city: "Lille",
    address: "23 Rue Leon Gambetta, 59000 Lille",
    phone: "07 60 55 60 39",
    lat: 50.63127,
    lng: 3.05939,
    image: "/dbc lille.svg",
    weeklyHours: [
      { open: "11:00", close: "20:30" },  // Dim
      { open: "11:00", close: "20:30" },  // Lun
      { open: "11:00", close: "20:30" },  // Mar
      { open: "11:00", close: "20:30" },  // Mer
      { open: "11:00", close: "20:30" },  // Jeu
      { open: "15:00", close: "20:30" },  // Ven
      { open: "11:00", close: "20:30" },  // Sam
    ],
  },
  {
    key: "bruxelles",
    city: "Bruxelles",
    address: "Boulevard Anspach 123, 1000 Bruxelles",
    phone: "+32 2 520 61 00",
    lat: 50.84664,
    lng: 4.34752,
    image: "/bruxelle.svg",
    weeklyHours: [
      { open: "", close: "", closed: true },  // Dim - Ferme
      { open: "11:00", close: "19:30" },  // Lun
      { open: "11:00", close: "19:30" },  // Mar
      { open: "11:00", close: "19:30" },  // Mer
      { open: "11:00", close: "19:30" },  // Jeu
      { open: "15:00", close: "19:30" },  // Ven
      { open: "11:00", close: "19:30" },  // Sam
    ],
  },
  {
    key: "marseille",
    city: "Marseille",
    address: "Centre-ville, Marseille",
    phone: "04 86 68 32 30",
    lat: 43.2965,
    lng: 5.3698,
    image: "/marseille.svg",
    weeklyHours: [
      { open: "", close: "", closed: true },  // Dim
      { open: "10:00", close: "19:00" },
      { open: "10:00", close: "19:00" },
      { open: "10:00", close: "19:00" },
      { open: "10:00", close: "19:00" },
      { open: "10:00", close: "19:00" },
      { open: "10:00", close: "19:00" },
    ],
  },
  {
    key: "laValentine",
    city: "Marseille",
    address: "CC Grand V, 117 Traverse de la Montre, 13011 Marseille",
    phone: "04 86 68 32 30",
    lat: 43.29584,
    lng: 5.47916,
    image: "/marseille.svg",
    weeklyHours: [
      { open: "", close: "", closed: true },  // Dim
      { open: "10:00", close: "19:00" },
      { open: "10:00", close: "19:00" },
      { open: "10:00", close: "19:00" },
      { open: "10:00", close: "19:00" },
      { open: "10:00", close: "19:00" },
      { open: "10:00", close: "19:00" },
    ],
  },
  {
    key: "toulouse",
    city: "Toulouse",
    address: "88 Avenue de Grande Bretagne, 31300 Toulouse",
    phone: "07 66 12 42 62",
    lat: 43.59892,
    lng: 1.41783,
    image: "/toulouse.svg",
    weeklyHours: [
      { open: "15:00", close: "20:00" },  // Dim
      { open: "10:00", close: "20:00" },
      { open: "10:00", close: "20:00" },
      { open: "10:00", close: "20:00" },
      { open: "10:00", close: "20:00" },
      { open: "15:00", close: "20:00" },  // Ven
      { open: "10:00", close: "20:00" },
    ],
  },
  {
    key: "bordeaux",
    city: "Bordeaux",
    address: "189 Cours de la Marne, 33800 Bordeaux",
    phone: "06 15 44 47 84",
    lat: 44.82816,
    lng: -0.56121,
    image: "/bordeaux.svg",
    weeklyHours: [
      { open: "", close: "", closed: true },  // Dim
      { open: "11:00", close: "13:00", open2: "14:00", close2: "19:00" },  // Lun
      { open: "11:00", close: "13:00", open2: "14:00", close2: "19:00" },  // Mar
      { open: "11:00", close: "13:00", open2: "14:00", close2: "19:00" },  // Mer
      { open: "11:00", close: "13:00", open2: "14:00", close2: "19:00" },  // Jeu
      { open: "15:00", close: "19:00" },  // Ven
      { open: "11:00", close: "13:00", open2: "14:00", close2: "19:00" },  // Sam
    ],
  },
];

/* ─── Helpers ───────────────────────────────────────────── */

function getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getStoreStatus(store: Store): { label: string; isOpen: boolean } {
  const now = new Date();
  const day = now.getDay();
  const h = store.weeklyHours[day];

  if (h.closed) {
    return { label: "", isOpen: false };
  }

  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const toMin = (t: string) => { const [hh, mm] = t.split(":").map(Number); return hh * 60 + mm; };

  // If store has a lunch break (open2/close2)
  if (h.open2 && h.close2) {
    const open1 = toMin(h.open);
    const close1 = toMin(h.close);
    const open2 = toMin(h.open2);
    const close2 = toMin(h.close2);

    if (currentMinutes < open1) return { label: h.open, isOpen: false };
    if (currentMinutes >= open1 && currentMinutes < close1) return { label: h.close, isOpen: true };
    if (currentMinutes >= close1 && currentMinutes < open2) return { label: h.open2, isOpen: false };
    if (currentMinutes >= open2 && currentMinutes < close2) return { label: h.close2, isOpen: true };
    return { label: "", isOpen: false };
  }

  // Simple schedule
  const openMin = toMin(h.open);
  const closeMin = toMin(h.close);

  if (currentMinutes < openMin) return { label: h.open, isOpen: false };
  if (currentMinutes >= closeMin) return { label: "", isOpen: false };
  return { label: h.close, isOpen: true };
}

function formatDayHours(h: DayHours): string {
  if (h.closed) return "";
  if (h.open2 && h.close2) return `${h.open} - ${h.close} / ${h.open2} - ${h.close2}`;
  return `${h.open} - ${h.close}`;
}

function getMapsUrl(store: Store): string {
  return `https://maps.apple.com/?daddr=${store.lat},${store.lng}`;
}

const DAY_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;

function getNextDays(): { dayKey: (typeof DAY_KEYS)[number]; date: Date }[] {
  const days: { dayKey: (typeof DAY_KEYS)[number]; date: Date }[] = [];
  const now = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(now.getDate() + i);
    days.push({ dayKey: DAY_KEYS[d.getDay()], date: d });
  }
  return days;
}

/* ─── Store Detail Overlay ──────────────────────────────── */

function StoreDetailOverlay({
  store,
  open,
  onClose,
}: {
  store: Store | null;
  open: boolean;
  onClose: () => void;
}) {
  const t = useTranslations("home");
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const meta = document.querySelector('meta[name="theme-color"]');
    const originalColor = meta?.getAttribute("content") || "";

    if (open) {
      requestAnimationFrame(() => setVisible(true));
      document.body.style.overflow = "hidden";
      meta?.setAttribute("content", "#ffffff");
    } else {
      setVisible(false);
      document.body.style.overflow = "";
      if (originalColor) meta?.setAttribute("content", originalColor);
    }
    return () => {
      document.body.style.overflow = "";
      if (originalColor) meta?.setAttribute("content", originalColor);
    };
  }, [open]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (open) window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!mounted || !open || !store) return null;

  const status = getStoreStatus(store);
  const days = getNextDays();

  const statusText = status.isOpen
    ? t("stores.openUntil", { time: status.label })
    : status.label
      ? t("stores.opensAt", { time: status.label })
      : t("stores.closed");

  return createPortal(
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
    >
      {/* Backdrop - covers safe area too */}
      <div className="absolute inset-0 bg-white" style={{ top: "calc(-1 * env(safe-area-inset-top, 0px))" }} />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-lg">
          <div className="mx-auto flex max-w-3xl items-center px-5 py-4">
            <button
              onClick={onClose}
              className="flex items-center gap-1 text-sm font-medium text-green-700 hover:text-green-800"
              aria-label={t("stores.back")}
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex-1 text-center">
              <h2 className="text-lg font-bold text-gray-900 md:text-xl">
                {t(`stores.${store.key}.name`)}
              </h2>
              <p className="text-sm text-gray-500">{statusText}</p>
            </div>
            <button
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 transition-colors hover:bg-gray-200"
              aria-label="Close"
            >
              <X className="h-4 w-4 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Store image */}
        <div className="relative mx-auto aspect-[16/9] w-full max-w-3xl bg-gray-100">
          <Image
            src={store.image}
            alt={t(`stores.${store.key}.name`)}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </div>

        {/* Details */}
        <div className="mx-auto w-full max-w-3xl px-5 py-8 md:px-8">
          {/* Opening hours */}
          <h3 className="mb-4 text-lg font-bold text-gray-900 md:text-xl">
            {t("stores.openingHours")}
          </h3>
          <div className="mb-8 flex flex-col gap-2">
            {days.map((day, i) => {
              const dayHours = store.weeklyHours[day.date.getDay()];
              const isToday = i === 0;
              const dateStr = day.date.toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "short",
              });

              return (
                <div
                  key={i}
                  className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm md:text-base ${isToday ? "bg-gray-50 font-bold" : ""}`}
                >
                  <span className="w-16 text-gray-900">
                    {isToday ? t("stores.today") : t(`stores.days.${day.dayKey}`)}
                  </span>
                  <span className="text-gray-500">{dateStr}</span>
                  <span className="text-right text-gray-900">
                    {dayHours.closed
                      ? t("stores.closed")
                      : formatDayHours(dayHours)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Address */}
          <h3 className="mb-3 text-lg font-bold text-gray-900 md:text-xl">
            {t("stores.addressLabel")}
          </h3>
          <p className="mb-2 text-sm leading-relaxed text-gray-600 md:text-base">
            {store.address}
          </p>

          {/* Phone */}
          <a
            href={`tel:${store.phone.replace(/\s/g, "")}`}
            className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-green-700 hover:text-green-800 md:text-base"
          >
            <Phone className="h-4 w-4" />
            {store.phone}
          </a>

          {/* Open in Maps */}
          <div className="mt-2">
            <a
              href={getMapsUrl(store)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-green-700 hover:text-green-800 md:text-base"
            >
              {t("stores.openInMaps")}
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

/* ─── Main Section ──────────────────────────────────────── */

export function StoresSection() {
  const t = useTranslations("home");
  const { ref: inViewRef, isInView } = useInView();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => {}
      );
    }
  }, []);

  const sortedStores = useMemo(() => {
    if (!userLocation) return STORES;
    return [...STORES].sort(
      (a, b) =>
        getDistance(userLocation.lat, userLocation.lng, a.lat, a.lng) -
        getDistance(userLocation.lat, userLocation.lng, b.lat, b.lng)
    );
  }, [userLocation]);

  const handleClose = useCallback(() => setSelectedStore(null), []);

  return (
    <>
      <section ref={inViewRef} className={`py-8 md:py-12 lg:py-16 transition-all duration-700 ease-out ${isInView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}>
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="mb-8 text-[28px] font-bold leading-tight tracking-tight text-gray-900 md:mb-10 md:text-[32px] lg:text-[36px]">
            {t("stores.title")}{" "}
            <span className="font-normal text-gray-500">{t("stores.titleAccent")}</span>
          </h2>
        </div>

        <div className="flex w-full gap-3 overflow-x-auto scroll-smooth px-4 pb-6 scrollbar-hide md:gap-4 md:px-8">
          {sortedStores.map((store) => {
            const distance = userLocation
              ? getDistance(userLocation.lat, userLocation.lng, store.lat, store.lng)
              : null;
            const status = getStoreStatus(store);
            const statusText = status.isOpen
              ? t("stores.openUntil", { time: status.label })
              : status.label
                ? t("stores.opensAt", { time: status.label })
                : t("stores.closed");

            return (
              <div
                key={store.key}
                onClick={() => setSelectedStore(store)}
                className="flex w-[280px] shrink-0 cursor-pointer flex-col overflow-hidden rounded-3xl bg-white shadow-sm transition-shadow duration-300 hover:shadow-lg md:w-[320px] lg:w-[370px]"
              >
                {/* Store image */}
                <div className="relative h-[200px] w-full bg-gray-100 md:h-[240px] lg:h-[280px]">
                  <Image
                    src={store.image}
                    alt={t(`stores.${store.key}.name`)}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 280px, (max-width: 1024px) 320px, 370px"
                  />
                </div>

                {/* Info zone */}
                <div className="flex flex-1 flex-col justify-between p-5 md:p-6">
                  <div>
                    <h3 className="text-base font-bold text-gray-900 md:text-lg">
                      {t(`stores.${store.key}.name`)}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-gray-500 md:text-sm">
                      {store.address}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 mt-4 border-t border-gray-100 pt-3 text-xs text-gray-500 md:text-sm">
                    {distance !== null && (
                      <span>
                        {distance < 1
                          ? `${Math.round(distance * 1000)} m`
                          : `${distance.toFixed(1)} km`}
                      </span>
                    )}
                    <span>{statusText}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <StoreDetailOverlay
        store={selectedStore}
        open={selectedStore !== null}
        onClose={handleClose}
      />
    </>
  );
}
