"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Truck, MapPin, Store, X, Loader2, Zap, Bike } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { COUNTRY_CODES, STORE_ADDRESS } from "@/lib/constants";
import type { DeliveryMethod } from "@/lib/constants";
import { cn, formatPrice } from "@/lib/utils";
import { DpdParcelShopPicker } from "@/components/checkout/DpdParcelShopPicker";
import { useCheckout } from "@/hooks/useCheckout";

export default function CheckoutPage() {
  const t = useTranslations("checkout");
  const tCart = useTranslations("cart");

  const {
    items,
    locale,
    subtotal,
    formData,
    errors,
    handleChange,
    deliveryMethod,
    selectedShippingId,
    setSelectedShippingId,
    currentShippingMethod,
    dpdShop,
    setDpdShop,
    clearDpdError,
    shippingCost,
    shippingMethods,
    isLoadingShipping,
    showAddressSheet,
    setShowAddressSheet,
    hasHomeAddress,
    isSubmitting,
    submitError,
    handleSubmit,
    uberQuote,
    isLoadingQuote,
    quoteError,
    stuartQuote,
    isLoadingStuartQuote,
    stuartQuoteError,
    orderCompleteRef,
  } = useCheckout();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Compute delivery time text from API data
  const currentDeliveryTime = currentShippingMethod
    ? currentShippingMethod.min_days === 0 && currentShippingMethod.max_days === 0
      ? t("deliveryPickupDesc")
      : `${currentShippingMethod.min_days}-${currentShippingMethod.max_days} ${t("days")}`
    : null;

  // Lock body scroll when address sheet is open
  useEffect(() => {
    if (!showAddressSheet) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [showAddressSheet]);

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
          onEdit={() => setDpdShop(null)}
          editLabel={t("changeParcelShop")}
        />
      );
    }

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
        line1={formData.addressLine2 || `${formData.postalCode} ${formData.city}`}
        line2={formData.addressLine2 ? `${formData.postalCode} ${formData.city}` : t(`countries.${formData.country}`)}
        subtitle={formData.accessCode ? `Code: ${formData.accessCode}` : undefined}
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
            {/* Delivery method selector */}
            <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                {t("deliveryMethod")}
              </h2>
              <div className="space-y-3">
                {isLoadingShipping ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
                  </div>
                ) : (
                  shippingMethods.map((sm) => {
                    const method = sm.method as DeliveryMethod;
                    const isSelected = selectedShippingId === sm.id;
                    const iconMap: Record<string, React.ReactNode> = {
                      pickup: <Store className="h-4 w-4" />,
                      dpd: <MapPin className="h-4 w-4" />,
                      uber: <Zap className="h-4 w-4" />,
                      stuart: <Bike className="h-4 w-4" />,
                    };
                    const titleKeyMap: Record<string, string> = {
                      pickup: "deliveryPickup",
                      dpd: "deliveryDpd",
                      uber: "deliveryUber",
                      stuart: "deliveryStuart",
                    };
                    const descKeyMap: Record<string, string> = {
                      pickup: "deliveryPickupDesc",
                      dpd: "deliveryDpdDesc",
                      uber: "deliveryUberDesc",
                      stuart: "deliveryStuartDesc",
                    };
                    const icon = iconMap[method] ?? <Truck className="h-4 w-4" />;
                    const title = t(titleKeyMap[method] ?? "deliveryHome");
                    const descKey = descKeyMap[method] ?? "deliveryHomeDesc";

                    // Build description: base desc + delivery time
                    const hasTime = !(sm.min_days === 0 && sm.max_days === 0);
                    const timeSuffix = hasTime
                      ? ` - ${sm.min_days}-${sm.max_days} ${t("days")}`
                      : "";

                    // Dynamic price from quote (Uber or Stuart — no DB price)
                    const isUber = method === "uber";
                    const isStuart = method === "stuart";
                    const isDynamicPrice = isUber || isStuart;
                    let displayPrice: string;
                    let displayPriceClassName: string | undefined;
                    if (isDynamicPrice) {
                      const loading = isUber ? isLoadingQuote : isLoadingStuartQuote;
                      const quote = isUber ? uberQuote : stuartQuote;
                      if (loading) {
                        displayPrice = "...";
                      } else if (quote) {
                        displayPrice = formatPrice(quote.fee, locale);
                      } else {
                        displayPrice = "—";
                        displayPriceClassName = "text-gray-400";
                      }
                    } else if (sm.price === 0) {
                      displayPrice = t("free");
                      displayPriceClassName = "text-green-700";
                    } else {
                      displayPrice = formatPrice(sm.price, locale);
                    }

                    // Replace description with real estimate when available
                    let description: string;
                    if (isUber && uberQuote) {
                      description = `${t("deliveryUberLive", { minutes: uberQuote.duration_minutes })}`;
                    } else if (isStuart && stuartQuote) {
                      description = `${t("deliveryStuartLive", { minutes: stuartQuote.duration_minutes })}`;
                    } else {
                      description = `${t(descKey)}${timeSuffix}`;
                    }

                    // Determine if this dynamic method needs address prompt or has error
                    const needsAddressPrompt = isDynamicPrice && isSelected && !hasHomeAddress;
                    const dynamicQuoteError = isUber && isSelected ? quoteError : isStuart && isSelected ? stuartQuoteError : null;
                    const errorId = isUber ? "uber-quote-error" : "stuart-quote-error";
                    const enterAddressKey = isUber ? "uberEnterAddress" : "stuartEnterAddress";

                    return (
                      <div key={sm.id}>
                        <DeliveryOptionCard
                          selected={isSelected}
                          onClick={() => setSelectedShippingId(sm.id)}
                          icon={icon}
                          title={title}
                          description={description}
                          price={displayPrice}
                          priceClassName={displayPriceClassName}
                        />
                        {needsAddressPrompt && (
                          <p className="mt-1 ml-10 text-xs text-gray-500">
                            {t(enterAddressKey)}
                          </p>
                        )}
                        {dynamicQuoteError && (
                          <div id={errorId} className="mt-2 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                            <span className="mt-0.5 shrink-0 text-red-500">⚠</span>
                            <p className="text-sm text-red-700">
                              {dynamicQuoteError}
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {deliveryMethod === "dpd" && !dpdShop && (
                <div className="mt-4">
                  <DpdParcelShopPicker
                    locale={locale}
                    country={formData.country}
                    onSelect={(shop) => {
                      setDpdShop(shop);
                      clearDpdError();
                    }}
                    selectedShop={dpdShop}
                  />
                  {errors.dpdShop && (
                    <p className="mt-2 text-sm text-red-600">{errors.dpdShop}</p>
                  )}
                </div>
              )}

              <div className="mt-4">
                {renderAddressCard()}
                {(deliveryMethod === "home" || deliveryMethod === "uber" || deliveryMethod === "stuart") && errors.address && !hasHomeAddress && (
                  <p className="mt-2 text-sm text-red-600">{t("errors.required")}</p>
                )}
              </div>
            </div>

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
                  className="mt-6 w-full rounded-full bg-green-700 py-3 font-medium text-white transition hover:bg-green-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting
                    ? t("redirectingToPayment")
                    : t("payButton", { amount: formatPrice(subtotal + shippingCost, locale).replace(" €", "") })}
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
                      {formatPrice(item.price * item.quantity, locale)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t("subtotal")}</span>
                  <span>{formatPrice(subtotal, locale)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">{t("shipping")}</span>
                  <span className={cn(
                    (deliveryMethod === "uber" && !uberQuote) || (deliveryMethod === "stuart" && !stuartQuote)
                      ? "text-gray-400"
                      : shippingCost === 0
                        ? "font-medium text-green-700"
                        : ""
                  )}>
                    {(deliveryMethod === "uber" && !uberQuote)
                      ? isLoadingQuote ? "..." : "—"
                      : (deliveryMethod === "stuart" && !stuartQuote)
                        ? isLoadingStuartQuote ? "..." : "—"
                        : shippingCost === 0
                          ? t("free")
                          : formatPrice(shippingCost, locale)}
                  </span>
                </div>
                {currentDeliveryTime && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">{tCart("delivery")}</span>
                    <span className="text-gray-700">{currentDeliveryTime}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 flex justify-between border-t border-gray-200 pt-4 text-lg font-semibold">
                <span>{t("total")}</span>
                <span>{formatPrice(subtotal + shippingCost, locale)}</span>
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

              <div className="space-y-4 p-5">
                <CheckoutField
                  id="address"
                  label={`${t("fields.address")} *`}
                  value={formData.address}
                  onChange={handleChange}
                  error={errors.address}
                />

                <CheckoutField
                  id="addressLine2"
                  label={t("fields.addressLine2")}
                  value={formData.addressLine2}
                  onChange={handleChange}
                  placeholder={t("fields.addressLine2Placeholder")}
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

                <div className="grid gap-4 sm:grid-cols-2">
                  <CheckoutField
                    id="accessCode"
                    label={t("fields.accessCode")}
                    value={formData.accessCode}
                    onChange={handleChange}
                    placeholder={t("fields.accessCodePlaceholder")}
                  />
                  <div>
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
                    className="h-9 w-full rounded-full border border-gray-200 bg-transparent px-4 py-1 text-base shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring"
                  >
                    {COUNTRY_CODES.map((code) => (
                      <option key={code} value={code}>
                        {t(`countries.${code}`)}
                      </option>
                    ))}
                  </select>
                  </div>
                </div>

                <CheckoutField
                  id="deliveryInstructions"
                  label={t("fields.deliveryInstructions")}
                  value={formData.deliveryInstructions}
                  onChange={handleChange}
                  placeholder={t("fields.deliveryInstructionsPlaceholder")}
                />

                <Button
                  type="button"
                  onClick={() => setShowAddressSheet(false)}
                  className="mt-2 w-full rounded-full bg-green-700 py-3 font-medium text-white transition hover:bg-green-800 active:scale-[0.98]"
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

/* --- Sub-components --- */

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
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-700">
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
      className={cn(
        "flex w-full items-start gap-3 rounded-lg border-2 p-4 text-left transition",
        selected
          ? "border-green-700 bg-green-50"
          : "border-gray-200 hover:border-gray-300"
      )}
    >
      <div
        className={cn(
          "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
          selected ? "border-green-700" : "border-gray-300"
        )}
      >
        {selected && <div className="h-2.5 w-2.5 rounded-full bg-green-700" />}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 text-gray-600">
          {icon}
          <span className="font-medium text-gray-900">{title}</span>
        </div>
        <p className="mt-1 text-xs text-gray-500">{description}</p>
      </div>
      <span className={cn("shrink-0 text-sm font-semibold", priceClassName || "text-gray-900")}>
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
        {subtitle && <p className="mt-1 text-xs text-green-700">{subtitle}</p>}
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
