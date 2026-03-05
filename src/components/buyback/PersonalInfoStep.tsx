"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { BuybackPersonalInfo } from "@/types/buyback";

interface PersonalInfoStepProps {
  onSubmit: (info: BuybackPersonalInfo) => void;
}

export function PersonalInfoStep({ onSubmit }: PersonalInfoStepProps) {
  const [form, setForm] = useState<BuybackPersonalInfo>({
    birthDate: "",
    address: "",
    addressComplement: "",
    city: "",
    postalCode: "",
    country: "France",
    phone: "",
  });
  const [termsAccepted, setTermsAccepted] = useState(false);

  const update = (key: keyof BuybackPersonalInfo, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const isValid =
    form.birthDate &&
    form.address &&
    form.city &&
    form.postalCode &&
    form.phone &&
    termsAccepted;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    onSubmit(form);
  };

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-2 text-center text-sm text-gray-500">
        2/3 Informations personnelles
      </div>
      <div className="mx-auto mb-8 h-1 w-2/3 rounded-full bg-primary" />

      <h3 className="mb-2 text-lg font-bold text-gray-900">
        Promis on en prendra soin
      </h3>
      <p className="mb-6 text-sm text-gray-500">
        Notre prestataire de paiement a besoin de ces informations pour effectuer la transaction.
        Tu dois avoir plus de 18 ans pour revendre un appareil.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <input
            type="date"
            value={form.birthDate}
            onChange={(e) => update("birthDate", e.target.value)}
            placeholder="Date de naissance"
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-base text-gray-900 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
          />
          <p className="mt-1 text-xs text-gray-400">Ex : 16/09/1985</p>
        </div>

        <div>
          <input
            type="text"
            value={form.address}
            onChange={(e) => update("address", e.target.value)}
            placeholder="Adresse"
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-base text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
          />
          <p className="mt-1 text-xs text-gray-400">Ex : 3, rue du reconditionnement</p>
        </div>

        <input
          type="text"
          value={form.addressComplement}
          onChange={(e) => update("addressComplement", e.target.value)}
          placeholder="Complement d'adresse (optionnel)"
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-base text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
        />

        <div>
          <input
            type="text"
            value={form.city}
            onChange={(e) => update("city", e.target.value)}
            placeholder="Ville"
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-base text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
          />
        </div>

        <div>
          <input
            type="text"
            value={form.postalCode}
            onChange={(e) => update("postalCode", e.target.value)}
            placeholder="Code Postal"
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-base text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
          />
        </div>

        <div className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-base text-gray-400">
          France
        </div>

        <div className="flex gap-2">
          <div className="flex items-center rounded-xl border border-gray-200 bg-white px-3 py-3.5 text-sm text-gray-500">
            +33
          </div>
          <input
            type="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="Telephone"
            className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-base text-gray-900 placeholder:text-gray-400 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
          />
        </div>

        <label className="mt-2 flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-gray-300"
          />
          <span className="text-xs text-gray-600">
            J&apos;accepte de ceder mon produit conformement aux{" "}
            <a href="/fr/legal/conditions-reprise" className="font-medium underline">
              Termes et Conditions pour les reprises
            </a>{" "}
            et a la{" "}
            <a href="/fr/legal/protection-donnees" className="font-medium underline">
              Politique de protection des donnees
            </a>.
          </span>
        </label>

        <button
          type="submit"
          disabled={!isValid}
          className={cn(
            "mt-4 w-full rounded-full py-4 text-base font-semibold transition-all duration-200",
            isValid
              ? "bg-gray-900 text-white hover:bg-gray-800"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          )}
        >
          Continuer
        </button>
      </form>
    </div>
  );
}
