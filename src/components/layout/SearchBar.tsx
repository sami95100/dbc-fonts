"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Search, ArrowRight, X } from "lucide-react";
import Link from "next/link";
import { ProductGrid } from "@/components/products/ProductGrid";
import type { Product } from "@/data/mock/products";
import { getModels, getModelOptions, getModelPrices } from "@/lib/api/products";
import { apiModelToProduct } from "@/lib/api/transformers";

const QUICK_LINKS = [
  { key: "iphone", slug: "smartphones" },
  { key: "android", slug: "android" },
  { key: "tablets", slug: "tablets" },
  { key: "laptopsShort", slug: "laptops" },
  { key: "smartwatchesShort", slug: "smartwatches" },
  { key: "accessories", slug: "accessories" },
] as const;

const SUGGESTED_SEARCHES = [
  "iPhone 16 Pro",
  "iPhone 15",
  "Samsung Galaxy",
  "iPad Pro",
  "MacBook",
] as const;

interface SearchPageContentProps {
  initialQuery?: string;
}

export function SearchPageContent({ initialQuery = "" }: SearchPageContentProps) {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("search");
  const tCat = useTranslations("categories");

  // Auto-focus on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Search when query changes (debounced)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      setIsLoading(true);
      setHasSearched(true);

      try {
        const modelsRes = await getModels({ search: trimmed, perPage: 12 });

        if (modelsRes.data && modelsRes.data.items.length > 0) {
          const products = await Promise.all(
            modelsRes.data.items.map(async (model) => {
              const [optionsRes, pricesRes] = await Promise.all([
                getModelOptions(model.id),
                getModelPrices(model.id),
              ]);

              if (optionsRes.data && pricesRes.data) {
                return apiModelToProduct({
                  model,
                  prices: pricesRes.data,
                  options: optionsRes.data,
                });
              }
              return null;
            })
          );

          setResults(products.filter((p): p is Product => p !== null));
        } else {
          setResults([]);
        }
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    // Update URL without reload
    router.replace(`/${locale}/search?q=${encodeURIComponent(suggestion)}`, { scroll: false });
  };

  const clearQuery = () => {
    setQuery("");
    inputRef.current?.focus();
    router.replace(`/${locale}/search`, { scroll: false });
  };

  const showSuggestions = !query.trim();

  return (
    <div className="min-h-[70vh] bg-white">
      {/* Search input area */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 py-8 md:py-12">
          <form onSubmit={handleSubmit} className="relative">
            <Search
              className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
              aria-hidden="true"
            />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                router.replace(
                  e.target.value.trim()
                    ? `/${locale}/search?q=${encodeURIComponent(e.target.value.trim())}`
                    : `/${locale}/search`,
                  { scroll: false }
                );
              }}
              placeholder={t("placeholder")}
              className="h-14 w-full rounded-2xl border border-gray-200 bg-white pl-14 pr-12 text-lg text-gray-900 shadow-sm placeholder:text-gray-400 outline-none transition-shadow focus:border-primary/30 focus:shadow-md focus:ring-2 focus:ring-primary/10"
            />
            {query && (
              <button
                type="button"
                onClick={clearQuery}
                className="absolute right-4 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-gray-200 text-gray-500 transition-colors hover:bg-gray-300 hover:text-gray-700"
                aria-label={t("close")}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </form>
        </div>
      </div>

      {/* Content area */}
      <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
        {showSuggestions ? (
          /* Quick links + suggested searches */
          <div className="mx-auto max-w-2xl">
            {/* Suggested searches */}
            <div className="mb-10">
              <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                {t("suggestedSearches")}
              </p>
              <div className="flex flex-col gap-1">
                {SUGGESTED_SEARCHES.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="group flex items-center gap-3 rounded-xl px-4 py-3 text-left text-base text-gray-900 transition-colors hover:bg-gray-50"
                  >
                    <Search className="h-4 w-4 shrink-0 text-gray-400" />
                    <span className="font-medium">{suggestion}</span>
                    <ArrowRight className="ml-auto h-4 w-4 text-gray-300 transition-transform group-hover:translate-x-0.5 group-hover:text-gray-500" />
                  </button>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                {t("quickLinks")}
              </p>
              <div className="flex flex-col gap-1">
                {QUICK_LINKS.map((link) => (
                  <Link
                    key={link.slug}
                    href={`/${locale}/products/${link.slug}`}
                    className="group flex items-center justify-between rounded-xl px-4 py-3 text-base font-medium text-gray-900 transition-colors hover:bg-gray-50"
                  >
                    {tCat(link.key)}
                    <ArrowRight className="h-4 w-4 text-gray-300 transition-transform group-hover:translate-x-0.5 group-hover:text-gray-500" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Search results */
          <div>
            {isLoading ? (
              /* Loading skeleton */
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-80 animate-pulse rounded-2xl bg-gray-100"
                  />
                ))}
              </div>
            ) : results.length > 0 ? (
              <div>
                <p className="mb-6 text-sm text-gray-500">
                  {t("resultsFor")} <span className="font-semibold text-gray-900">&ldquo;{query.trim()}&rdquo;</span>
                </p>
                <ProductGrid products={results} />
              </div>
            ) : hasSearched ? (
              /* No results */
              <div className="py-16 text-center">
                <p className="text-lg font-semibold text-gray-900">
                  {t("noResults")} &ldquo;{query.trim()}&rdquo;
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  {t("noResultsSub")}
                </p>
                {/* Show quick links as fallback */}
                <div className="mx-auto mt-8 max-w-sm">
                  <div className="flex flex-col gap-1">
                    {QUICK_LINKS.map((link) => (
                      <Link
                        key={link.slug}
                        href={`/${locale}/products/${link.slug}`}
                        className="group flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50"
                      >
                        {tCat(link.key)}
                        <ArrowRight className="h-4 w-4 text-gray-300 transition-transform group-hover:translate-x-0.5 group-hover:text-gray-500" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}
