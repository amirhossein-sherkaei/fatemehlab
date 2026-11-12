import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { stockNotifications, products } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { verifyAdmin } from '@/lib/auth';

export async function GET() {
  try {
    await verifyAdmin();
    
    const notifications = await db
      .select({
        id: stockNotifications.id,
        contact: stockNotifications.phoneOrEmail,
        status: stockNotifications.status,
        createdAt: stockNotifications.createdAt,
        productName: products.name,
        productImage: products.mainImage,
        productStock: products.stock,
      })
      .from(stockNotifications)
      .leftJoin(products, eq(stockNotifications.productId, products.id))
      .orderBy(desc(stockNotifications.createdAt));

    return NextResponse.json({ success: true, notifications });
  } catch {
    return NextResponse.json({ message: 'دسترسی غیرمجاز' }, { status: 401 });
  }
}