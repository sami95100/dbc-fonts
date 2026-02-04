import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const locale = useLocale();
  const t = useTranslations("nav");

  return (
    <nav className="mb-4 flex items-center gap-2 text-sm text-gray-500">
      <Link href={`/${locale}`} className="hover:text-gray-900">
        {t("home")}
      </Link>
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <svg
            className="h-4 w-4 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
          {item.href ? (
            <Link href={`/${locale}${item.href}`} className="hover:text-gray-900">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
}
