'use client';

import { useState } from 'react';
import { useCartStore } from '@/store/cart';
import { ShoppingBag, Loader2, Check, Plus, Minus } from 'lucide-react';
import { toast } from 'sonner';

type CartProduct = {
  id: string;
  name: string;
  slug: string;
  price: number;
  stock: number;
  mainImage: string | null;
};

export default function AddToCartButton({ product }: { product: CartProduct }) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCart);
  
  const hasPrice = product.price > 0;
  const hasStock = product.stock > 0;
  const canPurchase = hasPrice && hasStock;

  const handleAdd = () => {
    if (!canPurchase) return;
    setLoading(true);
    
    setTimeout(() => {
      // ✅ حلقه: به تعداد quantity بار، آیتم را اضافه می‌کنیم
      for (let i = 0; i < quantity; i++) {
        addItem({ 
          id: product.id, 
          name: product.name, 
          slug: product.slug, 
          price: product.price, 
          mainImage: product.mainImage
        });
      }
      
      setLoading(false);
      setAdded(true);
      toast.success(\${quantity} عدد به سبد خرید اضافه شد);
      openCart();
      
      setTimeout(() => setAdded(false), 2000);
    }, 500);
  };

  return (
    <div className="flex items-center gap-3 w-full">
      {/* انتخاب تعداد */}
      {canPurchase && (
        <div className="flex items-center bg-[#f8f7fa] rounded-xl border border-[#e9e5eb] p-1 shrink-0 h-12">
          <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-full flex items-center justify-center text-[#77717b] hover:text-[#c61d70] hover:bg-white rounded-lg transition-colors">
            <Minus size={16} />
          </button>
          <span className="w-8 text-center text-sm font-black text-[#28242b]">{quantity}</span>
          <button type="button" onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} className="w-8 h-full flex items-center justify-center text-[#77717b] hover:text-[#c61d70] hover:bg-white rounded-lg transition-colors">
            <Plus size={16} />
          </button>
        </div>
      )}

      {/* دکمه خرید */}
      <button 
        type="button" 
        onClick={handleAdd} 
        disabled={!canPurchase || loading || added} 
        className={`flex-1 h-12 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all ${
          added ? 'bg-emerald-500 text-white' : 
          canPurchase ? 'bg-[#c61d70] text-white hover:bg-[#a9155d] shadow-lg shadow-[#c61d70]/20' : 
          'bg-[#e9e5eb] text-[#918a95] cursor-not-allowed'
        }`}
      >
        {loading ? <Loader2 size={20} className="animate-spin" /> : 
         added ? <><Check size={20} /> با موفقیت اضافه شد</> : 
         canPurchase ? <><ShoppingBag size={20} /> افزودن به سبد خرید</> : 
         !hasPrice ? 'در انتظار قیمت' : 'ناموجود'}
      </button>
    </div>
  );
}