export interface CartItem {
  id: string;
  variantId: string;
  sku: string;
  foxwaySku?: string;
  model: string;
  modelId: string;
  storage: string;
  color: string;
  grade: string;
  battery: "standard" | "new";
  batteryFallback: boolean;
  needsShopProcessing: boolean;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
}
