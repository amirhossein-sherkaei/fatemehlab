import { formatPersianDate, formatPersianDateTime } from '@/lib/format';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, orderItems } from '@/db/schema';
import { verifyAdmin } from '@/lib/auth';
import { desc, eq } from 'drizzle-orm';

export async function GET() {
  try {
    await verifyAdmin();

    const allOrders = await db.select().from(orders).orderBy(desc(orders.createdAt));
    const allItems = await db.select().from(orderItems);

    // Build CSV
    const headers = ['کد رهگیری', 'نام', 'نام خانوادگی', 'موبایل', 'شهر', 'آدرس', 'کد پستی', 'مبلغ کل', 'تخفیف', 'کد تخفیف', 'وضعیت', 'تاریخ', 'محصولات'];
    const rows: string[][] = [headers];

    for (const order of allOrders) {
      const items = allItems.filter(i => i.orderId === order.id);
      const productList = items.map(i => `${i.productName} (${i.quantity})`).join(' | ');
      
      const statusMap: Record<string, string> = {
        pending: 'در انتظار',
        paid: 'پرداخت شده',
        processing: 'در حال پردازش',
        shipped: 'ارسال شده',
        delivered: 'تحویل شده',
        cancelled: 'لغو شده',
      };

      rows.push([
        order.trackingCode,
        order.firstName,
        order.lastName,
        order.phone,
        order.city,
        order.address,
        order.postalCode,
        order.totalAmount.toString(),
        order.discountAmount?.toString() || '0',
        order.couponCode || '',
        statusMap[order.status] || order.status,
        formatPersianDate(order.createdAt),
        productList,
      ]);
    }

    // Add BOM for Excel UTF-8 compatibility
    const BOM = '\uFEFF';
    const csvContent = BOM + rows.map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(',')).join('\r\n');

    return new NextResponse(csvContent, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="fatemehlab-orders-${Date.now()}.csv"`,
      },
    });
  } catch (error) {
    return NextResponse.json({ message: 'خطا در خروجی' }, { status: 500 });
  }
}