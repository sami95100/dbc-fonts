"use client";

import { memo } from "react";
import { cn } from "@/lib/utils";
import type { RadioOptionProps } from "./types";

/**
 * RadioOption - Reusable radio button component for product selection
 *
 * Used for selecting conditions, batteries, storage, etc.
 * Follows BackMarket-style design with rounded borders and clear selection state.
 *
 * @example
 * <RadioOption
 *   selected={isSelected}
 *   onClick={() => setSelected(option.id)}
 *   label="Parfait"
 *   sublabel="Comme neuf, aucune trace visible"
 *   price="890 EUR"
 *   badge="Best-seller"
 *   soldOut={false}
 *   soldOutLabel="Déjà vendu"
 * />
 */
function RadioOptionComponent({
  selected,
  onClick,
  label,
  sublabel,
  price,
  badge,
  disabled = false,
  soldOut = false,
  soldOutLabel,
}: RadioOptionProps) {
  const isDisabled = disabled || soldOut;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      aria-pressed={selected}
      className={cn(
        "flex w-full items-center justify-between rounded-2xl border p-4 text-left",
        "transition-all duration-150 ease-out",
        selected && !soldOut
          ? "border-green-700 bg-green-50"
          : "border-gray-200 bg-white hover:border-gray-300",
        isDisabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
        soldOut && "bg-gray-50"
      )}
    >
      <div className="flex items-center gap-3">
        {/* Radio circle indicator */}
        <div
          className={cn(
            "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
            "transition-colors duration-150",
            selected && !soldOut ? "border-green-700 bg-green-700" : "border-gray-300 bg-white",
            soldOut && "border-gray-200 bg-gray-100"
          )}
          aria-hidden="true"
        >
          {selected && !soldOut && <div className="h-2 w-2 rounded-full bg-white" />}
        </div>

        {/* Label content */}
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className={cn("font-medium", soldOut ? "text-gray-400 line-through" : "text-gray-900")}>
              {label}
            </span>
            {badge && !soldOut && (
              <span className="inline-flex rounded bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-800">
                {badge}
              </span>
            )}
          </div>
          {sublabel && (
            <span className={cn("mt-0.5 block text-sm", soldOut ? "text-gray-400" : "text-gray-500")}>
              {sublabel}
            </span>
          )}
        </div>
      </div>

      {/* Price or sold out status */}
      {soldOut ? (
        <span className="ml-4 shrink-0 rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-500">
          {soldOutLabel}
        </span>
      ) : price ? (
        <span className="ml-4 shrink-0 font-medium text-gray-900">{price}</span>
      ) : null}
    </button>
  );
}

// Memoize to prevent unnecessary re-renders
export const RadioOption = memo(RadioOptionComponent);
