import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  mainImage: string | null;
  quantity: number;
  stock?: number;
}

interface CartStore {
  items: CartItem[];
  isCartOpen: boolean;
  recentlyViewed: Omit<CartItem, 'quantity'>[];
  quickViewProduct: Omit<CartItem, 'quantity'> | null;
  
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
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

      addItem: (item, requestedQuantity = 1) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((i) => i.id === item.id);
        const safeRequested = Math.max(1, Math.floor(Number.isFinite(requestedQuantity) ? requestedQuantity : 1));
        const stockLimit = typeof item.stock === 'number' ? item.stock : Number.POSITIVE_INFINITY;
        if (stockLimit <= 0) return;
        const currentQuantity = existingItem?.quantity ?? 0;
        const nextQuantity = Math.min(stockLimit, currentQuantity + safeRequested);

        if (existingItem) {
          set({ items: currentItems.map((i) => i.id === item.id ? { ...i, ...item, quantity: nextQuantity } : i) });
        } else {
          set({ items: [...currentItems, { ...item, quantity: Math.min(stockLimit, safeRequested) }] });
        }
      },

      addBundle: (itemsToAdd) => {
        const currentItems = [...get().items];
        itemsToAdd.forEach(item => {
          const stockLimit = typeof item.stock === 'number' ? item.stock : Number.POSITIVE_INFINITY;
          if (stockLimit <= 0) return;
          const existingIndex = currentItems.findIndex(i => i.id === item.id);
          if (existingIndex > -1) {
            const nextQuantity = Math.min(stockLimit, currentItems[existingIndex].quantity + 1);
            currentItems[existingIndex] = { ...currentItems[existingIndex], ...item, quantity: nextQuantity };
          } else {
            currentItems.push({ ...item, quantity: 1 });
          }
        });
        set({ items: currentItems });
      },

      removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      
      updateQuantity: (id, quantity) => {
        if (!Number.isFinite(quantity) || quantity < 1) return;
        const currentItem = get().items.find((item) => item.id === id);
        if (!currentItem) return;
        const requested = Math.floor(quantity);
        if (typeof currentItem.stock === 'number' && currentItem.stock <= 0 && requested >= currentItem.quantity) return;
        const safeQuantity = typeof currentItem.stock === 'number' && currentItem.stock > 0
          ? Math.min(requested, currentItem.stock)
          : requested;
        set({ items: get().items.map((item) => item.id === id ? { ...item, quantity: safeQuantity } : item) });
      },
      
      clearCart: () => set({ items: [] }),
      getTotalPrice: () => get().items.reduce((total, item) => total + item.price * item.quantity, 0),
      
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      
      openQuickView: (product) => set({ quickViewProduct: product }),
      closeQuickView: () => set({ quickViewProduct: null }),
      
      addRecentlyViewed: (product) => {
        const current = get().recentlyViewed;
        const filtered = current.filter((i) => i.id !== product.id);
        const updated = [product, ...filtered].slice(0, 5);
        set({ recentlyViewed: updated });
      },
    }),
    { name: 'fatemehlab-cart' }
  )
);

// 🛡️ همگام‌سازی سبد خرید بین تب‌های مختلف
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === 'fatemehlab-cart') {
      useCartStore.persist.rehydrate();
    }
  });
}