"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";
import { TrendingDown, Store, Package } from "lucide-react";
import type { BuybackEstimate, DeliveryMethod } from "@/types/buyback";

interface OfferStepProps {
  estimate: BuybackEstimate;
  onAccept: (method: DeliveryMethod) => void;
  onDecline: () => void;
}

export function OfferStep({ estimate, onAccept, onDecline }: OfferStepProps) {
  const hasPrice = estimate.price > 0;

  return (
    <div className="mx-auto max-w-lg">
      {/* Device summary */}
      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6">
        <div className="flex items-center gap-4">
          {estimate.image_url ? (
            <div className="relative h-20 w-20 shrink-0">
              <Image
                src={estimate.image_url}
                alt={estimate.model_name}
                fill
                className="object-contain"
                sizes="80px"
              />
            </div>
          ) : (
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-gray-100">
              <span className="text-3xl text-gray-400">?</span>
            </div>
          )}
          <div>
            <p className="text-lg font-bold text-gray-900">
              {estimate.model_name}
            </p>
            <p className="text-sm text-gray-500">
              {estimate.brand} - {estimate.storage}
            </p>
          </div>
        </div>
      </div>

      {/* Price + tagline */}
      {hasPrice ? (
        <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-8 text-center">
          {/* Price first - big and bold */}
          <p className="mb-1 text-sm font-medium text-gray-600">
            Ton {estimate.model_name} vaut
          </p>
          <p className="text-5xl font-bold text-primary">
            {formatPrice(estimate.price)}
          </p>
          {estimate.depreciation_info && (
            <div className="mt-2 flex items-center justify-center gap-1.5 text-xs text-gray-500">
              <TrendingDown className="h-3.5 w-3.5" />
              <span>{estimate.depreciation_info}</span>
            </div>
          )}

          {/* Tagline below price - urgency message with SVG highlight */}
          <div className="mt-5 border-t border-green-200 pt-5">
            <p className="font-display text-[17px] font-bold leading-relaxed tracking-tight text-gray-900 md:text-[19px]">
              Chaque jour qui passe, ton telephone{" "}
              <span className="text-primary highlight-underline is-visible">
                perd de la valeur
              </span>
              .
            </p>
            <p className="mt-2 text-sm text-gray-600">
              Tu ne t&apos;en sers plus ? Vends-le maintenant, quelqu&apos;un d&apos;autre en profitera.
            </p>
          </div>
        </div>
      ) : (
        <div className="mb-6 rounded-2xl border border-gray-200 bg-gray-50 p-8 text-center">
          <p className="text-sm font-medium text-gray-600">
            Ce modele dans cet etat ne peut pas etre repris en ligne.
          </p>
          <p className="mt-2 text-xs text-gray-500">
            Passe en magasin pour une evaluation personnalisee.
          </p>
        </div>
      )}

      {/* Delivery choice */}
      {hasPrice && (
        <div className="mb-4 flex flex-col gap-3">
          <p className="text-sm font-semibold text-gray-900">
            Comment souhaites-tu vendre ?
          </p>

          {/* Store option */}
          <button
            type="button"
            onClick={() => onAccept("store")}
            className={cn(
              "flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5 text-left",
              "transition-all duration-200 hover:border-green-700 hover:shadow-md"
            )}
          >
            <Store className="mt-0.5 h-6 w-6 shrink-0 text-green-700" />
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-gray-900">
                  Deposer en magasin
                </p>
                <span className="rounded-full bg-highlight px-2 py-0.5 text-[10px] font-bold text-primary">
                  Recommande
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Paye en cash sur place, en 20 min. Pas de contre-offre, pas de surprise.
              </p>
            </div>
          </button>

          {/* Postal option */}
          <button
            type="button"
            onClick={() => onAccept("postal")}
            className={cn(
              "flex items-start gap-4 rounded-2xl border border-gray-200 bg-white p-5 text-left",
              "transition-all duration-200 hover:border-gray-900 hover:shadow-md"
            )}
          >
            <Package className="mt-0.5 h-6 w-6 shrink-0 text-gray-600" />
            <div>
              <p className="text-sm font-semibold text-gray-900">
                Expedier par colis
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Expedition gratuite et assuree. Paiement par virement sous 5 jours apres reception.
              </p>
            </div>
          </button>
        </div>
      )}

      {/* Decline */}
      <button
        type="button"
        onClick={onDecline}
        className={cn(
          "mt-2 w-full rounded-full border border-gray-200 bg-white px-6 py-3",
          "text-sm font-semibold text-gray-600",
          "transition-colors hover:bg-gray-50"
        )}
      >
        Estimer un autre appareil
      </button>
    </div>
  );
}
