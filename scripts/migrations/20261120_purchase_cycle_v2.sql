CREATE INDEX IF NOT EXISTS orders_customer_created_idx ON orders(customer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS orders_status_created_idx ON orders(status, created_at DESC);

CREATE TABLE IF NOT EXISTS payment_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
  request_key uuid NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  attempt_number integer NOT NULL CHECK (attempt_number > 0),
  provider text NOT NULL DEFAULT 'zarinpal',
  amount integer NOT NULL CHECK (amount >= 0),
  status text NOT NULL DEFAULT 'requesting' CHECK (status IN ('requesting','unknown','awaiting_customer','in_bank','verified','failed','reversed')),
  authority text,
  ref_id text,
  gateway_code integer,
  gateway_message text,
  requested_at timestamptz NOT NULL DEFAULT now(),
  last_checked_at timestamptz,
  verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT payment_attempts_order_number_unique UNIQUE (order_id, attempt_number)
);

CREATE UNIQUE INDEX IF NOT EXISTS payment_attempts_authority_unique
  ON payment_attempts(authority) WHERE authority IS NOT NULL;
CREATE INDEX IF NOT EXISTS payment_attempts_order_idx
  ON payment_attempts(order_id, created_at DESC);
CREATE INDEX IF NOT EXISTS payment_attempts_status_idx
  ON payment_attempts(status, created_at);

CREATE TABLE IF NOT EXISTS order_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE RESTRICT,
  actor_type text NOT NULL CHECK (actor_type IN ('customer','admin','gateway','system')),
  actor_id text,
  event_type text NOT NULL,
  from_status text,
  to_status text,
  summary text NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS order_events_order_created_idx
  ON order_events(order_id, created_at DESC);
CREATE INDEX IF NOT EXISTS order_events_type_created_idx
  ON order_events(event_type, created_at);
CREATE UNIQUE INDEX IF NOT EXISTS order_events_refund_reference_unique
  ON order_events ((metadata->>'refundReference'))
  WHERE event_type = 'order.refund_recorded_and_cancelled' AND metadata ? 'refundReference';

CREATE TABLE IF NOT EXISTS rate_limit_buckets (
  key_hash text PRIMARY KEY,
  window_start timestamptz NOT NULL,
  request_count integer NOT NULL DEFAULT 1 CHECK (request_count BETWEEN 1 AND 2147483647),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS rate_limit_buckets_updated_idx ON rate_limit_buckets(updated_at);

CREATE TABLE IF NOT EXISTS purchase_cycle_migrations (
  version text PRIMARY KEY,
  applied_at timestamptz NOT NULL DEFAULT now()
);
INSERT INTO purchase_cycle_migrations(version)
VALUES ('20261120_purchase_cycle_v2')
ON CONFLICT (version) DO NOTHING;
