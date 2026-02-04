"use client";

import { ProductCard } from "./ProductCard";
import type { Product } from "@/data/mock/products";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="flex flex-col gap-3 sm:grid sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
