import { Suspense } from 'react';
import { db } from '@/lib/db';
import { coupons } from '@/db/schema';
import { desc } from 'drizzle-orm';
import CouponsClient from './coupons-client';

export const instant = false;

function Skeleton() {
  return <div className="p-8 text-center text-[#77717b]">در حال بارگذاری کدهای تخفیف...</div>;
}

async function Content() {
  const allCoupons = await db.select().from(coupons).orderBy(desc(coupons.createdAt));
  return <CouponsClient initialCoupons={allCoupons} />;
}

export default function Page() {
  return <Suspense fallback={<Skeleton />}><Content /></Suspense>;
}