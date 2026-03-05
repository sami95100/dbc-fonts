"use client";

import { cn } from "@/lib/utils";
import type { BuybackStep } from "@/types/buyback";

const FUNNEL_STEPS: { key: BuybackStep; label: string }[] = [
  { key: "category", label: "Categorie" },
  { key: "brand", label: "Marque" },
  { key: "model", label: "Modele" },
  { key: "storage", label: "Stockage" },
  { key: "screen", label: "Ecran" },
  { key: "body", label: "Chassis" },
  { key: "checklist", label: "Fonctions" },
  { key: "offer", label: "Offre" },
];

interface BuybackProgressProps {
  currentStep: BuybackStep;
}

export function BuybackProgress({ currentStep }: BuybackProgressProps) {
  const currentIndex = FUNNEL_STEPS.findIndex((s) => s.key === currentStep);

  // Don't show progress for post-offer steps
  if (currentIndex === -1) return null;

  const progress = ((currentIndex + 1) / FUNNEL_STEPS.length) * 100;

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
        <span>
          {currentIndex + 1} / {FUNNEL_STEPS.length}
        </span>
        <span>{FUNNEL_STEPS[currentIndex]?.label}</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
