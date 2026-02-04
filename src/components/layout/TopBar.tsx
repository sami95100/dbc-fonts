"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

const TOP_LINKS = [
  { key: "quality", href: "/quality" },
  { key: "repair", href: "/repair" },
  { key: "stopFastTech", href: "/stop-fast-tech" },
  { key: "mag", href: "/mag" },
];

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
        {/* Left links */}
        <nav className="flex items-center gap-6">
          {TOP_LINKS.map((link) => (
            <Link
              key={link.key}
              href={`/${locale}${link.href}`}
              className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-gray-900"
            >
              {link.key === "quality" && (
                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              )}
              {t(link.key)}
            </Link>
          ))}
        </nav>

        {/* Right - Language selector */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-1.5 rounded px-2 py-1 text-xs text-gray-600 hover:bg-gray-50 hover:text-gray-900"
          >
            <span className="text-sm">{currentLang.flag}</span>
            <span>{currentLang.short}</span>
            <svg
              className={`h-3 w-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Dropdown */}
          {isOpen && (
            <div className="absolute right-0 top-full z-50 mt-1 min-w-[180px] rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
              <div className="border-b border-gray-100 px-3 py-2">
                <p className="text-xs font-medium text-gray-500">
                  {locale === "fr" ? "Choisir la langue" : "Choose language"}
                </p>
              </div>
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleLanguageChange(lang.code)}
                  className={`flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50 ${
                    lang.code === locale ? "bg-gray-50 font-medium" : ""
                  }`}
                >
                  <span className="text-base">{lang.flag}</span>
                  <span className="text-gray-700">{lang.label}</span>
                  {lang.code === locale && (
                    <svg
                      className="ml-auto h-4 w-4 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
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
