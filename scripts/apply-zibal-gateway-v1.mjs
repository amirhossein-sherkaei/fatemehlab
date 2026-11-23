import dotenv from 'dotenv';
import postgres from 'postgres';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

// Load local secrets without printing them. `.env.local` has priority over `.env`.
dotenv.config({ path: resolve(process.cwd(), '.env.local') });
dotenv.config({ path: resolve(process.cwd(), '.env'), override: false });

const databaseUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error('DIRECT_URL and DATABASE_URL are missing; migration was not applied.');
  process.exit(2);
}

let endpoint;
try {
  endpoint = new URL(databaseUrl);
} catch {
  console.error('The configured database URL is invalid; migration was not applied.');
  process.exit(2);
}

const migrationPath = resolve(process.cwd(), 'scripts/migrations/20261123_zibal_provider_v1.sql');
const migration = await readFile(migrationPath, 'utf8');
const statements = migration.split(/;\s*(?:\r?\n|$)/).map((part) => part.trim()).filter(Boolean);
const sql = postgres(databaseUrl, {
  prepare: false,
  max: 1,
  connect_timeout: 15,
  idle_timeout: 5,
  onnotice: () => {},
});

try {
  const [preflight] = await sql`
    SELECT
      to_regclass('public.orders') IS NOT NULL AS orders_ready,
      to_regclass('public.payment_attempts') IS NOT NULL AS payment_attempts_ready,
      to_regclass('public.order_events') IS NOT NULL AS order_events_ready
  `;
  if (!preflight?.orders_ready || !preflight?.payment_attempts_ready || !preflight?.order_events_ready) {
    throw new Error('REQUIRED_PAYMENT_TABLES_MISSING');
  }

  const [current] = await sql`
    SELECT
      (SELECT count(*)::int FROM payment_attempts pa JOIN orders o ON o.id = pa.order_id
       WHERE pa.provider = 'zarinpal' AND o.status = 'pending'
         AND (pa.status IN ('requesting','unknown','awaiting_customer','in_bank')
           OR (pa.status IN ('failed','reversed') AND o.payment_authority = pa.authority))) AS pending_legacy_attempts,
      (SELECT count(*)::int FROM orders o WHERE o.status = 'pending' AND o.payment_authority IS NOT NULL
       AND NOT EXISTS (SELECT 1 FROM payment_attempts pa WHERE pa.order_id = o.id AND pa.authority = o.payment_authority)) AS unmatched_pending_pointers
  `;
  const [migrationTable] = await sql`SELECT to_regclass('public.zibal_provider_migrations') IS NOT NULL AS exists`;
  let alreadyApplied = false;
  if (migrationTable?.exists) {
    const [version] = await sql`
      SELECT version FROM zibal_provider_migrations WHERE version = '20261123_zibal_provider_v1' LIMIT 1
    `;
    alreadyApplied = Boolean(version);
  }

  console.log('Database target (password/user hidden):');
  console.log(`  Host: ${endpoint.hostname}`);
  console.log(`  Database: ${decodeURIComponent(endpoint.pathname.replace(/^\//, '')) || '(default)'}`);
  console.log(`  Pending legacy attempts/pointers to retire or clear: ${current.pending_legacy_attempts}`);
  console.log(`  Unmatched pending payment pointers to preserve: ${current.unmatched_pending_pointers}`);

  if (alreadyApplied) {
    console.log('Zibal provider migration is already recorded. No database changes were made.');
  } else {
    const rl = createInterface({ input, output });
    let approval;
    try {
      approval = await rl.question('After confirming this is the intended FatemehLab database, type APPLY ZIBAL PROVIDER V1: ');
    } finally {
      rl.close();
    }
    if (approval !== 'APPLY ZIBAL PROVIDER V1') {
      console.log('Cancelled. No database changes were made.');
    } else {
      let verification;
      await sql.begin(async (tx) => {
        for (const statement of statements) await tx.unsafe(statement);

        const [checked] = await tx`
          SELECT
            (SELECT column_default FROM information_schema.columns
             WHERE table_schema = 'public' AND table_name = 'payment_attempts' AND column_name = 'provider') AS provider_default,
            (SELECT count(*)::int FROM payment_attempts pa JOIN orders o ON o.id = pa.order_id
             WHERE pa.provider = 'zarinpal' AND o.status = 'pending'
               AND (pa.status IN ('requesting','unknown','awaiting_customer','in_bank')
                 OR (pa.status IN ('failed','reversed') AND o.payment_authority = pa.authority))) AS unresolved_legacy_attempts,
            (SELECT count(*)::int FROM orders o WHERE o.status = 'pending' AND o.payment_authority IS NOT NULL AND NOT EXISTS (
              SELECT 1 FROM payment_attempts pa WHERE pa.order_id = o.id AND pa.authority = o.payment_authority AND pa.provider = 'zibal'
            )) AS unmatched_pending_authority_count
        `;
        const [version] = await tx`
          SELECT version FROM zibal_provider_migrations WHERE version = '20261123_zibal_provider_v1' LIMIT 1
        `;

        if (!String(checked?.provider_default || '').includes('zibal') || Number(checked?.unresolved_legacy_attempts || 0) !== 0 || !version) {
          throw new Error('ZIBAL_PROVIDER_MIGRATION_VERIFICATION_FAILED');
        }
        verification = checked;
      });

      console.log('Zibal provider migration applied and database-verified successfully.');
      console.log(`Unmatched pending payment pointers intentionally preserved for review: ${verification.unmatched_pending_authority_count}.`);
      console.log('Legacy payment and order rows were retained; unresolved linked legacy attempts were retired, not deleted.');
    }
  }
} catch (error) {
  console.error('Zibal provider migration failed. Database transaction was rolled back when applicable.');
  console.error(error instanceof Error ? error.message : 'Unknown database error');
  process.exitCode = 1;
} finally {
  await sql.end({ timeout: 5 }).catch(() => {});
}
