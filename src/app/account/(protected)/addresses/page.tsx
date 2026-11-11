import { db } from '@/lib/db';
import { addresses } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getCurrentCustomer } from '@/lib/customer-auth';
import AddressList from './address-list';


export const instant = false;

export default async function AddressesPage() {
  const customer = await getCurrentCustomer();
  const list = await db
    .select()
    .from(addresses)
    .where(eq(addresses.customerId, customer!.id))
    .orderBy(desc(addresses.isDefault), desc(addresses.createdAt));

  return <AddressList initialAddresses={list} />;
}