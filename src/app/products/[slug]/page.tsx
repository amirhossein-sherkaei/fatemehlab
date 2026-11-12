import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { and, eq, ne, inArray, sql, desc } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { ChevronLeft, ShieldAlert, Sparkles, Droplets, Package, CheckCircle2 } from 'lucide-react';
import { db } from '@/lib/db';
import { products, orderItems } from '@/db/schema';
import { formatToman } from '@/lib/currency';
import { getPublicProductDescription, getPublicProductImage } from '@/lib/product-content';
import Header from '@/components/storefront/Header';
import Footer from '@/components/storefront/Footer';
import AddToCartButton from './add-to-cart';
import WishlistButton from '@/components/storefront/WishlistButton';
import ShareButton from '@/components/storefront/ShareButton';
import ProductReviews from '@/components/storefront/ProductReviews';
import FrequentlyBoughtTogether from '@/components/product/FrequentlyBoughtTogether';
import RecentlyViewedTracker from '@/components/storefront/RecentlyViewedTracker';


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const [product] = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  if (!product || product.status !== 'published') return { title: 'محصول یافت نشد' };
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://fatemehbeautyland.ir';
  const productUrl = `${baseUrl}/products/${product.slug}`;
  const title = `${product.name} | فاطمه بیوتی لند`;
  const description = product.description || `خرید ${product.name} از فاطمه بیوتی لند با تضمین اصالت و ارسال سریع.`;

  return {
    title,
    description,
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      title,
      description,
      url: productUrl,
      siteName: 'فاطمه بیوتی لند',
      images: product.mainImage ? [{ url: product.mainImage }] : [],
      locale: 'fa_IR',
      type: 'website',
    },
  };
} = await params;
  const [product] = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  if (!product || product.status !== 'published') return { title: 'محصول یافت نشد' };
  return {
    title: `${product.name} | فاطمه بیوتی لند`,
    description: product.description || `خرید ${product.name} از فاطمه بیوتی لند با تضمین اصالت.`,
  };
}

