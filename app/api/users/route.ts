import { NextResponse } from 'next/server';
import { sql } from '../../../lib/db';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const rows = await sql`
      SELECT id, name, email, role, created_at
      FROM users
      ORDER BY created_at ASC
    `;
    return NextResponse.json((rows || []).map(u => ({
      id:        u.id,
      name:      u.name,
      email:     u.email,
      role:      u.role,
      createdAt: u.created_at,
    })));
  } catch (err) {
    console.error('GET /api/users error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
