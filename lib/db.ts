// lib/db.ts — Neon PostgreSQL serverless connection
import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not set.');
}

// Cast to any[] so TypeScript doesn't complain about FullQueryResults
export const sql = neon(DATABASE_URL) as unknown as (
  strings: TemplateStringsArray,
  ...values: unknown[]
) => Promise<Record<string, unknown>[]>;
