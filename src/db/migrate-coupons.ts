import 'dotenv/config';
import { db } from '../lib/db';
import { sql } from 'drizzle-orm';

async function main() {
  try {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS coupons (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        code TEXT NOT NULL UNIQUE,
        description TEXT,
        type TEXT NOT NULL DEFAULT 'percent',
        value INTEGER NOT NULL,
        min_order_amount INTEGER NOT NULL DEFAULT 0,
        max_discount_amount INTEGER,
        usage_limit INTEGER,
        used_count INTEGER NOT NULL DEFAULT 0,
        starts_at TIMESTAMP NOT NULL DEFAULT NOW(),
        expires_at TIMESTAMP,
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    await db.execute(sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS coupon_code TEXT`);
    await db.execute(sql`ALTER TABLE orders ADD COLUMN IF NOT EXISTS discount_amount INTEGER NOT NULL DEFAULT 0`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code)`);
    console.log('Migration complete.');
  } catch (e: any) {
    console.error('Migration failed:', e.message);
    process.exit(1);
  }
  process.exit(0);
}
main();