import 'dotenv/config';
import { db } from '../lib/db';
import { sql } from 'drizzle-orm';

async function main() {
  console.log('Checking for duplicate phones...');
  const dupes = await db.execute(sql`
    SELECT phone, COUNT(*) as count
    FROM customers
    WHERE phone IS NOT NULL AND phone != ''
    GROUP BY phone
    HAVING COUNT(*) > 1
  `);

  if (dupes.length > 0) {
    console.warn(`Found ${dupes.length} duplicate phone(s). Please resolve manually:`);
    console.table(dupes);
    process.exit(1);
  }

  console.log('No duplicates found. Creating index...');
  try {
    await db.execute(sql`
      CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone)
    `);
    console.log('Index created successfully.');
  } catch (e: any) {
    console.error('Index creation failed:', e.message);
  }

  process.exit(0);
}

main().catch((e) => { console.error(e); process.exit(1); });