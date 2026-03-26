// app/api/products/[id]/route.ts — GET one, PATCH status, DELETE
import { NextRequest, NextResponse } from 'next/server';
import { sql } from '../../../../lib/db';

// GET /api/products/:id
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const rows = await sql`SELECT * FROM products WHERE id = ${id}`;
    if (rows.length === 0) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    const r = rows[0];
    return NextResponse.json({
      id: r.id, sellerId: r.seller_id, sellerName: r.seller_name,
      name: r.name, description: r.description, price: r.price,
      category: r.category, stock: r.stock,
      images: r.image_url ? [r.image_url] : [],
      status: r.status, rejectionReason: r.rejection_reason,
      createdAt: r.created_at,
    });
  } catch (err) {
    console.error('GET /api/products/[id] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PATCH /api/products/:id — update status (admin) or stock
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, rejectionReason } = body;

    if (!status) return NextResponse.json({ error: 'Status required' }, { status: 400 });

    const rows = await sql`
      UPDATE products
      SET status = ${status},
          rejection_reason = ${rejectionReason ?? null}
      WHERE id = ${id}
      RETURNING *
    `;

    if (rows.length === 0) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    const r = rows[0];
    return NextResponse.json({
      id: r.id, sellerId: r.seller_id, sellerName: r.seller_name,
      name: r.name, description: r.description, price: r.price,
      category: r.category, stock: r.stock,
      images: r.image_url ? [r.image_url] : [],
      status: r.status, rejectionReason: r.rejection_reason,
      createdAt: r.created_at,
    });
  } catch (err) {
    console.error('PATCH /api/products/[id] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE /api/products/:id
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await sql`DELETE FROM products WHERE id = ${id}`;
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('DELETE /api/products/[id] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
