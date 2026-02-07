"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { useCartStore } from "@/stores/cart-store";
import { createOrder } from "@/lib/api/orders";
import type { CreateOrderPayload, OrderItem } from "@/types/order";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
}

interface FormErrors {
  [key: string]: string;
}

const GRADE_LABELS: Record<string, string> = {
  parfait: "Parfait",
  "tres-bon": "Tres bon",
  correct: "Correct",
  imparfait: "Imparfait",
};

export default function CheckoutPage() {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("checkout");
  const { items, getSubtotal, clearCart, hasShopProcessingItems } = useCartStore();
  const tCart = useTranslations("cart");

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    postalCode: "",
    city: "",
    country: "FR",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const subtotal = getSubtotal();

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <div className="bg-gray-50 py-8">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">
            {t("emptyCart")}
          </h1>
          <Link
            href={`/${locale}/cart`}
            className="text-green-700 hover:text-green-800"
          >
            {t("backToCart")}
          </Link>
        </div>
      </div>
    );
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = t("errors.required");
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = t("errors.required");
    }
    if (!formData.email.trim()) {
      newErrors.email = t("errors.required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("errors.invalidEmail");
    }
    if (!formData.phone.trim()) {
      newErrors.phone = t("errors.required");
    } else if (!/^[\d\s+.-]{10,}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = t("errors.invalidPhone");
    }
    if (!formData.address.trim()) {
      newErrors.address = t("errors.required");
    }
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = t("errors.required");
    } else if (formData.country === "FR" && !/^\d{5}$/.test(formData.postalCode)) {
      newErrors.postalCode = t("errors.invalidPostalCode");
    }
    if (!formData.city.trim()) {
      newErrors.city = t("errors.required");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Build order items from cart
      const orderItems: OrderItem[] = items.map((item) => ({
        variant_id: item.variantId,
        sku: item.sku,
        product_name: `${item.model} ${item.storage}`,
        storage: item.storage,
        color: item.color,
        grade: GRADE_LABELS[item.grade] || item.grade,
        unit_price: item.price,
        quantity: item.quantity,
        foxway_sku: item.foxwaySku,
        battery_fallback: item.batteryFallback,
      }));

      // Build order payload
      const payload: CreateOrderPayload = {
        customer_name: `${formData.firstName} ${formData.lastName}`,
        customer_email: formData.email,
        customer_phone: formData.phone,
        shipping_address: formData.address,
        shipping_postal_code: formData.postalCode,
        shipping_city: formData.city,
        shipping_country: formData.country,
        shipping_cost: 0, // Free shipping for now
        items: orderItems,
      };

      const response = await createOrder(payload);

      if (response.error) {
        setSubmitError(response.error.error || t("errors.submitFailed"));
        return;
      }

      if (response.data?.success) {
        // Clear cart and redirect to confirmation
        clearCart();
        router.push(
          `/${locale}/checkout/confirmation?order=${response.data.order.order_number}`
        );
      }
    } catch {
      setSubmitError(t("errors.submitFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 py-8">
      <div className="mx-auto max-w-6xl px-4">
        {/* Progress steps */}
        <div className="mb-8 flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-700 text-sm font-medium text-white">
              1
            </div>
            <span className="font-medium text-gray-900">{t("steps.address")}</span>
          </div>
          <div className="h-px w-16 bg-gray-300" />
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm font-medium text-gray-500">
              2
            </div>
            <span className="text-gray-500">{t("steps.confirmation")}</span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="mb-6 text-xl font-semibold text-gray-900">
                {t("shippingInfo")}
              </h2>

              {submitError && (
                <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700">
                  {submitError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name row */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      {t("fields.firstName")} *
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full rounded-lg border px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        errors.firstName ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      {t("fields.lastName")} *
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full rounded-lg border px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        errors.lastName ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                {/* Contact row */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      {t("fields.email")} *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full rounded-lg border px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        errors.email ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      {t("fields.phone")} *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+33 6 12 34 56 78"
                      className={`w-full rounded-lg border px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        errors.phone ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label
                    htmlFor="address"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    {t("fields.address")} *
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`w-full rounded-lg border px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.address ? "border-red-500" : "border-gray-300"
                    }`}
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                  )}
                </div>

                {/* City row */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <div>
                    <label
                      htmlFor="postalCode"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      {t("fields.postalCode")} *
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      className={`w-full rounded-lg border px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        errors.postalCode ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.postalCode && (
                      <p className="mt-1 text-sm text-red-600">{errors.postalCode}</p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="city"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      {t("fields.city")} *
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`w-full rounded-lg border px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500 ${
                        errors.city ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors.city && (
                      <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="country"
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      {t("fields.country")}
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="FR">France</option>
                      <option value="BE">Belgique</option>
                      <option value="CH">Suisse</option>
                      <option value="LU">Luxembourg</option>
                    </select>
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-6 w-full rounded-full bg-green-700 py-3 font-medium text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? t("submitting") : t("confirmOrder")}
                </button>
              </form>
            </div>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                {t("orderSummary")}
              </h2>

              <div className="mb-4 text-sm text-gray-500">
                {items.length} {items.length > 1 ? t("items") : t("item")}
              </div>

              <div className="max-h-64 space-y-3 overflow-y-auto border-b border-gray-200 pb-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {item.model} {item.storage}
                      </p>
                      <p className="text-gray-500">
                        {item.color} x{item.quantity}
                      </p>
                    </div>
                    <span className="font-medium">
                      {(item.price * item.quantity).toLocaleString("fr-FR")} €
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t("subtotal")}</span>
                  <span>{subtotal.toLocaleString("fr-FR")} €</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t("shipping")}</span>
                  <span className="text-green-700 font-medium">{t("free")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{tCart("delivery")}</span>
                  <span className="text-gray-700">
                    {hasShopProcessingItems() ? tCart("deliveryExtended") : tCart("deliveryStandard")}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex justify-between border-t border-gray-200 pt-4 text-lg font-semibold">
                <span>{t("total")}</span>
                <span>{subtotal.toLocaleString("fr-FR")} €</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
