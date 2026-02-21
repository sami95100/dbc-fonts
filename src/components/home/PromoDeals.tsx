"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect, useCallback } from "react";

const PROMO_PRODUCTS = [
  {
    slug: "apple/iphone-16-pro-max",
    name: "iPhone 16 Pro Max",
    image: "/images/products/apple/iphone-16-pro-max/image.png",
    priceFrom: 899,
    colors: ["#1d1d1f", "#f5f5f7", "#4b4845", "#d4c5b3"],
    badge: "-15%",
  },
  {
    slug: "apple/iphone-16-pro",
    name: "iPhone 16 Pro",
    image: "/images/products/apple/iphone-16-pro/image.png",
    priceFrom: 683,
    colors: ["#1d1d1f", "#f5f5f7", "#4b4845"],
    badge: "-20%",
  },
  {
    slug: "apple/iphone-15-pro-max",
    name: "iPhone 15 Pro Max",
    image: "/images/products/apple/iphone-15-pro-max/image.png",
    priceFrom: 639,
    colors: ["#1d1d1f", "#f5f5f7", "#4b4845", "#d4c5b3"],
    badge: "-25%",
  },
  {
    slug: "apple/iphone-16",
    name: "iPhone 16",
    image: "/images/products/apple/iphone-16/image.png",
    priceFrom: 549,
    colors: ["#1d1d1f", "#f5f5f7", "#e3c8d0", "#c8d8e3"],
    badge: "-10%",
  },
  {
    slug: "apple/iphone-15",
    name: "iPhone 15",
    image: "/images/products/apple/iphone-15/image.png",
    priceFrom: 449,
    colors: ["#1d1d1f", "#f5f5f7", "#e3c8d0"],
    badge: "-30%",
  },
] as const;

export function PromoDeals() {
  const locale = useLocale();
  const t = useTranslations("home");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction === "left" ? -350 : 350,
      behavior: "smooth",
    });
  };

  // DBC flag icon path (reused in pattern)
  const flagPath = "M352.63,105.49V0C268.36,75.4,112.77,111.66,0,68.16v325.35l284.9-76.32v144.05c134.76-89.71,326.51-89.73,461.25,0V.03l-393.52,105.45ZM284.9,247.08l-217.2,58.21v-154.18c74.52,9.94,151.7-3.81,217.2-38.41v134.37ZM678.44,357.99c-99.17-42.65-226.63-42.66-325.82,0v-182.42l325.82-87.32v269.74Z";

  // Build a dense Louis Vuitton-style monogram tile
  // Grid: 6 cols x 8 rows, alternating logo / PROMO / BONNE AFFAIRE, offset every other row
  const TILE_W = 480;
  const TILE_H = 360;
  const COL_W = 80;
  const ROW_H = 45;
  const ICON_SIZE = 20;
  const FONT_SIZE = 9;
  const OFFSET_X = COL_W / 2; // half-col shift on odd rows

  const items: string[] = [];
  for (let row = 0; row < 8; row++) {
    const offsetX = row % 2 === 1 ? OFFSET_X : 0;
    for (let col = 0; col < 6; col++) {
      const x = col * COL_W + offsetX;
      const y = row * ROW_H;
      const idx = row * 6 + col;
      const mod = idx % 3; // cycle: icon, PROMO, BONNE AFFAIRE

      if (mod === 0) {
        // DBC flag icon centered in cell
        const ix = x + (COL_W - ICON_SIZE) / 2;
        const iy = y + (ROW_H - ICON_SIZE * 0.62) / 2;
        items.push(`<svg x="${ix}" y="${iy}" viewBox="0 0 746.14 461.25" width="${ICON_SIZE}" height="${Math.round(ICON_SIZE * 0.62)}" fill="white"><path d="${flagPath}"/></svg>`);
      } else {
        const label = mod === 1 ? "PROMO" : "BONNE AFFAIRE";
        const tx = x + COL_W / 2;
        const ty = y + ROW_H / 2 + FONT_SIZE / 3;
        items.push(`<text x="${tx}" y="${ty}" fill="white" text-anchor="middle" style="font-family:system-ui,-apple-system,sans-serif;font-weight:700;font-size:${FONT_SIZE}px;letter-spacing:1.5px;">${label}</text>`);
      }
    }
  }

  const patternSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${TILE_W}" height="${TILE_H}" viewBox="0 0 ${TILE_W} ${TILE_H}">${items.join("")}</svg>`;
  const encodedPattern = `url("data:image/svg+xml,${encodeURIComponent(patternSvg)}")`;

  return (
    <section className="relative overflow-hidden bg-green-700 py-8 md:py-12 lg:py-16">
      {/* Dense monogram background — LV style */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: encodedPattern,
          backgroundRepeat: "repeat",
          backgroundSize: `${TILE_W}px ${TILE_H}px`,
          opacity: 0.07,
        }}
      />

      {/* Title */}
      <div className="relative mx-auto max-w-7xl px-4">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
            {t("promoDeals.title")}{" "}
            <span className="italic" style={{ color: "#D8E143" }}>
              {t("promoDeals.titleAccent")}
            </span>
          </h2>
        </div>
      </div>

      {/* Carousel - full width */}
      <div className="relative">
        {/* Left arrow */}
        <button
          onClick={() => scroll("left")}
          className={`absolute left-4 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition-opacity hover:bg-gray-50 md:flex ${
            canScrollLeft ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          aria-label={t("hero.previous")}
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>

        {/* Scroll container */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scroll-smooth px-4 scrollbar-hide md:overflow-hidden md:px-8"
        >
            {PROMO_PRODUCTS.map((product) => (
              <Link
                key={product.slug}
                href={`/${locale}/products/${product.slug}`}
                className="group flex w-[280px] shrink-0 flex-col rounded-2xl bg-white p-5 transition-shadow hover:shadow-md md:w-[300px] lg:w-[320px]"
              >
                {/* Product name */}
                <h3 className="text-lg font-bold text-gray-900">
                  {product.name}
                </h3>

                {/* Product image */}
                <div className="relative my-4 aspect-square w-full overflow-hidden">
                  <span className="absolute right-2 top-2 z-10 rounded-full px-2.5 py-1 text-xs font-bold" style={{ backgroundColor: "#D8E143", color: "#034638" }}>
                    {product.badge}
                  </span>
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 280px, (max-width: 1024px) 300px, 320px"
                  />
                </div>

                {/* Color dots */}
                <div className="mb-4 flex items-center justify-center gap-1.5">
                  {product.colors.map((color) => (
                    <span
                      key={color}
                      className="h-3 w-3 rounded-full border border-gray-200"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>

                {/* Price + CTA */}
                <div className="flex items-end justify-between">
                  <p className="text-sm text-gray-600">
                    {t("promoDeals.from")} {product.priceFrom} &euro;
                  </p>
                  <span className="rounded-full bg-green-700 px-4 py-2 text-sm font-semibold text-white transition-colors group-hover:bg-green-800">
                    {t("promoDeals.buy")}
                  </span>
                </div>
              </Link>
            ))}
          </div>

        {/* Right arrow */}
        <button
          onClick={() => scroll("right")}
          className={`absolute right-4 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm transition-opacity hover:bg-gray-50 md:flex ${
            canScrollRight ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          aria-label={t("hero.next")}
        >
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </button>
      </div>
    </section>
  );
}
