import { getModels } from "@/lib/api/products";
import { getColorHex } from "@/lib/api/transformers";
import type { PhoneModel } from "@/types/product";
import { PromoDealsCarousel, type PromoProduct } from "./PromoDealsCarousel";

function modelToPromo(model: PhoneModel): PromoProduct {
  const priceFrom = model.price_from ?? 0;
  const newPrice = model.new_price ?? 0;

  let badge: string | null = null;
  if (newPrice > 0 && priceFrom > 0 && priceFrom < newPrice) {
    badge = `-${Math.round((1 - priceFrom / newPrice) * 100)}%`;
  }

  return {
    slug: `${model.brand.toLowerCase()}/${model.slug}`,
    name: model.name,
    brand: model.brand,
    imageUrl: model.primary_image_url ?? null,
    priceFrom,
    colors: (model.colors ?? []).map(getColorHex),
    badge,
  };
}

export async function PromoDeals() {
  const res = await getModels({ promo: true, perPage: 8 });

  const products: PromoProduct[] = res.data?.items
    ? res.data.items.map(modelToPromo)
    : [];

  if (products.length === 0) return null;

  return <PromoDealsCarousel products={products} />;
}
