"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/stores/cart-store";

export function useStripeConfirmation(sessionId: string | null) {
  const clearCart = useCartStore((state) => state.clearCart);

  const [orderNumber, setOrderNumber] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(!!sessionId);
  const [verifyError, setVerifyError] = useState(false);

  useEffect(() => {
    if (!sessionId) return;

    const verify = async () => {
      try {
        const res = await fetch(
          `/api/verify-session?session_id=${encodeURIComponent(sessionId)}`
        );
        const data = await res.json();

        if (data.payment_status === "paid" && data.order_number) {
          setOrderNumber(data.order_number);
          clearCart();
        } else {
          setVerifyError(true);
        }
      } catch {
        setVerifyError(true);
      } finally {
        setIsVerifying(false);
      }
    };

    verify();
  }, [sessionId, clearCart]);

  return { orderNumber, isVerifying, verifyError };
}
