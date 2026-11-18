import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { orders, customers } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

function failureRedirect(baseUrl: string, reason: string, orderId?: string | null) {
  const target = new URL('/order/failure', baseUrl);
  target.searchParams.set('reason', reason);
  if (orderId) target.searchParams.set('orderId', orderId);
  return NextResponse.redirect(target);
}

function successRedirect(baseUrl: string, orderId: string, trackingCode: string) {
  const target = new URL('/order/success', baseUrl);
  target.searchParams.set('id', orderId);
  target.searchParams.set('code', trackingCode);
  return NextResponse.redirect(target);
}

export async function GET(req: Request) {
  const baseUrl = (process.env.NEXT_PUBLIC_BASE_URL || 'https://fatemehbeautyland.ir').replace(/\/+$/, '');
  try {
    const { searchParams } = new URL(req.url);
    const authority = searchParams.get('Authority');
    const status = searchParams.get('Status');
    const orderId = searchParams.get('orderId');

    if (!authority || !orderId) return failureRedirect(baseUrl, 'missing_params', orderId);
    if (status !== 'OK') return failureRedirect(baseUrl, 'cancelled', orderId);

    const [order] = await db.select().from(orders).where(eq(orders.id, orderId)).limit(1);
    if (!order) return failureRedirect(baseUrl, 'order_not_found', orderId);
    if (order.paymentAuthority !== authority) {
      console.error('[SECURITY] Authority mismatch for order ' + orderId);
      return failureRedirect(baseUrl, 'security_error', orderId);
    }
    if (order.status === 'cancelled') return failureRedirect(baseUrl, 'cancelled', orderId);
    if (order.status === 'paid' || order.status === 'processing') {
      return successRedirect(baseUrl, orderId, order.trackingCode);
    }
    if (order.status !== 'pending') return failureRedirect(baseUrl, 'invalid_order_state', orderId);

    const merchantId = process.env.ZARINPAL_MERCHANT_ID;
    if (!merchantId) return failureRedirect(baseUrl, 'server_error', orderId);

    const response = await fetch('https://payment.zarinpal.com/pg/v4/payment/verify.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ merchant_id: merchantId, amount: order.totalAmount, authority }),
      cache: 'no-store',
    });
    const data = await response.json();

    if (data?.data && (data.data.code === 100 || data.data.code === 101)) {
      const refId = String(data.data.ref_id ?? order.paymentRefId ?? '');
      const finalized = await db.transaction(async (tx) => {
        const [updated] = await tx.update(orders)
          .set({ status: 'paid', paymentRefId: refId })
          .where(and(
            eq(orders.id, orderId),
            eq(orders.status, 'pending'),
            eq(orders.paymentAuthority, authority)
          ))
          .returning({ id: orders.id });

        if (!updated) {
          const [latest] = await tx.select({ status: orders.status })
            .from(orders).where(eq(orders.id, orderId)).limit(1);
          return latest?.status === 'paid' || latest?.status === 'processing';
        }

        if (order.customerId) {
          const [customer] = await tx.select().from(customers).where(eq(customers.id, order.customerId)).limit(1);
          if (customer) {
            const earnedPoints = Math.floor(order.totalAmount / 100000);
            const newPoints = customer.loyaltyPoints + earnedPoints;
            let newTier = 'bronze';
            if (newPoints >= 1500) newTier = 'gold';
            else if (newPoints >= 500) newTier = 'silver';
            await tx.update(customers)
              .set({ loyaltyPoints: newPoints, tier: newTier })
              .where(eq(customers.id, order.customerId));
          }
        }
        return true;
      });

      if (finalized) return successRedirect(baseUrl, orderId, order.trackingCode);
      return failureRedirect(baseUrl, 'verification_conflict', orderId);
    }

    console.error('[Zarinpal Verify Error]', data);
    return failureRedirect(baseUrl, 'verify_failed', orderId);
  } catch (error) {
    console.error('[Payment Verify Error]', error);
    const params = new URL(req.url).searchParams;
    return failureRedirect(baseUrl, 'server_error', params.get('orderId'));
  }
}
