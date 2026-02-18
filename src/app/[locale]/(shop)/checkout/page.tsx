"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Truck, MapPin, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCartStore } from "@/stores/cart-store";
import { useAuthStore } from "@/stores/auth-store";
import { createOrder } from "@/lib/api/orders";
import { getProfile } from "@/lib/api/profile";
import { COUNTRY_CODES } from "@/lib/constants";
import { GRADE_ID_TO_API } from "@/components/products/configurator";
import { DpdParcelShopPicker } from "@/components/checkout/DpdParcelShopPicker";
import type { CreateOrderPayload, OrderItem, DpdParcelShop } from "@/types/order";

type DeliveryMethod = "home" | "dpd" | "pickup";

const STORE_ADDRESS = {
  name: "DBC 17",
  address: "110 Av. de Villiers",
  postalCode: "75017",
  city: "Paris",
  country: "FR",
};

interface ShippingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  postalCode: string;
  city: string;
  country: string;
}

const INITIAL_FORM: ShippingFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  postalCode: "",
  city: "",
  country: "FR",
};

// DPD available in all supported countries (FR, BE, CH, LU)
// The widget filters parcel shops by country automatically

export default function CheckoutPage() {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("checkout");
  const tCart = useTranslations("cart");
  const { items, getSubtotal, setLastOrder, clearCart, hasShopProcessingItems } =
    useCartStore();
  const { user, initialized, getAccessToken } = useAuthStore();

  const orderCompleteRef = useRef(false);
  const [formData, setFormData] = useState<ShippingFormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Delivery method
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("home");
  const [dpdShop, setDpdShop] = useState<DpdParcelShop | null>(null);

  const subtotal = getSubtotal();
  const isShopOrder = hasShopProcessingItems();
  const showDeliverySelector = !isShopOrder;
  const shippingCost = deliveryMethod === "pickup" ? 0 : deliveryMethod === "dpd" ? 6 : 20;

  // Reset DPD shop when country changes (widget shows different shops per country)
  useEffect(() => {
    setDpdShop(null);
  }, [formData.country]);

  // Pre-fill from saved profile
  useEffect(() => {
    if (!initialized || !user) return;

    const token = getAccessToken();
    if (!token) return;

    getProfile(token).then(({ data }) => {
      if (!data) return;
      setFormData((prev) => ({
        ...prev,
        firstName: data.first_name || prev.firstName,
        lastName: data.last_name || prev.lastName,
        email: user.email || prev.email,
        phone: data.phone || prev.phone,
        address: data.address || prev.address,
        postalCode: data.postal_code || prev.postalCode,
        city: data.city || prev.city,
        country: data.country || prev.country,
      }));
    });
  }, [initialized, user, getAccessToken]);

  if (items.length === 0 && !orderCompleteRef.current) {
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
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim())
      newErrors.firstName = t("errors.required");
    if (!formData.lastName.trim())
      newErrors.lastName = t("errors.required");
    if (!formData.email.trim()) {
      newErrors.email = t("errors.required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("errors.invalidEmail");
    }
    if (!formData.phone.trim()) {
      newErrors.phone = t("errors.required");
    } else if (
      !/^[\d\s+.-]{10,}$/.test(formData.phone.replace(/\s/g, ""))
    ) {
      newErrors.phone = t("errors.invalidPhone");
    }
    // Address fields only required for home delivery
    if (deliveryMethod === "home") {
      if (!formData.address.trim())
        newErrors.address = t("errors.required");
      if (!formData.postalCode.trim()) {
        newErrors.postalCode = t("errors.required");
      } else if (
        formData.country === "FR" &&
        !/^\d{5}$/.test(formData.postalCode)
      ) {
        newErrors.postalCode = t("errors.invalidPostalCode");
      }
      if (!formData.city.trim()) newErrors.city = t("errors.required");
    }

    // DPD: must have selected a parcel shop
    if (deliveryMethod === "dpd" && !dpdShop) {
      newErrors.dpdShop = t("parcelShopRequired");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const orderItems: OrderItem[] = items.map((item) => ({
        variant_id: item.variantId,
        sku: item.sku,
        product_name: `${item.model} ${item.storage}`,
        storage: item.storage,
        color: item.color,
        grade: GRADE_ID_TO_API[item.grade] || item.grade,
        battery: item.battery,
        unit_price: item.price,
        quantity: item.quantity,
        image_url: item.imageUrl,
        foxway_sku: item.foxwaySku,
        battery_fallback: item.batteryFallback,
        needs_shop_processing: item.needsShopProcessing,
      }));

      const isPickup = deliveryMethod === "pickup";
      const isDpd = deliveryMethod === "dpd";

      const payload: CreateOrderPayload = {
        customer_name: `${formData.firstName} ${formData.lastName}`,
        customer_email: formData.email,
        customer_phone: formData.phone,
        shipping_address: isPickup
          ? `${STORE_ADDRESS.name}, ${STORE_ADDRESS.address}`
          : formData.address,
        shipping_postal_code: isPickup
          ? STORE_ADDRESS.postalCode
          : formData.postalCode,
        shipping_city: isPickup ? STORE_ADDRESS.city : formData.city,
        shipping_country: isPickup ? STORE_ADDRESS.country : formData.country,
        shipping_cost: shippingCost,
        carrier_id: isPickup ? 0 : isDpd ? 3 : 1,
        items: orderItems,
      };

      // DPD: add parcel locker address
      if (isDpd && dpdShop) {
        payload.dpd_parcel_shop_id = dpdShop.parcelShopId;
        payload.dpd_shipping_address = `${dpdShop.company}, ${dpdShop.street} ${dpdShop.houseNo}`.trim();
        payload.dpd_shipping_postal_code = dpdShop.zipCode;
        payload.dpd_shipping_city = dpdShop.city;
        payload.dpd_shipping_country = dpdShop.country;
      }

      const response = await createOrder(payload);

      if (response.error) {
        setSubmitError(response.error.error || t("errors.submitFailed"));
        return;
      }

      if (!response.data?.success) {
        setSubmitError(t("errors.submitFailed"));
        return;
      }

      orderCompleteRef.current = true;
      setLastOrder({
        orderNumber: response.data.order.order_number,
        items: items.map((item) => ({
          name: item.model,
          storage: item.storage,
          color: item.color,
          grade: tCart(`grades.${item.grade}`),
          battery: item.battery,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.imageUrl,
        })),
        subtotal: getSubtotal(),
      });
      clearCart();
      router.push(
        `/${locale}/checkout/confirmation?order=${encodeURIComponent(response.data.order.order_number)}`
      );
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
            <span className="font-medium text-gray-900">
              {t("steps.address")}
            </span>
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
            {/* Delivery method selector */}
            {showDeliverySelector && (
              <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">
                  {t("deliveryMethod")}
                </h2>
                <div className="space-y-3">
                  <DeliveryOptionCard
                    selected={deliveryMethod === "pickup"}
                    onClick={() => setDeliveryMethod("pickup")}
                    icon={<Store className="h-4 w-4" />}
                    title={t("deliveryPickup")}
                    description={`${STORE_ADDRESS.address}, ${STORE_ADDRESS.postalCode} ${STORE_ADDRESS.city}`}
                    price={t("free")}
                    priceClassName="text-green-700"
                  />
                  <DeliveryOptionCard
                    selected={deliveryMethod === "home"}
                    onClick={() => setDeliveryMethod("home")}
                    icon={<Truck className="h-4 w-4" />}
                    title={t("deliveryHome")}
                    description={t("deliveryHomeDesc")}
                    price="20 €"
                  />
                  <DeliveryOptionCard
                    selected={deliveryMethod === "dpd"}
                    onClick={() => setDeliveryMethod("dpd")}
                    icon={<MapPin className="h-4 w-4" />}
                    title={t("deliveryDpd")}
                    description={t("deliveryDpdDesc")}
                    price="6 €"
                  />
                </div>

                {/* DPD Parcel Shop Picker */}
                {deliveryMethod === "dpd" && (
                  <div className="mt-4">
                    <DpdParcelShopPicker
                      locale={locale}
                      country={formData.country}
                      onSelect={(shop) => {
                        setDpdShop(shop);
                        if (errors.dpdShop) {
                          setErrors((prev) => ({ ...prev, dpdShop: "" }));
                        }
                      }}
                      selectedShop={dpdShop}
                    />
                    {errors.dpdShop && (
                      <p className="mt-2 text-sm text-red-600">{errors.dpdShop}</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Contact + Address info */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="mb-6 text-xl font-semibold text-gray-900">
                {deliveryMethod === "home" ? t("shippingInfo") : t("contactInfo")}
              </h2>

              {submitError && (
                <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700">
                  {submitError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Contact fields — always visible */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <CheckoutField
                    id="firstName"
                    label={`${t("fields.firstName")} *`}
                    value={formData.firstName}
                    onChange={handleChange}
                    error={errors.firstName}
                  />
                  <CheckoutField
                    id="lastName"
                    label={`${t("fields.lastName")} *`}
                    value={formData.lastName}
                    onChange={handleChange}
                    error={errors.lastName}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <CheckoutField
                    id="email"
                    type="email"
                    label={`${t("fields.email")} *`}
                    value={formData.email}
                    onChange={handleChange}
                    error={errors.email}
                  />
                  <CheckoutField
                    id="phone"
                    type="tel"
                    label={`${t("fields.phone")} *`}
                    value={formData.phone}
                    onChange={handleChange}
                    error={errors.phone}
                    placeholder="+33 6 12 34 56 78"
                  />
                </div>

                {/* Country selector — always visible (affects DPD picker) */}
                <div className="max-w-xs">
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
                    className="h-9 w-full rounded-lg border border-gray-200 bg-transparent px-3 py-1 text-base shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring"
                  >
                    {COUNTRY_CODES.map((code) => (
                      <option key={code} value={code}>
                        {t(`countries.${code}`)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Address fields — only for home delivery */}
                {deliveryMethod === "home" && (
                  <>
                    <CheckoutField
                      id="address"
                      label={`${t("fields.address")} *`}
                      value={formData.address}
                      onChange={handleChange}
                      error={errors.address}
                    />

                    <div className="grid gap-4 sm:grid-cols-2">
                      <CheckoutField
                        id="postalCode"
                        label={`${t("fields.postalCode")} *`}
                        value={formData.postalCode}
                        onChange={handleChange}
                        error={errors.postalCode}
                      />
                      <CheckoutField
                        id="city"
                        label={`${t("fields.city")} *`}
                        value={formData.city}
                        onChange={handleChange}
                        error={errors.city}
                      />
                    </div>
                  </>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-6 w-full rounded-full bg-green-700 py-3 font-medium text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? t("submitting") : t("confirmOrder")}
                </Button>
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
                  <span className={shippingCost === 0 ? "font-medium text-green-700" : ""}>
                    {shippingCost === 0
                      ? t("free")
                      : `${shippingCost.toLocaleString("fr-FR")} €`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{tCart("delivery")}</span>
                  <span className="text-gray-700">
                    {isShopOrder
                      ? tCart("deliveryExtended")
                      : tCart("deliveryStandard")}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex justify-between border-t border-gray-200 pt-4 text-lg font-semibold">
                <span>{t("total")}</span>
                <span>{(subtotal + shippingCost).toLocaleString("fr-FR")} €</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckoutField({
  id,
  label,
  value,
  onChange,
  error,
  type = "text",
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1 block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <Input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-invalid={!!error}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

function DeliveryOptionCard({
  selected,
  onClick,
  icon,
  title,
  description,
  price,
  priceClassName,
}: {
  selected: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  title: string;
  description: string;
  price: string;
  priceClassName?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-start gap-3 rounded-lg border-2 p-4 text-left transition ${
        selected
          ? "border-green-700 bg-green-50"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <div
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
          selected ? "border-green-700" : "border-gray-300"
        }`}
      >
        {selected && (
          <div className="h-2.5 w-2.5 rounded-full bg-green-700" />
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 text-gray-600">
          {icon}
          <span className="font-medium text-gray-900">{title}</span>
        </div>
        <p className="mt-1 text-xs text-gray-500">{description}</p>
      </div>
      <span
        className={`shrink-0 text-sm font-semibold ${priceClassName || "text-gray-900"}`}
      >
        {price}
      </span>
    </button>
  );
}
