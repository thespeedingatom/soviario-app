import { createServerSupabaseClient } from "./supabase-server"
import type { CartItem } from "@/contexts/cart-context"

// Types
export type Order = {
  id: string
  user_id: string
  stripe_checkout_id?: string
  stripe_payment_intent_id?: string
  status: "pending" | "processing" | "completed" | "cancelled" | "refunded"
  total: number
  discount: number
  created_at: string
  updated_at: string
  items?: OrderItem[]
}

export type OrderItem = {
  id: string
  order_id: string
  product_id: string
  name: string
  price: number
  quantity: number
  region?: string
  data?: string
  duration?: string
}

export type PaymentMethod = {
  id: string
  user_id: string
  stripe_payment_method_id: string
  card_brand?: string
  card_last4?: string
  is_default: boolean
  created_at: string
}

// Order CRUD operations
export async function createOrder(userId: string, items: CartItem[], discount = 0) {
  const supabase = createServerSupabaseClient()

  // Calculate total
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0) - discount

  // Create order
  const { data: order, error } = await supabase
    .from("orders")
    .insert({
      user_id: userId,
      total,
      discount,
      status: "pending",
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Error creating order: ${error.message}`)
  }

  // Create order items
  const orderItems = items.map((item) => ({
    order_id: order.id,
    product_id: item.id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
    region: item.region,
    data: item.data,
    duration: item.duration,
  }))

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

  if (itemsError) {
    throw new Error(`Error creating order items: ${itemsError.message}`)
  }

  return { ...order, items: orderItems }
}

export async function getOrderById(orderId: string) {
  const supabase = createServerSupabaseClient()

  // Get order
  const { data: order, error } = await supabase.from("orders").select("*").eq("id", orderId).single()

  if (error) {
    throw new Error(`Error fetching order: ${error.message}`)
  }

  // Get order items
  const { data: items, error: itemsError } = await supabase.from("order_items").select("*").eq("order_id", orderId)

  if (itemsError) {
    throw new Error(`Error fetching order items: ${itemsError.message}`)
  }

  return { ...order, items }
}

// Update the getUserOrders function to handle errors better and provide fallbacks
export async function getUserOrders(userId: string) {
  const supabase = createServerSupabaseClient()

  try {
    // Get orders
    const { data: orders, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error(`Error fetching orders for user ${userId}:`, error)
      return [] // Return empty array instead of throwing error
    }

    // If no orders, return empty array
    if (!orders || orders.length === 0) {
      return []
    }

    // Get order items for each order
    const ordersWithItems = await Promise.all(
      orders.map(async (order) => {
        try {
          const { data: items, error: itemsError } = await supabase
            .from("order_items")
            .select("*")
            .eq("order_id", order.id)

          if (itemsError) {
            console.error(`Error fetching items for order ${order.id}:`, itemsError)
            return { ...order, items: [] }
          }

          return { ...order, items: items || [] }
        } catch (itemError) {
          console.error(`Error processing items for order ${order.id}:`, itemError)
          return { ...order, items: [] }
        }
      }),
    )

    return ordersWithItems
  } catch (error) {
    console.error("Error in getUserOrders:", error)
    return [] // Return empty array on any error
  }
}

export async function updateOrderStatus(orderId: string, status: Order["status"]) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("orders")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId)
    .select()
    .single()

  if (error) {
    throw new Error(`Error updating order status: ${error.message}`)
  }

  return data
}

export async function updateOrderStripeIds(orderId: string, stripeCheckoutId?: string, stripePaymentIntentId?: string) {
  const supabase = createServerSupabaseClient()

  const updates: any = { updated_at: new Date().toISOString() }
  if (stripeCheckoutId) updates.stripe_checkout_id = stripeCheckoutId
  if (stripePaymentIntentId) updates.stripe_payment_intent_id = stripePaymentIntentId

  const { data, error } = await supabase.from("orders").update(updates).eq("id", orderId).select().single()

  if (error) {
    throw new Error(`Error updating order Stripe IDs: ${error.message}`)
  }

  return data
}

// Payment Method CRUD operations
export async function savePaymentMethod(
  userId: string,
  stripePaymentMethodId: string,
  cardBrand?: string,
  cardLast4?: string,
  isDefault = false,
) {
  const supabase = createServerSupabaseClient()

  // If this is the default payment method, unset any existing defaults
  if (isDefault) {
    await supabase.from("customer_payment_methods").update({ is_default: false }).eq("user_id", userId)
  }

  const { data, error } = await supabase
    .from("customer_payment_methods")
    .insert({
      user_id: userId,
      stripe_payment_method_id: stripePaymentMethodId,
      card_brand: cardBrand,
      card_last4: cardLast4,
      is_default: isDefault,
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Error saving payment method: ${error.message}`)
  }

  return data
}

export async function getUserPaymentMethods(userId: string) {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("customer_payment_methods")
    .select("*")
    .eq("user_id", userId)
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false })

  if (error) {
    throw new Error(`Error fetching payment methods: ${error.message}`)
  }

  return data
}

export async function deletePaymentMethod(paymentMethodId: string) {
  const supabase = createServerSupabaseClient()

  const { error } = await supabase.from("customer_payment_methods").delete().eq("id", paymentMethodId)

  if (error) {
    throw new Error(`Error deleting payment method: ${error.message}`)
  }

  return true
}

export async function setDefaultPaymentMethod(userId: string, paymentMethodId: string) {
  const supabase = createServerSupabaseClient()

  // Unset any existing defaults
  await supabase.from("customer_payment_methods").update({ is_default: false }).eq("user_id", userId)

  // Set the new default
  const { data, error } = await supabase
    .from("customer_payment_methods")
    .update({ is_default: true })
    .eq("id", paymentMethodId)
    .eq("user_id", userId)
    .select()
    .single()

  if (error) {
    throw new Error(`Error setting default payment method: ${error.message}`)
  }

  return data
}

