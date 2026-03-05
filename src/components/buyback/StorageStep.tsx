"use client";

import { cn } from "@/lib/utils";

interface StorageStepProps {
  storages: string[];
  onSelect: (storage: string) => void;
}

export function StorageStep({ storages, onSelect }: StorageStepProps) {
  return (
    <div className="flex flex-col gap-3">
      {storages.map((storage) => (
        <button
          key={storage}
          type="button"
          onClick={() => onSelect(storage)}
          className={cn(
            "flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-6 py-4",
            "text-base font-semibold text-gray-900",
            "transition-all duration-200 hover:border-gray-900 hover:shadow-md"
          )}
        >
          <span>{storage}</span>
          <span className="text-gray-400">&rsaquo;</span>
        </button>
      ))}
    </div>
  );
}
