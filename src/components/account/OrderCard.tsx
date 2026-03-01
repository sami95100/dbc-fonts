import { useLocale, useTranslations } from "next-intl";
import { Package } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Order, OrderItem, OrderStatus } from "@/types/order";
import OrderItemRow from "./OrderItemRow";

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending_payment: "bg-yellow-50 text-yellow-700",
  pending: "bg-highlight/10 text-highlight-foreground",
  confirmed: "bg-blue-50 text-blue-700",
  processing: "bg-blue-50 text-blue-700",
  ready_for_pickup: "bg-green-50 text-green-700",
  shipped: "bg-purple-50 text-purple-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-700",
};

interface OrderCardProps {
  order: Order & { items: OrderItem[] };
}

export default function OrderCard({ order }: OrderCardProps) {
  const locale = useLocale();
  const t = useTranslations("account");

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <Package className="h-5 w-5 text-gray-400" />
            <span className="font-medium text-gray-900">
              {t("page.orderNumber")} {order.order_number}
            </span>
            <span
              className={cn(
                "rounded-full px-2.5 py-0.5 text-xs font-medium",
                STATUS_STYLES[order.status as OrderStatus] ??
                  "bg-gray-100 text-gray-800"
              )}
            >
              {t(`status.${order.status}`)}
            </span>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {new Date(order.created_at).toLocaleDateString(
              locale === "fr" ? "fr-FR" : "en-GB",
              { day: "numeric", month: "long", year: "numeric" }
            )}
          </p>
        </div>
        <p className="text-lg font-semibold text-gray-900">
          {order.total.toLocaleString(locale)} &euro;
        </p>
      </div>

      {order.items && order.items.length > 0 && (
        <div className="mt-4 border-t border-gray-100 pt-3">
          <p className="mb-2 text-xs font-medium text-gray-500">
            {t("page.orderItems")} ({order.items.length})
          </p>
          <div className="space-y-2">
            {order.items.map((item, idx) => (
              <OrderItemRow key={idx} item={item} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
