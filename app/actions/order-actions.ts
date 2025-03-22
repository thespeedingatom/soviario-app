"use server"

import { createServerSupabaseClient } from "@/lib/supabase"
import type { Order } from "@/lib/db-service"

export async function fetchUserOrders(userId: string): Promise<Order[]> {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        items:order_items(*)
      `)
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching orders:", error)
      return []
    }

    return data as Order[]
  } catch (error) {
    console.error("Error in fetchUserOrders:", error)
    return []
  }
}

export async function fetchOrderById(orderId: string): Promise<Order | null> {
  try {
    const supabase = createServerSupabaseClient()

    const { data, error } = await supabase
      .from("orders")
      .select(`
        *,
        items:order_items(*)
      `)
      .eq("id", orderId)
      .single()

    if (error) {
      console.error("Error fetching order:", error)
      return null
    }

    return data as Order
  } catch (error) {
    console.error("Error in fetchOrderById:", error)
    return null
  }
}

