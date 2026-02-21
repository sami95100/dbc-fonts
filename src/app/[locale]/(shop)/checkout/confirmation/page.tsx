"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, Mail, Package, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useCartStore } from "@/stores/cart-store";
import { useStripeConfirmation } from "@/hooks/useStripeConfirmation";
import { formatPrice } from "@/lib/utils";

export default function ConfirmationPage() {
  const locale = useLocale();
  const searchParams = useSearchParams();
  const t = useTranslations("confirmation");
  const lastOrder = useCartStore((state) => state.lastOrder);

  // Support both: ?session_id=xxx (Stripe) and ?order=xxx (legacy)
  const sessionId = searchParams.get("session_id");
  const orderParam = searchParams.get("order");
  const { orderNumber: stripeOrderNumber, isVerifying, verifyError } =
    useStripeConfirmation(sessionId);
  const orderNumber = stripeOrderNumber || orderParam;

  // Loading state while verifying Stripe session
  if (isVerifying) {
    return (
      <div className="bg-gray-50 py-16">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-green-700" />
          <p className="text-gray-600">{t("verifyingPayment")}</p>
        </div>
      </div>
    );
  }

  // Error or no order
  if (verifyError || !orderNumber) {
    return (
      <div className="bg-gray-50 py-8">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">
            {t("noOrder")}
          </h1>
          <Link
            href={`/${locale}`}
            className="text-green-700 hover:text-green-800"
          >
            {t("backToHome")}
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = lastOrder?.subtotal ?? 0;
  const shippingCost = lastOrder?.shippingCost ?? 0;
  const total = subtotal + shippingCost;

  return (
    <div className="bg-gray-50 py-8">
      <div className="mx-auto max-w-2xl px-4">
        {/* Success header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <Check className="h-8 w-8 text-green-600" aria-hidden="true" />
          </div>
          <h1 className="mb-2 font-display text-2xl font-bold text-gray-900">
            {t("title")}
          </h1>
          <p className="text-gray-600">{t("subtitle")}</p>
        </div>

        {/* Order details card */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          {/* Order number */}
          <div className="mb-6 border-b border-gray-200 pb-6 text-center">
            <p className="text-sm text-gray-500">{t("orderNumber")}</p>
            <p className="text-xl font-bold text-gray-900">{orderNumber}</p>
          </div>

          {/* Product list with images */}
          {lastOrder && lastOrder.items.length > 0 && (
            <div className="mb-6 border-b border-gray-200 pb-6">
              <h2 className="mb-4 flex items-center gap-2 font-semibold text-gray-900">
                <Package className="h-4 w-4" aria-hidden="true" />
                {t("yourOrder")}
              </h2>
              <div className="space-y-4">
                {lastOrder.items.map((item, i) => (
                  <div key={i} className="flex gap-4">
                    {item.imageUrl ? (
                      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-50">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-contain p-1"
                          sizes="80px"
                        />
                      </div>
                    ) : (
                      <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-lg bg-gray-100">
                        <Package className="h-8 w-8 text-gray-300" aria-hidden="true" />
                      </div>
                    )}
                    <div className="flex flex-1 items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {item.storage} · {item.color} · {item.grade}
                        </p>
                        <p className="text-sm text-gray-500">
                          {item.battery === "new"
                            ? t("newBattery")
                            : t("standardBattery")}
                        </p>
                        {item.quantity > 1 && (
                          <p className="text-sm text-gray-500">
                            x{item.quantity}
                          </p>
                        )}
                      </div>
                      <p className="font-medium text-gray-900">
                        {formatPrice(item.price * item.quantity, locale)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="mt-4 space-y-2 border-t border-gray-100 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t("subtotal")}</span>
                  <span>{formatPrice(subtotal, locale)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t("shipping")}</span>
                  <span className={shippingCost === 0 ? "font-medium text-green-700" : ""}>
                    {shippingCost === 0
                      ? t("free")
                      : formatPrice(shippingCost, locale)}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-semibold">
                  <span>{t("total")}</span>
                  <span>{formatPrice(total, locale)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Email notification */}
          <div className="mb-6">
            <div className="flex items-start gap-3 rounded-lg bg-blue-50 p-4">
              <Mail className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600" aria-hidden="true" />
              <div>
                <p className="font-medium text-blue-900">{t("emailSent")}</p>
                <p className="text-sm text-blue-700">
                  {t("emailDescription")}
                </p>
              </div>
            </div>
          </div>

          {/* Next steps */}
          <div className="mb-6">
            <h2 className="mb-3 font-semibold text-gray-900">
              {t("nextSteps")}
            </h2>
            <ol className="space-y-3 text-sm text-gray-600">
              <li className="flex gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-700">
                  1
                </span>
                <span>{t("step1")}</span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-700">
                  2
                </span>
                <span>{t("step2")}</span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gray-100 text-xs font-medium text-gray-700">
                  3
                </span>
                <span>{t("step3")}</span>
              </li>
            </ol>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button asChild className="flex-1 rounded-full bg-green-700 py-3 font-medium text-white transition hover:bg-green-800 active:scale-[0.98]">
              <Link href={`/${locale}/products/smartphones`}>
                {t("continueShopping")}
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex-1 rounded-full border-gray-300 py-3 font-medium text-gray-700 transition hover:bg-gray-50">
              <Link href={`/${locale}`}>
                {t("backToHome")}
              </Link>
            </Button>
          </div>
        </div>

        {/* Support */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>
            {t("questions")}{" "}
            <Link
              href={`/${locale}/help`}
              className="text-green-700 hover:text-green-800"
            >
              {t("contactUs")}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
