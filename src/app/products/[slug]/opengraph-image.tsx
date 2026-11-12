import { ImageResponse } from 'next/og';
import { db } from '@/lib/db';
import { products } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const runtime = 'nodejs';
export const alt = 'محصول فاطمه بیوتی لند';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  // دریافت اطلاعات محصول از دیتابیس
  const [product] = await db.select().from(products).where(eq(products.slug, slug)).limit(1);

  if (!product) {
    return new ImageResponse(
      (
        <div style={{ background: '#fafafc', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 60, color: '#c61d70', fontWeight: 'bold' }}>محصول یافت نشد</span>
        </div>
      ),
      { ...size }
    );
  }

  const priceStr = product.price > 0 ? (product.price / 10).toLocaleString('fa-IR') + ' تومان' : 'به زودی';
  const imageUrl = product.mainImage || '';

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #fafafc 0%, #fff0f7 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'row-reverse', // راست‌چین
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '60px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* بخش متن */}
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, paddingLeft: '40px' }}>
          <div style={{ fontSize: 24, color: '#c61d70', fontWeight: 'bold', marginBottom: 20, display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#c61d70', display: 'inline-block' }}></span>
            FATEMEH BEAUTY LAND
          </div>
          <div style={{ fontSize: 60, fontWeight: '900', color: '#28242b', lineHeight: 1.4, marginBottom: 30 }}>
            {product.name}
          </div>
          <div style={{ fontSize: 40, fontWeight: 'bold', color: '#c61d70', marginTop: 'auto', display: 'flex', alignItems: 'center' }}>
            {priceStr}
          </div>
        </div>

        {/* بخش تصویر محصول */}
        <div style={{ display: 'flex', width: '420px', height: '420px', background: '#fff', borderRadius: '40px', boxShadow: '0 20px 40px rgba(198,29,112,0.15)', overflow: 'hidden', border: '4px solid #f2d7e5', alignItems: 'center', justifyContent: 'center' }}>
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: '20px' }} />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', fontSize: 40, color: '#c61d70' }}>بدون عکس</div>
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}