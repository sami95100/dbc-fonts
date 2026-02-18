"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { ChevronDown, Check, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

const LANGUAGES = [
  { code: "fr", label: "Francais (FR)", flag: "🇫🇷", short: "FR" },
  { code: "en", label: "English (EN)", flag: "🇬🇧", short: "EN" },
];

export function TopBar() {
  const locale = useLocale();
  const t = useTranslations("topBar");
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = LANGUAGES.find((l) => l.code === locale) || LANGUAGES[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLanguageChange = (langCode: string) => {
    // Replace current locale in pathname with new locale
    const newPathname = pathname.replace(`/${locale}`, `/${langCode}`);
    router.push(newPathname);
    setIsOpen(false);
  };

  return (
    <div className="hidden border-b border-gray-100 bg-white md:block">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-1.5">
        {/* Announcement */}
        <p className="flex items-center gap-1.5 text-xs font-medium text-gray-600">
          <MapPin className="h-3.5 w-3.5 text-accent" aria-hidden="true" />
          {t("physicalStores")}
        </p>

        {/* Language selector */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 rounded px-2 py-2.5 text-xs text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          >
            <span className="text-sm">{currentLang.flag}</span>
            <span>{currentLang.short}</span>
            <ChevronDown
              className={cn("h-3 w-3 transition-transform", isOpen && "rotate-180")}
              aria-hidden="true"
            />
          </button>

          {/* Dropdown */}
          {isOpen && (
            <div className="absolute right-0 top-full z-50 mt-1 min-w-[180px] rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
              <div className="border-b border-gray-100 px-3 py-2">
                <p className="text-xs font-medium text-gray-500">
                  {t("chooseLanguage")}
                </p>
              </div>
              {LANGUAGES.map((lang) => (
                <button
                  type="button"
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={cn(
                    "flex w-full items-center gap-2 px-3 py-2.5 text-left text-sm hover:bg-gray-50",
                    lang.code === locale && "bg-gray-50 font-medium"
                  )}
                >
                  <span className="text-base">{lang.flag}</span>
                  <span className="text-gray-700">{lang.label}</span>
                  {lang.code === locale && (
                    <Check className="ml-auto h-4 w-4 text-accent" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
