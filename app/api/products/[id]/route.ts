import { NextRequest, NextResponse } from 'next/server';
import { sql } from '../../../../lib/db';

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

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const rows = await sql`SELECT * FROM products WHERE id = ${id}`;
    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(toProduct(rows[0]));
  } catch (err) {
    console.error('GET /api/products/[id] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status, rejectionReason } = await req.json();

    if (!status) {
      return NextResponse.json({ error: 'Status required' }, { status: 400 });
    }

    const rows = await sql`
      UPDATE products
      SET status = ${status},
          rejection_reason = ${rejectionReason ?? null}
      WHERE id = ${id}
      RETURNING *
    `;

    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    return NextResponse.json(toProduct(rows[0]));
  } catch (err) {
    console.error('PATCH /api/products/[id] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await sql`DELETE FROM products WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/products/[id] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
