"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { useInView } from "@/hooks/useInView";
import { ArrowRight, Banknote, Truck, MapPin } from "lucide-react";

export function BuybackSection() {
  const locale = useLocale();
  const { ref, isInView } = useInView();
  const { ref: titleRef, isInView: titleVisible } = useInView({ threshold: 1, rootMargin: "-34% 0px -34% 0px" });

  return (
    <section
      ref={ref}
      className={`py-12 md:py-16 lg:py-20 transition-all duration-700 ease-out ${
        isInView ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4">
        {/* Section title */}
        <h2 ref={titleRef} className="mb-6 text-[28px] font-bold leading-tight tracking-tight text-gray-900 md:mb-8 md:text-[32px] lg:text-[36px]">
          Revends ton telephone.{" "}
          <span className="font-normal text-gray-500">Au meilleur prix, sans effort.</span>
        </h2>

        {/* Capsule - same sizing as ImpactSection */}
        <div className="overflow-hidden rounded-[32px] border border-gray-200 bg-gray-50 px-6 py-10 shadow-sm md:rounded-[40px] md:px-12 md:py-14 lg:px-16 lg:py-16">
          {/* Tagline */}
          <p className="font-display text-[20px] font-semibold leading-snug tracking-tight text-gray-600 md:text-[24px] lg:text-[28px]">
            Le meilleur moment pour vendre, c&apos;etait hier. Le deuxieme,{" "}
            <span className={`font-bold text-primary highlight-underline ${titleVisible ? "is-visible" : ""}`}>
              c&apos;est maintenant
            </span>
            .
          </p>

          {/* CTA right after tagline */}
          <div className="mt-6 text-center">
          <Link
            href={`/${locale}/reprise`}
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-primary/90 hover:shadow-md md:text-base"
          >
            Estimer mon telephone
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
          </div>

          {/* Divider */}
          <div className="my-8 h-px bg-gray-200 md:my-10" />

          {/* Value props */}
          <div className="flex flex-col gap-5 sm:flex-row sm:gap-8">
            <div className="flex items-center gap-3">
              <Banknote className="h-5 w-5 shrink-0 text-gray-900" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-semibold text-gray-900">Estimation en 1 min</p>
                <p className="text-xs text-gray-500">Gratuite et sans engagement</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 shrink-0 text-gray-900" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-semibold text-gray-900">Envoi gratuit</p>
                <p className="text-xs text-gray-500">Expedition assuree, virement sous 5j</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 shrink-0 text-gray-900" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-semibold text-gray-900">Depot en magasin</p>
                <p className="text-xs text-gray-500">Paye sur place, sans surprise</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
