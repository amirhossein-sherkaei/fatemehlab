import { NextResponse } from 'next/server';
import { validateOrigin, rejectCsrf } from '@/lib/security';
import { db } from '@/lib/db';
import { products } from '@/db/schema';
import { revalidatePath, revalidateTag } from 'next/cache';
import { verifyAdmin } from '@/lib/auth';
import { z } from 'zod';
import { tomanToRial } from '@/lib/currency';

const productSchema = z.object({
  name: z.string().min(2, 'نام محصول حداقل ۲ حرف باشد'),
  slug: z.string().min(2, 'شناسه حداقل ۲ حرف باشد').regex(/^[a-z0-9-]+$/, 'شناسه نامعتبر است'),
  sku: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  price: z.coerce.number().int().min(0, 'قیمت نمی‌تواند منفی باشد').max(214748364, 'قیمت از سقف قابل ذخیره بیشتر است'),
  compareAtPrice: z.union([z.coerce.number().int().positive().max(214748364), z.null()]).optional(),
  stock: z.coerce.number().int().min(0, 'موجودی نمی‌تواند منفی باشد').max(2147483647),
  status: z.enum(['draft', 'published']),
  mainImage: z.string().optional().nullable(),
  gallery: z.array(z.string()).optional().default([]),
  specifications: z.array(z.object({ key: z.string(), value: z.string() })).optional().default([]),
  ingredients: z.string().optional().nullable(),
  usage: z.string().optional().nullable(),
});

export async function POST(req: Request) {
  try {
    const { valid: originValid } = validateOrigin(req);
    if (!originValid) return rejectCsrf(req);

    await verifyAdmin();
    const body = await req.json();
    const validated = productSchema.parse(body);
    if (validated.compareAtPrice != null && validated.compareAtPrice <= validated.price) {
      return NextResponse.json({ message: 'قیمت قبل از تخفیف باید بیشتر از قیمت فروش باشد.' }, { status: 400 });
    }

    const newProduct = await db.insert(products).values({
      ...validated,
      price: tomanToRial(validated.price),
      compareAtPrice: validated.compareAtPrice == null ? null : tomanToRial(validated.compareAtPrice),
    }).returning();

    revalidateTag('products', 'max');
    revalidatePath('/admin/products');
    revalidatePath('/');

    return NextResponse.json({ success: true, product: newProduct[0] });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') return NextResponse.json({ message: 'دسترسی غیرمجاز' }, { status: 401 });
    if (error instanceof z.ZodError) return NextResponse.json({ message: error.issues[0].message }, { status: 400 });
    if (error?.cause?.code === '23505') return NextResponse.json({ message: 'این شناسه قبلاً استفاده شده است.' }, { status: 400 });
    return NextResponse.json({ message: 'خطا در ثبت محصول' }, { status: 500 });
  }
}