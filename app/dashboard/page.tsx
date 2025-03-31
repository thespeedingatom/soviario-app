"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { NeoButton } from "@/components/ui/neo-button"
import { NeoCard } from "@/components/ui/neo-card"
import { NeoCardPlain } from "@/components/ui/neo-card-plain"
import { NeoBanner } from "@/components/ui/neo-banner"
import { NeoTag } from "@/components/ui/neo-tag"
import { NeoBadge } from "@/components/ui/neo-badge"
import { Wifi, Clock, MapPin, BarChart, Package, Settings, LogOut, QrCode } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import type { Order, OrderItem } from "@/lib/db-service"
import { fetchUserOrders } from "@/app/_actions/order-actions"
import Image from "next/image"
import QRCode from 'qrcode' // Import qrcode library

// Define type for processed eSIM data
type EsimDisplayData = {
  orderId: string;
  itemId: string;
  name: string;
  status: Order["status"];
  activationCode?: string;
  // qrCodeData is generated client-side now
  region?: string;
  data?: string;
  duration?: string;
  purchaseDate: string;
}

// Helper component to generate and display QR code client-side
function QrCodeDisplay({ activationCode, orderId }: { activationCode: string; orderId: string }) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    QRCode.toDataURL(activationCode, { width: 200, margin: 1 })
      .then(url => {
        setQrCodeUrl(url);
        setError(null);
      })
      .catch(err => {
        console.error('QR code generation failed:', err);
        setError('Could not generate QR code.');
        setQrCodeUrl(null);
      });
  }, [activationCode]); // Re-generate if activationCode changes

  if (error) {
    return <p className="text-red-600 text-sm mt-2">{error}</p>;
  }

  if (!qrCodeUrl) {
    return <p className="text-sm mt-2">Generating QR code...</p>;
  }

  return (
    <div className="mt-4 text-center">
      <p className="text-sm font-bold mb-2">Activation QR Code:</p>
      <Image
        src={qrCodeUrl}
        alt={`eSIM QR Code for order ${orderId.slice(0, 8)}`}
        width={200}
        height={200}
        className="mx-auto border-4 border-black p-1"
      />
      <p className="mt-2 text-xs font-mono break-all">Code: {activationCode}</p>
    </div>
  );
}


