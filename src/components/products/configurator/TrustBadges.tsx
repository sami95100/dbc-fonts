"use client";

import { memo } from "react";
import { Truck, RotateCcw, ShieldCheck } from "lucide-react";
import type { TrustBadgesProps } from "./types";

/**
 * TrustBadges - Trust/guarantee badges display
 *
 * Shows trust indicators like free shipping, returns, warranty, etc.
 * Each badge has an icon, title, and optional subtitle.
 *
 * @example
 * <TrustBadges
 *   items={[
 *     { icon: <TruckIcon />, title: "Free shipping", subtitle: "2-3 days" },
 *     { icon: <ShieldIcon />, title: "12-month warranty" },
 *   ]}
 * />
 */
function TrustBadgesComponent({ items }: TrustBadgesProps) {
  if (items.length === 0) return null;

  return (
    <div className="space-y-3" role="list" aria-label="Trust badges">
      {items.map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-3 rounded-xl bg-gray-50 p-4"
          role="listitem"
        >
          <div className="shrink-0 text-gray-600">{item.icon}</div>
          <div className="min-w-0">
            <p className="font-medium text-gray-900">{item.title}</p>
            {item.subtitle && (
              <p className="text-sm text-gray-500">{item.subtitle}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export const TrustBadges = memo(TrustBadgesComponent);

// ============================================
// Icon Components for TrustBadges
// ============================================

export function DeliveryIcon({ className = "h-6 w-6" }: { className?: string }) {
  return <Truck className={className} aria-hidden="true" />;
}

export function ReturnIcon({ className = "h-6 w-6" }: { className?: string }) {
  return <RotateCcw className={className} aria-hidden="true" />;
}

export function ShieldIcon({ className = "h-6 w-6" }: { className?: string }) {
  return <ShieldCheck className={className} aria-hidden="true" />;
}
