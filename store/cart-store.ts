import { create } from 'zustand';
import { CartItem } from '../types'; // Using relative path for now

interface CartState {
  items: CartItem[];
  promoCode: string | null;
  discount: number;
  itemCount: number;
  subtotal: number;
}

interface CartActions {
  addItem: (newItem: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, newQuantity: number) => void;
  clearCart: () => void;
  applyPromoCode: (code: string) => void;
  removePromoCode: () => void;
  // Internal helper to recalculate totals
  _recalculateTotals: () => void; 
}

export const useCartStore = create<CartState & CartActions>((set, get) => ({
  items: [],
  promoCode: null,
  discount: 0,
  itemCount: 0,
  subtotal: 0,

  _recalculateTotals: () => {
    const items = get().items;
    const newSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const newItemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    set({ subtotal: newSubtotal, itemCount: newItemCount });

    // Re-apply discount if a promo code exists, as subtotal might have changed
    const currentPromoCode = get().promoCode;
    if (currentPromoCode) {
      // This is a simplified re-application.
      // You might want more sophisticated logic if promo codes have complex conditions.
      if (currentPromoCode === "SORAVIO10") {
        set({ discount: newSubtotal * 0.1 });
      } else {
        // If other promo codes were possible, handle them here or reset.
        set({ discount: 0 }); 
      }
    } else {
      set({ discount: 0 });
    }
  },

  addItem: (newItem) => {
    set((state) => {
      const existingItemIndex = state.items.findIndex((item) => item.id === newItem.id);
      let updatedItems;
      if (existingItemIndex > -1) {
        updatedItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      } else {
        updatedItems = [...state.items, newItem];
      }
      return { items: updatedItems };
    });
    get()._recalculateTotals();
  },

  removeItem: (itemId) => {
    set((state) => ({
      items: state.items.filter((item) => item.id !== itemId),
    }));
    get()._recalculateTotals();
  },

  updateQuantity: (itemId, newQuantity) => {
    if (newQuantity < 1) {
      get().removeItem(itemId); // Use existing removeItem action
      return;
    }
    set((state) => ({
      items: state.items.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      ),
    }));
    get()._recalculateTotals();
  },

  clearCart: () => {
    set({ items: [], promoCode: null, discount: 0, itemCount: 0, subtotal: 0 });
    // No need to call _recalculateTotals as everything is reset.
  },

  applyPromoCode: (code) => {
    const currentSubtotal = get().subtotal; // Use subtotal from state
    if (code.toUpperCase() === "SORAVIO10") {
      set({ promoCode: code.toUpperCase(), discount: currentSubtotal * 0.1 });
    } else {
      alert("Invalid promo code"); // Consider using a toast notification
      set({ promoCode: null, discount: 0 });
    }
    // Recalculate totals isn't strictly needed here if discount is based on current subtotal
    // but if promo logic becomes complex, it might be.
  },

  removePromoCode: () => {
    set({ promoCode: null, discount: 0 });
  },
}));
