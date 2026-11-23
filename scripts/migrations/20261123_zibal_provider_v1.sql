CREATE TABLE IF NOT EXISTS zibal_provider_migrations (
  version text PRIMARY KEY,
  applied_at timestamptz NOT NULL DEFAULT now()
);

-- Keep the old provider names in historical rows, but make Zibal the only default.
ALTER TABLE payment_attempts ALTER COLUMN provider SET DEFAULT 'zibal';

-- Add a non-destructive retired state for unresolved legacy attempts.
ALTER TABLE payment_attempts DROP CONSTRAINT IF EXISTS payment_attempts_status_check;
ALTER TABLE payment_attempts
  ADD CONSTRAINT payment_attempts_status_check
  CHECK (status IN ('requesting','unknown','awaiting_customer','in_bank','verified','failed','reversed','retired'));

-- Retire only unresolved attempts belonging to pending orders. Capture the
-- previous state in the audit event; completed financial rows are not deleted.
WITH candidates AS (
  SELECT pa.id, pa.order_id, pa.authority, pa.status AS previous_status
  FROM payment_attempts AS pa
  INNER JOIN orders AS o ON o.id = pa.order_id
  WHERE pa.provider = 'zarinpal'
    AND o.status = 'pending'
    AND pa.status IN ('requesting','unknown','awaiting_customer','in_bank')
  FOR UPDATE OF pa
), retired AS (
  UPDATE payment_attempts AS pa
  SET
    status = 'retired',
    gateway_message = 'Legacy provider retired before Zibal activation; previous attempt state is preserved in the order audit event.',
    last_checked_at = now(),
    updated_at = now()
  FROM candidates
  WHERE pa.id = candidates.id
  RETURNING pa.id, pa.order_id
)
INSERT INTO order_events (order_id, actor_type, event_type, summary, metadata, created_at)
SELECT
  candidates.order_id,
  'system',
  'payment.legacy_provider_retired',
  'تلاش پرداخت درگاه قبلی برای سفارش پرداخت‌نشده بازنشسته شد؛ سابقه مالی نگهداری شد.',
  jsonb_build_object(
    'attemptId', candidates.id,
    'previousProvider', 'zarinpal',
    'previousStatus', candidates.previous_status,
    'authorityWasPresent', candidates.authority IS NOT NULL
  ),
  now()
FROM candidates
INNER JOIN retired ON retired.id = candidates.id;

-- A legacy FAILED/REVERSED attempt can still be the order's active pointer in
-- old callback flows. Clear that pointer so the customer may retry through Zibal,
-- while preserving the original FAILED/REVERSED status on the attempt itself.
WITH detached AS (
  UPDATE orders AS o
  SET payment_authority = NULL
  FROM payment_attempts AS pa
  WHERE pa.order_id = o.id
    AND pa.authority = o.payment_authority
    AND pa.provider = 'zarinpal'
    AND pa.status IN ('retired','failed','reversed')
    AND o.status = 'pending'
    AND o.payment_authority IS NOT NULL
  RETURNING o.id AS order_id, pa.id AS attempt_id, pa.status AS previous_status
)
INSERT INTO order_events (order_id, actor_type, event_type, summary, metadata, created_at)
SELECT
  detached.order_id,
  'system',
  'payment.legacy_provider_pointer_cleared',
  'پیوند فعال درگاه قبلی از سفارش پرداخت‌نشده جدا شد تا تلاش مجدد فقط از مسیر زیبال انجام شود؛ سابقه تلاش حفظ شد.',
  jsonb_build_object('attemptId', detached.attempt_id, 'previousProvider', 'zarinpal', 'previousStatus', detached.previous_status),
  now()
FROM detached;

INSERT INTO zibal_provider_migrations(version)
VALUES ('20261123_zibal_provider_v1')
ON CONFLICT (version) DO NOTHING;
