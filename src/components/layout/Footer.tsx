import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

export function Footer() {
  const locale = useLocale();
  const t = useTranslations("footer");

  return (
    <footer className="border-t border-gray-200 bg-white">
      {/* Trust bar */}
      <div className="border-b border-gray-100 py-8">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 md:grid-cols-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100">
              <svg
                className="h-5 w-5 text-gray-600"
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
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{t("warranty")}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100">
              <svg
                className="h-5 w-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{t("qualityCheck")}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100">
              <svg
                className="h-5 w-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{t("freeReturn")}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100">
              <svg
                className="h-5 w-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{t("support")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="py-12">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">{t("about")}</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href={`/${locale}/about`}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  {t("aboutUs")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/quality`}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  {t("qualityPact")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/careers`}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  {t("careers")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">{t("help")}</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href={`/${locale}/help`}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  {t("helpCenter")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/contact`}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  {t("contact")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/shipping`}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  {t("shipping")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">{t("legal")}</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href={`/${locale}/cgv`}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  {t("terms")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/privacy`}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  {t("privacy")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${locale}/legal`}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  {t("legalNotice")}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">{t("followUs")}</h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-gray-400 hover:text-gray-600"
                aria-label="Facebook"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-gray-600"
                aria-label="Instagram"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-gray-400 hover:text-gray-600"
                aria-label="Twitter"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-200 py-6">
        <div className="mx-auto max-w-7xl px-4">
          <p className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} DBC. {t("rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
