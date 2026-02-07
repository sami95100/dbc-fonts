import { api, publicApi } from "./client";
import type {
  CreateOrderPayload,
  CreateOrderResponse,
  Order,
  OrderItem,
} from "@/types/order";

interface OrderDetailResponse {
  order: Order;
  items: OrderItem[];
}

export async function createOrder(payload: CreateOrderPayload) {
  return publicApi.post<CreateOrderResponse>("/orders", payload);
}

export async function getOrder(orderId: string) {
  return api.get<OrderDetailResponse>(`/orders/${orderId}`);
}

interface CarriersResponse {
  Id: number;
  Name: string;
}

export async function getCarriers() {
  return api.get<CarriersResponse[]>("/foxway/carriers");
}
