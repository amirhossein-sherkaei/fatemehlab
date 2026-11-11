import { db } from '@/lib/db';
import { coupons } from '@/db/schema';
import { desc } from 'drizzle-orm';
import CouponsClient from './coupons-client';

export const instant = false;

export default async function AdminCouponsPage() {
  const allCoupons = await db.select().from(coupons).orderBy(desc(coupons.createdAt));
  return <CouponsClient initialCoupons={allCoupons} />;
}