"use client"

import { useState, useEffect } from "react"
import { NeoButton } from "@/components/ui/neo-button"
import { NeoCard } from "@/components/ui/neo-card"
import { NeoBanner } from "@/components/ui/neo-banner"
import { NeoBadge } from "@/components/ui/neo-badge"
import { Package, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { getUserOrders, type Order } from "@/lib/db-service"
import { useAuth } from "@/contexts/auth-context"

export default function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchOrders() {
      if (user?.id) {
        try {
          setIsLoading(true)
          const userOrders = await getUserOrders(user.id)
          setOrders(userOrders)
        } catch (error) {
          console.error("Error fetching orders:", error)
          // Set orders to empty array on error
          setOrders([])
        } finally {
          setIsLoading(false)
        }
      } else {
        // If no user, set loading to false
        setIsLoading(false)
      }
    }

    fetchOrders()
  }, [user])

  // Helper function to format status badge
  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <NeoBadge color="yellow">PENDING</NeoBadge>
      case "processing":
        return <NeoBadge color="blue">PROCESSING</NeoBadge>
      case "completed":
        return <NeoBadge color="green">COMPLETED</NeoBadge>
      case "cancelled":
        return <NeoBadge color="red">CANCELLED</NeoBadge>
      case "refunded":
        return <NeoBadge color="purple">REFUNDED</NeoBadge>
      default:
        return <NeoBadge color="gray">UNKNOWN</NeoBadge>
    }
  }

  return (
    <div className="flex flex-col">
      <NeoBanner color="yellow">ORDERS • PURCHASE HISTORY • TRACK STATUS</NeoBanner>

      {/* Orders Header */}
      <section className="bg-[#FFE566] py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-block bg-black px-4 py-2 text-sm font-bold uppercase text-white">DASHBOARD</div>
              <h1 className="mt-4 text-4xl font-black uppercase tracking-tight">YOUR ORDERS</h1>
              <div className="mt-2 h-1 w-32 bg-black"></div>
            </div>

            <div className="mt-4 flex gap-4 md:mt-0">
              <Link href="/dashboard">
                <NeoButton variant="outline">
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Back to Dashboard
                </NeoButton>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Orders Content */}
      <section className="py-8">
        <div className="container">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <NeoCard>
                    <div className="h-32 w-full"></div>
                  </NeoCard>
                </div>
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                <Package className="h-12 w-12 text-muted-foreground" />
              </div>

              <h2 className="text-2xl font-bold">No orders yet</h2>
              <p className="mt-2 text-muted-foreground">
                You haven't placed any orders yet. Browse our eSIM plans to get started.
              </p>

              <div className="mt-8">
                <Link href="/plans">
                  <NeoButton>Browse eSIM Plans</NeoButton>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <NeoCard key={order.id} color="yellow">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-xl font-bold">Order #{order.id.slice(0, 8)}</h3>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Placed on {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <span className="text-xl font-bold">${order.total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-dashed border-black pt-4">
                    <h4 className="font-bold">Items:</h4>
                    <ul className="mt-2 space-y-2">
                      {order.items?.map((item) => (
                        <li key={item.id} className="flex justify-between">
                          <div>
                            <span>
                              {item.name} - {item.duration}
                            </span>
                            <span className="ml-2 text-sm text-muted-foreground">Qty: {item.quantity}</span>
                          </div>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="mt-4">
                    <Link href={`/dashboard/orders/${order.id}`}>
                      <NeoButton variant="outline" className="w-full">
                        View Order Details
                      </NeoButton>
                    </Link>
                  </div>
                </NeoCard>
              ))}
            </div>
          )}
        </div>
      </section>

      <NeoBanner color="black">VIEW ORDERS • TRACK STATUS • MANAGE PURCHASES</NeoBanner>
    </div>
  )
}

