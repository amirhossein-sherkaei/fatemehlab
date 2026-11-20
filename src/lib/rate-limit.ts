import { createHmac } from 'node:crypto';
import { sql } from 'drizzle-orm';
import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';
import { db } from '@/lib/db';

const hasUpstash = Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
let redis: Redis | null = null;
if (hasUpstash) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
}

const LIMIT = 10;
const WINDOW = '60 s';
const limiter = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(LIMIT, WINDOW), analytics: false, prefix: '@fatemehlab/ratelimit' })
  : null;

const memoryBuckets = new Map<string, { count: number; resetAt: number }>();
const MEMORY_WINDOW_MS = 60_000;
const MEMORY_MAX = LIMIT;

export type RateLimitResult = { success: boolean; remaining: number; unavailable?: boolean };
export type RateLimitOptions = { failClosedOnStoreError?: boolean };

/**
 * Production fallback with shared PostgreSQL state. Raw IP/customer identifiers
 * are never stored: only a keyed HMAC digest reaches Redis, PostgreSQL or memory.
 * The PostgreSQL UPSERT is atomic
 * across serverless instances and uses the database clock to avoid clock skew.
 */
async function databaseRateLimit(keyHash: string): Promise<RateLimitResult> {
  const rows = await db.execute(sql`
    INSERT INTO rate_limit_buckets (key_hash, window_start, request_count, updated_at)
    VALUES (${keyHash}, date_trunc('minute', now()), 1, now())
    ON CONFLICT (key_hash) DO UPDATE SET
      request_count = CASE
        WHEN rate_limit_buckets.window_start < date_trunc('minute', now()) THEN 1
        ELSE LEAST(2147483647, rate_limit_buckets.request_count + 1)
      END,
      window_start = CASE
        WHEN rate_limit_buckets.window_start < date_trunc('minute', now()) THEN date_trunc('minute', now())
        ELSE rate_limit_buckets.window_start
      END,
      updated_at = now()
    RETURNING request_count
  `);
  const count = Number((rows as unknown as Array<{ request_count: number | string }>)[0]?.request_count);
  if (!Number.isFinite(count) || count < 1) throw new Error('RATE_LIMIT_DB_INVALID_RESULT');
  return { success: count <= LIMIT, remaining: Math.max(0, LIMIT - count) };
}

export async function rateLimit(key: string, options: RateLimitOptions = {}): Promise<RateLimitResult> {
  // Hash before every backend, including Upstash and local memory, so raw IPs,
  // phone numbers and customer identifiers are never stored as limiter keys.
  const hmacSecret = process.env.JWT_SECRET;
  if (!hmacSecret) return { success: false, remaining: 0, unavailable: true };
  const keyHash = createHmac('sha256', hmacSecret).update(key).digest('hex');
  if (limiter) {
    try {
      const { success, remaining } = await limiter.limit(keyHash);
      return { success, remaining };
    } catch (error) {
      console.error('[rate-limit] Upstash request failed', error);
      if (options.failClosedOnStoreError) {
        try {
          return await databaseRateLimit(keyHash);
        } catch (databaseError) {
          console.error('[rate-limit] PostgreSQL fallback failed', databaseError);
          return { success: false, remaining: 0, unavailable: true };
        }
      }
    }
  }

  if (options.failClosedOnStoreError && process.env.NODE_ENV === 'production') {
    try {
      return await databaseRateLimit(keyHash);
    } catch (error) {
      console.error('[rate-limit] Critical database fallback unavailable', error);
      return { success: false, remaining: 0, unavailable: true };
    }
  }

  // Only non-critical routes and local development may use process-local memory.
  const now = Date.now();
  const bucket = memoryBuckets.get(keyHash);
  if (!bucket || now >= bucket.resetAt) {
    memoryBuckets.set(keyHash, { count: 1, resetAt: now + MEMORY_WINDOW_MS });
    return { success: true, remaining: MEMORY_MAX - 1 };
  }
  if (bucket.count >= MEMORY_MAX) return { success: false, remaining: 0 };
  bucket.count++;
  return { success: true, remaining: MEMORY_MAX - bucket.count };
}
