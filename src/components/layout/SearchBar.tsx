"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Search } from "lucide-react";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("search");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/${locale}/products/smartphones?search=${encodeURIComponent(trimmed)}`);
    setQuery("");
  };

  return (
    <form onSubmit={handleSubmit} className="relative flex-1 max-w-xl">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" aria-hidden="true" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("placeholder")}
          className="h-12 w-full rounded-full border-0 bg-white pl-12 pr-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:bg-gray-50"
        />
      </div>
    </form>
  );
}
