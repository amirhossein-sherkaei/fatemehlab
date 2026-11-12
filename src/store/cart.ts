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

      addItem: (item) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((i) => i.id === item.id);
        if (existingItem) {
          set({
            items: currentItems.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
            ),
          });
        } else {
          set({ items: [...currentItems, { ...item, quantity: 1 }] });
        }
      },
            addBundle: (itemsToAdd) => {
        const currentItems = [...get().items];
        itemsToAdd.forEach(item => {
          const existingIndex = currentItems.findIndex(i => i.id === item.id);
          if (existingIndex > -1) {
            currentItems[existingIndex].quantity += 1;
          } else {
            currentItems.push({ ...item, quantity: 1 });
          }
        });
        set({ items: currentItems });
      },
      removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),
      updateQuantity: (id, quantity) => {
        if (quantity < 1) return;
        set({
          items: get().items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        });
      },
      clearCart: () => set({ items: [] }),
      getTotalPrice: () => get().items.reduce((total, item) => total + item.price * item.quantity, 0),
      
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      
      openQuickView: (product) => set({ quickViewProduct: product }),
      closeQuickView: () => set({ quickViewProduct: null }),
      
      addRecentlyViewed: (product) => {
        const current = get().recentlyViewed;
        // حذف تکراری‌ها و اضافه کردن به ابتدای لیست
        const filtered = current.filter((i) => i.id !== product.id);
        const updated = [product, ...filtered].slice(0, 5); // فقط ۵ محصول آخر
        set({ recentlyViewed: updated });
      },
    }),
    { name: 'fatemehlab-cart' }
  )
);