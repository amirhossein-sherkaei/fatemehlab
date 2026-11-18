import { NextResponse } from 'next/server';
import { validateOrigin, rejectCsrf } from '@/lib/security';
import { db } from '@/lib/db';
import { products, stockNotifications } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { revalidatePath, revalidateTag } from 'next/cache';
import { verifyAdmin } from '@/lib/auth';
import { tomanToRial } from '@/lib/currency';
import { sendBackInStockSms } from '@/lib/sms';
import { z } from 'zod';

const updateSchema = z.object({
  name: z.string().min(2).max(200),
  slug: z.string().min(2).max(200),
  sku: z.string().optional().nullable(),
  brand: z.string().optional().nullable(),
  countryOfOrigin: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  price: z.number().int().min(0),
  compareAtPrice: z.union([z.number().int().positive(), z.null()]).optional(),
  stock: z.number().int().min(0),
  status: z.enum(['draft', 'published']),
  mainImage: z.string().optional().nullable(),
  gallery: z.array(z.string()).optional().default([]),
  specifications: z.array(z.object({ key: z.string(), value: z.string() })).optional().default([]),
  ingredients: z.string().optional().nullable(),
  usage: z.string().optional().nullable(),
  skinType: z.string().optional().nullable(),
  expiryDate: z.string().optional().nullable(),
  warnings: z.string().optional().nullable(),
});

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { valid: originValid } = validateOrigin(req);
    if (!originValid) return rejectCsrf(req);

    await verifyAdmin();
    const { id } = await params;
    const parsed = updateSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ message: parsed.error.issues[0]?.message || 'اطلاعات محصول معتبر نیست.' }, { status: 400 });
    }

    const data = parsed.data;
    if (data.compareAtPrice != null && data.compareAtPrice <= data.price) {
      return NextResponse.json({ message: 'قیمت قبل از تخفیف باید بیشتر از قیمت فروش باشد.' }, { status: 400 });
    }

    const updateValues = {
      name: data.name,
      slug: data.slug,
      ...(data.sku !== undefined ? { sku: data.sku || null } : {}),
      brand: data.brand || null,
      countryOfOrigin: data.countryOfOrigin || null,
      description: data.description || null,
      price: tomanToRial(data.price),
      compareAtPrice: data.compareAtPrice == null ? null : tomanToRial(data.compareAtPrice),
      stock: data.stock,
      status: data.status,
      mainImage: data.mainImage || null,
      gallery: data.gallery,
      specifications: data.specifications,
      ingredients: data.ingredients || null,
      usage: data.usage || null,
      skinType: data.skinType || null,
      expiryDate: data.expiryDate || null,
      warnings: data.warnings || null,
      updatedAt: new Date(),
    };

    const [updatedProduct] = await db.update(products)
      .set(updateValues)
      .where(eq(products.id, id))
      .returning();

    if (!updatedProduct) {
      return NextResponse.json({ message: 'محصول موردنظر پیدا نشد.' }, { status: 404 });
    }

    if (updatedProduct.stock > 0) {
      const pendingNotifs = await db.select()
        .from(stockNotifications)
        .where(and(eq(stockNotifications.productId, id), eq(stockNotifications.status, 'pending')))
        .limit(15);

      for (const notif of pendingNotifs) {
        try {
          if (notif.phoneOrEmail.startsWith('09')) {
            const result = await sendBackInStockSms(notif.phoneOrEmail, updatedProduct.name);
            if (!result.success) continue;
          } else {
            console.log('[Email Mock] Send email to ' + notif.phoneOrEmail);
          }
          await db.update(stockNotifications)
            .set({ status: 'notified' })
            .where(eq(stockNotifications.id, notif.id));
        } catch (err) {
          console.error('[stock-notify] Failed:', err);
        }
      }
    }

    revalidateTag('products', 'max');
    revalidatePath('/admin/products');
    revalidatePath('/products');
    revalidatePath('/products/' + updatedProduct.slug);
    revalidatePath('/');

    return NextResponse.json({ success: true, product: updatedProduct });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') return NextResponse.json({ message: 'دسترسی غیرمجاز' }, { status: 401 });
    if (error?.cause?.code === '23505') return NextResponse.json({ message: 'این شناسه قبلاً استفاده شده است.' }, { status: 400 });
    console.error('[admin/products/update]', error);
    return NextResponse.json({ message: 'خطا در ویرایش محصول' }, { status: 500 });
  }
}
