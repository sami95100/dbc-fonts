"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FilterOption {
  value: string;
  label: string;
  count?: number;
}

interface FilterDropdownProps {
  label: string;
  options: FilterOption[];
  selected: string[];
  onChange: (values: string[]) => void;
  multiSelect?: boolean;
  className?: string;
}

export function FilterDropdown({
  label,
  options,
  selected,
  onChange,
  multiSelect = false,
  className,
}: FilterDropdownProps) {
  const t = useTranslations("catalog.filters");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fermer le dropdown quand on clique ailleurs
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (value: string) => {
    if (multiSelect) {
      if (selected.includes(value)) {
        onChange(selected.filter((v) => v !== value));
      } else {
        onChange([...selected, value]);
      }
    } else {
      onChange(selected.includes(value) ? [] : [value]);
      setIsOpen(false);
    }
  };

  const hasSelection = selected.length > 0;

  return (
    <div ref={dropdownRef} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-1 rounded-full border px-3 py-2.5 text-sm font-normal transition-colors",
          hasSelection
            ? "border-green-700 bg-green-700 text-white"
            : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
        )}
      >
        {label}
        {hasSelection && selected.length > 1 && (
          <span className="ml-0.5 rounded-full bg-white px-1.5 text-xs font-medium text-green-700">
            {selected.length}
          </span>
        )}
        <ChevronDown
          className={cn(
            "ml-1 h-4 w-4 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full z-50 mt-2 min-w-[200px] rounded-lg border border-gray-200 bg-white py-2 shadow-lg">
          {options.length === 0 ? (
            <div className="px-4 py-2 text-sm text-gray-500">
              {t("noOptions")}
            </div>
          ) : (
            options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleSelect(option.value)}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-gray-50"
              >
                {multiSelect ? (
                  <span
                    className={cn(
                      "flex h-4 w-4 items-center justify-center rounded border",
                      selected.includes(option.value)
                        ? "border-green-700 bg-green-700 text-white"
                        : "border-gray-300"
                    )}
                  >
                    {selected.includes(option.value) && (
                      <Check className="h-3 w-3" />
                    )}
                  </span>
                ) : (
                  <span
                    className={cn(
                      "flex h-4 w-4 items-center justify-center rounded-full border",
                      selected.includes(option.value)
                        ? "border-green-700 bg-green-700"
                        : "border-gray-300"
                    )}
                  >
                    {selected.includes(option.value) && (
                      <span className="h-2 w-2 rounded-full bg-white" />
                    )}
                  </span>
                )}
                <span className="flex-1 text-gray-900">{option.label}</span>
                {option.count !== undefined && (
                  <span className="text-gray-400">({option.count})</span>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
