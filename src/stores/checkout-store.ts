"use client";

import { create } from "zustand";
import type { ShippingAddress } from "@/types/order";

type CheckoutStep = "address" | "payment" | "confirmation";

interface CheckoutState {
  step: CheckoutStep;
  shippingAddress: ShippingAddress | null;
  paymentIntentId: string | null;
  orderId: string | null;
  orderNumber: string | null;

  setStep: (step: CheckoutStep) => void;
  setShippingAddress: (address: ShippingAddress) => void;
  setPaymentIntent: (id: string) => void;
  setOrder: (id: string, number: string) => void;
  reset: () => void;
}

const initialState = {
  step: "address" as CheckoutStep,
  shippingAddress: null,
  paymentIntentId: null,
  orderId: null,
  orderNumber: null,
};

export const useCheckoutStore = create<CheckoutState>()((set) => ({
  ...initialState,

  setStep: (step) => set({ step }),

  setShippingAddress: (address) =>
    set({ shippingAddress: address, step: "payment" }),

  setPaymentIntent: (id) => set({ paymentIntentId: id }),

  setOrder: (id, number) =>
    set({ orderId: id, orderNumber: number, step: "confirmation" }),

  reset: () => set(initialState),
}));
