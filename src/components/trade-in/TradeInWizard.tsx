"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTradeIn } from "@/hooks/useTradeIn";
import { ProgressBar } from "./ProgressBar";
import { BrandStep } from "./BrandStep";
import { ModelStep } from "./ModelStep";
import { StorageStep } from "./StorageStep";
import { ConditionStep } from "./ConditionStep";
import { EstimateResult } from "./EstimateResult";

export function TradeInWizard() {
  const t = useTranslations("tradeIn");
  const {
    step,
    brands,
    models,
    storages,
    estimate,
    loading,
    error,
    stepIndex,
    loadBrands,
    selectBrand,
    selectModel,
    selectStorage,
    submitAnswers,
    goBack,
    restart,
  } = useTradeIn();

  useEffect(() => {
    loadBrands();
  }, [loadBrands]);

  return (
    <div className="mx-auto max-w-3xl">
      {/* Progress bar */}
      <div className="mb-8">
        <ProgressBar currentStep={step} />
      </div>

      {/* Back button */}
      {stepIndex > 0 && step !== "result" && (
        <button
          type="button"
          onClick={goBack}
          className={cn(
            "mb-6 flex items-center gap-2 text-sm font-medium text-gray-600",
            "transition-colors hover:text-gray-900"
          )}
        >
          <ArrowLeft className="h-4 w-4" />
          {t("back")}
        </button>
      )}

      {/* Error state */}
      {error && (
        <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm text-red-600">
          {t("error")}
        </div>
      )}

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-primary" />
        </div>
      )}

      {/* Step content */}
      {!loading && (
        <>
          {step === "brand" && (
            <BrandStep brands={brands} onSelect={selectBrand} />
          )}
          {step === "model" && (
            <ModelStep models={models} onSelect={selectModel} />
          )}
          {step === "storage" && (
            <StorageStep storages={storages} onSelect={selectStorage} />
          )}
          {step === "condition" && (
            <ConditionStep onSubmit={submitAnswers} />
          )}
          {step === "result" && estimate && (
            <EstimateResult estimate={estimate} onRestart={restart} />
          )}
        </>
      )}
    </div>
  );
}
