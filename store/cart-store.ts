import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { 
  ShopifyCart, 
  CartLineInput, 
  CartLineUpdateInput,
  createCart as apiCreateCart,
  getCart as apiGetCart,
  addCartLines as apiAddCartLines,
  removeCartLines as apiRemoveCartLines,
  updateCartLines as apiUpdateCartLines,
  updateCartDiscountCodes as apiUpdateCartDiscountCodes,
} from '../lib/shopify'; // Assuming shopify.ts is in lib

// This type represents a line item as displayed in the UI, derived from ShopifyCart.lines.edges.node
export interface DisplayCartLine {
  id: string; // CartLine ID
  variantId: string; // Merchandise (ProductVariant) ID
  productId?: string; // Product ID (if available/needed)
  productHandle?: string;
  productTitle?: string;
  variantTitle?: string;
  quantity: number;
  price: number; // Price per unit
  linePrice: number; // quantity * price
  imageUrl?: string | null;
  // Add other fields like dataAmount, region if they are part of merchandise.product.metafields
  dataAmount?: string;
  region?: string;
}

interface CartState {
  cartId: string | null;
  shopifyCart: ShopifyCart | null; // Raw cart object from Shopify
  displayLines: DisplayCartLine[]; // Processed lines for UI
  itemCount: number;
  subtotal: number;
  total: number;
  discountCodes: { code: string; applicable: boolean }[];
  checkoutUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

interface CartActions {
  initializeCart: () => Promise<void>;
  addItem: (variantId: string, quantity: number, attributes?: {key: string, value: string}[]) => Promise<void>;
  removeItem: (lineId: string) => Promise<void>;
  updateQuantity: (lineId: string, newQuantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  applyPromoCode: (code: string) => Promise<void>;
  removePromoCode: () => Promise<void>;
  _updateStoreWithShopifyCart: (cart: ShopifyCart | null) => void;
  _setError: (message: string | null) => void;
}

const SHOPIFY_CART_ID_LOCAL_STORAGE_KEY = 'shopify_cart_id';

const initialState: CartState = {
  cartId: null,
  shopifyCart: null,
  displayLines: [],
  itemCount: 0,
  subtotal: 0,
  total: 0,
  discountCodes: [],
  checkoutUrl: null,
  isLoading: true,
  error: null,
};

export const useCartStore = create<CartState & CartActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      _setError: (message) => set({ error: message, isLoading: false }),

      _updateStoreWithShopifyCart: (cart) => {
        if (cart) {
          const displayLines: DisplayCartLine[] = cart.lines.edges.map(({ node }) => {
            const merchandise = node.merchandise as any; // Cast for easier access
            const price = parseFloat(merchandise.price?.amount || '0');
            return {
              id: node.id,
              variantId: merchandise.id,
              productHandle: merchandise.product?.handle,
              productTitle: merchandise.product?.title,
              variantTitle: merchandise.title,
              quantity: node.quantity,
              price: price,
              linePrice: price * node.quantity,
              imageUrl: merchandise.image?.url,
              // Assuming metafields are fetched and available on merchandise.product
              dataAmount: merchandise.product?.dataAmount?.value, 
              region: merchandise.product?.region?.value,
            };
          });
          
          set({
            shopifyCart: cart,
            cartId: cart.id,
            displayLines,
            itemCount: cart.lines.edges.reduce((sum, edge) => sum + edge.node.quantity, 0),
            subtotal: parseFloat(cart.cost.subtotalAmount.amount),
            total: parseFloat(cart.cost.totalAmount.amount),
            discountCodes: cart.discountCodes || [],
            checkoutUrl: cart.checkoutUrl,
            isLoading: false,
            error: null,
          });
          // Persist cartId to localStorage
          if (typeof window !== 'undefined') {
            localStorage.setItem(SHOPIFY_CART_ID_LOCAL_STORAGE_KEY, cart.id);
          }
        } else {
          // Clear cart state if null is passed (e.g., after clearing cart or error)
          set({ ...initialState, cartId: null, isLoading: false });
           if (typeof window !== 'undefined') {
            localStorage.removeItem(SHOPIFY_CART_ID_LOCAL_STORAGE_KEY);
          }
        }
      },

      initializeCart: async () => {
        set({ isLoading: true });
        let storedCartId: string | null = null;
        if (typeof window !== 'undefined') {
          storedCartId = localStorage.getItem(SHOPIFY_CART_ID_LOCAL_STORAGE_KEY);
        }

        if (storedCartId) {
          const existingCart = await apiGetCart(storedCartId);
          if (existingCart) {
            get()._updateStoreWithShopifyCart(existingCart);
            return;
          } else {
             if (typeof window !== 'undefined') {
              localStorage.removeItem(SHOPIFY_CART_ID_LOCAL_STORAGE_KEY); // Clear invalid ID
            }
          }
        }
        // If no valid stored cart, create a new one
        const newCart = await apiCreateCart([]); // Create empty cart
        get()._updateStoreWithShopifyCart(newCart);
      },

