"use client"

import { useState, useEffect } from "react"
import { NeoButton } from "@/components/ui/neo-button"
import { NeoCard } from "@/components/ui/neo-card"
import { NeoBanner } from "@/components/ui/neo-banner"
import { NeoTag } from "@/components/ui/neo-tag"
import { NeoBadge } from "@/components/ui/neo-badge"
import { Wifi, Clock, MapPin, BarChart, Package, Settings, LogOut } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import type { Order } from "@/lib/db-service"
import { fetchUserOrders } from "@/app/actions/order-actions"

// Mock eSIM data
const esimData = [
  {
    id: "esim-1",
    name: "Europe 3GB",
    status: "active",
    dataUsed: 1.2,
    dataTotal: 3,
    activationDate: "2023-03-15",
    expiryDate: "2023-04-15",
    countries: 36,
    region: "Europe",
  },
  {
    id: "esim-2",
    name: "USA 5GB",
    status: "active",
    dataUsed: 2.8,
    dataTotal: 5,
    activationDate: "2023-03-10",
    expiryDate: "2023-04-10",
    countries: 1,
    region: "USA",
  },
  {
    id: "esim-3",
    name: "Asia 3GB",
    status: "expired",
    dataUsed: 3,
    dataTotal: 3,
    activationDate: "2023-02-01",
    expiryDate: "2023-03-01",
    countries: 14,
    region: "Asia",
  },
]

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function getOrders() {
      if (user?.id) {
        try {
          setIsLoading(true)
          const userOrders = await fetchUserOrders(user.id)
          setOrders(userOrders)
        } catch (error) {
          console.error("Error fetching orders:", error)
          // Set orders to empty array on error instead of leaving it undefined
          setOrders([])
        } finally {
          setIsLoading(false)
        }
      } else {
        // If no user, set loading to false to avoid infinite loading state
        setIsLoading(false)
      }
    }

    getOrders()
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
      <NeoBanner color="blue">DASHBOARD • MY ACCOUNT • ESIM MANAGEMENT</NeoBanner>

      {/* Dashboard Header */}
      <section className="bg-[#B8E3FF] py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <div className="inline-block bg-black px-4 py-2 text-sm font-bold uppercase text-white">DASHBOARD</div>
              <h1 className="mt-4 text-4xl font-black uppercase tracking-tight">
                WELCOME BACK, {user?.user_metadata?.first_name || user?.email?.split("@")[0] || "USER"}
              </h1>
              <div className="mt-2 h-1 w-32 bg-black"></div>
            </div>

            <div className="mt-4 flex gap-4 md:mt-0">
              <Link href="/dashboard/settings">
                <NeoButton variant="outline">
                  <Settings className="mr-2 h-5 w-5" />
                  Settings
                </NeoButton>
              </Link>
              <Link href="/auth/sign-out">
                <NeoButton variant="outline">
                  <LogOut className="mr-2 h-5 w-5" />
                  Sign Out
                </NeoButton>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Navigation */}
      <section className="border-b-4 border-black bg-white py-4">
        <div className="container">
          <div className="flex flex-wrap gap-4">
            <NeoTag active={activeTab === "overview"} onClick={() => setActiveTab("overview")}>
              Overview
            </NeoTag>
            <NeoTag active={activeTab === "esims"} onClick={() => setActiveTab("esims")}>
              My eSIMs
            </NeoTag>
            <NeoTag active={activeTab === "orders"} onClick={() => setActiveTab("orders")}>
              Orders
            </NeoTag>
          </div>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="py-8">
        <div className="container">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div>
              {/* Stats Cards */}
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                <NeoCard color="blue">
                  <div className="flex items-center">
                    <div className="mr-4 flex h-16 w-16 items-center justify-center rounded-full bg-black">
                      <Wifi className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-medium uppercase text-muted-foreground">Active eSIMs</div>
                      <div className="text-3xl font-bold">{esimData.filter((e) => e.status === "active").length}</div>
                    </div>
                  </div>
                </NeoCard>

                <NeoCard color="yellow">
                  <div className="flex items-center">
                    <div className="mr-4 flex h-16 w-16 items-center justify-center rounded-full bg-black">
                      <Package className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-medium uppercase text-muted-foreground">Total Orders</div>
                      <div className="text-3xl font-bold">{orders.length}</div>
                    </div>
                  </div>
                </NeoCard>

                <NeoCard color="green">
                  <div className="flex items-center">
                    <div className="mr-4 flex h-16 w-16 items-center justify-center rounded-full bg-black">
                      <MapPin className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-medium uppercase text-muted-foreground">Countries Covered</div>
                      <div className="text-3xl font-bold">51</div>
                    </div>
                  </div>
                </NeoCard>

                <NeoCard color="pink">
                  <div className="flex items-center">
                    <div className="mr-4 flex h-16 w-16 items-center justify-center rounded-full bg-black">
                      <BarChart className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-medium uppercase text-muted-foreground">Data Used</div>
                      <div className="text-3xl font-bold">4.0 GB</div>
                    </div>
                  </div>
                </NeoCard>
              </div>

              {/* Active eSIMs */}
              <div className="mt-12">
                <h2 className="text-2xl font-bold">Active eSIMs</h2>
                <div className="mt-4 grid gap-8 md:grid-cols-2">
                  {esimData
                    .filter((esim) => esim.status === "active")
                    .map((esim) => (
                      <NeoCard
                        key={esim.id}
                        color={esim.region === "Europe" ? "blue" : esim.region === "USA" ? "yellow" : "pink"}
                      >
                        <div className="flex justify-between">
                          <h3 className="text-xl font-bold">{esim.name}</h3>
                          <NeoBadge color={esim.status === "active" ? "green" : "red"}>
                            {esim.status.toUpperCase()}
                          </NeoBadge>
                        </div>

                        <div className="mt-4 space-y-2">
                          <div className="flex items-center gap-2">
                            <Wifi className="h-4 w-4" />
                            <span>
                              {esim.dataUsed} GB / {esim.dataTotal} GB Used
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>Expires on {new Date(esim.expiryDate).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>
                              {esim.countries} {esim.countries === 1 ? "Country" : "Countries"}
                            </span>
                          </div>
                        </div>

                        <div className="mt-4 h-4 w-full overflow-hidden rounded-full bg-gray-200">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{ width: `${(esim.dataUsed / esim.dataTotal) * 100}%` }}
                          ></div>
                        </div>

                        <div className="mt-6">
                          <Link href={`/dashboard/esims/${esim.id}`}>
                            <NeoButton className="w-full">Manage eSIM</NeoButton>
                          </Link>
                        </div>
                      </NeoCard>
                    ))}
                </div>

                <div className="mt-6 text-center">
                  <Link href="/dashboard/esims">
                    <NeoButton variant="outline">View All eSIMs</NeoButton>
                  </Link>
                </div>
              </div>

              {/* Recent Orders */}
              <div className="mt-12">
                <h2 className="text-2xl font-bold">Recent Orders</h2>
                {isLoading ? (
                  <div className="mt-4 overflow-hidden border-4 border-black">
                    <div className="animate-pulse">
                      <div className="h-12 w-full bg-black"></div>
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-16 w-full border-b border-black last:border-b-0 p-4">
                          <div className="h-8 w-full bg-gray-200"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="mt-4 text-center">
                    <p className="text-muted-foreground">You haven't placed any orders yet.</p>
                    <div className="mt-4">
                      <Link href="/plans">
                        <NeoButton>Browse eSIM Plans</NeoButton>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 overflow-hidden border-4 border-black">
                    <table className="w-full">
                      <thead className="bg-black text-white">
                        <tr>
                          <th className="p-4 text-left">Order ID</th>
                          <th className="p-4 text-left">Date</th>
                          <th className="p-4 text-left">Total</th>
                          <th className="p-4 text-left">Status</th>
                          <th className="p-4 text-left">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.slice(0, 3).map((order) => (
                          <tr key={order.id} className="border-b border-black last:border-b-0">
                            <td className="p-4">{order.id.slice(0, 8)}</td>
                            <td className="p-4">{new Date(order.created_at).toLocaleDateString()}</td>
                            <td className="p-4">${order.total.toFixed(2)}</td>
                            <td className="p-4">{getStatusBadge(order.status)}</td>
                            <td className="p-4">
                              <Link href={`/dashboard/orders/${order.id}`}>
                                <NeoButton variant="outline" size="sm">
                                  View
                                </NeoButton>
                              </Link>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="mt-6 text-center">
                  <Link href="/dashboard/orders">
                    <NeoButton variant="outline">View All Orders</NeoButton>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* eSIMs Tab */}
          {activeTab === "esims" && (
            <div>
              <div className="flex justify-between">
                <h2 className="text-2xl font-bold">My eSIMs</h2>
                <Link href="/plans">
                  <NeoButton>Buy New eSIM</NeoButton>
                </Link>
              </div>

              <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {esimData.map((esim) => (
                  <NeoCard
                    key={esim.id}
                    color={esim.region === "Europe" ? "blue" : esim.region === "USA" ? "yellow" : "pink"}
                  >
                    <div className="flex justify-between">
                      <h3 className="text-xl font-bold">{esim.name}</h3>
                      <NeoBadge color={esim.status === "active" ? "green" : "red"}>
                        {esim.status.toUpperCase()}
                      </NeoBadge>
                    </div>

                    <div className="mt-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <Wifi className="h-4 w-4" />
                        <span>
                          {esim.dataUsed} GB / {esim.dataTotal} GB Used
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>
                          {esim.status === "active" ? "Expires" : "Expired"} on{" "}
                          {new Date(esim.expiryDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        <span>
                          {esim.countries} {esim.countries === 1 ? "Country" : "Countries"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 h-4 w-full overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${(esim.dataUsed / esim.dataTotal) * 100}%` }}
                      ></div>
                    </div>

                    <div className="mt-6">
                      <Link href={`/dashboard/esims/${esim.id}`}>
                        <NeoButton className="w-full">
                          {esim.status === "active" ? "Manage eSIM" : "View Details"}
                        </NeoButton>
                      </Link>
                    </div>
                  </NeoCard>
                ))}
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div>
              <h2 className="text-2xl font-bold">Order History</h2>

              {isLoading ? (
                <div className="mt-8 overflow-hidden border-4 border-black">
                  <div className="animate-pulse">
                    <div className="h-12 w-full bg-black"></div>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="h-16 w-full border-b border-black last:border-b-0 p-4">
                        <div className="h-8 w-full bg-gray-200"></div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : orders.length === 0 ? (
                <div className="mt-8 text-center">
                  <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-muted">
                    <Package className="h-12 w-12 text-muted-foreground" />
                  </div>

                  <h3 className="text-xl font-bold">No orders yet</h3>
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
                <div className="mt-8 overflow-hidden border-4 border-black">
                  <table className="w-full">
                    <thead className="bg-black text-white">
                      <tr>
                        <th className="p-4 text-left">Order ID</th>
                        <th className="p-4 text-left">Date</th>
                        <th className="p-4 text-left">Items</th>
                        <th className="p-4 text-left">Total</th>
                        <th className="p-4 text-left">Status</th>
                        <th className="p-4 text-left">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id} className="border-b border-black last:border-b-0">
                          <td className="p-4">{order.id.slice(0, 8)}</td>
                          <td className="p-4">{new Date(order.created_at).toLocaleDateString()}</td>
                          <td className="p-4">
                            {order.items?.map((item, index) => (
                              <div key={index}>{item.name}</div>
                            ))}
                          </td>
                          <td className="p-4">${order.total.toFixed(2)}</td>
                          <td className="p-4">{getStatusBadge(order.status)}</td>
                          <td className="p-4">
                            <Link href={`/dashboard/orders/${order.id}`}>
                              <NeoButton variant="outline" size="sm">
                                View
                              </NeoButton>
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <NeoBanner color="black">MANAGE YOUR ESIMS • TRACK USAGE • VIEW ORDERS</NeoBanner>
    </div>
  )
}

