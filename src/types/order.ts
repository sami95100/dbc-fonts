export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  addressLine2: string;
  accessCode: string;
  deliveryInstructions: string;
  postalCode: string;
  city: string;
  country: string;
}

export interface OrderItem {
  variant_id: string;
  sku: string;
  product_name: string;
  storage: string;
  color: string;
  grade: string;
  battery: "standard" | "new";
  unit_price: number;
  quantity: number;
  image_url?: string;
  foxway_sku?: string;
  battery_fallback?: boolean;
  needs_shop_processing?: boolean;
}

export interface CreateOrderPayload {
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  shipping_postal_code: string;
  shipping_city: string;
  shipping_country: string;
  shipping_cost: number;
  carrier_id?: number;
  dpd_parcel_shop_id?: string;
  dpd_shipping_address?: string;
  dpd_shipping_postal_code?: string;
  dpd_shipping_city?: string;
  dpd_shipping_country?: string;
  uber_quote_id?: string;
  notes?: string;
  locale?: string;
  items: OrderItem[];
}

export interface DpdParcelShop {
  parcelShopId: string;
  company: string;
  street: string;
  houseNo: string;
  zipCode: string;
  city: string;
  country: string;
}

export interface Order {
  id: string;
  order_number: string;
  delivery_type: "dropshipping" | "shop";
  status: OrderStatus;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  shipping_postal_code: string;
  shipping_city: string;
  shipping_country: string;
  subtotal: number;
  shipping_cost: number;
  total: number;
  foxway_order_id?: number;
  foxway_reference?: string;
  foxway_status?: number;
  foxway_tracking_codes?: string[];
  uber_delivery_id?: string;
  uber_status?: string;
  uber_tracking_url?: string;
  uber_fee?: number;
  uber_courier_name?: string;
  uber_eta?: string;
  created_at: string;
  shipped_at?: string;
  delivered_at?: string;
}

export type OrderStatus =
  | "pending_payment"
  | "pending"
  | "confirmed"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export interface CreateOrderResponse {
  success: boolean;
  order: {
    id: string;
    order_number: string;
  };
  delivery_type: "dropshipping" | "shop";
  checkout_url: string;
}
