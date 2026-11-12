import { NextResponse } from 'next/server';
import { validateOrigin, rejectCsrf } from '@/lib/security';
import { db } from '@/lib/db';
import { products } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath, revalidateTag } from 'next/cache';
import { verifyAdmin } from '@/lib/auth';
import { stockNotifications } from '@/db/schema';
import { sendBackInStockSms } from '@/lib/sms';
import { and, eq } from 'drizzle-orm';
import { tomanToRial } from '@/lib/currency';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { valid: originValid } = validateOrigin(req);
    if (!originValid) return rejectCsrf(req);

    await verifyAdmin();
    const { id } = await params;
    const body = await req.json();
    const { name, slug, sku, description, price, stock, status, mainImage, gallery, specifications, ingredients, usage } = body;

        const [updatedProduct] = await db.update(products)
      .set({ 
        name, slug, sku: sku || null, description, 
        price: tomanToRial(Number(price)), 
        stock: Number(stock), 
        status, mainImage, 
        gallery: gallery || [], 
        specifications: specifications || [], 
        ingredients, usage, 
        updatedAt: new Date() 
      })
      .where(eq(products.id, id))
      .returning();

    // 🚀 ارسال خودکار پیامک در صورت شارژ موجودی
    if (updatedProduct && Number(updatedProduct.stock) > 0) {
      const pendingNotifs = await db.select().from(stockNotifications)
        .where(and(eq(stockNotifications.productId, id), eq(stockNotifications.status, 'pending')));
      
      if (pendingNotifs.length > 0) {
        // ارسال پیامک (بدون await کردن برای اینکه سرعت پنل ادمین کم نشود)
        Promise.all(pendingNotifs.map(async (notif) => {
          if (notif.phoneOrEmail.startsWith('09')) {
            await sendBackInStockSms(notif.phoneOrEmail, updatedProduct.name);
          } else {
            console.log(`[Email Mock] Send email to ${notif.phoneOrEmail} for product ${updatedProduct.name}`);
          }
          
          // آپدیت وضعیت به notified
          await db.update(stockNotifications).set({ status: 'notified' }).where(eq(stockNotifications.id, notif.id));
        })).catch(err => console.error('Stock notify send error:', err));
      }
    }

    revalidateTag('products', 'max');
    revalidatePath('/admin/products');
    revalidatePath('/');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') return NextResponse.json({ message: 'دسترسی غیرمجاز' }, { status: 401 });
    if (error?.cause?.code === '23505') return NextResponse.json({ message: 'این شناسه قبلاً استفاده شده است.' }, { status: 400 });
    return NextResponse.json({ message: 'خطا در ویرایش محصول' }, { status: 500 });
  }
}