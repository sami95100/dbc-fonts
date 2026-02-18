import Image from "next/image";
import { useLocale } from "next-intl";
import { Package } from "lucide-react";
import type { OrderItem } from "@/types/order";

interface OrderItemRowProps {
  item: OrderItem;
}

export default function OrderItemRow({ item }: OrderItemRowProps) {
  const locale = useLocale();

  return (
    <div className="flex items-center gap-3">
      <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
        {item.image_url ? (
          <Image
            src={item.image_url}
            alt={item.product_name}
            fill
            className="object-contain p-1"
            sizes="56px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <Package className="h-5 w-5 text-gray-300" />
          </div>
        )}
      </div>

      <div className="flex flex-1 items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate font-medium text-gray-900 text-sm">
            {item.product_name}
            {item.quantity > 1 && (
              <span className="text-gray-500"> x{item.quantity}</span>
            )}
          </p>
          <p className="text-xs text-gray-500">
            {[item.storage, item.color].filter(Boolean).join(" - ")}
          </p>
        </div>
        <span className="flex-shrink-0 font-semibold text-gray-900 text-sm">
          {(item.unit_price * item.quantity).toLocaleString(locale)} &euro;
        </span>
      </div>
    </div>
  );
}
