import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  mainImage: string | null;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isCartOpen: boolean;
  recentlyViewed: Omit<CartItem, 'quantity'>[];
  quickViewProduct: Omit<CartItem, 'quantity'> | null;
  
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  addBundle: (items: Omit<CartItem, 'quantity'>[]) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  
  openCart: () => void;
  closeCart: () => void;
  
  openQuickView: (product: Omit<CartItem, 'quantity'>) => void;
  closeQuickView: () => void;
  
  addRecentlyViewed: (product: Omit<CartItem, 'quantity'>) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      recentlyViewed: [],
      quickViewProduct: null,
      addItem: (item) => { ... },
      removeItem: (id) => { ... },
      updateQuantity: (id, quantity) => { ... },
      clearCart: () => { ... },
      getTotalPrice: () => { ... },
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      openQuickView: (product) => set({ quickViewProduct: product }),
      closeQuickView: () => set({ quickViewProduct: null }),
      addRecentlyViewed: (product) => { ... },
    }),
    { name: 'fatemehlab-cart' }
  )
);

// 🛡️ همگام‌سازی سبد خرید بین تب‌ها
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === 'fatemehlab-cart') {
      useCartStore.persist.rehydrate();
    }
  });
}