export interface CartItem {
  id: string; // Should correspond to Shopify's variant ID
  name: string;
  price: number;
  quantity: number;
  duration?: string;
  data?: string;
  // imageUrl?: string; // Optional: if you plan to show images in the cart
}

// You can add other global types here as your project grows.
