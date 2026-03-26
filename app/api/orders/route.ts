import { NextRequest, NextResponse } from 'next/server';
import { sql } from '../../../lib/db';

export const runtime = 'nodejs';

async function fetchOrders(buyerId?: string) {
  const orderRows = buyerId
    ? await sql`SELECT * FROM orders WHERE buyer_id = ${buyerId} ORDER BY created_at DESC`
    : await sql`SELECT * FROM orders ORDER BY created_at DESC`;

  if (!orderRows || orderRows.length === 0) return [];

  const orderIds = orderRows.map(o => o.id as string);

  const itemRows = await sql`
    SELECT
      oi.order_id,
      oi.quantity,
      oi.price_at_purchase,
      p.id          AS product_id,
      p.seller_id,
      p.seller_name,
      p.name        AS product_name,
      p.description,
      p.category,
      p.stock,
      p.image_url,
      p.status      AS product_status
    FROM order_items oi
    JOIN products p ON p.id = oi.product_id
    WHERE oi.order_id = ANY(${orderIds}::uuid[])
  `;

  return orderRows.map(o => ({
    id: o.id,
    buyerId: o.buyer_id,
    buyerName: o.buyer_name,
    buyerEmail: o.buyer_email,
    total: o.total,
    status: o.status,
    address: o.address,
    createdAt: o.created_at,
    items: (itemRows || [])
      .filter(i => i.order_id === o.id)
      .map(i => ({
        quantity: i.quantity,
        product: {
          id: i.product_id,
          sellerId: i.seller_id,
          sellerName: i.seller_name,
          name: i.product_name,
          description: i.description,
          price: i.price_at_purchase,
          category: i.category,
          stock: i.stock,
          images: i.image_url ? [i.image_url] : [],
          status: i.product_status,
          createdAt: '',
        },
      })),
  }));
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const buyerId  = searchParams.get('buyerId')  ?? undefined;
    const sellerId = searchParams.get('sellerId') ?? undefined;

    let orders = await fetchOrders(buyerId);

    if (sellerId) {
      orders = orders.filter(o =>
        o.items.some(i => i.product.sellerId === sellerId)
      );
    }

    return NextResponse.json(orders);
  } catch (err) {
    console.error('GET /api/orders error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { buyerId, buyerName, buyerEmail, items, total, address } = await req.json();

    if (!buyerName || !buyerEmail || !items?.length || !total || !address) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const orderRows = await sql`
      INSERT INTO orders (buyer_id, buyer_name, buyer_email, total, address, status)
      VALUES (${buyerId ?? null}, ${buyerName}, ${buyerEmail}, ${total}, ${address}, 'pending')
      RETURNING *
    `;
    const order = orderRows[0];

    for (const item of items) {
      await sql`
        INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
        VALUES (${order.id}, ${item.product.id}, ${item.quantity}, ${item.product.price})
      `;
      await sql`
        UPDATE products
        SET stock = stock - ${item.quantity}
        WHERE id = ${item.product.id} AND stock >= ${item.quantity}
      `;
    }

    const allOrders = await fetchOrders(buyerId ?? undefined);
    const created   = allOrders.find(o => o.id === order.id);

    return NextResponse.json({
      id:         order.id,
      buyerId:    order.buyer_id,
      buyerName:  order.buyer_name,
      buyerEmail: order.buyer_email,
      total:      order.total,
      status:     order.status,
      address:    order.address,
      createdAt:  order.created_at,
      items:      created?.items ?? [],
    }, { status: 201 });
  } catch (err) {
    console.error('POST /api/orders error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
