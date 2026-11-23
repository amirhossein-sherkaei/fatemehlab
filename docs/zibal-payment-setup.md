# Zibal payment gateway

## Server environment

Configure these variables in Vercel Project Settings → Environment Variables:

- `ZIBAL_MERCHANT_ID`: the active merchant ID supplied by Zibal. Server-only; never create a `NEXT_PUBLIC_` version.
- `NEXT_PUBLIC_BASE_URL`: `https://fatemehbeautyland.ir`
- `CRON_SECRET`: a long random secret (at least 16 characters) used by the existing cleanup cron.
- `DATABASE_URL` or `DIRECT_URL`: existing Postgres connection variable required by the app and the migration runner.

Apply the merchant variable to Production and Preview only where the gateway has been configured. For local development, put the same variable in `.env.local`; do not commit that file or paste the value into support messages. Keep the existing database and `CRON_SECRET` settings unchanged.

## Payment flow

1. The server creates a Zibal transaction with the order's final amount in Rials.
2. The server stores the numeric Zibal `trackId` as the active order payment pointer and in the payment-attempt ledger.
3. The customer is sent only to `https://gateway.zibal.ir/start/{trackId}`.
4. The callback is treated as an untrusted notification. The server calls Zibal's verify endpoint and checks the returned amount against the exact order amount before settling the order.
5. Unknown, in-progress, mismatched, or unreachable transactions keep their pointer and are not replaced with a new payment attempt.
6. The scheduled cleanup verifies only attempts whose ledger provider is `zibal`. It never submits legacy provider identifiers to Zibal.

All amounts passed to Zibal are Rials. Legacy payment attempts and completed order/payment history remain in the database. Unresolved legacy attempts for pending orders are marked `retired` with an order-event audit entry; their rows are not deleted. Run `node scripts/apply-zibal-gateway-v1.mjs` only after the new Vercel deployment is Ready. The migration runner displays a sanitized database target and asks for the exact confirmation phrase before applying changes.
