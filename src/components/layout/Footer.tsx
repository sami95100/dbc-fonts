import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ShieldCheck, ClipboardCheck, RotateCcw, Headset } from "lucide-react";
import { DbcLogo } from "@/components/ui/dbc-logo";

export function Footer() {
  const locale = useLocale();
  const t = useTranslations("footer");

  return (
    <footer>
      {/* Trust bar */}
      <div className="border-y border-gray-200 py-8">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 md:grid-cols-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-highlight/10">
              <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{t("warranty")}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-highlight/10">
              <ClipboardCheck className="h-5 w-5 text-accent" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{t("qualityCheck")}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-highlight/10">
              <RotateCcw className="h-5 w-5 text-primary" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{t("freeReturn")}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-highlight/10">
              <Headset className="h-5 w-5 text-accent" aria-hidden="true" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{t("support")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer - Dark green */}
      <div className="bg-primary">
        <div className="mx-auto max-w-7xl px-4 py-12">
          {/* Logo + description */}
          <div className="mb-10 max-w-sm">
            <DbcLogo className="mb-4 h-7 w-auto text-white" />
            <p className="text-sm leading-relaxed text-green-200/70">
              {t("description")}
            </p>
          </div>

          {/* Links grid */}
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <h3 className="mb-4 text-sm font-semibold text-highlight">{t("about")}</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href={`/${locale}/about`}
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {t("aboutUs")}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/quality`}
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {t("qualityPact")}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold text-highlight">{t("help")}</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href={`/${locale}/help`}
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {t("helpCenter")}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/contact`}
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {t("contact")}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/shipping`}
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {t("shipping")}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold text-highlight">{t("legal")}</h3>
              <ul className="space-y-3">
                <li>
                  <Link
                    href={`/${locale}/cgv`}
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {t("terms")}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/privacy`}
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {t("privacy")}
                  </Link>
                </li>
                <li>
                  <Link
                    href={`/${locale}/legal`}
                    className="text-sm text-white/60 transition-colors hover:text-white"
                  >
                    {t("legalNotice")}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold text-highlight">{t("followUs")}</h3>
              <div className="flex gap-4">
                <a
                  href="https://www.tiktok.com/@dbclille"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full text-white/40 transition-colors hover:text-highlight"
                  aria-label="TikTok"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                  </svg>
                </a>
                <a
                  href="https://www.snapchat.com/add/dbc_story"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-full text-white/40 transition-colors hover:text-highlight"
                  aria-label="Snapchat"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.15-.055-.225-.015-.243.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-1.107-.435-1.257-.93-1.197-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.383.074.42.194.789.3 1.104.3.234 0 .384-.06.465-.105l-.046-.569c-.098-1.626-.225-3.651.307-4.837C7.392 1.077 10.739.807 11.727.807l.419-.015h.06z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6">
            <p className="text-sm text-white/40">
              &copy; {new Date().getFullYear()} DBC. {t("rights")}
            </p>
            <p className="text-sm italic text-highlight/60">
              {t("tagline")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
