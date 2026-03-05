"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";
import { ArrowRight } from "lucide-react";
import { useInView } from "@/hooks/useInView";

/* ─── Animated counter ────────────────────────────────── */

function useCountUp(target: number, isVisible: boolean, duration = 2000) {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isVisible || hasAnimated.current) return;
    hasAnimated.current = true;

    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isVisible, target, duration]);

  return count;
}

/* ─── DBC Run animated logo ───────────────────────────── */

function DbcRunLogo({ isVisible }: { isVisible: boolean }) {
  const [svgContent, setSvgContent] = useState<string>("");

  useEffect(() => {
    fetch("/images/dbc-run-vector.svg")
      .then((res) => res.text())
      .then((text) => setSvgContent(text.replace(/<\?xml[^?]*\?>/, "").trim()))
      .catch(() => {});
  }, []);

  if (!svgContent) return <div className="h-10 w-16" />;

  return (
    <div
      className={`dbc-logo-animated w-16 md:w-20 ${isVisible ? "is-visible" : ""}`}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}

/* ─── Stat item (inline, no card) ─────────────────────── */

function StatItem({ value, suffix, label, isVisible, delay, duration }: {
  value: number;
  suffix: string;
  label: string;
  isVisible: boolean;
  delay: number;
  duration: number;
}) {
  const count = useCountUp(value, isVisible, duration);

  return (
    <div
      className={`flex flex-col items-center text-center transition-all duration-600 ease-out ${isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex items-baseline gap-0.5">
        <span className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
          {count}
        </span>
        <span className="text-xl font-bold text-white/80 md:text-2xl lg:text-3xl">
          {suffix}
        </span>
      </div>
      <p className="mt-2 text-xs font-medium text-white/50 md:text-sm">
        {label}
      </p>
    </div>
  );
}

/* ─── Impact Section ──────────────────────────────────── */

export function ImpactSection() {
  const locale = useLocale();
  const { ref: inViewRef, isInView } = useInView();
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    if (isInView && !hasTriggered) setHasTriggered(true);
  }, [isInView, hasTriggered]);

  return (
    <section
      ref={inViewRef}
      className={`py-12 md:py-16 lg:py-20 transition-all duration-700 ease-out ${hasTriggered ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`}
    >
      <div className="mx-auto max-w-7xl px-4">
        {/* Section title */}
        <h2 className="mb-6 text-[28px] font-bold leading-tight tracking-tight text-gray-900 md:mb-8 md:text-[32px] lg:text-[36px]">
          Notre impact.{" "}
          <span className="font-normal text-gray-500">Pourquoi le reconditionne compte.</span>
        </h2>

        {/* Dark capsule */}
        <div
          className="overflow-hidden rounded-[32px] px-6 py-10 md:rounded-[40px] md:px-12 md:py-14 lg:px-16 lg:py-16"
          style={{ background: "linear-gradient(135deg, #0E0F0C 0%, #1a2a1f 50%, #0E0F0C 100%)" }}
        >
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 md:gap-8">
            <StatItem value={16} suffix=" Mrd" label="De smartphones en circulation dans le monde" isVisible={hasTriggered} delay={200} duration={2000} />
            <StatItem value={82} suffix="%" label="D'augmentation des e-dechets depuis 2010" isVisible={hasTriggered} delay={350} duration={2200} />
            <StatItem value={78} suffix="%" label="De l'empreinte carbone vient de la fabrication" isVisible={hasTriggered} delay={500} duration={2400} />
          </div>

          {/* Divider */}
          <div className="my-8 h-px bg-white/10 md:my-10" />

          {/* Logo + conclusion */}
          <div className={`flex flex-col items-center gap-5 text-center transition-all duration-700 ease-out md:gap-6 ${hasTriggered ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"}`} style={{ transitionDelay: "600ms" }}>
            <DbcRunLogo isVisible={hasTriggered} />

            <p className="max-w-md text-base font-semibold leading-relaxed text-white md:text-lg">
              Chaque telephone reconditionne par DBC,
              <br />
              c&apos;est un de moins a fabriquer.
            </p>

            <Link
              href={`/${locale}/products`}
              className="group mt-2 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:brightness-110 md:text-base"
            >
              Acheter reconditionne
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
