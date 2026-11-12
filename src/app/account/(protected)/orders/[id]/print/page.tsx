import { db } from '@/lib/db';
import { orders, orderItems } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { getCurrentCustomer } from '@/lib/customer-auth';
import { notFound } from 'next/navigation';
import InvoiceTemplate from '@/components/shared/InvoiceTemplate';
import PrintButton from '@/components/shared/PrintButton';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default async function CustomerPrintPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = await getCurrentCustomer();
  
  const orderData = await db.select().from(orders).where(and(eq(orders.id, id), eq(orders.customerId, customer!.id))).limit(1);
  if (orderData.length === 0) notFound();

  const order = orderData[0];
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id));

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center no-print">
        <Link href={`/account/orders/${id}`} className="flex items-center gap-2 text-sm font-bold text-[#28242b] bg-white px-4 py-2 rounded-xl shadow-sm hover:bg-gray-50">
          <ArrowRight size={16} /> بازگشت به سفارش
        </Link>
        <PrintButton />
      </div>
      <InvoiceTemplate order={order} items={items} />
    </div>
  );
}