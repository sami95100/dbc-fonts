"use client";

import { memo } from "react";
import Image from "next/image";
import { ImageIcon, Minus, Plus } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { formatPrice } from "@/lib/utils";
import type { CartItem } from "@/types/cart";

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}


function CartItemRowComponent({
  item,
  onUpdateQuantity,
  onRemove,
}: CartItemRowProps) {
  const locale = useLocale();
  const t = useTranslations("cart");
  const gradeLabel = t(`grades.${item.grade}`);

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
            <ImageIcon className="h-8 w-8" />
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
            {item.color} &bull; {gradeLabel}
          </p>
          <p className="text-sm text-gray-500">
            {item.battery === "new" ? t("newBattery") : t("standardBattery")}
          </p>
        </div>

        {/* Price and quantity */}
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            {/* Quantity controls */}
            <button
              type="button"
              onClick={handleDecrement}
              disabled={item.quantity <= 1}
              className="flex h-9 w-9 items-center justify-center rounded border border-gray-300 text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 sm:h-11 sm:w-11"
              aria-label={t("decreaseQuantity")}
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-6 text-center font-medium sm:w-8">{item.quantity}</span>
            <button
              type="button"
              onClick={handleIncrement}
              className="flex h-9 w-9 items-center justify-center rounded border border-gray-300 text-gray-600 transition hover:bg-gray-50 sm:h-11 sm:w-11"
              aria-label={t("increaseQuantity")}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <span className="font-semibold text-gray-900">
            {formatPrice(item.price * item.quantity, locale)}
          </span>

          <button
            type="button"
            onClick={() => onRemove(item.id)}
            className="ml-auto text-sm text-red-600 hover:text-red-700"
          >
            {t("remove")}
          </button>
        </div>
      </div>
    </div>
  );
}

export const CartItemRow = memo(CartItemRowComponent);
