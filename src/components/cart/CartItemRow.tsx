"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import type { CartItem } from "@/types/cart";

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

const GRADE_LABELS: Record<string, string> = {
  parfait: "Parfait",
  "tres-bon": "Tres bon",
  correct: "Correct",
  imparfait: "Imparfait",
};

export function CartItemRow({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemRowProps) {
  const t = useTranslations("cart");

  const handleDecrement = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    }
  };

  const handleIncrement = () => {
    onUpdateQuantity(item.id, item.quantity + 1);
  };

  return (
    <div className="flex gap-4 rounded-lg border border-gray-200 bg-white p-4">
      {/* Image */}
      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.model}
            fill
            className="object-contain"
            sizes="96px"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-400">
            <svg
              className="h-8 w-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          <h3 className="font-medium text-gray-900">
            {item.model} {item.storage}
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {item.color} &bull; {GRADE_LABELS[item.grade] || item.grade}
          </p>
          <p className="text-sm text-gray-500">
            {item.battery === "new" ? t("newBattery") : t("standardBattery")}
          </p>
        </div>

        {/* Price and quantity */}
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Quantity controls */}
            <button
              onClick={handleDecrement}
              disabled={item.quantity <= 1}
              className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="w-8 text-center font-medium">{item.quantity}</span>
            <button
              onClick={handleIncrement}
              className="flex h-8 w-8 items-center justify-center rounded border border-gray-300 text-gray-600 transition hover:bg-gray-50"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-semibold text-gray-900">
              {(item.price * item.quantity).toLocaleString("fr-FR")} €
            </span>
            <button
              onClick={() => onRemove(item.id)}
              className="text-sm text-red-600 hover:text-red-700"
            >
              {t("remove")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
