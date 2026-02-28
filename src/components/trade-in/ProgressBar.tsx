"use client";

import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import type { TradeInStep } from "@/hooks/useTradeIn";

const STEPS: TradeInStep[] = ["brand", "model", "storage", "condition", "result"];

interface ProgressBarProps {
  currentStep: TradeInStep;
}

export function ProgressBar({ currentStep }: ProgressBarProps) {
  const t = useTranslations("tradeIn.steps");
  const currentIndex = STEPS.indexOf(currentStep);

  return (
    <div className="flex items-center justify-between gap-2">
      {STEPS.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;

        return (
          <div key={step} className="flex flex-1 flex-col items-center gap-1.5">
            <div
              className={cn(
                "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                isCompleted && "bg-primary text-white",
                isCurrent && "bg-primary text-white ring-2 ring-primary/30 ring-offset-2",
                !isCompleted && !isCurrent && "bg-gray-200 text-gray-500"
              )}
            >
              {index + 1}
            </div>
            <span
              className={cn(
                "hidden text-xs font-medium md:block",
                isCurrent ? "text-gray-900" : "text-gray-500"
              )}
            >
              {t(step)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
