"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { getOrder } from "@/lib/api/orders";
import type { Order, OrderItem } from "@/types/order";

export default function ConfirmationPage() {
  const locale = useLocale();
  const searchParams = useSearchParams();
  const t = useTranslations("confirmation");
  const orderNumber = searchParams.get("order");

  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!orderNumber) {
      setIsLoading(false);
      return;
    }

    const fetchOrder = async () => {
      // Note: We might need the order ID, not the order number
      // For now, show confirmation based on order number
      setIsLoading(false);
    };

    fetchOrder();
  }, [orderNumber]);

  if (!orderNumber) {
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

  return (
    <div className="bg-gray-50 py-8">
      <div className="mx-auto max-w-2xl px-4">
        {/* Success header */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-8 w-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            {t("title")}
          </h1>
          <p className="text-gray-600">{t("subtitle")}</p>
        </div>

        {/* Order details card */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="mb-6 border-b border-gray-200 pb-6 text-center">
            <p className="text-sm text-gray-500">{t("orderNumber")}</p>
            <p className="text-xl font-bold text-gray-900">{orderNumber}</p>
          </div>

          <div className="mb-6">
            <div className="flex items-start gap-3 rounded-lg bg-blue-50 p-4">
              <svg
                className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <div>
                <p className="font-medium text-blue-900">{t("emailSent")}</p>
                <p className="text-sm text-blue-700">{t("emailDescription")}</p>
              </div>
            </div>
          </div>

          {/* Next steps */}
          <div className="mb-6">
            <h2 className="mb-3 font-semibold text-gray-900">{t("nextSteps")}</h2>
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
            <Link
              href={`/${locale}/smartphones`}
              className="flex-1 rounded-full bg-green-700 py-3 text-center font-medium text-white transition hover:bg-green-800"
            >
              {t("continueShopping")}
            </Link>
            <Link
              href={`/${locale}`}
              className="flex-1 rounded-full border border-gray-300 py-3 text-center font-medium text-gray-700 transition hover:bg-gray-50"
            >
              {t("backToHome")}
            </Link>
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
