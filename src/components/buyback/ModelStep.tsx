"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import type { BuybackModel } from "@/types/buyback";

interface ModelStepProps {
  models: BuybackModel[];
  onSelect: (model: BuybackModel) => void;
}

export function ModelStep({ models, onSelect }: ModelStepProps) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
      {models.map((model) => (
        <button
          key={model.id}
          type="button"
          onClick={() => onSelect(model)}
          className={cn(
            "flex flex-col items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4",
            "transition-all duration-200 hover:border-gray-900 hover:shadow-md"
          )}
        >
          {model.image_url ? (
            <div className="relative h-24 w-24">
              <Image
                src={model.image_url}
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
          <span className="text-sm font-semibold text-gray-900">
            {model.name}
          </span>
        </button>
      ))}
    </div>
  );
}
