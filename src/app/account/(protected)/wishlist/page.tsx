import { db } from '@/lib/db';
import { wishlist, products } from '@/db/schema';
import { eq, desc, inArray } from 'drizzle-orm';
import { getCurrentCustomer } from '@/lib/customer-auth';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Package, ArrowLeft, ShoppingBag } from 'lucide-react';
import { formatToman } from '@/lib/currency';
import { getPublicProductImage } from '@/lib/product-content';
import WishlistRemoveButton from './remove-button';


export const instant = false;

export default async function WishlistPage() {
  const customer = await getCurrentCustomer();
  const customerId = customer!.id;

  const items = await db
    .select({
      id: wishlist.id,
      productId: wishlist.productId,
      createdAt: wishlist.createdAt,
    })
    .from(wishlist)
    .where(eq(wishlist.customerId, customerId))
    .orderBy(desc(wishlist.createdAt));

  let productsList: any[] = [];
  if (items.length > 0) {
    const productIds = items.map(i => i.productId);
    productsList = await db.select().from(products).where(inArray(products.id, productIds));
  }

  const mergedItems = items
    .map(item => ({
      ...item,
      product: productsList.find(p => p.id === item.productId),
    }))
    .filter(item => item.product);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-[#28242b] flex items-center gap-2">
            <Heart className="text-rose-500" fill="currentColor" />
            علاقه‌مندی‌های من
          </h1>
          <p className="text-sm text-[#77717b] mt-1">
            {mergedItems.length.toLocaleString('fa-IR')} محصول در لیست علاقه‌مندی‌های شما
          </p>
        </div>
        <Link href="/products" className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 bg-[#c61d70] text-white text-sm font-bold rounded-xl hover:bg-[#a9155d] transition-colors">
          <ShoppingBag size={16} /> ادامه خرید
        </Link>
      </div>

      {mergedItems.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#e9e5eb] p-12 text-center">
          <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart size={40} className="text-rose-300" />
          </div>
          <h3 className="text-lg font-black text-[#28242b] mb-2">لیست علاقه‌مندی‌ها خالی است</h3>
          <p className="text-sm text-[#77717b] mb-6 max-w-md mx-auto">
            محصولاتی که به آن‌ها علاقه دارید را با کلیک روی آیکون قلب ذخیره کنید و بعداً به راحتی پیدایشان کنید.
          </p>
          <Link href="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-[#c61d70] text-white text-sm font-bold rounded-xl hover:bg-[#a9155d] transition-colors">
            مشاهده محصولات <ArrowLeft size={16} />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
          {mergedItems.map((item) => {
            const product = item.product!;
            const hasPrice = product.price > 0;
            const isAvailable = product.stock > 0 && hasPrice;
            const productImage = getPublicProductImage(product.mainImage);

            return (
              <div key={item.id} className="group bg-white rounded-2xl border border-[#e9e5eb] overflow-hidden hover:shadow-xl hover:shadow-[#c61d70]/5 transition-all">
                <Link href={`/products/${product.slug}`} className="block">
                  <div className="relative aspect-square bg-[#fafafc] p-4">
                    {productImage ? (
                      <Image src={productImage} alt={product.name} fill unoptimized={productImage.startsWith('http')} className="object-contain transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[#c61d70]/20"><Package size={32} /></div>
                    )}
                    {!isAvailable && (
                      <span className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-md text-[9px] font-bold text-rose-500 shadow-sm">
                        {hasPrice ? 'ناموجود' : 'در انتظار قیمت'}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm md:text-base font-black text-[#28242b] mb-1 line-clamp-1 group-hover:text-[#c61d70] transition-colors">{product.name}</h3>
                    <div className="flex items-center justify-between border-t border-[#f5f0f2] pt-3 mt-2">
                      <span className="text-xs md:text-sm font-black text-[#28242b]">{hasPrice ? formatToman(product.price) : '---'}</span>
                    </div>
                  </div>
                </Link>
                <div className="px-4 pb-4 flex gap-2">
                  <Link href={`/products/${product.slug}`} className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-[#c61d70] text-white text-xs font-bold rounded-lg hover:bg-[#a9155d] transition-colors">
                    <ShoppingBag size={13} /> مشاهده
                  </Link>
                  <WishlistRemoveButton wishlistId={item.id} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Link href="/products" className="md:hidden flex items-center justify-center gap-2 w-full py-3 bg-[#c61d70] text-white text-sm font-bold rounded-xl hover:bg-[#a9155d] transition-colors">
        <ShoppingBag size={16} /> ادامه خرید
      </Link>
    </div>
  );
}