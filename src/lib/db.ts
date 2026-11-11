import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '@/db/schema';

// Vercel Serverless-safe connection settings:
// - prepare: false (required for PgBouncer / poolers)
// - max: 1 (each serverless invocation gets its own connection)
// - idle_timeout / connect_timeout: prevent hung connections
const client = postgres(process.env.DATABASE_URL!, {
  prepare: false,
  max: 1,
  idle_timeout: 20,
  connect_timeout: 10,
});

export const db = drizzle(client, { schema });