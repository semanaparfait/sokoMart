// app/api/auth/register/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '../../../../lib/db';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }
    if (!['buyer', 'seller'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }

    // Check existing email
    const existing = await sql`SELECT id FROM users WHERE email = ${email.toLowerCase().trim()}`;
    if (existing.length > 0) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 10);
    const rows = await sql`
      INSERT INTO users (name, email, password, role)
      VALUES (${name.trim()}, ${email.toLowerCase().trim()}, ${hashed}, ${role})
      RETURNING id, name, email, role, created_at
    `;

    const user = rows[0];
    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.created_at,
    }, { status: 201 });
  } catch (err) {
    console.error('Register error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
