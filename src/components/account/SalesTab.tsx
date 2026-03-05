"use client";

import { useState, useEffect, useCallback } from "react";
import { useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/utils";
import { Loader2, Package, ArrowLeftRight } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { getMyBuybackOrders } from "@/lib/api/buyback";
import type { BuybackOrder } from "@/types/buyback";

const STATUS_LABELS: Record<string, string> = {
  confirmed: "Confirme",
  shipping: "Expedition",
  delivered: "Livre",
  paid: "Paiement effectue",
};

const STATUS_COLORS: Record<string, string> = {
  confirmed: "bg-blue-100 text-blue-700",
  shipping: "bg-yellow-100 text-yellow-800",
  delivered: "bg-green-100 text-green-700",
  paid: "bg-green-200 text-green-800",
};

export function SalesTab() {
  const locale = useLocale();
  const { getAccessToken } = useAuthStore();
  const [orders, setOrders] = useState<BuybackOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    const token = getAccessToken();
    if (!token) { setLoading(false); return; }
    const { data } = await getMyBuybackOrders(token);
    if (data) setOrders(data);
    setLoading(false);
  }, [getAccessToken]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <Package className="h-8 w-8 text-gray-400" />
        </div>
        <p className="mb-2 text-base font-semibold text-gray-900">
          Aucune revente en cours
        </p>
        <p className="mb-4 text-sm text-gray-500">
          Estimez la valeur de votre telephone et vendez-le en quelques clics.
        </p>
        <Link
          href={`/${locale}/reprise`}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-white transition hover:bg-primary/90"
        >
          <ArrowLeftRight className="h-4 w-4" />
          Revendre un appareil
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div
          key={order.id}
          className="rounded-lg border border-gray-200 bg-white p-5"
        >
          <div className="flex items-start gap-4">
            {order.image_url ? (
              <div className="relative h-16 w-16 shrink-0">
                <Image
                  src={order.image_url}
                  alt={order.model_name}
                  fill
                  className="object-contain"
                  sizes="64px"
                />
              </div>
            ) : (
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gray-100">
                <Package className="h-6 w-6 text-gray-400" />
              </div>
            )}
            <div className="flex-1">
              <p className="text-xs text-gray-500">
                N de reprise : {order.reference}
              </p>
              <span className={cn("mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-bold", STATUS_COLORS[order.status])}>
                {STATUS_LABELS[order.status]}
              </span>
              <p className="mt-1 text-sm font-bold text-gray-900">
                {order.model_name} {order.storage}
              </p>
              <p className="text-sm font-bold text-primary">
                {formatPrice(order.price)}
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className="mt-4 border-t border-gray-100 pt-4">
            <div className="flex flex-col gap-2">
              {(["confirmed", "shipping", "delivered", "paid"] as const).map((status, i) => {
                const isActive = ["confirmed", "shipping", "delivered", "paid"].indexOf(order.status) >= i;
                return (
                  <div key={status} className="flex items-center gap-3">
                    <div className={cn(
                      "h-2.5 w-2.5 rounded-full",
                      isActive ? "bg-primary" : "bg-gray-200"
                    )} />
                    <span className={cn(
                      "text-xs",
                      isActive ? "font-medium text-gray-900" : "text-gray-400"
                    )}>
                      {STATUS_LABELS[status]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
