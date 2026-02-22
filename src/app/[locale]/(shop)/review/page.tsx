"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Star, CheckCircle, AlertCircle, Loader2, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getOrderItemsForReview,
  submitReviews,
  type ReviewOrderItem,
} from "@/lib/api/reviews";

type PageState = "loading" | "form" | "already_reviewed" | "success" | "error";

interface ReviewFormItem extends ReviewOrderItem {
  rating: number;
  title: string;
  content: string;
}

function StarRating({
  value,
  onChange,
  starLabel,
}: {
  value: number;
  onChange: (v: number) => void;
  starLabel: (count: number) => string;
}) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          aria-label={starLabel(star)}
          className="p-0.5 transition-transform hover:scale-110"
        >
          <Star
            className={cn(
              "h-8 w-8 transition-colors",
              (hovered || value) >= star
                ? "fill-yellow-400 text-yellow-400"
                : "fill-none text-gray-300"
            )}
          />
        </button>
      ))}
    </div>
  );
}

export default function ReviewPage() {
  const searchParams = useSearchParams();
  const locale = useLocale();
  const t = useTranslations("reviewRequest");

  const orderId = searchParams.get("order") || "";
  const sig = searchParams.get("sig") || "";

  const [state, setState] = useState<PageState>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [orderNumber, setOrderNumber] = useState("");
  const [items, setItems] = useState<ReviewFormItem[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!orderId || !sig) {
      setErrorMessage(t("errorInvalidLink"));
      setState("error");
      return;
    }

    async function loadOrder() {
      const { data, error } = await getOrderItemsForReview(orderId, sig);

      if (error) {
        if (error.error.includes("403") || error.error.includes("Invalid")) {
          setErrorMessage(t("errorInvalidLink"));
        } else if (error.error.includes("404") || error.error.includes("not found")) {
          setErrorMessage(t("errorOrderNotFound"));
        } else {
          setErrorMessage(t("errorGeneric"));
        }
        setState("error");
        return;
      }

      if (!data) {
        setErrorMessage(t("errorGeneric"));
        setState("error");
        return;
      }

      setOrderNumber(data.order_number);

      if (data.already_reviewed) {
        setState("already_reviewed");
        return;
      }

      setItems(
        data.items.map((item) => ({
          ...item,
          rating: 0,
          title: "",
          content: "",
        }))
      );
      setState("form");
    }

    loadOrder();
  }, [orderId, sig, t]);

  function updateItem(index: number, field: keyof ReviewFormItem, value: string | number) {
    setItems((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const reviewsToSubmit = items
      .filter((item) => item.rating > 0 && item.model_id)
      .map((item) => ({
        model_id: item.model_id!,
        rating: item.rating,
        title: item.title || undefined,
        content: item.content || undefined,
      }));

    if (reviewsToSubmit.length === 0) {
      setErrorMessage(t("errorMinRating"));
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    const { error } = await submitReviews({
      order_id: orderId,
      sig,
      reviews: reviewsToSubmit,
    });

    setSubmitting(false);

    if (error) {
      if (error.error.includes("deja") || error.error.includes("already")) {
        setState("already_reviewed");
      } else {
        setErrorMessage(t("errorGeneric"));
      }
      return;
    }

    setState("success");
  }

  // Loading state
  if (state === "loading") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-gray-600">{t("loading")}</p>
      </div>
    );
  }

  // Error state
  if (state === "error") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
          <AlertCircle className="h-8 w-8 text-red-500" />
        </div>
        <h1 className="font-display text-xl font-semibold text-gray-900">
          {errorMessage}
        </h1>
        <Link
          href={`/${locale}`}
          className="mt-6 inline-flex items-center gap-2 text-sm text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("backToHome")}
        </Link>
      </div>
    );
  }

  // Already reviewed state
  if (state === "already_reviewed") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <CheckCircle className="h-8 w-8 text-primary" />
        </div>
        <h1 className="font-display text-xl font-semibold text-gray-900">
          {t("alreadyReviewed")}
        </h1>
        <p className="mt-2 text-gray-600">{t("alreadyReviewedMessage")}</p>
        <Link
          href={`/${locale}`}
          className="mt-6 inline-flex items-center gap-2 text-sm text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("backToHome")}
        </Link>
      </div>
    );
  }

  // Success state
  if (state === "success") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10">
          <CheckCircle className="h-8 w-8 text-accent" />
        </div>
        <h1 className="font-display text-xl font-semibold text-gray-900">
          {t("successTitle")}
        </h1>
        <p className="mt-2 text-gray-600">{t("successMessage")}</p>
        <Link
          href={`/${locale}`}
          className="mt-6 inline-flex items-center gap-2 text-sm text-primary hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("backToHome")}
        </Link>
      </div>
    );
  }

  // Form state
  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-8 text-center">
        <h1 className="font-display text-2xl font-bold text-gray-900">
          {t("pageTitle")}
        </h1>
        <p className="mt-2 text-gray-600">{t("subtitle")}</p>
        {orderNumber && (
          <p className="mt-1 text-sm text-gray-500">
            {t("orderLabel")} {orderNumber}
          </p>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {items.map((item, index) => (
          <div
            key={item.item_id}
            className="rounded-xl border border-gray-200 bg-white p-5"
          >
            <div className="flex gap-4">
              {item.image_url ? (
                <img
                  src={item.image_url}
                  alt={item.product_name}
                  className="h-20 w-20 rounded-lg object-cover"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-gray-100">
                  <Star className="h-8 w-8 text-gray-300" />
                </div>
              )}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">
                  {item.product_name}
                </h3>
                <p className="text-sm text-gray-500">
                  {[item.storage, item.color, item.grade]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {t("ratingLabel")}
              </label>
              <StarRating
                value={item.rating}
                onChange={(v) => updateItem(index, "rating", v)}
                starLabel={(count) => t("starLabel", { count })}
              />
            </div>

            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {t("titleLabel")}
              </label>
              <input
                type="text"
                value={item.title}
                onChange={(e) => updateItem(index, "title", e.target.value)}
                placeholder={t("titlePlaceholder")}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="mt-3">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                {t("contentLabel")}
              </label>
              <textarea
                value={item.content}
                onChange={(e) => updateItem(index, "content", e.target.value)}
                placeholder={t("contentPlaceholder")}
                rows={3}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        ))}

        {errorMessage && (
          <p className="text-center text-sm text-red-600">{errorMessage}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className={cn(
            "w-full rounded-lg bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-primary/90",
            submitting && "cursor-not-allowed opacity-60"
          )}
        >
          {submitting ? (
            <span className="inline-flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              {t("submitting")}
            </span>
          ) : (
            t("submit")
          )}
        </button>
      </form>
    </div>
  );
}
