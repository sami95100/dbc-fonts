"use client";

import { memo } from "react";
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
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
      />
    </svg>
  );
}

export function ReturnIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  );
}

export function ShieldIcon({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
      />
    </svg>
  );
}
