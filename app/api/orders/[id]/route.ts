import { NextRequest, NextResponse } from 'next/server';
import { sql } from '../../../../lib/db';

export const runtime = 'nodejs';

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { status } = await req.json();

    const valid = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!status || !valid.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const rows = await sql`
      UPDATE orders SET status = ${status} WHERE id = ${id} RETURNING *
    `;

    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const o = rows[0];
    return NextResponse.json({
      id:         o.id,
      buyerId:    o.buyer_id,
      buyerName:  o.buyer_name,
      buyerEmail: o.buyer_email,
      total:      o.total,
      status:     o.status,
      address:    o.address,
      createdAt:  o.created_at,
      items:      [],
    });
  } catch (err) {
    console.error('PATCH /api/orders/[id] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
