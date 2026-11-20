import "dotenv/config";
import postgres from "postgres";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

const databaseUrl = process.env.DIRECT_URL || process.env.DATABASE_URL;
if (!databaseUrl) {
  console.error("DIRECT_URL and DATABASE_URL are missing; migration was not applied.");
  process.exit(2);
}

const migrationPath = resolve(process.cwd(), "scripts/migrations/20261120_purchase_cycle_v2.sql");
const migration = await readFile(migrationPath, "utf8");
const statements = migration.split(/;\s*(?:\r?\n|$)/).map((part) => part.trim()).filter(Boolean);
const sql = postgres(databaseUrl, {
  prepare: false,
  max: 1,
  connect_timeout: 15,
  idle_timeout: 5,
});

try {
  await sql.begin(async (tx) => {
    for (const statement of statements) await tx.unsafe(statement);
  });
  const [verification] = await sql`
    SELECT
      to_regclass('public.payment_attempts') IS NOT NULL AS payment_attempts_ready,
      to_regclass('public.order_events') IS NOT NULL AS order_events_ready,
      to_regclass('public.rate_limit_buckets') IS NOT NULL AS rate_limit_buckets_ready
  `;
  const [version] = await sql`
    SELECT version FROM purchase_cycle_migrations WHERE version = '20261120_purchase_cycle_v2' LIMIT 1
  `;
  if (!verification?.payment_attempts_ready || !verification?.order_events_ready || !verification?.rate_limit_buckets_ready || !version) {
    throw new Error('PURCHASE_CYCLE_V2_SCHEMA_VERIFICATION_FAILED');
  }
  console.log("Purchase-cycle migration v2 applied and schema-verified successfully.");
} catch (error) {
  console.error("Purchase-cycle migration failed; transaction rolled back.");
  console.error(error instanceof Error ? error.message : "Unknown database error");
  process.exitCode = 1;
} finally {
  await sql.end({ timeout: 5 }).catch(() => {});
}
