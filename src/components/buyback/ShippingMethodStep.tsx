"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import type { ShippingOption } from "@/types/buyback";

interface ShippingMethodStepProps {
  onSubmit: (option: ShippingOption) => void;
}

export function ShippingMethodStep({ onSubmit }: ShippingMethodStepProps) {
  const [selected, setSelected] = useState<ShippingOption>("kit");

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-2 text-center text-sm text-gray-500">
        3/3 Mode d&apos;envoi
      </div>
      <div className="mx-auto mb-8 h-1 w-full rounded-full bg-primary" />

      <h3 className="mb-2 text-lg font-bold text-gray-900">
        Comment souhaites-tu expedier ton appareil ?
      </h3>
      <p className="mb-6 text-sm text-gray-500">
        Quel que soit ton choix, l&apos;envoi est gratuit et integralement couvert par notre assurance.
      </p>

      <div className="flex flex-col gap-3">
        {/* Kit DBC */}
        <button
          type="button"
          onClick={() => setSelected("kit")}
          className={cn(
            "relative flex items-start gap-4 rounded-2xl border p-5 text-left transition-all duration-200",
            selected === "kit"
              ? "border-gray-900 bg-gray-50"
              : "border-gray-200 bg-white hover:border-gray-400"
          )}
        >
          <div
            className={cn(
              "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
              selected === "kit" ? "border-gray-900 bg-gray-900" : "border-gray-300"
            )}
          >
            {selected === "kit" && <Check className="h-3 w-3 text-white" />}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">
              Kit d&apos;envoi DBC
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Pas d&apos;emballage ? Pas de probleme. On t&apos;envoie les materiaux d&apos;emballage
              et une etiquette d&apos;expedition imprimee gratuitement sous 4 jours ouvres.
            </p>
          </div>
          <span className="absolute -top-2 right-3 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-medium text-blue-700">
            Recommande
          </span>
        </button>

        {/* Own packaging */}
        <button
          type="button"
          onClick={() => setSelected("own_packaging")}
          className={cn(
            "flex items-start gap-4 rounded-2xl border p-5 text-left transition-all duration-200",
            selected === "own_packaging"
              ? "border-gray-900 bg-gray-50"
              : "border-gray-200 bg-white hover:border-gray-400"
          )}
        >
          <div
            className={cn(
              "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
              selected === "own_packaging" ? "border-gray-900 bg-gray-900" : "border-gray-300"
            )}
          >
            {selected === "own_packaging" && <Check className="h-3 w-3 text-white" />}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">
              Ton emballage et etiquette a imprimer
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Imprime ton etiquette d&apos;expedition et emballe ton appareil avec tes propres materiaux.
            </p>
          </div>
        </button>
      </div>

      <button
        type="button"
        onClick={() => onSubmit(selected)}
        className={cn(
          "mt-8 w-full rounded-full py-4 text-base font-semibold",
          "bg-gray-900 text-white transition-colors hover:bg-gray-800"
        )}
      >
        Terminer ma revente
      </button>
    </div>
  );
}
