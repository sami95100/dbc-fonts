"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { Truck, MapPin, Store, X } from "lucide-react";
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
  const [mounted, setMounted] = useState(false);

  // Delivery method
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("home");
  const [dpdShop, setDpdShop] = useState<DpdParcelShop | null>(null);
  const [showAddressSheet, setShowAddressSheet] = useState(false);

  const subtotal = getSubtotal();
  const isShopOrder = hasShopProcessingItems();
  const showDeliverySelector = !isShopOrder;
  const shippingCost = deliveryMethod === "pickup" ? 0 : deliveryMethod === "dpd" ? 6 : 20;

  const hasHomeAddress = formData.address.trim() && formData.city.trim();

  useEffect(() => setMounted(true), []);

  // Reset DPD shop when country changes
  useEffect(() => {
    setDpdShop(null);
  }, [formData.country]);

  // Lock body scroll when address sheet is open
  useEffect(() => {
    if (!showAddressSheet) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [showAddressSheet]);

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

    // Address required for home delivery
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

    // If home delivery has address errors, open the sheet
    if (
      deliveryMethod === "home" &&
      (newErrors.address || newErrors.postalCode || newErrors.city)
    ) {
      setShowAddressSheet(true);
    }

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

  // Build the address summary for the selected delivery method
  const renderAddressCard = () => {
    if (deliveryMethod === "pickup") {
      return (
        <AddressCard
          icon={<Store className="h-5 w-5" />}
          title={STORE_ADDRESS.name}
          line1={STORE_ADDRESS.address}
          line2={`${STORE_ADDRESS.postalCode} ${STORE_ADDRESS.city}`}
          subtitle={t("deliveryPickupReady")}
        />
      );
    }

    if (deliveryMethod === "dpd") {
      if (!dpdShop) return null;
      return (
        <AddressCard
          icon={<MapPin className="h-5 w-5" />}
          title={dpdShop.company}
          line1={`${dpdShop.street} ${dpdShop.houseNo}`}
          line2={`${dpdShop.zipCode} ${dpdShop.city}`}
          onEdit={() => {
            setDpdShop(null);
          }}
          editLabel={t("changeParcelShop")}
        />
      );
    }

    // Home delivery
    if (!hasHomeAddress) {
      return (
        <button
          type="button"
          onClick={() => setShowAddressSheet(true)}
          className="flex w-full items-center gap-3 rounded-lg border-2 border-dashed border-gray-300 p-4 text-left transition hover:border-green-700 hover:text-green-700"
        >
          <MapPin className="h-5 w-5 text-gray-400" />
          <span className="text-sm text-gray-500">{t("addAddress")}</span>
        </button>
      );
    }

    return (
      <AddressCard
        icon={<Truck className="h-5 w-5" />}
        title={formData.address}
        line1={`${formData.postalCode} ${formData.city}`}
        line2={t(`countries.${formData.country}`)}
        onEdit={() => setShowAddressSheet(true)}
        editLabel={t("editAddress")}
      />
    );
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
                    description={t("deliveryPickupDesc")}
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

                {/* DPD Parcel Shop Picker (only when no shop selected yet) */}
                {deliveryMethod === "dpd" && !dpdShop && (
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

                {/* Unified address card below delivery options */}
                <div className="mt-4">
                  {renderAddressCard()}
                  {deliveryMethod === "home" && errors.address && !hasHomeAddress && (
                    <p className="mt-2 text-sm text-red-600">{t("errors.required")}</p>
                  )}
                </div>
              </div>
            )}

            {/* Contact info */}
            <div className="rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="mb-6 text-xl font-semibold text-gray-900">
                {t("contactInfo")}
              </h2>

              {submitError && (
                <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-700">
                  {submitError}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
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

      {/* Address bottom sheet for home delivery */}
      {showAddressSheet &&
        mounted &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-end justify-center bg-black/60 sm:items-center sm:p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowAddressSheet(false);
            }}
          >
            <div className="w-full max-w-lg animate-in slide-in-from-bottom rounded-t-xl bg-white shadow-2xl sm:rounded-xl">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {t("shippingInfo")}
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddressSheet(false)}
                  className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form */}
              <div className="space-y-4 p-5">
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

                <div className="max-w-xs">
                  <label
                    htmlFor="sheet-country"
                    className="mb-1 block text-sm font-medium text-gray-700"
                  >
                    {t("fields.country")}
                  </label>
                  <select
                    id="sheet-country"
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

                <Button
                  type="button"
                  onClick={() => setShowAddressSheet(false)}
                  className="mt-2 w-full rounded-full bg-green-700 py-3 font-medium text-white transition hover:bg-green-800"
                >
                  {t("saveAddress")}
                </Button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
}

/* ─── Sub-components ─── */

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

function AddressCard({
  icon,
  title,
  line1,
  line2,
  subtitle,
  onEdit,
  editLabel,
}: {
  icon: React.ReactNode;
  title: string;
  line1: string;
  line2: string;
  subtitle?: string;
  onEdit?: () => void;
  editLabel?: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
      <div className="mt-0.5 shrink-0 text-green-700">{icon}</div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-sm text-gray-600">{line1}</p>
        <p className="text-sm text-gray-600">{line2}</p>
        {subtitle && (
          <p className="mt-1 text-xs text-green-700">{subtitle}</p>
        )}
      </div>
      {onEdit && editLabel && (
        <button
          type="button"
          onClick={onEdit}
          className="shrink-0 text-sm font-medium text-green-700 underline hover:text-green-800"
        >
          {editLabel}
        </button>
      )}
    </div>
  );
}
