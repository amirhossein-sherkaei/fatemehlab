import { db } from '@/lib/db';
import { orders, orderItems } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import InvoiceTemplate from '@/components/shared/InvoiceTemplate';
import PrintButton from './print-button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default async function AdminPrintPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const orderData = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  if (orderData.length === 0) notFound();

  const order = orderData[0];
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id));

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center no-print">
        <Link href={`/admin/orders/${id}`} className="flex items-center gap-2 text-sm font-bold text-[#28242b] bg-white px-4 py-2 rounded-xl shadow-sm hover:bg-gray-50">
          <ArrowRight size={16} /> بازگشت به سفارش
        </Link>
        <PrintButton />
      </div>
      <InvoiceTemplate order={order} items={items} isAdmin={true} />
    </div>
  );
}