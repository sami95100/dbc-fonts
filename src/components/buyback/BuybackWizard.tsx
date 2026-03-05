"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { useBuybackStore } from "@/stores/buyback-store";
import { useAuthStore } from "@/stores/auth-store";
import {
  getBuybackBrands,
  getBuybackModels,
  getBuybackStorages,
  getBuybackEstimate,
  submitBuybackOrder,
} from "@/lib/api/buyback";
import { BuybackStepLayout } from "./BuybackStepLayout";
import { CategoryStep } from "./CategoryStep";
import { BrandStep } from "./BrandStep";
import { ModelStep } from "./ModelStep";
import { StorageStep } from "./StorageStep";
import { ScreenConditionStep } from "./ScreenConditionStep";
import { BodyConditionStep } from "./BodyConditionStep";
import { ChecklistStep } from "./ChecklistStep";
import { OfferStep } from "./OfferStep";
import { StoreSelectStep } from "./StoreSelectStep";
import { AppointmentStep } from "./AppointmentStep";
import { BankInfoStep } from "./BankInfoStep";
import { PersonalInfoStep } from "./PersonalInfoStep";
import { ShippingMethodStep } from "./ShippingMethodStep";
import { ConfirmationStep } from "./ConfirmationStep";
import type { BuybackCategory, BuybackModel, FunctionalityChecklist, DeliveryMethod } from "@/types/buyback";

const STEP_TITLES: Record<string, { title: string; subtitle?: string }> = {
  category: { title: "Que souhaitez-vous revendre ?", subtitle: "Selectionnez une categorie" },
  brand: { title: "Quelle marque ?", subtitle: "Selectionnez la marque de votre appareil" },
  model: { title: "Quel modele ?", subtitle: "Selectionnez votre modele" },
  storage: { title: "Quelle capacite ?", subtitle: "Selectionnez la capacite de stockage" },
  screen: { title: "Etat de l'ecran", subtitle: "Soyez honnete, ca nous aide a vous faire la meilleure offre" },
  body: { title: "Etat de l'arriere et du chassis", subtitle: "Faces arriere, contour et boutons" },
  checklist: { title: "Fonctionnalites", subtitle: "Tout fonctionne ?" },
  offer: { title: "" },
  "store-select": { title: "Choisissez votre magasin", subtitle: "Le plus proche, le plus rapide" },
  appointment: { title: "Prenez rendez-vous", subtitle: "Choisissez un creneau de 30 min" },
  "bank-info": { title: "" },
  "personal-info": { title: "" },
  "shipping-method": { title: "" },
  confirmation: { title: "" },
};

