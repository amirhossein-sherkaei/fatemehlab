import 'dotenv/config';
import { db } from '../lib/db';
import { coupons } from './schema';

async function main() {
  const all = await db.select().from(coupons);
  console.log(`Total coupons in DB: ${all.length}`);
  if (all.length > 0) {
    console.log('Existing coupons:');
    all.forEach((c) => {
      console.log(`  - ${c.code} | type: ${c.type} | value: ${c.value} | active: ${c.isActive} | used: ${c.usedCount}`);
    });
  } else {
    console.log('  No coupons found (clean state).');
  }
  process.exit(0);
}
main().catch((e) => { console.error(e); process.exit(1); });