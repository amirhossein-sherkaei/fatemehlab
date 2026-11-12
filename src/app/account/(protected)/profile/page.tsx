import { db } from '@/lib/db';
import { customers, orders, wishlist, addresses } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getCurrentCustomer } from '@/lib/customer-auth';
import ProfileClient from './profile-client';

export const instant = false;

export default async function ProfilePage() {
  const current = await getCurrentCustomer();
  const [customer] = await db.select().from(customers).where(eq(customers.id, current!.id)).limit(1);

  const myOrders = await db.select({ id: orders.id }).from(orders).where(eq(orders.customerId, current!.id));
  const myWishlist = await db.select({ id: wishlist.id }).from(wishlist).where(eq(wishlist.customerId, current!.id));
  const myAddresses = await db.select({ id: addresses.id }).from(addresses).where(eq(addresses.customerId, current!.id));

  const recentOrders = await db
    .select({
      id: orders.id,
      trackingCode: orders.trackingCode,
      totalAmount: orders.totalAmount,
      status: orders.status,
      createdAt: orders.createdAt,
    })
    .from(orders)
    .where(eq(orders.customerId, current!.id))
    .orderBy(desc(orders.createdAt))
    .limit(3);

  const stats = {
    orders: myOrders.length,
    wishlist: myWishlist.length,
    addresses: myAddresses.length,
    memberSince: customer.createdAt,
    loyaltyPoints: customer.loyaltyPoints,
    tier: customer.tier,
  };

  const isOtpUser = customer.email.endsWith('@temp.fatemehlab.ir');

  return <ProfileClient customer={customer} stats={stats} recentOrders={recentOrders} isOtpUser={isOtpUser} />;
}