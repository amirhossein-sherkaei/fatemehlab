import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { customers, orders } from '@/db/schema';
import { and, eq, sql } from 'drizzle-orm';
import { isSettledOrderStatus } from '@/lib/order-payment';
import { inquireZarinpalAuthority, verifyZarinpalAuthority } from '@/lib/zarinpal';
import { rateLimit } from '@/lib/rate-limit';

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
  const params = new URL(req.url).searchParams;
  const authority = params.get('Authority');
  const callbackStatus = params.get('Status');
  const orderId = params.get('orderId');

  try {
    if (!authority || authority.length > 128 || /[^a-zA-Z0-9_-]/.test(authority) || !orderId || !/^[0-9a-f]{8}-[0-9a-f-]{27}$/i.test(orderId)) {
      return failureRedirect(baseUrl, 'missing_params', orderId);
    }
    if (callbackStatus !== 'OK' && callbackStatus !== 'NOK') return failureRedirect(baseUrl, 'invalid_callback', orderId);

    const merchantId = process.env.ZARINPAL_MERCHANT_ID;
    if (!merchantId) return failureRedirect(baseUrl, 'server_error', orderId);

    // Serialize callback verification with customer retries and expired-order cleanup.
    // This prevents a late callback for an old authority racing a newly issued authority.
    return await db.transaction(async (tx) => {
      await tx.execute(sql`SELECT pg_advisory_xact_lock(hashtext('fatemehlab:payment'), hashtext(${orderId}))`);

      const [order] = await tx.select().from(orders).where(eq(orders.id, orderId)).limit(1);
      if (!order) return failureRedirect(baseUrl, 'order_not_found', orderId);
      if (order.paymentAuthority !== authority) {
        console.error('[SECURITY] Authority mismatch for order ' + orderId);
        return failureRedirect(baseUrl, 'security_error', orderId);
      }

      const callbackLimit = await rateLimit('payment-callback:' + orderId, { failClosedOnStoreError: true });
      if (callbackLimit.unavailable) return failureRedirect(baseUrl, 'server_error', orderId);
      if (!callbackLimit.success) return failureRedirect(baseUrl, 'verify_failed', orderId);
      if (order.status === 'cancelled') return failureRedirect(baseUrl, 'cancelled', orderId);
      if (isSettledOrderStatus(order.status)) return successRedirect(baseUrl, orderId, order.trackingCode);
      if (order.status !== 'pending') return failureRedirect(baseUrl, 'invalid_order_state', orderId);

      const finalizeInsideTransaction = async (refId: string | null): Promise<boolean> => {
        const [current] = await tx.select({
          status: orders.status,
          paymentAuthority: orders.paymentAuthority,
          customerId: orders.customerId,
          totalAmount: orders.totalAmount,
        }).from(orders).where(eq(orders.id, orderId)).limit(1);

        if (!current) return false;
        if (isSettledOrderStatus(current.status)) return true;
        if (current.status !== 'pending' || current.paymentAuthority !== authority) return false;

        const [updated] = await tx.update(orders)
          .set({ status: 'paid', ...(refId ? { paymentRefId: refId } : {}) })
          .where(and(eq(orders.id, orderId), eq(orders.status, 'pending'), eq(orders.paymentAuthority, authority)))
          .returning({ id: orders.id });

        if (!updated) {
          const [latest] = await tx.select({ status: orders.status }).from(orders).where(eq(orders.id, orderId)).limit(1);
          return isSettledOrderStatus(latest?.status);
        }

        if (current.customerId && current.totalAmount > 0) {
          const earnedPoints = Math.floor(current.totalAmount / 100000);
          if (earnedPoints > 0) {
            const [updatedCustomer] = await tx.update(customers)
              .set({ loyaltyPoints: sql`${customers.loyaltyPoints} + ${earnedPoints}` })
              .where(eq(customers.id, current.customerId))
              .returning({ loyaltyPoints: customers.loyaltyPoints });
            if (updatedCustomer) {
              const tier = updatedCustomer.loyaltyPoints >= 1500 ? 'gold' : updatedCustomer.loyaltyPoints >= 500 ? 'silver' : 'bronze';
              await tx.update(customers).set({ tier }).where(eq(customers.id, current.customerId));
            }
          }
        }
        return true;
      };

      let shouldVerify = callbackStatus === 'OK';
      let inquiryRefId: string | null = null;

      // A NOK callback is not proof that no money moved. Inquiry is non-destructive.
      if (callbackStatus === 'NOK') {
        let inquiry;
        try {
          inquiry = await inquireZarinpalAuthority(merchantId, authority);
        } catch (error) {
          console.error('[Zarinpal NOK Inquiry Error]', error);
          return failureRedirect(baseUrl, 'verify_failed', orderId);
        }
        const { code, status, refId } = inquiry.result;
        inquiryRefId = refId;
        if (!inquiry.response.ok || code !== 100 || !status) {
          console.error('[Zarinpal NOK Inquiry Response]', inquiry.data);
          return failureRedirect(baseUrl, 'verify_failed', orderId);
        }
        if (status === 'VERIFIED') {
          const finalized = await finalizeInsideTransaction(refId);
          return finalized ? successRedirect(baseUrl, orderId, order.trackingCode) : failureRedirect(baseUrl, 'verification_conflict', orderId);
        }
        if (status === 'FAILED' || status === 'REVERSED') {
          // Retain authority here. Only the retry endpoint may clear it after a fresh
          // inquiry under the same lock, preventing callback/retry races.
          return failureRedirect(baseUrl, 'cancelled', orderId);
        }
        if (status === 'IN_BANK') return failureRedirect(baseUrl, 'payment_processing', orderId);
        if (status !== 'PAID') return failureRedirect(baseUrl, 'verify_failed', orderId);
        shouldVerify = true;
      }

      if (!shouldVerify) return failureRedirect(baseUrl, 'invalid_callback', orderId);

      // Verify only after an OK callback or an Inquiry result that independently says PAID.
      let verification;
      try {
        verification = await verifyZarinpalAuthority(merchantId, order.totalAmount, authority);
      } catch (error) {
        console.error('[Zarinpal Verify Request Error]', error);
        return failureRedirect(baseUrl, 'verify_failed', orderId);
      }

      if (verification.response.ok && (verification.result.code === 100 || verification.result.code === 101)) {
        const finalized = await finalizeInsideTransaction(verification.result.refId ?? inquiryRefId);
        return finalized ? successRedirect(baseUrl, orderId, order.trackingCode) : failureRedirect(baseUrl, 'verification_conflict', orderId);
      }

      console.error('[Zarinpal Verify Error]', verification.data);

      // Recover by Inquiry without destroying an active or unknown authority.
      let fallbackInquiry;
      try {
        fallbackInquiry = await inquireZarinpalAuthority(merchantId, authority);
      } catch (error) {
        console.error('[Zarinpal Verify Fallback Inquiry Error]', error);
        return failureRedirect(baseUrl, 'verify_failed', orderId);
      }
      const fallback = fallbackInquiry.result;
      if (!fallbackInquiry.response.ok || fallback.code !== 100 || !fallback.status) {
        return failureRedirect(baseUrl, 'verify_failed', orderId);
      }
      if (fallback.status === 'VERIFIED') {
        const finalized = await finalizeInsideTransaction(fallback.refId ?? inquiryRefId);
        return finalized ? successRedirect(baseUrl, orderId, order.trackingCode) : failureRedirect(baseUrl, 'verification_conflict', orderId);
      }
      if (fallback.status === 'FAILED' || fallback.status === 'REVERSED') {
        return failureRedirect(baseUrl, 'cancelled', orderId);
      }
      if (fallback.status === 'IN_BANK') return failureRedirect(baseUrl, 'payment_processing', orderId);
      return failureRedirect(baseUrl, 'verify_failed', orderId);
    });
  } catch (error) {
    console.error('[Payment Verify Error]', error);
    return failureRedirect(baseUrl, 'server_error', orderId);
  }
}
