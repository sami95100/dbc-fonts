"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useCartStore } from "@/stores/cart-store";
import { useAuthStore } from "@/stores/auth-store";
import { createOrder } from "@/lib/api/orders";
import { getProfile } from "@/lib/api/profile";
import { getShippingMethods, getUberQuote, type ShippingMethod, type UberQuote } from "@/lib/api/products";
import { GRADE_ID_TO_API } from "@/components/products/configurator";
import { STORE_ADDRESS } from "@/lib/constants";
import type { DeliveryMethod } from "@/lib/constants";
import type {
  ShippingAddress,
  CreateOrderPayload,
  OrderItem,
  DpdParcelShop,
} from "@/types/order";

const INITIAL_FORM: ShippingAddress = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  addressLine2: "",
  accessCode: "",
  deliveryInstructions: "",
  postalCode: "",
  city: "",
  country: "FR",
};

export function useCheckout() {
  const locale = useLocale();
  const searchParams = useSearchParams();
  const t = useTranslations("checkout");
  const tCart = useTranslations("cart");
  const { items, getSubtotal, setLastOrder, clearLastOrder, getCartFulfillmentType } =
    useCartStore();
  const { user, initialized, getAccessToken } = useAuthStore();

  const orderCompleteRef = useRef(false);

  // Form state
  const [formData, setFormData] = useState<ShippingAddress>(INITIAL_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(
    searchParams.get("cancelled") === "true" ? t("paymentCancelled") : null
  );

  // Delivery state — selection by shipping method ID (UUID)
  const [selectedShippingId, setSelectedShippingId] = useState<string | null>(null);
  const [dpdShop, setDpdShop] = useState<DpdParcelShop | null>(null);
  const [showAddressSheet, setShowAddressSheet] = useState(false);

  // Shipping methods from API
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>([]);
  const [isLoadingShipping, setIsLoadingShipping] = useState(true);

  // Uber Direct quote
  const [uberQuote, setUberQuote] = useState<UberQuote | null>(null);
  const [isLoadingQuote, setIsLoadingQuote] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);

  const fulfillmentType = getCartFulfillmentType();
  const subtotal = getSubtotal();
  const hasHomeAddress = formData.address.trim() !== "" && formData.city.trim() !== "";

  // Fetch shipping methods from API when fulfillment type changes
  useEffect(() => {
    if (!fulfillmentType) return;

    setIsLoadingShipping(true);
    getShippingMethods(fulfillmentType).then(({ data }) => {
      if (data) {
        setShippingMethods(data);
      }
      setIsLoadingShipping(false);
    });
  }, [fulfillmentType]);

  // Derive current method and UX behavior from selected ID
  const currentShippingMethod = shippingMethods.find(
    (m) => m.id === selectedShippingId
  );
  const deliveryMethod: DeliveryMethod = (currentShippingMethod?.method ?? "home") as DeliveryMethod;

  // Compute shipping cost from API data (override with Uber quote if available)
  const shippingCost =
    deliveryMethod === "uber" && uberQuote
      ? uberQuote.fee
      : currentShippingMethod?.price ?? 0;

  // Clear last order on mount
  useEffect(() => {
    clearLastOrder();
  }, [clearLastOrder]);

  // Auto-select first available shipping method when methods load
  useEffect(() => {
    if (shippingMethods.length === 0) return;

    const ids = shippingMethods.map((m) => m.id);
    if (!selectedShippingId || !ids.includes(selectedShippingId)) {
      setSelectedShippingId(ids[0]);
    }
  }, [shippingMethods, selectedShippingId]);

  // Reset DPD shop when country changes
  useEffect(() => {
    setDpdShop(null);
  }, [formData.country]);

  // Fetch Uber quote when address is ready and method is uber
  useEffect(() => {
    if (deliveryMethod !== "uber") {
      setUberQuote(null);
      setQuoteError(null);
      return;
    }
    if (!formData.address.trim() || !formData.postalCode.trim() || !formData.city.trim()) {
      setUberQuote(null);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoadingQuote(true);
      setQuoteError(null);
      const { data, error } = await getUberQuote({
        address: formData.address,
        postal_code: formData.postalCode,
        city: formData.city,
        country: formData.country,
      });
      if (error) {
        setQuoteError(error.error || t("errors.uberQuoteFailed"));
        setUberQuote(null);
      } else if (data) {
        setUberQuote(data);
      }
      setIsLoadingQuote(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [deliveryMethod, formData.address, formData.postalCode, formData.city, formData.country, t]);

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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const clearDpdError = () => {
    if (errors.dpdShop) {
      setErrors((prev) => ({ ...prev, dpdShop: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = t("errors.required");
    if (!formData.lastName.trim()) newErrors.lastName = t("errors.required");

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

    if (deliveryMethod === "home" || deliveryMethod === "uber") {
      if (!formData.address.trim()) newErrors.address = t("errors.required");
      if (!formData.postalCode.trim()) {
        newErrors.postalCode = t("errors.required");
      } else if (formData.country === "FR" && !/^\d{5}$/.test(formData.postalCode)) {
        newErrors.postalCode = t("errors.invalidPostalCode");
      }
      if (!formData.city.trim()) newErrors.city = t("errors.required");
    }

    if (deliveryMethod === "dpd" && !dpdShop) {
      newErrors.dpdShop = t("parcelShopRequired");
    }

    setErrors(newErrors);

    if (
      (deliveryMethod === "home" || deliveryMethod === "uber") &&
      (newErrors.address || newErrors.postalCode || newErrors.city)
    ) {
      setShowAddressSheet(true);
    }

    return Object.keys(newErrors).length === 0;
  };

  const buildPayload = (): CreateOrderPayload => {
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
    // Use dpdShop as primary indicator (more reliable than deliveryMethod which can be stale)
    const hasDpdShop = deliveryMethod === "dpd" && !!dpdShop;

    // Build full address depending on delivery method
    let fullAddress: string;
    let postalCode: string;
    let city: string;
    let country: string;

    if (isPickup) {
      fullAddress = `${STORE_ADDRESS.name}, ${STORE_ADDRESS.address}`;
      postalCode = STORE_ADDRESS.postalCode;
      city = STORE_ADDRESS.city;
      country = STORE_ADDRESS.country;
    } else if (hasDpdShop) {
      fullAddress = `${dpdShop.company}, ${dpdShop.street} ${dpdShop.houseNo}`.trim();
      postalCode = dpdShop.zipCode;
      city = dpdShop.city;
      country = dpdShop.country;
    } else {
      fullAddress = [formData.address, formData.addressLine2].filter(Boolean).join(", ");
      postalCode = formData.postalCode;
      city = formData.city;
      country = formData.country;
    }

    // Build notes from access code and delivery instructions
    const notesParts = [
      formData.accessCode && `Code d'accès: ${formData.accessCode}`,
      formData.deliveryInstructions,
    ].filter(Boolean);

    const carrierId = currentShippingMethod?.carrier_id ?? 0;

    const payload: CreateOrderPayload = {
      customer_name: `${formData.firstName} ${formData.lastName}`,
      customer_email: formData.email,
      customer_phone: formData.phone,
      shipping_address: fullAddress,
      shipping_postal_code: postalCode,
      shipping_city: city,
      shipping_country: country,
      shipping_cost: shippingCost,
      carrier_id: carrierId,
      notes: notesParts.length > 0 ? notesParts.join(" | ") : undefined,
      shipping_method: deliveryMethod,
      items: orderItems,
      locale,
    };

    if (hasDpdShop) {
      payload.dpd_parcel_shop_id = dpdShop.parcelShopId;
      payload.dpd_shipping_address = fullAddress;
      payload.dpd_shipping_postal_code = postalCode;
      payload.dpd_shipping_city = city;
      payload.dpd_shipping_country = country;
    }

    if (deliveryMethod === "uber" && uberQuote) {
      payload.uber_quote_id = uberQuote.quote_id;
      payload.shipping_cost = uberQuote.fee;
    }

    payload.order_type = fulfillmentType;

    return payload;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validateForm()) return;

    // Uber: ensure we have a valid (non-expired) quote
    let freshUberQuote = uberQuote;
    if (deliveryMethod === "uber") {
      if (!freshUberQuote) {
        // Show error at the Uber card level and scroll to it
        if (!quoteError) {
          setQuoteError(t("errors.uberQuoteRequired"));
        }
        setTimeout(() => {
          document.getElementById("uber-quote-error")?.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
        return;
      }
      if (new Date(freshUberQuote.expires_at) <= new Date()) {
        // Quote expired — refresh it
        setIsSubmitting(true);
        const { data, error } = await getUberQuote({
          address: formData.address,
          postal_code: formData.postalCode,
          city: formData.city,
          country: formData.country,
        });
        if (error || !data) {
          setQuoteError(error?.error || t("errors.uberQuoteFailed"));
          setIsSubmitting(false);
          // Scroll to the quote error after it renders
          setTimeout(() => {
            document.getElementById("uber-quote-error")?.scrollIntoView({ behavior: "smooth", block: "center" });
          }, 100);
          return;
        }
        freshUberQuote = data;
        setUberQuote(data);
      }
    }

    setIsSubmitting(true);

    try {
      const payload = buildPayload();
      // Override with fresh uber quote data (state might not be updated yet)
      if (deliveryMethod === "uber" && freshUberQuote) {
        payload.uber_quote_id = freshUberQuote.quote_id;
        payload.shipping_cost = freshUberQuote.fee;
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
        shippingCost,
        deliveryMethod,
      });

      window.location.href = response.data.checkout_url;
    } catch {
      setSubmitError(t("errors.submitFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    // Data
    items,
    locale,
    subtotal,
    fulfillmentType,

    // Form
    formData,
    errors,
    handleChange,

    // Delivery
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

    // Address sheet
    showAddressSheet,
    setShowAddressSheet,
    hasHomeAddress,

    // Submit
    isSubmitting,
    submitError,
    handleSubmit,

    // Uber Direct
    uberQuote,
    isLoadingQuote,
    quoteError,

    // Ref for empty cart guard
    orderCompleteRef,
  };
}
