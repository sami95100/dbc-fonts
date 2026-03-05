"use client";

import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { MapPin, Navigation } from "lucide-react";
import { STORES, getDistance, getStoreStatus } from "@/data/stores";

interface StoreSelectStepProps {
  onSelect: (storeKey: string) => void;
}

export function StoreSelectStep({ onSelect }: StoreSelectStepProps) {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locating, setLocating] = useState(false);

  const requestLocation = () => {
    if (!("geolocation" in navigator)) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => setLocating(false)
    );
  };

  useEffect(() => {
    requestLocation();
  }, []);

  const sortedStores = useMemo(() => {
    if (!userLocation) return STORES;
    return [...STORES].sort(
      (a, b) =>
        getDistance(userLocation.lat, userLocation.lng, a.lat, a.lng) -
        getDistance(userLocation.lat, userLocation.lng, b.lat, b.lng)
    );
  }, [userLocation]);

  return (
    <div>
      {!userLocation && (
        <button
          type="button"
          onClick={requestLocation}
          disabled={locating}
          className="mb-6 flex items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
        >
          <Navigation className="h-4 w-4" />
          {locating ? "Localisation..." : "Me localiser"}
        </button>
      )}

      <div className="flex flex-col gap-3">
        {sortedStores.map((store) => {
          const distance = userLocation
            ? getDistance(userLocation.lat, userLocation.lng, store.lat, store.lng)
            : null;
          const status = getStoreStatus(store);

          return (
            <button
              key={store.key}
              type="button"
              onClick={() => onSelect(store.key)}
              className={cn(
                "flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5 text-left",
                "transition-all duration-200 hover:border-gray-900 hover:shadow-md"
              )}
            >
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-green-700" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-gray-900">
                  DBC {store.city}
                </p>
                <p className="mt-0.5 text-xs text-gray-500">{store.address}</p>
                <div className="mt-2 flex items-center gap-3 text-xs">
                  {distance !== null && (
                    <span className="text-gray-500">
                      {distance < 1
                        ? `${Math.round(distance * 1000)} m`
                        : `${distance.toFixed(1)} km`}
                    </span>
                  )}
                  <span
                    className={cn(
                      "font-medium",
                      status.isOpen ? "text-green-600" : "text-gray-400"
                    )}
                  >
                    {status.isOpen ? `Ouvert jusqu'a ${status.label}` : "Ferme"}
                  </span>
                </div>
              </div>
              <span className="mt-2 text-gray-400">&rsaquo;</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
