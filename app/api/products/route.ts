import { NextRequest, NextResponse } from 'next/server';
import { sql } from '../../../lib/db';

export const runtime = 'nodejs';

function toProduct(r: Record<string, unknown>) {
  return {
    id: r.id,
    sellerId: r.seller_id,
    sellerName: r.seller_name,
    name: r.name,
    description: r.description,
    price: r.price,
    category: r.category,
    stock: r.stock,
    images: r.image_url ? [r.image_url] : [],
    status: r.status,
    rejectionReason: r.rejection_reason ?? null,
    createdAt: r.created_at,
  };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status   = searchParams.get('status');
    const sellerId = searchParams.get('sellerId');
    const category = searchParams.get('category');

    let rows: Record<string, unknown>[];

    if (status && sellerId) {
      rows = await sql`SELECT * FROM products WHERE status = ${status} AND seller_id = ${sellerId} ORDER BY created_at DESC`;
    } else if (status && category) {
      rows = await sql`SELECT * FROM products WHERE status = ${status} AND category = ${category} ORDER BY created_at DESC`;
    } else if (status) {
      rows = await sql`SELECT * FROM products WHERE status = ${status} ORDER BY created_at DESC`;
    } else if (sellerId) {
      rows = await sql`SELECT * FROM products WHERE seller_id = ${sellerId} ORDER BY created_at DESC`;
    } else if (category) {
      rows = await sql`SELECT * FROM products WHERE category = ${category} ORDER BY created_at DESC`;
    } else {
      rows = await sql`SELECT * FROM products ORDER BY created_at DESC`;
    }

    return NextResponse.json(rows.map(toProduct));
  } catch (err) {
    console.error('GET /api/products error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sellerId, sellerName, name, description, price, category, stock, images } = body;

    if (!sellerId || !name || !description || !price || !category || stock == null) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const imageUrl = images?.[0] ?? null;

    const rows = await sql`
      INSERT INTO products (seller_id, seller_name, name, description, price, category, stock, image_url, status)
      VALUES (${sellerId}, ${sellerName}, ${name}, ${description}, ${price}, ${category}, ${stock}, ${imageUrl}, 'pending')
      RETURNING *
    `;

    return NextResponse.json(toProduct(rows[0]), { status: 201 });
  } catch (err) {
    console.error('POST /api/products error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
