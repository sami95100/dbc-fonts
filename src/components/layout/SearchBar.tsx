"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const t = useTranslations("search");

  return (
    <div className="relative flex-1 max-w-xl">
      <div className="relative">
        <svg
          className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("placeholder")}
          className="h-12 w-full rounded-full border border-gray-200 bg-gray-50 pl-12 pr-4 text-sm placeholder:text-gray-400 focus:border-gray-300 focus:bg-white focus:outline-none"
        />
      </div>
    </div>
  );
}
