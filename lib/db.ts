// lib/db.ts — Neon PostgreSQL serverless connection
import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error(
    'DATABASE_URL is not set. Make sure .env.local exists with the DATABASE_URL variable.'
  );
}

export const sql = neon(DATABASE_URL);
