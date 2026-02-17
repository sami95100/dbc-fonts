import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PolicyPageProps {
  locale: string;
  title: string;
  backLabel: string;
  lastUpdated?: string;
  children: React.ReactNode;
}

export function PolicyPage({ locale, title, backLabel, lastUpdated, children }: PolicyPageProps) {
  return (
    <div className="bg-white py-12 md:py-16">
      <div className="mx-auto max-w-3xl px-4">
        <Link
          href={`/${locale}`}
          className="mb-8 inline-flex min-h-[44px] items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {backLabel}
        </Link>

        <h1 className="mb-4 font-display text-3xl font-bold text-gray-900 md:text-4xl">
          {title}
        </h1>

        {lastUpdated && (
          <p className="mb-10 text-sm text-gray-500">{lastUpdated}</p>
        )}

        <div className="prose prose-gray max-w-none prose-headings:font-display prose-h2:text-xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-lg prose-h3:mt-8 prose-h3:mb-3 prose-p:leading-relaxed prose-li:leading-relaxed prose-strong:text-gray-900 prose-a:text-primary prose-a:no-underline hover:prose-a:underline">
          {children}
        </div>
      </div>
    </div>
  );
}
