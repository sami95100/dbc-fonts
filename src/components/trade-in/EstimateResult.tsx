"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";
import type { TradeInEstimate } from "@/lib/api/trade-in";

interface EstimateResultProps {
  estimate: TradeInEstimate;
  onRestart: () => void;
}

export function EstimateResult({ estimate, onRestart }: EstimateResultProps) {
  const t = useTranslations("tradeIn.result");
  const locale = useLocale();
  const hasPrice = estimate.price > 0;

  return (
    <div className="mx-auto max-w-lg">
      <h2 className="mb-6 text-center text-lg font-semibold text-gray-900">
        {t("title")}
      </h2>

      {/* Device summary card */}
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
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
              {t("yourDevice")}
            </p>
            <p className="text-lg font-bold text-gray-900">
              {estimate.model_name}
            </p>
            <p className="text-sm text-gray-600">
              {estimate.brand} - {estimate.storage}
            </p>
          </div>
        </div>

        <div className="mt-4 border-t border-gray-100 pt-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">{t("condition")}</span>
            <span
              className={cn(
                "rounded-full px-3 py-1 text-sm font-medium",
                estimate.condition_grade === "bon_etat" &&
                  "bg-green-100 text-green-800",
                estimate.condition_grade === "correct" &&
                  "bg-yellow-100 text-yellow-800",
                estimate.condition_grade === "casse" &&
                  "bg-red-100 text-red-800"
              )}
            >
              {t(`grades.${estimate.condition_grade}`)}
            </span>
          </div>
        </div>
      </div>

      {/* Price result */}
      <div
        className={cn(
          "mb-6 rounded-2xl p-6 text-center",
          hasPrice ? "bg-green-50 border border-green-200" : "bg-gray-50 border border-gray-200"
        )}
      >
        {hasPrice ? (
          <>
            <p className="mb-1 text-sm font-medium text-gray-600">
              {t("estimatedPrice")}
            </p>
            <p className="text-4xl font-bold text-primary">
              {formatPrice(estimate.price, locale === "fr" ? "fr-FR" : "en-US")}
            </p>
          </>
        ) : (
          <p className="text-sm font-medium text-gray-600">{t("noPrice")}</p>
        )}
      </div>

      {/* Disclaimer */}
      <p className="mb-6 text-center text-xs text-gray-500">
        {t("disclaimer")}
      </p>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={onRestart}
          className={cn(
            "w-full rounded-2xl border border-gray-200 bg-white px-6 py-3",
            "text-sm font-semibold text-gray-900",
            "transition-colors hover:bg-gray-50"
          )}
        >
          {t("restart")}
        </button>
      </div>
    </div>
  );
}
