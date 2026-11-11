import { NextResponse } from 'next/server';
import { validateOrigin, rejectCsrf } from '@/lib/security';
import { db } from '@/lib/db';
import { products } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath, revalidateTag } from 'next/cache';
import { verifyAdmin } from '@/lib/auth';
import { tomanToRial } from '@/lib/currency';

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { valid: originValid } = validateOrigin(req);
    if (!originValid) return rejectCsrf(req);

    await verifyAdmin();
    const { id } = await params;
    const body = await req.json();
    const { name, slug, sku, description, price, stock, status, mainImage, gallery, specifications, ingredients, usage } = body;

    await db.update(products)
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
      .where(eq(products.id, id));

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