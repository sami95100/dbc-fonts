"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { DoorOpen, Users, Zap, Leaf } from "lucide-react";
import { cn } from "@/lib/utils";

const VALUES = [
  { key: "access", icon: DoorOpen, color: "bg-highlight/10 text-highlight" },
  { key: "community", icon: Users, color: "bg-accent/10 text-accent" },
  { key: "urban", icon: Zap, color: "bg-highlight/10 text-highlight" },
  { key: "future", icon: Leaf, color: "bg-accent/10 text-accent" },
] as const;

export function BrandValues() {
  const t = useTranslations("home.values");

  return (
    <section className="bg-gray-50 py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4">
        <h2 className="mb-2 text-center font-display text-3xl font-bold text-gray-900 md:text-4xl">
          {t("title")}
        </h2>
        <Image
          src="/images/brand/brush-underline.svg"
          alt=""
          width={624}
          height={71}
          className="mx-auto mb-12 h-2 w-32 object-contain opacity-30"
          aria-hidden="true"
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map(({ key, icon: Icon, color }) => (
            <div
              key={key}
              className={cn(
                "group rounded-2xl border border-gray-200 bg-white p-6",
                "transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5"
              )}
            >
              <div
                className={cn(
                  "mb-4 flex h-12 w-12 items-center justify-center rounded-xl",
                  color
                )}
              >
                <Icon className="h-6 w-6" aria-hidden="true" />
              </div>
              <h3 className="mb-2 font-display text-lg font-semibold text-gray-900">
                {t(`${key}.title`)}
              </h3>
              <p className="text-sm leading-relaxed text-gray-600">
                {t(`${key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
