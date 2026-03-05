"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";
import { Check, MapPin, Clock, Store } from "lucide-react";
import { STORES } from "@/data/stores";
import type { BuybackEstimate, DeliveryMethod, ShippingOption, AppointmentSlot } from "@/types/buyback";

interface ConfirmationStepProps {
  confirmationId: string;
  estimate: BuybackEstimate;
  deliveryMethod: DeliveryMethod;
  shippingOption?: ShippingOption | null;
  storeKey?: string | null;
  appointment?: AppointmentSlot | null;
}

export function ConfirmationStep({
  confirmationId,
  estimate,
  deliveryMethod,
  shippingOption,
  storeKey,
  appointment,
}: ConfirmationStepProps) {
  const locale = useLocale();
  const store = storeKey ? STORES.find((s) => s.key === storeKey) : null;

  return (
    <div className="mx-auto max-w-lg">
      {/* Success header */}
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <Check className="h-8 w-8 text-green-700" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">
          C&apos;est dans la poche !
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Pour donner une nouvelle vie a ton appareil, c&apos;est par la.
        </p>
      </div>

      {/* Next steps */}
      <div className="mb-6 rounded-2xl bg-gray-50 p-6">
        <h3 className="mb-4 text-base font-bold text-gray-900">
          Et apres ?
        </h3>
        <div className="flex flex-col gap-4">
          {deliveryMethod === "store" && appointment ? (
            <>
              <div className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  1
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Rendez-vous chez DBC {store?.city}
                  </p>
                  <p className="text-xs text-gray-500">
                    Le {new Date(appointment.date).toLocaleDateString("fr-FR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })} a {appointment.time}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  2
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Evaluation en 20 min
                  </p>
                  <p className="text-xs text-gray-500">
                    Nos experts verifient ton appareil sur place.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  3
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Paye cash immediatement
                  </p>
                  <p className="text-xs text-gray-500">
                    Tu repars avec {formatPrice(estimate.price)} en main.
                  </p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  1
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {shippingOption === "kit"
                      ? "Recois ton kit d'envoi prepaye"
                      : "Imprime ton etiquette d'expedition"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {shippingOption === "kit"
                      ? "Tu recevras ton kit d'envoi sous 4 jours ouvres."
                      : "Telecharge et imprime ton etiquette depuis ton espace."}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  2
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Expedie ton {estimate.model_name} sous 21 jours
                  </p>
                  <p className="text-xs text-gray-500">
                    Expedition gratuite !
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  3
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    Deconnecte tes comptes et renseigne ton IBAN
                  </p>
                  <p className="text-xs text-gray-500">
                    Tu recevras {formatPrice(estimate.price)} sur ton compte une fois l&apos;appareil verifie.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Recap */}
      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-base font-bold text-gray-900">
          Informations sur la reprise
        </h3>
        <div className="flex items-center gap-4 mb-4">
          {estimate.image_url ? (
            <div className="relative h-16 w-16 shrink-0">
              <Image
                src={estimate.image_url}
                alt={estimate.model_name}
                fill
                className="object-contain"
                sizes="64px"
              />
            </div>
          ) : (
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gray-100">
              <span className="text-2xl text-gray-400">?</span>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-500">N de reprise :</p>
            <p className="text-sm font-bold text-gray-900">
              {estimate.brand} {estimate.model_name} {estimate.storage}
            </p>
            <p className="text-sm font-bold text-primary">
              {formatPrice(estimate.price)}
            </p>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <div className="flex justify-between py-2 text-sm">
            <span className="text-gray-500">N de reprise</span>
            <span className="font-medium text-gray-900">{confirmationId}</span>
          </div>
          {deliveryMethod === "store" && store && (
            <div className="flex justify-between py-2 text-sm">
              <span className="text-gray-500">Magasin</span>
              <span className="font-medium text-gray-900">DBC {store.city}</span>
            </div>
          )}
          <div className="flex justify-between py-2 text-sm">
            <span className="text-gray-500">Methode</span>
            <span className="font-medium text-gray-900">
              {deliveryMethod === "store" ? "Depot en magasin" : shippingOption === "kit" ? "Kit d'envoi DBC" : "Envoi personnel"}
            </span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <Link
        href={`/${locale}/account`}
        className={cn(
          "block w-full rounded-full py-4 text-center text-base font-semibold",
          "bg-primary text-white transition-colors hover:bg-primary/90"
        )}
      >
        J&apos;ai compris
      </Link>
    </div>
  );
}
