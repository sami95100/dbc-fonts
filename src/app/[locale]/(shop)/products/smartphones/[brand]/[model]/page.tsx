import { Breadcrumb } from "@/components/products/Breadcrumb";
import { TrustBar } from "@/components/products/TrustBar";
import { ProductConfigurator } from "@/components/products/ProductConfigurator";
import {
  getModelBySlug,
  getModelOptions,
  getModelPrices,
  getModelImages,
  getModelConditionImages,
  getCategoryImages,
} from "@/lib/api/products";
import { apiModelToProduct } from "@/lib/api/transformers";
import { notFound } from "next/navigation";

interface ProductPageProps {
  params: Promise<{
    locale: string;
    brand: string;
    model: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { locale, brand, model: modelSlug } = await params;

  // Charger le modele par slug
  const modelResponse = await getModelBySlug(modelSlug);

  if (!modelResponse.data) {
    notFound();
  }

  const modelData = modelResponse.data;

  // Charger options, prix, images et images de categorie en parallele
  const [optionsRes, pricesRes, imagesRes, conditionImagesRes, categoryImagesRes] = await Promise.all([
    getModelOptions(modelData.id),
    getModelPrices(modelData.id),
    getModelImages(modelData.id),
    getModelConditionImages(modelData.id),
    getCategoryImages(modelData.category || "mobile"), // Charge les images de la categorie (mobile)
  ]);

  if (!optionsRes.data || !pricesRes.data) {
    notFound();
  }

  // Transformer en Product pour le frontend
  const product = apiModelToProduct({
    model: modelData,
    prices: pricesRes.data,
    options: optionsRes.data,
    images: imagesRes.data ?? undefined,
  });

  // Extraire les URLs des images de categorie par type
  const categoryImages = categoryImagesRes.data || [];
  const storageImageUrl = categoryImages.find((img) => img.type === "storage")?.url;
  const simImageUrl = categoryImages.find((img) => img.type === "sim")?.url;
  const batteryImageUrl = categoryImages.find((img) => img.type === "battery")?.url;
  const conditionImageUrl = categoryImages.find((img) => img.type === "condition")?.url;

  return (
    <>
      <TrustBar />

      <div className="mx-auto max-w-7xl px-4 py-6">
        <Breadcrumb
          items={[
            { label: "Smartphones", href: `/${locale}/products/smartphones` },
            { label: modelData.brand, href: `/${locale}/products/smartphones/${brand}` },
            { label: modelData.name },
          ]}
        />

        <ProductConfigurator
          product={product}
          storageImageUrl={storageImageUrl}
          simImageUrl={simImageUrl}
          batteryImageUrl={batteryImageUrl}
          conditionImageUrl={conditionImageUrl}
        />
      </div>
    </>
  );
}
