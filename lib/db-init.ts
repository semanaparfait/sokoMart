// lib/db-init.ts — Creates all tables and seeds initial data
// Run with: npm run db:init
import { readFileSync } from 'fs';
import { resolve } from 'path';

// ── Load .env.local manually (tsx doesn't auto-load it) ──────────────────────
try {
  const envPath = resolve(process.cwd(), '.env.local');
  const envFile = readFileSync(envPath, 'utf-8');
  for (const line of envFile.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
  console.log('✅ .env.local loaded');
} catch {
  console.warn('⚠️  Could not load .env.local — make sure DATABASE_URL is set');
}

import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';

const sql = neon(process.env.DATABASE_URL!);

async function init() {
  console.log('🔧 Initializing database schema...\n');

  // ── Drop tables (clean reset) ─────────────────────────────────────────────
  await sql`DROP TABLE IF EXISTS order_items CASCADE`;
  await sql`DROP TABLE IF EXISTS orders CASCADE`;
  await sql`DROP TABLE IF EXISTS products CASCADE`;
  await sql`DROP TABLE IF EXISTS users CASCADE`;
  console.log('✅ Old tables dropped');

  // ── Create tables ─────────────────────────────────────────────────────────

  await sql`
    CREATE TABLE users (
      id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name        TEXT NOT NULL,
      email       TEXT UNIQUE NOT NULL,
      password    TEXT NOT NULL,
      role        TEXT NOT NULL CHECK (role IN ('buyer','seller','admin')),
      created_at  TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  console.log('✅ users table created');

  await sql`
    CREATE TABLE products (
      id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      seller_id        UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      seller_name      TEXT NOT NULL,
      name             TEXT NOT NULL,
      description      TEXT NOT NULL,
      price            INTEGER NOT NULL CHECK (price > 0),
      category         TEXT NOT NULL,
      stock            INTEGER NOT NULL DEFAULT 0,
      image_url        TEXT,
      status           TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
      rejection_reason TEXT,
      created_at       TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  console.log('✅ products table created');

  await sql`
    CREATE TABLE orders (
      id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      buyer_id     UUID REFERENCES users(id) ON DELETE SET NULL,
      buyer_name   TEXT NOT NULL,
      buyer_email  TEXT NOT NULL,
      total        INTEGER NOT NULL,
      status       TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','processing','shipped','delivered','cancelled')),
      address      TEXT NOT NULL,
      created_at   TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  console.log('✅ orders table created');

  await sql`
    CREATE TABLE order_items (
      id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      order_id            UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
      product_id          UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
      quantity            INTEGER NOT NULL CHECK (quantity > 0),
      price_at_purchase   INTEGER NOT NULL
    )
  `;
  console.log('✅ order_items table created');

  // ── Seed users ────────────────────────────────────────────────────────────
  const adminPw   = await bcrypt.hash('admin123',  10);
  const sellerPw  = await bcrypt.hash('seller123', 10);
  const seller2Pw = await bcrypt.hash('seller123', 10);
  const buyerPw   = await bcrypt.hash('buyer123',  10);

  const [admin] = await sql`
    INSERT INTO users (name, email, password, role)
    VALUES ('Admin User', 'admin@sokomart.rw', ${adminPw}, 'admin')
    RETURNING id
  `;
  const [seller1] = await sql`
    INSERT INTO users (name, email, password, role)
    VALUES ('Jean Pierre', 'jean@sokomart.rw', ${sellerPw}, 'seller')
    RETURNING id
  `;
  const [seller2] = await sql`
    INSERT INTO users (name, email, password, role)
    VALUES ('Amina Uwase', 'amina@sokomart.rw', ${seller2Pw}, 'seller')
    RETURNING id
  `;
  const [buyer] = await sql`
    INSERT INTO users (name, email, password, role)
    VALUES ('Patrick Nkurunziza', 'patrick@sokomart.rw', ${buyerPw}, 'buyer')
    RETURNING id
  `;

  console.log('✅ Users seeded');

  // ── Seed products ─────────────────────────────────────────────────────────
  const [p1] = await sql`
    INSERT INTO products (seller_id, seller_name, name, description, price, category, stock, image_url, status)
    VALUES (
      ${seller1.id}, 'Jean Pierre',
      'Wireless Earbuds Pro',
      'High quality wireless earbuds with noise cancellation and 30h battery life. Perfect for music lovers and remote workers.',
      25000, 'Electronics', 15,
      'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80',
      'approved'
    ) RETURNING id
  `;
  const [p2] = await sql`
    INSERT INTO products (seller_id, seller_name, name, description, price, category, stock, image_url, status)
    VALUES (
      ${seller1.id}, 'Jean Pierre',
      'Ankara Print Dress',
      'Beautiful traditional Ankara fabric dress, handmade by local artisans. Available in multiple sizes.',
      12000, 'Clothing', 8,
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80',
      'approved'
    ) RETURNING id
  `;
  const [p3] = await sql`
    INSERT INTO products (seller_id, seller_name, name, description, price, category, stock, image_url, status)
    VALUES (
      ${seller2.id}, 'Amina Uwase',
      'Rwanda Coffee Blend',
      'Premium single-origin Rwanda coffee from the hills of Musanze. Rich, fruity and aromatic. 500g bag.',
      4500, 'Food & Drinks', 50,
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80',
      'approved'
    ) RETURNING id
  `;
  await sql`
    INSERT INTO products (seller_id, seller_name, name, description, price, category, stock, image_url, status)
    VALUES (
      ${seller2.id}, 'Amina Uwase',
      'Handwoven Basket',
      'Traditional Rwandan agaseke basket, handwoven by skilled women cooperatives. Great for home decoration.',
      8000, 'Home & Garden', 20,
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
      'approved'
    )
  `;
  await sql`
    INSERT INTO products (seller_id, seller_name, name, description, price, category, stock, image_url, status)
    VALUES (
      ${seller1.id}, 'Jean Pierre',
      'Smart Watch X200',
      'Feature-packed smartwatch with heart rate monitor, GPS, and 7-day battery. Water resistant.',
      45000, 'Electronics', 5,
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
      'pending'
    )
  `;
  await sql`
    INSERT INTO products (seller_id, seller_name, name, description, price, category, stock, image_url, status)
    VALUES (
      ${seller2.id}, 'Amina Uwase',
      'Natural Shea Butter',
      'Pure unrefined shea butter sourced from Uganda. Great for skin and hair care. 250ml.',
      3500, 'Beauty', 100,
      'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&q=80',
      'pending'
    )
  `;
  console.log('✅ Products seeded');

  // ── Seed orders ───────────────────────────────────────────────────────────
  const [o1] = await sql`
    INSERT INTO orders (buyer_id, buyer_name, buyer_email, total, status, address)
    VALUES (
      ${buyer.id}, 'Patrick Nkurunziza', 'patrick@sokomart.rw',
      34000, 'delivered', 'KG 45 St, Kigali'
    ) RETURNING id
  `;
  await sql`INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES (${o1.id}, ${p1.id}, 1, 25000)`;
  await sql`INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES (${o1.id}, ${p3.id}, 2, 4500)`;

  const [o2] = await sql`
    INSERT INTO orders (buyer_id, buyer_name, buyer_email, total, status, address)
    VALUES (
      NULL, 'Guest User', 'guest@example.com',
      12000, 'processing', 'KN 12 Ave, Kigali'
    ) RETURNING id
  `;
  await sql`INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES (${o2.id}, ${p2.id}, 1, 12000)`;

  console.log('✅ Orders seeded');

  console.log('\n🎉 Database initialized successfully!');
  console.log('\n📋 Demo credentials:');
  console.log('   Admin:  admin@sokomart.rw   / admin123');
  console.log('   Seller: jean@sokomart.rw    / seller123');
  console.log('   Seller: amina@sokomart.rw   / seller123');
  console.log('   Buyer:  patrick@sokomart.rw / buyer123');
  process.exit(0);
}

init().catch(err => {
  console.error('\n❌ DB init failed:', err.message);
  process.exit(1);
});
