"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Loader2 } from "lucide-react";
import { useCart } from "@/contexts/cart-context";
import { useSearchParams } from "next/navigation";
// Remove verifyCheckoutSession import
// import { MayaQRCode } from "@/components/maya-qr-code"; // Remove old QR component import
import { getOrderById, type Order } from "@/lib/db-service"; // Import function to get order details and Order type
import { EsimInstallationDetails } from "@/components/esim-installation-details"; // Import the new component

export default function CheckoutSuccessPage() {
  const { clearCart } = useCart();
  const [order, setOrder] = useState<Order | null>(null); // Store the full order object
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  // const sessionId = searchParams.get("session_id"); // Session ID might not be needed anymore
  const orderIdParam = searchParams.get("order_id");

  useEffect(() => {
    // Clear cart once on successful landing
    clearCart(); 

    async function fetchOrder() {
      if (orderIdParam) {
        try {
          setIsLoading(true);
          setError(null);
          const fetchedOrder = await getOrderById(orderIdParam);
          if (fetchedOrder) {
            setOrder(fetchedOrder);
            // Optional: Add a small delay or check status if webhook might be slow
            // if (fetchedOrder.status !== 'completed' || !fetchedOrder.maya_esim_data) {
            //   // Optionally poll or wait briefly
            // }
          } else {
             setError("Order not found.");
          }
        } catch (err) {
          console.error("Error fetching order details:", err);
          setError("Could not load order details.");
        } finally {
          setIsLoading(false);
        }
      } else {
        setError("Order ID missing from URL.");
        setIsLoading(false);
        // Optionally redirect if order ID is missing
        // window.location.href = "/"; 
      }
    }

    fetchOrder();
  }, [orderIdParam, clearCart]); // Depend only on orderIdParam and clearCart

  if (isLoading) {
    // Keep loading state UI
    return (
      <div className="py-16">
        <div className="container max-w-3xl text-center">
          <Card className="neobrutalist-card">
            <CardContent className="p-8">
              <div className="flex items-center justify-center gap-2">
                 <Loader2 className="h-8 w-8 animate-spin" />
                 <span className="text-xl">Loading Order Details...</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    // Display error state
     return (
      <div className="py-16">
        <div className="container max-w-3xl text-center">
          <Card className="neobrutalist-card border-red-500">
            <CardContent className="p-8">
               <h1 className="text-3xl font-bold text-red-600">Error</h1>
               <p className="mt-4 text-xl">{error}</p>
               <div className="mt-8">
                 <Link href="/">
                   <Button variant="outline" className="neobrutalist-border">
                     Return to Home
                   </Button>
                 </Link>
               </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!order) {
     // Should be covered by error state, but as a fallback
     return null; 
  }

  // Main success UI
  return (
    <div className="py-16">
      <div className="container max-w-3xl">
        <Card className="neobrutalist-card">
          <CardContent className="p-8 text-center">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>

            <h1 className="text-3xl font-bold">Order Confirmed!</h1>
            <p className="mt-4 text-xl">Thank you for your purchase.</p>

            {/* Display eSIM details if available */}
            {order.status === 'completed' && order.maya_esim_data ? (
              <div className="mt-8">
                 <EsimInstallationDetails 
                   activationCode={order.maya_esim_data.activationCode} 
                   manualCode={order.maya_esim_data.manualCode} 
                   smdpAddress={order.maya_esim_data.smdpAddress} 
                 />
              </div>
            ) : order.status === 'processing' ? (
               <div className="mt-6 flex items-center justify-center gap-2 text-blue-600">
                 <Loader2 className="h-5 w-5 animate-spin" />
                 <span>Your eSIM is being prepared. Details will appear here and in your email shortly.</span>
               </div>
            ) : order.status === 'failed' ? (
               <p className="mt-6 text-red-600">There was an issue provisioning your eSIM. Please contact support.</p>
            ) : null /* Handle other statuses if needed */}


            <div className="mt-8 space-y-4">
              <div className="rounded-lg bg-muted p-4">
                <h2 className="font-bold">Order #{order.id.slice(0, 8)}</h2>
                <p className="text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
              </div>

              {/* Display total from the fetched order */}
              <div className="rounded-lg bg-muted p-4">
                <h2 className="font-bold">Total Amount</h2>
                <p className="text-xl font-bold">${order.total.toFixed(2)}</p>
              </div>
              {/* End of the correct total amount display */}
            </div> 
            {/* The duplicate block referencing 'orderDetails' has been removed. */}

            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link href="/dashboard/orders">
                <Button className="neobrutalist-button">View My Orders</Button>
              </Link>
              <Link href="/">
                <Button variant="outline" className="neobrutalist-border">
                  Return to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
