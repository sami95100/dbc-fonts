import { publicApi } from "./client";

// ==================================
// Types
// ==================================

export interface ReviewOrderItem {
  item_id: string;
  product_name: string;
  color: string;
  grade: string;
  storage: string;
  image_url: string;
  model_id: string | null;
}

export interface ReviewOrderData {
  order_id: string;
  order_number: string;
  customer_name: string;
  items: ReviewOrderItem[];
  already_reviewed: boolean;
}

export interface SubmitReviewPayload {
  order_id: string;
  sig: string;
  reviews: {
    model_id: string;
    rating: number;
    title?: string;
    content?: string;
  }[];
}

export interface SubmitReviewResponse {
  created: number;
}

// ==================================
// API Functions
// ==================================

/**
 * Recupere les produits d'une commande pour le formulaire d'avis.
 */
export async function getOrderItemsForReview(orderId: string, sig: string) {
  return publicApi.get<ReviewOrderData>(
    `/reviews/order-items?order_id=${encodeURIComponent(orderId)}&sig=${encodeURIComponent(sig)}`
  );
}

/**
 * Soumet les avis client pour une commande.
 */
export async function submitReviews(payload: SubmitReviewPayload) {
  return publicApi.post<SubmitReviewResponse>("/reviews/submit", payload);
}
