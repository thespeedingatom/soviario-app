"use server";

import { fetchSaleorProducts, fetchSaleorProductBySlug, createSaleorOrder, getSaleorOrderById, getSaleorUserOrders, updateSaleorOrderStatus } from "@/domains/saleor/services/saleorApi";

/**
 * Server action to fetch all products from Saleor
 */
export async function fetchAllProductsFromSaleor() {
  return await fetchSaleorProducts();
}

/**
 * Server action to fetch a specific product by slug from Saleor
 */
export async function fetchProductBySlugFromSaleor(slug: string) {
  return await fetchSaleorProductBySlug(slug);
}

/**
 * Server action to create an order in Saleor
 */
export async function createOrderInSaleor(userId: string, items: any[], discount = 0) {
  return await createSaleorOrder(userId, items, discount);
}

/**
 * Server action to fetch an order by ID from Saleor
 */
export async function fetchOrderByIdFromSaleor(orderId: string) {
  return await getSaleorOrderById(orderId);
}

/**
 * Server action to fetch user orders from Saleor
 */
export async function fetchUserOrdersFromSaleor(userId: string) {
  return await getSaleorUserOrders(userId);
}

/**
 * Server action to update order status in Saleor
 */
export async function updateOrderStatusInSaleor(orderId: string, status: string) {
  return await updateSaleorOrderStatus(orderId, status);
}
