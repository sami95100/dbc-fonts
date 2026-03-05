"use client";

import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { BuybackProgress } from "./BuybackProgress";
import type { BuybackStep } from "@/types/buyback";

interface BuybackStepLayoutProps {
  step: BuybackStep;
  title: string;
  subtitle?: string;
  onBack?: () => void;
  showProgress?: boolean;
  children: React.ReactNode;
}

export function BuybackStepLayout({
  step,
  title,
  subtitle,
  onBack,
  showProgress = true,
  children,
}: BuybackStepLayoutProps) {
  return (
    <div className="mx-auto max-w-3xl">
      {showProgress && (
        <div className="mb-8">
          <BuybackProgress currentStep={step} />
        </div>
      )}

      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className={cn(
            "mb-6 flex items-center gap-2 text-sm font-medium text-gray-600",
            "transition-colors hover:text-gray-900"
          )}
        >
          <ArrowLeft className="h-4 w-4" />
          Retour
        </button>
      )}

      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 md:text-2xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-2 text-sm text-gray-500 md:text-base">{subtitle}</p>
        )}
      </div>

      {children}
    </div>
  );
}
