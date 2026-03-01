"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem } from "@/types/cart";
import type { DeliveryMethod } from "@/lib/constants";

export interface LastOrder {
  orderNumber: string;
  items: {
    name: string;
    storage: string;
    color: string;
    grade: string;
    battery: "standard" | "new";
    price: number;
    quantity: number;
    imageUrl?: string;
  }[];
  subtotal: number;
  shippingCost: number;
  deliveryMethod: DeliveryMethod;
}

interface CartState {
  items: CartItem[];
  lastOrder: LastOrder | null;
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  setLastOrder: (order: LastOrder) => void;
  clearLastOrder: () => void;
  getItemCount: () => number;
  getSubtotal: () => number;
  getCartFulfillmentType: () => "foxway_direct" | "foxway_shop" | "shop_stock";
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      lastOrder: null,

      addItem: (item) => {
        const id = crypto.randomUUID();
        set((state) => ({
          items: [...state.items, { ...item, id }],
        }));
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        if (quantity < 1) return;
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => set({ items: [] }),

      setLastOrder: (order) => set({ lastOrder: order }),

      clearLastOrder: () => set({ lastOrder: null }),

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
      },

      getCartFulfillmentType: () => {
        const items = get().items;
        if (items.length === 0) return "foxway_direct";
        // If any item needs shop processing, the whole cart is shop-based
        const hasShop = items.some(
          (item) =>
            item.fulfillmentType === "foxway_shop" ||
            item.fulfillmentType === "shop_stock" ||
            item.needsShopProcessing ||
            item.batteryFallback
        );
        if (hasShop) {
          // If any item is from shop_stock, use shop_stock; otherwise foxway_shop
          const hasShopStock = items.some(
            (item) => item.fulfillmentType === "shop_stock"
          );
          return hasShopStock ? "shop_stock" : "foxway_shop";
        }
        return "foxway_direct";
      },
    }),
    {
      name: "dbc-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items, lastOrder: state.lastOrder }),
    }
  )
);

// Selector hooks for optimized re-renders
export const useCartItems = () => useCartStore((state) => state.items);
export const useCartItemCount = () => useCartStore((state) => state.getItemCount());
export const useCartSubtotal = () => useCartStore((state) => state.getSubtotal());
export const useCartActions = () =>
  useCartStore((state) => ({
    addItem: state.addItem,
    removeItem: state.removeItem,
    updateQuantity: state.updateQuantity,
    clearCart: state.clearCart,
  }));