      addItem: async (variantId, quantity, attributes) => {
        set({ isLoading: true });
        let currentCartId = get().cartId;
        if (!currentCartId) {
          const newCart = await apiCreateCart([{ merchandiseId: variantId, quantity, attributes }]);
          get()._updateStoreWithShopifyCart(newCart);
          if (!newCart) get()._setError("Failed to create cart and add item.");
          return;
        }
        
        const updatedCart = await apiAddCartLines(currentCartId, [{ merchandiseId: variantId, quantity, attributes }]);
        get()._updateStoreWithShopifyCart(updatedCart);
        if (!updatedCart) get()._setError("Failed to add item to cart.");
      },

      removeItem: async (lineId) => {
        set({ isLoading: true });
        const currentCartId = get().cartId;
        if (!currentCartId) {
          get()._setError("Cart not found.");
          return;
        }
        const updatedCart = await apiRemoveCartLines(currentCartId, [lineId]);
        get()._updateStoreWithShopifyCart(updatedCart);
        if (!updatedCart) get()._setError("Failed to remove item from cart.");
      },

      updateQuantity: async (lineId, newQuantity) => {
        set({ isLoading: true });
        const currentCartId = get().cartId;
        if (!currentCartId) {
          get()._setError("Cart not found.");
          return;
        }
        if (newQuantity < 1) {
          // Shopify API might handle this, or we can call removeItem
          await get().removeItem(lineId);
          return;
        }
        const updatedCart = await apiUpdateCartLines(currentCartId, [{ id: lineId, quantity: newQuantity }]);
        get()._updateStoreWithShopifyCart(updatedCart);
        if (!updatedCart) get()._setError("Failed to update item quantity.");
      },

      clearCart: async () => {
        set({ isLoading: true });
        const currentCartId = get().cartId;
        const currentLines = get().shopifyCart?.lines.edges;

        if (currentCartId && currentLines && currentLines.length > 0) {
          const lineIds = currentLines.map(edge => edge.node.id);
          const clearedCart = await apiRemoveCartLines(currentCartId, lineIds);
          // Shopify might return a cart with 0 lines, or you might want to create a new one
          // For simplicity, let's assume removeCartLines gives us an empty cart or we create a new one
          if (clearedCart && clearedCart.lines.edges.length === 0) {
             get()._updateStoreWithShopifyCart(clearedCart);
          } else {
            // Fallback: create a new empty cart if removal fails or doesn't empty it
            const newCart = await apiCreateCart([]);
            get()._updateStoreWithShopifyCart(newCart);
          }
        } else {
          // If no cart or no lines, just ensure state is clean
          const newCart = await apiCreateCart([]);
          get()._updateStoreWithShopifyCart(newCart);
        }
         if (typeof window !== 'undefined') { // Also clear local storage if we are effectively resetting
            localStorage.removeItem(SHOPIFY_CART_ID_LOCAL_STORAGE_KEY);
            if(get().cartId) { // if a new cart was created, store its ID
                 localStorage.setItem(SHOPIFY_CART_ID_LOCAL_STORAGE_KEY, get().cartId!);
            }
        }
      },

      applyPromoCode: async (code) => {
        set({ isLoading: true });
        const currentCartId = get().cartId;
        if (!currentCartId) {
          get()._setError("Cart not found.");
          return;
        }
        const updatedCart = await apiUpdateCartDiscountCodes(currentCartId, [code]);
        get()._updateStoreWithShopifyCart(updatedCart);
        if (!updatedCart) {
          get()._setError("Failed to apply promo code.");
        } else if (updatedCart.discountCodes.length === 0 || !updatedCart.discountCodes.find(dc => dc.code.toUpperCase() === code.toUpperCase() && dc.applicable)) {
          // If Shopify rejected the code or it's not applicable
          get()._setError(`Promo code "${code}" is not valid or applicable.`);
          // Re-fetch cart without the attempted code to ensure clean state
          const originalCart = await apiGetCart(currentCartId);
          get()._updateStoreWithShopifyCart(originalCart);
        }
      },

      removePromoCode: async () => {
        set({ isLoading: true });
        const currentCartId = get().cartId;
        if (!currentCartId) {
          get()._setError("Cart not found.");
          return;
        }
        const updatedCart = await apiUpdateCartDiscountCodes(currentCartId, []);
        get()._updateStoreWithShopifyCart(updatedCart);
        if (!updatedCart) get()._setError("Failed to remove promo code.");
      },
    }),
    {
      name: 'shopify-cart-storage', // name of the item in the storage (must be unique)
      storage: createJSONStorage(() => localStorage), // (optional) by default, 'localStorage' is used
      partialize: (state) => ({ cartId: state.cartId }), // Only persist cartId
    }
  )
);

// Call initializeCart when the store is first used/app loads.
// This can be done in a top-level component like _app.tsx or Layout.tsx
// useEffect(() => { useCartStore.getState().initializeCart(); }, []);
