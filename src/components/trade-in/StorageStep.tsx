"use client";

import { useTranslations } from "next-intl";
import { RadioOption } from "@/components/products/configurator/RadioOption";

interface StorageStepProps {
  storages: string[];
  onSelect: (storage: string) => void;
}

export function StorageStep({ storages, onSelect }: StorageStepProps) {
  const t = useTranslations("tradeIn");

  return (
    <div>
      <h2 className="mb-6 text-lg font-semibold text-gray-900">
        {t("storageStep.title")}
      </h2>
      <div className="flex flex-col gap-3">
        {storages.map((storage) => (
          <RadioOption
            key={storage}
            selected={false}
            onClick={() => onSelect(storage)}
            label={storage}
          />
        ))}
      </div>
    </div>
  );
}
