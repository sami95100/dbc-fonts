"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Search, ArrowRight, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
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

interface SearchOverlayProps {
  open: boolean;
  onClose: () => void;
}

export function SearchOverlay({ open, onClose }: SearchOverlayProps) {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("search");
  const tCat = useTranslations("categories");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => setVisible(true));
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setVisible(false);
      document.body.style.overflow = "";
      // Reset state when closing
      setTimeout(() => {
        setQuery("");
        setResults([]);
        setHasSearched(false);
      }, 400);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  // Debounced search
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

  const handleLinkClick = () => {
    onClose();
  };

  const handleResultClick = (slug: string) => {
    onClose();
    router.push(`/${locale}/products/${slug}`);
  };

  if (!mounted || !open) return null;

  const showSuggestions = !query.trim();

  const overlay = (
    <div
      className={cn(
        "fixed inset-0 z-[9999] flex flex-col bg-white transition-all duration-400 ease-out",
        visible ? "opacity-100" : "opacity-0"
      )}
    >
      {/* Close button - top right (Apple style) */}
      <div className="flex justify-end px-5 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="p-2 text-gray-500 transition-colors hover:text-gray-900"
          aria-label={t("close")}
        >
          <X className="h-6 w-6" strokeWidth={1.5} />
        </button>
      </div>

      {/* Search input - Apple style: large icon + large placeholder */}
      <div className="px-8 pt-2 md:px-12">
        <form onSubmit={handleSubmit} className="relative">
          <Search
            className={cn(
              "absolute left-0 top-1/2 h-6 w-6 -translate-y-1/2 transition-all duration-500 ease-out",
              visible ? "translate-y-[-50%] opacity-100" : "translate-y-[-30%] opacity-0",
              query ? "text-gray-900" : "text-gray-400"
            )}
            style={{ transitionDelay: visible ? "50ms" : "0ms" }}
            strokeWidth={1.5}
            aria-hidden="true"
          />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("placeholder")}
            className={cn(
              "search-input-clean w-full border-0 bg-transparent py-3 pl-10 pr-10 font-display text-[28px] font-semibold text-gray-900 transition-all duration-500 ease-out placeholder:font-display placeholder:text-gray-400 md:text-[32px]",
              visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            )}
            style={{
              outline: "none",
              boxShadow: "none",
              transitionDelay: visible ? "50ms" : "0ms",
            }}
          />
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                inputRef.current?.focus();
              }}
              className="absolute right-0 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-gray-200 text-gray-500 transition-colors hover:bg-gray-300 hover:text-gray-700"
              aria-label={t("close")}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </form>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-8 pt-6 pb-8 md:px-12">
        {showSuggestions ? (
          /* Quick links - Apple style */
          <div
            className={cn(
              "transition-all duration-500 ease-out",
              visible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            )}
            style={{ transitionDelay: visible ? "150ms" : "0ms" }}
          >
            <p className="mb-4 text-sm font-medium text-gray-400">
              {t("quickLinks")}
            </p>
            <div className="flex flex-col">
              {QUICK_LINKS.map((link, index) => (
                <Link
                  key={link.slug}
                  href={`/${locale}/products/${link.slug}`}
                  onClick={handleLinkClick}
                  className={cn(
                    "group flex items-center gap-4 py-3 text-base font-semibold text-gray-900 transition-all duration-500 ease-out hover:text-gray-500",
                    visible ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                  )}
                  style={{ transitionDelay: visible ? `${(index + 3) * 50}ms` : "0ms" }}
                >
                  <ArrowRight className="h-4 w-4 text-gray-400 transition-transform group-hover:translate-x-0.5" strokeWidth={1.5} />
                  {tCat(link.key)}
                </Link>
              ))}
            </div>
          </div>
        ) : (
          /* Search results */
          <div>
            {isLoading ? (
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
              <div className="py-16 text-center">
                <p className="text-lg font-semibold text-gray-900">
                  {t("noResults")} &ldquo;{query.trim()}&rdquo;
                </p>
                <p className="mt-2 text-sm text-gray-500">
                  {t("noResultsSub")}
                </p>
                <div className="mx-auto mt-8 max-w-sm">
                  <div className="flex flex-col gap-1">
                    {QUICK_LINKS.map((link) => (
                      <Link
                        key={link.slug}
                        href={`/${locale}/products/${link.slug}`}
                        onClick={handleLinkClick}
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

  return createPortal(overlay, document.body);
}
