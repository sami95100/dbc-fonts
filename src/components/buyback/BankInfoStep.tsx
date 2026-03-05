"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { BuybackBankInfo } from "@/types/buyback";

interface BankInfoStepProps {
  estimatePrice: number;
  onSubmit: (info: BuybackBankInfo) => void;
  onSkip: () => void;
}

export function BankInfoStep({ estimatePrice, onSubmit, onSkip }: BankInfoStepProps) {
  const [iban, setIban] = useState("");
  const [skipChecked, setSkipChecked] = useState(false);

  const formatIban = (value: string) => {
    const cleaned = value.replace(/\s/g, "").toUpperCase();
    return cleaned.replace(/(.{4})/g, "$1 ").trim();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\s/g, "");
    if (raw.length <= 34) {
      setIban(formatIban(raw));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (skipChecked) {
      onSkip();
      return;
    }
    if (iban.replace(/\s/g, "").length >= 15) {
      onSubmit({ iban: iban.replace(/\s/g, "") });
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-2 text-center text-sm text-gray-500">
        1/3 Informations bancaires
      </div>
      <div className="mx-auto mb-8 h-1 w-1/3 rounded-full bg-primary" />

      <h3 className="mb-2 text-lg font-bold text-gray-900">
        On a besoin de ca pour te payer
      </h3>
      <p className="mb-6 text-sm text-gray-500">
        Comme ca on pourra verser {estimatePrice.toFixed(2)} EUR directement
        sur ton compte. Vite fait, bien fait.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="mb-1">
          <input
            type="text"
            value={iban}
            onChange={handleChange}
            placeholder="IBAN"
            disabled={skipChecked}
            className={cn(
              "w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-base text-gray-900",
              "placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900",
              "transition-colors",
              skipChecked && "opacity-50"
            )}
          />
          <p className="mt-1.5 text-xs text-gray-400">
            Ex : FR14 2004 1010 2004 1010 1010
          </p>
        </div>

        <label className="mt-6 flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={skipChecked}
            onChange={(e) => setSkipChecked(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-gray-300"
          />
          <span className="text-sm text-gray-600">
            Je n&apos;ai pas ces informations sur moi, je les renseignerai plus tard.
          </span>
        </label>

        <p className="mt-6 text-xs text-gray-400">
          DBC collecte vos informations bancaires pour votre paiement
          via notre prestataire securise.{" "}
          <a href="/fr/legal/protection-donnees" className="underline">
            Voir notre Politique de protection des donnees
          </a>.
        </p>

        <button
          type="submit"
          className={cn(
            "mt-6 w-full rounded-full py-4 text-base font-semibold",
            "bg-gray-900 text-white transition-colors hover:bg-gray-800"
          )}
        >
          Continuer
        </button>
      </form>
    </div>
  );
}
