"use server";

import { getMayaProducts, provisionMayaEsim, getMayaProductById } from "@/domains/maya/services/mayaApi";

/**
 * Server action to fetch all Maya Mobile products
 */
export async function getMayaProductsAction() {
  return await getMayaProducts();
}

/**
 * Server action to provision an eSIM for a given order and product
 */
export async function provisionAndRecordMayaEsim(orderId: string, productSlug: string) {
  return await provisionMayaEsim(orderId, productSlug);
}

/**
 * Server action to fetch a specific Maya Mobile product by ID
 */
export async function getMayaProductByIdAction(id: string) {
  return await getMayaProductById(id);
}
