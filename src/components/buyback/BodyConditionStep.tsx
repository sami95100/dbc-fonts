"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import type { BodyCondition } from "@/types/buyback";

const OPTIONS: { value: BodyCondition; label: string; description: string }[] = [
  {
    value: "perfect",
    label: "Impeccable",
    description: "Aucune marque, coque et chassis parfaits",
  },
  {
    value: "light_wear",
    label: "Usure legere",
    description: "Petites marques d'usure, quasi invisibles",
  },
  {
    value: "dents_scratches",
    label: "Rayures et bosses",
    description: "Marques visibles, bosses ou rayures sur le chassis",
  },
  {
    value: "cracked",
    label: "Casse",
    description: "Face arriere ou cadre casses",
  },
];

interface BodyConditionStepProps {
  onSelect: (condition: BodyCondition) => void;
}

export function BodyConditionStep({ onSelect }: BodyConditionStepProps) {
  const [selected, setSelected] = useState<BodyCondition | null>(null);

  const handleSelect = (value: BodyCondition) => {
    setSelected(value);
    setTimeout(() => onSelect(value), 200);
  };

  return (
    <div className="flex flex-col gap-3">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => handleSelect(option.value)}
          className={cn(
            "flex items-start gap-4 rounded-2xl border p-5 text-left transition-all duration-200",
            selected === option.value
              ? "border-gray-900 bg-gray-50"
              : "border-gray-200 bg-white hover:border-gray-400"
          )}
        >
          <div
            className={cn(
              "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
              selected === option.value
                ? "border-gray-900 bg-gray-900"
                : "border-gray-300"
            )}
          >
            {selected === option.value && (
              <Check className="h-3 w-3 text-white" />
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900">
              {option.label}
            </p>
            <p className="mt-0.5 text-sm text-gray-500">
              {option.description}
            </p>
          </div>
        </button>
      ))}
    </div>
  );
}
