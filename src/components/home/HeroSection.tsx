import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, ShieldCheck, ClipboardCheck, RefreshCw, Truck } from "lucide-react";
import { cn } from "@/lib/utils";
import { DbcLogoIcon } from "@/components/ui/dbc-logo";

export function HeroSection() {
  const locale = useLocale();
  const t = useTranslations("home");

  return (
    <section className="relative overflow-hidden bg-primary">
      {/* Pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "url('/images/brand/pattern.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 py-16 md:py-20 lg:py-24">
        <div className="flex flex-col items-center text-center">
          {/* Logo icon as decorative element */}
          <DbcLogoIcon className="mb-6 h-10 w-auto text-highlight md:h-12" />

          {/* Tagline */}
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-highlight">
            {t("hero.tagline")}
          </p>

          {/* Main heading */}
          <h1 className="mb-6 max-w-3xl font-display text-4xl font-bold text-white md:text-5xl lg:text-6xl">
            {t("hero.title")}
          </h1>

          {/* Brush stroke underline */}
          <div className="mb-8 h-3 w-48 md:w-64">
            <Image
              src="/images/brand/brush-underline.svg"
              alt=""
              width={624}
              height={71}
              className="h-full w-full object-contain opacity-30 brightness-0 invert"
              aria-hidden="true"
            />
          </div>

          {/* Subtitle */}
          <p className="mb-10 max-w-xl text-lg text-green-200 md:text-xl">
            {t("hero.subtitle")}
          </p>

          {/* CTA Button */}
          <Link
            href={`/${locale}/products/smartphones`}
            className={cn(
              "group inline-flex items-center gap-2 rounded-full px-8 py-4",
              "bg-highlight text-highlight-foreground",
              "text-base font-semibold",
              "transition-all hover:scale-105 hover:shadow-lg hover:shadow-highlight/20"
            )}
          >
            {t("hero.cta")}
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Trust badges */}
        <div className="mt-16 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {[
            { icon: ShieldCheck, label: t("trust.warrantyMonths") },
            { icon: ClipboardCheck, label: t("trust.checkpoints") },
            { icon: RefreshCw, label: t("trust.freeReturn") },
            { icon: Truck, label: t("trust.shipping") },
          ].map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-highlight/10">
                <Icon className="h-5 w-5 text-highlight" aria-hidden="true" />
              </div>
              <span className="text-sm font-medium text-white/90">{label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
