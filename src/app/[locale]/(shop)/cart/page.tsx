"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useCartStore } from "@/stores/cart-store";
import { CartItemRow } from "@/components/cart/CartItemRow";

export default function CartPage() {
  const locale = useLocale();
  const t = useTranslations("cart");
  const { items, removeItem, updateQuantity, getSubtotal, hasShopProcessingItems } = useCartStore();

  const subtotal = getSubtotal();
  const isEmpty = items.length === 0;
  const needsShopProcessing = hasShopProcessingItems();

  return (
    <div className="bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4">
        {/* Header */}
        <h1 className="mb-6 text-2xl font-bold text-gray-900">
          {t("title")} {!isEmpty && `(${items.length})`}
        </h1>

        {isEmpty ? (
          /* Empty state */
          <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <ShoppingCart className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="mb-2 text-lg font-medium text-gray-900">
              {t("emptyTitle")}
            </h2>
            <p className="mb-6 text-gray-500">{t("emptyDescription")}</p>
            <Link
              href={`/${locale}/products/smartphones`}
              className="inline-flex items-center justify-center rounded-full bg-green-700 px-6 py-3 font-medium text-white transition hover:bg-green-800"
            >
              {t("browseProducts")}
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Cart items */}
            <div className="space-y-4 lg:col-span-2">
              {items.map((item) => (
                <CartItemRow
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 rounded-lg border border-gray-200 bg-white p-6">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">
                  {t("summary")}
                </h2>

                <div className="space-y-3 border-b border-gray-200 pb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t("subtotal")}</span>
                    <span className="font-medium">
                      {subtotal.toLocaleString("fr-FR")} €
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t("shipping")}</span>
                    <span className="text-green-700 font-medium">{t("free")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{t("delivery")}</span>
                    <span className="text-gray-700">
                      {needsShopProcessing ? t("deliveryExtended") : t("deliveryStandard")}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex justify-between text-lg font-semibold">
                  <span>{t("total")}</span>
                  <span>{subtotal.toLocaleString("fr-FR")} €</span>
                </div>

                <Link
                  href={`/${locale}/checkout`}
                  className="mt-6 block w-full rounded-full bg-green-700 py-3 text-center font-medium text-white transition hover:bg-green-800"
                >
                  {t("checkout")}
                </Link>

                <Link
                  href={`/${locale}/products/smartphones`}
                  className="mt-3 block text-center text-sm text-gray-600 hover:text-gray-900"
                >
                  {t("continueShopping")}
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
