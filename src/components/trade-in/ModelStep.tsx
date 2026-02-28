"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { TradeInModel } from "@/lib/api/trade-in";

interface ModelStepProps {
  models: TradeInModel[];
  onSelect: (model: TradeInModel) => void;
}

export function ModelStep({ models, onSelect }: ModelStepProps) {
  const t = useTranslations("tradeIn");

  return (
    <div>
      <h2 className="mb-6 text-lg font-semibold text-gray-900">
        {t("modelStep.title")}
      </h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
        {models.map((model) => (
          <button
            key={model.id}
            type="button"
            onClick={() => onSelect(model)}
            className={cn(
              "flex flex-col items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4",
              "transition-all duration-150 hover:border-primary hover:shadow-md",
              "cursor-pointer"
            )}
          >
            {model.primary_image_url ? (
              <div className="relative h-24 w-24">
                <Image
                  src={model.primary_image_url}
                  alt={model.name}
                  fill
                  className="object-contain"
                  sizes="96px"
                />
              </div>
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-gray-100">
                <span className="text-2xl text-gray-400">?</span>
              </div>
            )}
            <span className="text-center text-sm font-medium text-gray-900">
              {model.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