export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [processedEsims, setProcessedEsims] = useState<EsimDisplayData[]>([])
  const { user, isPending } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true) // For order fetching
  const router = useRouter()

  // Redirect unauthenticated users
  useEffect(() => {
    if (!isPending && !user) {
      router.push('/auth/sign-in?redirect=/dashboard') // Redirect to sign-in if not logged in after check
    }
  }, [user, isPending, router])

  // Fetch orders when user is available
  useEffect(() => {
    async function getOrders() {
      // Only fetch if user exists and is not pending
      if (!isPending && user?.id) {
        try {
          setIsLoading(true);
          const userOrders = await fetchUserOrders(user.id);
          setOrders(userOrders);

          // Process orders to extract eSIM data for display
          const esims: EsimDisplayData[] = userOrders
            .filter(order => order.status === 'completed' && order.maya_esim_data && order.items && order.items.length > 0)
            .flatMap(order =>
              order.items!.map(item => ({
                orderId: order.id,
                itemId: item.id,
                name: item.name,
                status: order.status,
                activationCode: order.maya_esim_data?.activationCode,
                region: item.region,
                data: item.data,
                duration: item.duration,
                purchaseDate: order.created_at,
              }))
            );
          setProcessedEsims(esims);

        } catch (error) {
          console.error("Error fetching orders:", error);
          setOrders([]);
          setProcessedEsims([]);
        } finally {
          setIsLoading(false);
        }
      } else if (!isPending && !user) {
        // If auth check done and no user, stop loading
        setIsLoading(false);
        setOrders([]);
        setProcessedEsims([]);
      }
    }

    getOrders();
  }, [user, isPending]); // Rerun when user or isPending changes


  // Show loading state while checking auth or fetching data
  if (isPending || isLoading) { // Simplified loading check
    return (
      <div className="flex min-h-screen items-center justify-center">
        <NeoCardPlain>
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold">Loading Dashboard...</h2>
            <p className="mt-2 text-muted-foreground">Please wait while we verify your session.</p>
            <div className="mt-4 flex justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-black"></div>
            </div>
          </div>
        </NeoCardPlain>
      </div>
    )
  }
  
  // If loading is done but still no user (should have been redirected, but as fallback)
  if (!user) {
     return (
       <div className="flex min-h-screen items-center justify-center">
         <NeoCardPlain>
           <div className="p-8 text-center">
             <h2 className="text-2xl font-bold">Redirecting...</h2>
             <p className="mt-2 text-muted-foreground">Please sign in to view your dashboard.</p>
           </div>
         </NeoCardPlain>
       </div>
     )
  }


  // Helper function to format status badge
  const getStatusBadge = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return <NeoBadge color="yellow">PENDING</NeoBadge>;
      case "processing":
        return <NeoBadge color="blue">PROCESSING</NeoBadge>;
      case "completed":
        return <NeoBadge color="green">COMPLETED</NeoBadge>;
      case "cancelled":
        return <NeoBadge color="red">CANCELLED</NeoBadge>;
      case "refunded":
        return <NeoBadge color="purple">REFUNDED</NeoBadge>;
      case "failed":
        return <NeoBadge color="red">FAILED</NeoBadge>;
      default:
        return <NeoBadge color="yellow">UNKNOWN</NeoBadge>;
    }
  };

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
                WELCOME BACK, {user?.name || user?.email?.split("@")[0] || "USER"}
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
                      <div className="text-sm font-medium uppercase text-muted-foreground">Purchased eSIMs</div>
                      <div className="text-3xl font-bold">{processedEsims.length}</div>
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
                {/* Other stats cards can be updated similarly if needed */}
                 <NeoCard color="green">
                   <div className="flex items-center">
                     <div className="mr-4 flex h-16 w-16 items-center justify-center rounded-full bg-black">
                       <MapPin className="h-8 w-8 text-white" />
                     </div>
                     <div>
                       <div className="text-sm font-medium uppercase text-muted-foreground">Countries Covered</div>
                       <div className="text-3xl font-bold">51</div> {/* Placeholder */}
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
                       <div className="text-3xl font-bold">N/A</div> {/* Placeholder */}
                     </div>
                   </div>
                 </NeoCard>
              </div>

              {/* Purchased eSIMs Section */}
              <div className="mt-12">
                <h2 className="text-2xl font-bold">Purchased eSIMs</h2>
                {processedEsims.length === 0 ? (
                   <p className="mt-4 text-muted-foreground">No completed eSIM orders found.</p>
                ) : (
                  <div className="mt-4 grid gap-8 md:grid-cols-2">
                    {/* Display first 2 eSIMs on overview */}
                    {processedEsims.slice(0, 2).map((esim) => (
                      <NeoCard
                        key={esim.itemId}
                        color={esim.region === "Europe" ? "blue" : esim.region === "USA" ? "yellow" : "pink"}
                      >
                        <div className="flex justify-between">
                          <h3 className="text-xl font-bold">{esim.name}</h3>
                          {getStatusBadge(esim.status)}
                        </div>
                        <div className="mt-4 space-y-2">
                           {esim.data && <div className="flex items-center gap-2"><BarChart className="h-4 w-4" /><span>{esim.data}</span></div>}
                           {esim.duration && <div className="flex items-center gap-2"><Clock className="h-4 w-4" /><span>{esim.duration}</span></div>}
                           {esim.region && <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /><span>{esim.region}</span></div>}
                           <div className="flex items-center gap-2"><Clock className="h-4 w-4" /><span>Purchased: {new Date(esim.purchaseDate).toLocaleDateString()}</span></div>
                        </div>
                        {esim.activationCode && (
                          <QrCodeDisplay activationCode={esim.activationCode} orderId={esim.orderId} />
                        )}
                        <div className="mt-6">
                          <Link href={`/dashboard/orders/${esim.orderId}`}>
                            <NeoButton className="w-full">View Order Details</NeoButton>
                          </Link>
                        </div>
                      </NeoCard>
                    ))}
                  </div>
                )}
                 <div className="mt-6 text-center">
                   <NeoButton variant="outline" onClick={() => setActiveTab('esims')}>View All eSIMs</NeoButton>
                 </div>
              </div>

              {/* Recent Orders Section */}
              <div className="mt-12">
                <h2 className="text-2xl font-bold">Recent Orders</h2>
                {isLoading ? ( // Use main isLoading state
                  <div className="mt-4 overflow-hidden border-4 border-black"> {/* Loading skeleton */} </div>
                ) : orders.length === 0 ? (
                  <div className="mt-4 text-center"> {/* No orders message */} </div>
                ) : (
                  <div className="mt-4 overflow-hidden border-4 border-black">
                    <table className="w-full">
                      {/* Table Head */}
                      <thead className="bg-black text-white">
                        <tr>
                          <th className="p-4 text-left">Order ID</th>
                          <th className="p-4 text-left">Date</th>
                          <th className="p-4 text-left">Total</th>
                          <th className="p-4 text-left">Status</th>
                          <th className="p-4 text-left">Actions</th>
                        </tr>
                      </thead>
                      {/* Table Body */}
                      <tbody>
                        {orders.slice(0, 3).map((order) => (
                          <tr key={order.id} className="border-b border-black last:border-b-0">
                            <td className="p-4">{order.id.slice(0, 8)}</td>
                            <td className="p-4">{new Date(order.created_at).toLocaleDateString()}</td>
                            <td className="p-4">${order.total.toFixed(2)}</td>
                            <td className="p-4">{getStatusBadge(order.status)}</td>
                            <td className="p-4">
                              <Link href={`/dashboard/orders/${order.id}`}>
                                <NeoButton variant="outline" size="sm">View</NeoButton>
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

          {/* My eSIMs Tab */}
          {activeTab === "esims" && (
             <div>
               <div className="flex justify-between items-center mb-8">
                 <h2 className="text-2xl font-bold">My Purchased eSIMs</h2>
                 <Link href="/plans">
                   <NeoButton>Buy New eSIM</NeoButton>
                 </Link>
               </div>
               {processedEsims.length === 0 ? (
                  <div className="text-center py-12"> {/* No eSIMs message */} </div>
               ) : (
                 <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                   {processedEsims.map((esim) => (
                     <NeoCard
                       key={esim.itemId}
                       color={esim.region === "Europe" ? "blue" : esim.region === "USA" ? "yellow" : "pink"}
                     >
                       <div className="flex justify-between">
                         <h3 className="text-xl font-bold">{esim.name}</h3>
                         {getStatusBadge(esim.status)}
                       </div>
                       <div className="mt-4 space-y-2">
                         {esim.data && <div className="flex items-center gap-2"><BarChart className="h-4 w-4" /><span>{esim.data}</span></div>}
                         {esim.duration && <div className="flex items-center gap-2"><Clock className="h-4 w-4" /><span>{esim.duration}</span></div>}
                         {esim.region && <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /><span>{esim.region}</span></div>}
                         <div className="flex items-center gap-2"><Clock className="h-4 w-4" /><span>Purchased: {new Date(esim.purchaseDate).toLocaleDateString()}</span></div>
                       </div>
                       {esim.activationCode && (
                         <QrCodeDisplay activationCode={esim.activationCode} orderId={esim.orderId} />
                       )}
                       <div className="mt-6">
                         <Link href={`/dashboard/orders/${esim.orderId}`}>
                           <NeoButton className="w-full">View Order Details</NeoButton>
                         </Link>
                       </div>
                     </NeoCard>
                   ))}
                 </div>
               )}
             </div>
           )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div>
              <h2 className="text-2xl font-bold">Order History</h2>
              {isLoading ? (
                <div className="mt-8 overflow-hidden border-4 border-black"> {/* Loading skeleton */} </div>
              ) : orders.length === 0 ? (
                <div className="mt-8 text-center"> {/* No orders message */} </div>
              ) : (
                <div className="mt-8 overflow-hidden border-4 border-black">
                  <table className="w-full">
                    {/* Table Head */}
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
                    {/* Table Body */}
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
                              <NeoButton variant="outline" size="sm">View</NeoButton>
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
