import { api, publicApi, publicApiWithAuth } from "./client";
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

export interface MyOrdersResponse {
  orders: (Order & { items: OrderItem[] })[];
  total: number;
  page: number;
  pages: number;
  per_page: number;
}

export async function getMyOrders(
  accessToken: string,
  page: number = 1,
  perPage: number = 10
) {
  return publicApiWithAuth(accessToken).get<MyOrdersResponse>(
    `/my-orders?page=${page}&per_page=${perPage}`
  );
}