export function BuybackWizard() {
  const locale = useLocale();
  const router = useRouter();
  const store = useBuybackStore();
  const { user } = useAuthStore();
  const [brands, setBrands] = useState<string[]>([]);
  const [models, setModels] = useState<BuybackModel[]>([]);
  const [storages, setStorages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset store on mount ONLY if not returning from login redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const isReturningFromLogin = params.has("redirect") || document.referrer.includes("/login");
    if (!isReturningFromLogin && store.step === "category") {
      store.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll to top of wizard on step change
  useEffect(() => {
    containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [store.step]);

  const handleCategory = useCallback(async (category: BuybackCategory) => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await getBuybackBrands(category);
    setLoading(false);
    if (err) { setError(err.error); return; }
    setBrands(data ?? []);
    store.setCategory(category);
  }, [store]);

  const handleBrand = useCallback(async (brand: string) => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await getBuybackModels(brand);
    setLoading(false);
    if (err) { setError(err.error); return; }
    setModels(data ?? []);
    store.setBrand(brand);
  }, [store]);

  const handleModel = useCallback(async (model: BuybackModel) => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await getBuybackStorages(model.id);
    setLoading(false);
    if (err) { setError(err.error); return; }
    setStorages(data ?? []);
    store.setModel(model);
  }, [store]);

  const handleStorage = useCallback((storage: string) => {
    store.setStorage(storage);
  }, [store]);

  const handleScreen = useCallback((condition: Parameters<typeof store.setScreenCondition>[0]) => {
    store.setScreenCondition(condition);
  }, [store]);

  const handleBody = useCallback((condition: Parameters<typeof store.setBodyCondition>[0]) => {
    store.setBodyCondition(condition);
  }, [store]);

  const handleChecklist = useCallback(async (checklist: FunctionalityChecklist) => {
    if (!store.model || !store.storage || !store.screenCondition || !store.bodyCondition) return;
    store.setChecklist(checklist);
    setLoading(true);
    setError(null);
    const { data, error: err } = await getBuybackEstimate({
      model_id: store.model.id,
      storage: store.storage,
      screen: store.screenCondition,
      body: store.bodyCondition,
      checklist,
    });
    setLoading(false);
    if (err) { setError(err.error); return; }
    if (data) store.setEstimate(data);
  }, [store]);

  const handleAcceptOffer = useCallback((method: DeliveryMethod) => {
    // Auth required for both paths
    if (!user) {
      router.push(`/${locale}/account/login?redirect=/${locale}/reprise`);
      return;
    }
    store.setDeliveryMethod(method);
  }, [store, user, router, locale]);

  const handleStoreSelect = useCallback((storeKey: string) => {
    store.setSelectedStoreKey(storeKey);
  }, [store]);

  const handleAppointment = useCallback(async (slot: Parameters<typeof store.setAppointment>[0]) => {
    store.setAppointment(slot);
    if (!store.estimate) return;
    setLoading(true);
    const { data } = await submitBuybackOrder({
      estimate_id: store.estimate.id,
      delivery_method: "store",
      store_key: slot.storeKey,
      appointment: slot,
    });
    setLoading(false);
    if (data) store.setConfirmationId(data.confirmation_id);
  }, [store]);

  const handleBankInfo = useCallback((info: Parameters<typeof store.setBankInfo>[0]) => {
    store.setBankInfo(info);
  }, [store]);

  const handleBankSkip = useCallback(() => {
    store.setBankInfo({ iban: "" });
  }, [store]);

  const handlePersonalInfo = useCallback((info: Parameters<typeof store.setPersonalInfo>[0]) => {
    store.setPersonalInfo(info);
  }, [store]);

  const handleShippingMethod = useCallback(async (option: Parameters<typeof store.setShippingOption>[0]) => {
    store.setShippingOption(option);
    if (!store.estimate) return;
    setLoading(true);
    const { data } = await submitBuybackOrder({
      estimate_id: store.estimate.id,
      delivery_method: "postal",
      shipping_option: option,
      bank_info: store.bankInfo ?? undefined,
      personal_info: store.personalInfo ?? undefined,
    });
    setLoading(false);
    if (data) store.setConfirmationId(data.confirmation_id);
  }, [store]);

  const stepConfig = STEP_TITLES[store.step] ?? { title: "" };
  const showBack = store.step !== "category" && store.step !== "confirmation";

  return (
    <div ref={containerRef}>
      <BuybackStepLayout
        step={store.step}
        title={stepConfig.title}
        subtitle={stepConfig.subtitle}
        onBack={showBack ? store.goBack : undefined}
        showProgress={!["offer", "store-select", "appointment", "bank-info", "personal-info", "shipping-method", "confirmation"].includes(store.step)}
      >
        {error && (
          <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-primary" />
          </div>
        ) : (
          <>
            {store.step === "category" && (
              <CategoryStep onSelect={handleCategory} />
            )}
            {store.step === "brand" && (
              <BrandStep brands={brands} onSelect={handleBrand} />
            )}
            {store.step === "model" && (
              <ModelStep models={models} onSelect={handleModel} />
            )}
            {store.step === "storage" && (
              <StorageStep storages={storages} onSelect={handleStorage} />
            )}
            {store.step === "screen" && (
              <ScreenConditionStep onSelect={handleScreen} />
            )}
            {store.step === "body" && (
              <BodyConditionStep onSelect={handleBody} />
            )}
            {store.step === "checklist" && (
              <ChecklistStep onSubmit={handleChecklist} />
            )}
            {store.step === "offer" && store.estimate && (
              <OfferStep
                estimate={store.estimate}
                onAccept={handleAcceptOffer}
                onDecline={store.reset}
              />
            )}
            {store.step === "store-select" && (
              <StoreSelectStep onSelect={handleStoreSelect} />
            )}
            {store.step === "appointment" && store.selectedStoreKey && (
              <AppointmentStep
                storeKey={store.selectedStoreKey}
                onSelect={handleAppointment}
              />
            )}
            {store.step === "bank-info" && store.estimate && (
              <BankInfoStep
                estimatePrice={store.estimate.price}
                onSubmit={handleBankInfo}
                onSkip={handleBankSkip}
              />
            )}
            {store.step === "personal-info" && (
              <PersonalInfoStep onSubmit={handlePersonalInfo} />
            )}
            {store.step === "shipping-method" && (
              <ShippingMethodStep onSubmit={handleShippingMethod} />
            )}
            {store.step === "confirmation" && store.estimate && store.confirmationId && (
              <ConfirmationStep
                confirmationId={store.confirmationId}
                estimate={store.estimate}
                deliveryMethod={store.deliveryMethod!}
                shippingOption={store.shippingOption}
                storeKey={store.selectedStoreKey}
                appointment={store.appointment}
              />
            )}
          </>
        )}
      </BuybackStepLayout>
    </div>
  );
}
