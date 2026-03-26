// lib/db.ts — Lazy Neon connection (only initializes at request time, not build time)
import { neon } from '@neondatabase/serverless';

type SqlFn = (
  strings: TemplateStringsArray,
  ...values: unknown[]
) => Promise<Record<string, unknown>[]>;

let _sql: SqlFn | null = null;

export function getDb(): SqlFn {
  if (_sql) return _sql;

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      'DATABASE_URL is not set. Add it to .env.local or Vercel environment variables.'
    );
  }

  _sql = neon(url) as unknown as SqlFn;
  return _sql;
}

// Convenience: use this exactly like the old `sql` tagged template
export const sql: SqlFn = (strings, ...values) => getDb()(strings, ...values);
