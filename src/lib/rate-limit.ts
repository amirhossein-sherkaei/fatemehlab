import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

// If UPSTASH env vars are missing, fall back to a permissive in-memory limiter
// so local development and preview builds don't break.
const hasUpstash = Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

let redis: Redis | null = null;
if (hasUpstash) {
  redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });
}

// Sliding window: 10 requests per 60 seconds
const limiter = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(10, '60 s'),
      analytics: false,
      prefix: '@fatemehlab/ratelimit',
    })
  : null;

// Simple in-memory fallback (per-process) when Upstash is not configured
const memoryBuckets = new Map<string, { count: number; resetAt: number }>();
const MEMORY_WINDOW_MS = 60_000;
const MEMORY_MAX = 10;

export async function rateLimit(key: string): Promise<{ success: boolean; remaining: number }> {
  if (limiter) {
    try {
      const { success, remaining } = await limiter.limit(key);
      return { success, remaining };
    } catch (e) {
      console.warn('[rate-limit] Upstash failed, falling back to memory', e);
    }
  }

  // Fallback path
  const now = Date.now();
  const bucket = memoryBuckets.get(key);
  if (!bucket || now > bucket.resetAt) {
    memoryBuckets.set(key, { count: 1, resetAt: now + MEMORY_WINDOW_MS });
    return { success: true, remaining: MEMORY_MAX - 1 };
  }
  if (bucket.count >= MEMORY_MAX) {
    return { success: false, remaining: 0 };
  }
  bucket.count++;
  return { success: true, remaining: MEMORY_MAX - bucket.count };
}