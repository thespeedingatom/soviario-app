"use client"

import { useState, useEffect } from "react"
import { NeoButton } from "@/components/ui/neo-button"
import { NeoCard } from "@/components/ui/neo-card"
import { NeoBanner } from "@/components/ui/neo-banner"
import { NeoBadge } from "@/components/ui/neo-badge"
import { ArrowLeft, Package, Download, Clock, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"
import type { Order } from "@/lib/db-service"
import { fetchOrderById } from "@/app/_actions/order-actions"

export default function OrderDetailPage() {
  const { id } = useParams()
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function getOrder() {
      if (id) {
        try {
          setIsLoading(true)
          const orderData = await fetchOrderById(id as string)
          setOrder(orderData)
        } catch (error) {
          console.error("Error fetching order:", error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    getOrder()
  }, [id])

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

  // Helper function to get status icon
  const getStatusIcon = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <Clock className="h-6 w-6 text-yellow-500" />
      case "processing":
        return <Clock className="h-6 w-6 text-blue-500" />
      case "completed":
        return <CheckCircle className="h-6 w-6 text-green-500" />
      case "cancelled":
        return <XCircle className="h-6 w-6 text-red-500" />
      case "refunded":
        return <XCircle className="h-6 w-6 text-purple-500" />
      default:
        return <Package className="h-6 w-6" />
    }
  }

  return (
    <div className="flex flex-col">
      <NeoBanner color="yellow">ORDER DETAILS • PURCHASE INFORMATION • TRACK STATUS</NeoBanner>

      {/* Order Header */}
      <section className="bg-[#FFE566] py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-block bg-black px-4 py-2 text-sm font-bold uppercase text-white">
                ORDER DETAILS
              </div>
              <h1 className="mt-4 text-4xl font-black uppercase tracking-tight">
                {isLoading ? "LOADING..." : `ORDER #${(order?.id || "").slice(0, 8)}`}
              </h1>
              <div className="mt-2 h-1 w-32 bg-black"></div>
            </div>

            <div className="mt-4 flex gap-4 md:mt-0">
              <Link href="/dashboard/orders">
                <NeoButton variant="outline">
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Back to Orders
                </NeoButton>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Order Content */}
      <section className="py-8">
        <div className="container max-w-4xl">
          {isLoading ? (
            <div className="animate-pulse">
              <NeoCard>
                <div className="h-64 w-full"></div>
              </NeoCard>
            </div>
          ) : !order ? (
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                <Package className="h-12 w-12 text-muted-foreground" />
              </div>

              <h2 className="text-2xl font-bold">Order not found</h2>
              <p className="mt-2 text-muted-foreground">We couldn't find the order you're looking for.</p>

              <div className="mt-8">
                <Link href="/dashboard/orders">
                  <NeoButton>View All Orders</NeoButton>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <NeoCard color="yellow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(order.status)}
                    <div>
                      <h2 className="text-xl font-bold">Order Status</h2>
                      <div className="mt-1">{getStatusBadge(order.status)}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Order Date</div>
                    <div className="font-bold">{new Date(order.created_at).toLocaleDateString()}</div>
                  </div>
                </div>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <div>
                    <h3 className="font-bold">Order Information</h3>
                    <div className="mt-2 rounded-lg bg-muted p-4">
                      <div className="flex justify-between">
                        <span>Order ID:</span>
                        <span className="font-mono">{order.id.slice(0, 8)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Payment Status:</span>
                        <span>{order.status === "pending" ? "Awaiting Payment" : "Paid"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Last Updated:</span>
                        <span>{new Date(order.updated_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold">Order Summary</h3>
                    <div className="mt-2 rounded-lg bg-muted p-4">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>${(order.total + order.discount).toFixed(2)}</span>
                      </div>
                      {order.discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount:</span>
                          <span>-${order.discount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between border-t border-dashed border-black pt-2 font-bold">
                        <span>Total:</span>
                        <span>${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </NeoCard>

              <NeoCard>
                <h3 className="text-xl font-bold">Order Items</h3>
                <div className="mt-4 overflow-hidden border-4 border-black">
                  <table className="w-full">
                    <thead className="bg-black text-white">
                      <tr>
                        <th className="p-4 text-left">Product</th>
                        <th className="p-4 text-left">Details</th>
                        <th className="p-4 text-left">Price</th>
                        <th className="p-4 text-left">Quantity</th>
                        <th className="p-4 text-left">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {order.items?.map((item) => (
                        <tr key={item.id} className="border-b border-black last:border-b-0">
                          <td className="p-4 font-bold">{item.name}</td>
                          <td className="p-4">
                            <div>{item.duration}</div>
                            {item.data && <div>{item.data}</div>}
                            {item.region && <div>{item.region}</div>}
                          </td>
                          <td className="p-4">${item.price.toFixed(2)}</td>
                          <td className="p-4">{item.quantity}</td>
                          <td className="p-4 font-bold">${(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </NeoCard>

              {order.status === "completed" && (
                <NeoCard color="green">
                  <h3 className="text-xl font-bold">eSIM Downloads</h3>
                  <p className="mt-2">
                    Your eSIMs are ready to download. Click the button below to download your eSIM QR codes.
                  </p>
                  <div className="mt-4">
                    <NeoButton className="flex items-center gap-2">
                      <Download className="h-5 w-5" />
                      Download eSIM QR Codes
                    </NeoButton>
                  </div>
                </NeoCard>
              )}

              <div className="flex justify-center">
                <Link href="/contact">
                  <NeoButton variant="outline">Need Help? Contact Support</NeoButton>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <NeoBanner color="black">ORDER DETAILS • TRACK STATUS • DOWNLOAD ESIMS</NeoBanner>
    </div>
  )
}