export const instant = false;

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [product] = await db.select().from(products).where(eq(products.slug, slug)).limit(1);

  if (!product || product.status !== 'published') notFound();

  const isPriced = product.price > 0;
  const isAvailable = product.stock > 0 && isPriced; 
  const publicDescription = getPublicProductDescription(product.description);
  const publicMainImage = getPublicProductImage(product.mainImage);
  // ══════════ محاسبه هوشمند محصولات خریداری‌شده با هم ══════════
  let fbtProducts: any[] = [];
  try {
    // ۱. پیدا کردن سفارشاتی که این محصول در آن‌ها بوده (بهینه‌شده)
    const ordersWithProduct = await db.select({ orderId: orderItems.orderId }).from(orderItems).where(eq(orderItems.productId, product.id)).limit(50);
    const orderIds = ordersWithProduct.map(o => o.orderId);

    if (orderIds.length > 0) {
      // ۲. پیدا کردن سایر محصولات در آن سفارشات با یک کوئری واحد (جلوگیری از N+1)
      const otherItems = await db.select({ productId: orderItems.productId })
        .from(orderItems)
        .where(and(inArray(orderItems.orderId, orderIds), ne(orderItems.productId, product.id)))
        .groupBy(orderItems.productId)
        .orderBy(desc(sql`count(*)`))
        .limit(2);
      
      const fbtIds = otherItems.map(i => i.productId);
      if (fbtIds.length > 0) {
        // دریافت محصولات با یک کوئری
        fbtProducts = await db.select().from(products).where(and(inArray(products.id, fbtIds), eq(products.status, 'published')));
      }
    }

    // ۳. اگر داده‌ای نبود، از محصولات مشابه استفاده کن (Fallback)
    if (fbtProducts.length === 0) {
      fbtProducts = await db.select().from(products).where(and(eq(products.status, 'published'), ne(products.id, product.id))).limit(2);
    }
  } catch (e) {
    console.error('FBT Error:', e);
  }
  const publicGallery = (product.gallery || []).map((img) => getPublicProductImage(img)).filter((img): img is string => Boolean(img));

  const relatedProducts = await db.select().from(products).where(and(eq(products.status, 'published'), ne(products.id, product.id))).limit(4);
  const specs = Array.isArray(product.specifications) ? product.specifications : [];

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafc]">
      {/* JSON-LD for Product Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.name,
            "image": publicMainImage ? [publicMainImage] : [],
            "description": publicDescription || product.name,
            "sku": product.sku || product.id,
            "brand": {
              "@type": "Brand",
              "name": product.brand || "فاطمه بیوتی لند"
            },
            "offers": {
              "@type": "Offer",
              "url": `https://fatemehbeautyland.ir/products/${product.slug}`,
              "priceCurrency": "IRR",
              "price": product.price,
              "availability": isAvailable ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              "seller": {
                "@type": "Organization",
                "name": "فاطمه بیوتی لند"
              }
            }
          })
        }}
      />
      <RecentlyViewedTracker product={product} />
      <Header />
      <main className="flex-1 pb-32 md:pb-12">
        <div className="container-custom px-4 md:px-6 py-6">
          
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[11px] text-[#918a95] mb-6 whitespace-nowrap overflow-x-auto">
            <Link href="/" className="hover:text-[#c61d70]">خانه</Link>
            <ChevronLeft size={12} />
            <Link href="/products" className="hover:text-[#c61d70]">محصولات</Link>
            <ChevronLeft size={12} />
            <span className="text-[#28242b] font-bold truncate">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            
            {/* گالری تصاویر */}
            <div className="space-y-3">
              <div className="relative aspect-square md:aspect-[4/5] rounded-3xl overflow-hidden bg-white border border-[#e9e5eb] shadow-sm flex items-center justify-center p-6 md:p-10">
                {publicMainImage ? (
                  <Image src={publicMainImage} alt={product.name} fill className="object-contain" priority />
                ) : (
                  <Package size={80} className="text-[#c61d70]/20" />
                )}
              </div>
              {publicGallery.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {publicGallery.map((img, i) => (
                    <div key={i} className="relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-xl overflow-hidden border border-[#e9e5eb] bg-white">
                       <Image src={img} alt={`${product.name} - ${i}`} fill className="object-contain p-1.5" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* اطلاعات و خرید */}
            <div className="flex flex-col">
              {product.brand && (
                <span className="text-[11px] font-bold text-[#c61d70] mb-2">{product.brand}</span>
              )}
              <h1 className="text-2xl md:text-4xl font-black text-[#28242b] leading-[1.4] mb-3">{product.name}</h1>
              
              <div className="flex items-center gap-3 mb-4">
                <span className={`text-[10px] font-black px-3 py-1.5 rounded-md flex items-center gap-1 ${isAvailable ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {isAvailable ? <><CheckCircle2 size={12} /> موجود در انبار</> : 'ناموجود'}
                </span>
                {product.sku && <span className="text-[10px] text-[#918a95]" dir="ltr">SKU: {product.sku}</span>}
              </div>

              {publicDescription && <p className="text-[#77717b] text-sm leading-loose mb-6">{publicDescription}</p>}

              <div className="bg-white rounded-2xl border border-[#e9e5eb] p-5 md:p-6 mb-6 shadow-sm">
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <span className="block text-xs text-[#918a95] mb-1">قیمت</span>
                    <span className="text-2xl md:text-3xl font-black text-[#28242b]">
                      {isPriced ? formatToman(product.price) : 'به زودی'}
                    </span>
                  </div>
                </div>
                <div className="hidden md:flex gap-3 items-stretch">
                  <div className="flex-1">
                    <AddToCartButton product={product} />
                  </div>
                  <WishlistButton productId={product.id} variant="button" className="min-w-[140px]" />
                  <ShareButton title={product.name} />
                </div>
              </div>

              {/* هشدارها و نوع پوست */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {product.skinType && (
                  <div className="flex items-center gap-2 rounded-xl border border-[#f2d7e5] bg-[#fff0f7] p-3 text-xs text-[#c61d70] font-bold">
                    <Sparkles size={16} /> مناسب برای: {product.skinType}
                  </div>
                )}
                {product.countryOfOrigin && (
                  <div className="flex items-center gap-2 rounded-xl border border-[#e9e5eb] bg-white p-3 text-xs text-[#77717b] font-bold">
                    <Package size={16} /> کشور سازنده: {product.countryOfOrigin}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* جزئیات، ترکیبات و هشدارها */}
          <div className="mt-12 md:mt-20 max-w-4xl mx-auto space-y-8">
            
            {/* مشخصات فنی */}
            {specs.length > 0 && (
              <div className="bg-white rounded-2xl border border-[#e9e5eb] overflow-hidden shadow-sm">
                <div className="p-4 border-b border-[#e9e5eb] bg-[#fafafc]">
                  <h3 className="text-sm font-black text-[#28242b]">مشخصات محصول</h3>
                </div>
                <div className="divide-y divide-[#e9e5eb]">
                  {specs.map((spec, i) => (
                    <div key={i} className="flex justify-between p-4 text-xs">
                      <span className="text-[#77717b]">{spec.key}</span>
                      <span className="font-bold text-[#28242b]" dir="auto">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ترکیبات */}
            {product.ingredients && (
              <div className="bg-white rounded-2xl border border-[#e9e5eb] p-6 shadow-sm">
                <h3 className="text-sm font-black text-[#28242b] mb-3 flex items-center gap-2"><Droplets size={16} className="text-[#c61d70]" /> ترکیبات</h3>
                <p className="text-xs leading-loose text-[#77717b]">{product.ingredients}</p>
              </div>
            )}

            {/* روش استفاده */}
            {product.usage && (
              <div className="bg-white rounded-2xl border border-[#e9e5eb] p-6 shadow-sm">
                <h3 className="text-sm font-black text-[#28242b] mb-3 flex items-center gap-2"><Sparkles size={16} className="text-[#c61d70]" /> روش استفاده</h3>
                <p className="text-xs leading-loose text-[#77717b]">{product.usage}</p>
              </div>
            )}

            {/* هشدارهای ایمنی */}
            {product.warnings && (
              <div className="bg-amber-50 rounded-2xl border border-amber-200 p-6 shadow-sm">
                <h3 className="text-sm font-black text-amber-800 mb-3 flex items-center gap-2"><ShieldAlert size={16} /> هشدارهای ایمنی</h3>
                <p className="text-xs leading-loose text-amber-900/80">{product.warnings}</p>
              </div>
            )}
          </div>

          <FrequentlyBoughtTogether currentProduct={product} fbtProducts={fbtProducts} />`n`n          <ProductReviews productId={product.id} />

          {/* محصولات مشابه */}
          {relatedProducts.length > 0 && (
            <section className="mt-16 md:mt-24 border-t border-[#e9e5eb] pt-10">
              <h2 className="text-xl font-black text-[#28242b] mb-6 text-center">محصولات مشابه</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {relatedProducts.map(p => (
                  <Link key={p.id} href={`/products/${p.slug}`} className="group bg-white rounded-xl border border-[#e9e5eb] overflow-hidden hover:shadow-lg transition-all">
                    <div className="relative aspect-square bg-[#fafafc]">
                      {getPublicProductImage(p.mainImage) ? (
                        <Image src={getPublicProductImage(p.mainImage)!} alt={p.name} fill className="object-contain p-3" />
                      ) : (
                        <Package size={32} className="absolute inset-0 m-auto text-[#c61d70]/20" />
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="text-xs font-bold text-[#28242b] group-hover:text-[#c61d70] truncate">{p.name}</h3>
                      <span className="text-[11px] font-black text-[#c61d70] mt-1 block">{p.price > 0 ? formatToman(p.price) : 'به زودی'}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

        </div>
      </main>

      {/* استیکی خرید موبایل */}
      {isPriced && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-[#e9e5eb] p-4 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] pb-safe">
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="block text-[10px] text-[#918a95]">قیمت</span>
              <span className="text-base font-black text-[#28242b]">{formatToman(product.price)}</span>
            </div>
            <div className="flex-1 max-w-[220px]"><AddToCartButton product={product} /></div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}