import topSellers from "@/data/top-sellers.json";
import { PromoDealsCarousel, type PromoProduct } from "./PromoDealsCarousel";

/** Map a color name (FR) to a hex value for the dot display */
const COLOR_MAP: Record<string, string> = {
  noir: "#1d1d1f",
  minuit: "#1d1d1f",
  blanc: "#f5f5f0",
  argent: "#e3e4df",
  silver: "#e3e4df",
  "lumière stellaire": "#f9f3ee",
  or: "#f4e8ce",
  gold: "#f4e8ce",
  "or rose": "#faddd7",
  "or clair": "#f4e8ce",
  rose: "#faddd7",
  rouge: "#bf0013",
  bleu: "#a7c1d9",
  "bleu pacifique": "#2d4e5c",
  "bleu alpine": "#3e5f6e",
  vert: "#4e5851",
  "vert alpine": "#394c38",
  violet: "#b8afe6",
  "violet intense": "#59476b",
  mauve: "#e3d0e8",
  jaune: "#f9e479",
  graphite: "#54524f",
};

function getColorHex(name: string): string {
  return COLOR_MAP[name.toLowerCase()] ?? "#cccccc";
}

export async function PromoDeals() {
  const products: PromoProduct[] = topSellers.slice(0, 8).map((item, index) => ({
    slug: item.handle,
    name: item.name,
    brand: "Apple",
    imageUrl: item.images[0] ?? null,
    priceFrom: item.price_from,
    colors: item.colors.map(getColorHex),
    badge: index < 3 ? "Best-seller" : null,
  }));

  if (products.length === 0) return null;

  return <PromoDealsCarousel products={products} />;
}
