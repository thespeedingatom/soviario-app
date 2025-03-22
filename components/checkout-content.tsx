// Add this import at the top of the file
import { trackEvent } from "@/lib/analytics"

// Inside the handleStripeCheckout function, add this before redirecting:
const handleStripeCheckout = async (e) => {
  e.preventDefault()

  // Declare variables (assuming they are coming from a form or context)
  const { email, firstName, lastName, toast, setIsLoading, items, subtotal, discount, createCheckoutSession } = {
    email: "test@example.com", // Replace with actual value
    firstName: "John", // Replace with actual value
    lastName: "Doe", // Replace with actual value
    toast: (options) => console.log(options), // Replace with actual toast function
    setIsLoading: (loading) => console.log("setIsLoading:", loading), // Replace with actual setIsLoading function
    items: [], // Replace with actual items
    subtotal: 100, // Replace with actual subtotal
    discount: 10, // Replace with actual discount
    createCheckoutSession: async () => ({ url: "https://example.com/checkout" }), // Replace with actual createCheckoutSession function
  }

  if (!email || !firstName || !lastName) {
    toast({
      title: "Missing information",
      description: "Please fill in all required fields",
      variant: "destructive",
    })
    return
  }

  try {
    setIsLoading(true)

    // Create a Stripe checkout session
    const { url } = await createCheckoutSession(items, email, discount)

    if (url) {
      // Track checkout initiated event
      trackEvent("begin_checkout", {
        value: subtotal - discount,
        currency: "USD",
        items: items.map((item) => ({
          item_id: item.id,
          item_name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
      })

      // Redirect to Stripe Checkout
      window.location.href = url
    } else {
      toast({
        title: "Checkout error",
        description: "Unable to create checkout session",
        variant: "destructive",
      })
    }
  } catch (error) {
    console.error("Error during checkout:", error)
    toast({
      title: "Checkout failed",
      description: "There was a problem processing your payment. Please try again.",
      variant: "destructive",
    })
  } finally {
    setIsLoading(false)
  }
}

