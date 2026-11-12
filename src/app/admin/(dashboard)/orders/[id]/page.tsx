import { Suspense } from 'react';
import { db } from '@/lib/db';
import { orders, orderItems } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import AdminGuard from '@/components/admin/AdminGuard';
import { formatToman } from '@/lib/currency';
import { ArrowRight, User, Phone, MapPin, Package } from 'lucide-react';
import Link from 'next/link';
import StatusUpdater from './status-updater';
import { Printer } from 'lucide-react';

export const instant = false;

function Skeleton() {
  return <div className="p-8 text-center text-[#77717b]">در حال بارگذاری سفارش...</div>;
}

async function Content({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const orderData = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  if (orderData.length === 0) notFound();
  const order = orderData[0];
  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id));

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href={/admin/orders//print} target="_blank" className="flex items-center gap-2 px-4 py-2 bg-[#c61d70] text-white text-sm font-bold rounded-xl shadow-sm hover:bg-[#a9155d]"><Printer size={16} /> پرینت فاکتور</Link>
        <Link href="/admin/orders" prefetch={false} className="p-2 bg-white border border-border rounded-xl hover:bg-[#F8F9FA] transition-colors shadow-sm">
          <ArrowRight className="w-5 h-5 text-foreground" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-foreground">جزئیات سفارش</h1>
          <p className="text-sm text-muted-foreground mt-1 font-mono" dir="ltr">{order.trackingCode}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-white border border-border rounded-2xl shadow-sm p-6 space-y-4">
          <h2 className="text-lg font-bold border-b border-border pb-3 mb-4 flex items-center gap-2"><User className="w-5 h-5 text-sage" /> مشتری</h2>
          <div className="space-y-3 text-sm">
            <p className="flex justify-between"><span className="text-muted-foreground">نام:</span> <span className="font-medium">{order.firstName} {order.lastName}</span></p>
            <p className="flex justify-between"><span className="text-muted-foreground">تلفن:</span> <span className="font-medium font-mono" dir="ltr">{order.phone}</span></p>
            <p className="flex justify-between"><span className="text-muted-foreground">شهر:</span> <span className="font-medium">{order.city}</span></p>
            <p className="flex justify-between"><span className="text-muted-foreground">کد پستی:</span> <span className="font-medium font-mono" dir="ltr">{order.postalCode}</span></p>
          </div>
          <div className="pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground mb-2 flex items-center gap-2"><MapPin className="w-4 h-4" /> آدرس:</p>
            <p className="text-sm bg-[#F8F9FA] p-3 rounded-lg border border-border leading-relaxed">{order.address}</p>
          </div>
        </div>

        <div className="md:col-span-2 space-y-6">
          <div className="bg-white border border-border rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-bold border-b border-border pb-3 mb-4 flex items-center gap-2"><Package className="w-5 h-5 text-sage" /> محصولات سفارش</h2>
            <div className="space-y-4 mb-6">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center text-sm">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 flex items-center justify-center bg-[#F8F9FA] border border-border rounded-lg text-xs font-bold">{item.quantity}</span>
                    <span className="font-medium text-foreground">{item.productName}</span>
                  </div>
                  <span className="font-bold">{formatToman(item.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-4 flex justify-between items-center">
              <span className="font-bold text-foreground">مبلغ کل</span>
              <span className="font-black text-xl text-sage">{formatToman(order.totalAmount)}</span>
            </div>
          </div>

          <StatusUpdater orderId={order.id} currentStatus={order.status} />
        </div>
      </div>
    </div>
  );
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<Skeleton />}>
      <AdminGuard>
        <Content params={params} />
      </AdminGuard>
    </Suspense>
  );
}