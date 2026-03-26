// ─── Mock Data ───────────────────────────────────────────────────────────────
import { Product, Order, User } from './types';

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Admin User', email: 'admin@sokomart.rw', role: 'admin', createdAt: '2024-01-01' },
  { id: 'u2', name: 'Jean Pierre', email: 'jean@sokomart.rw', role: 'seller', createdAt: '2024-01-10' },
  { id: 'u3', name: 'Amina Uwase', email: 'amina@sokomart.rw', role: 'seller', createdAt: '2024-01-15' },
  { id: 'u4', name: 'Patrick Nkurunziza', email: 'patrick@sokomart.rw', role: 'buyer', createdAt: '2024-02-01' },
];

export const CATEGORIES = ['Electronics', 'Clothing', 'Food & Drinks', 'Home & Garden', 'Beauty', 'Sports', 'Books', 'Other'];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1', sellerId: 'u2', sellerName: 'Jean Pierre',
    name: 'Wireless Earbuds Pro', description: 'High quality wireless earbuds with noise cancellation and 30h battery life. Perfect for music lovers and remote workers.',
    price: 25000, category: 'Electronics', stock: 15,
    images: ['https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80'],
    status: 'approved', createdAt: '2024-02-01',
  },
  {
    id: 'p2', sellerId: 'u2', sellerName: 'Jean Pierre',
    name: 'Ankara Print Dress', description: 'Beautiful traditional Ankara fabric dress, handmade by local artisans. Available in multiple sizes.',
    price: 12000, category: 'Clothing', stock: 8,
    images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&q=80'],
    status: 'approved', createdAt: '2024-02-05',
  },
  {
    id: 'p3', sellerId: 'u3', sellerName: 'Amina Uwase',
    name: 'Rwanda Coffee Blend', description: 'Premium single-origin Rwanda coffee from the hills of Musanze. Rich, fruity and aromatic. 500g bag.',
    price: 4500, category: 'Food & Drinks', stock: 50,
    images: ['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80'],
    status: 'approved', createdAt: '2024-02-10',
  },
  {
    id: 'p4', sellerId: 'u3', sellerName: 'Amina Uwase',
    name: 'Handwoven Basket', description: 'Traditional Rwandan agaseke basket, handwoven by skilled women cooperatives. Great for home decoration.',
    price: 8000, category: 'Home & Garden', stock: 20,
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80'],
    status: 'approved', createdAt: '2024-02-12',
  },
  {
    id: 'p5', sellerId: 'u2', sellerName: 'Jean Pierre',
    name: 'Smart Watch X200', description: 'Feature-packed smartwatch with heart rate monitor, GPS, and 7-day battery. Water resistant.',
    price: 45000, category: 'Electronics', stock: 5,
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80'],
    status: 'pending', createdAt: '2024-03-01',
  },
  {
    id: 'p6', sellerId: 'u3', sellerName: 'Amina Uwase',
    name: 'Natural Shea Butter', description: 'Pure unrefined shea butter sourced from Uganda. Great for skin and hair care. 250ml.',
    price: 3500, category: 'Beauty', stock: 100,
    images: ['https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&q=80'],
    status: 'pending', createdAt: '2024-03-05',
  },
  {
    id: 'p7', sellerId: 'u2', sellerName: 'Jean Pierre',
    name: 'Fake Medicine Pills', description: 'Unlicensed pharmaceutical product.',
    price: 1000, category: 'Other', stock: 200,
    images: ['https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&q=80'],
    status: 'rejected', rejectionReason: 'Unlicensed medical product. Not allowed on platform.',
    createdAt: '2024-03-08',
  },
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'o1', buyerId: 'u4', buyerName: 'Patrick Nkurunziza', buyerEmail: 'patrick@sokomart.rw',
    items: [{ product: MOCK_PRODUCTS[0], quantity: 1 }, { product: MOCK_PRODUCTS[2], quantity: 2 }],
    total: 34000, status: 'delivered', createdAt: '2024-02-20', address: 'KG 45 St, Kigali',
  },
  {
    id: 'o2', buyerId: null, buyerName: 'Guest User', buyerEmail: 'guest@example.com',
    items: [{ product: MOCK_PRODUCTS[1], quantity: 1 }],
    total: 12000, status: 'processing', createdAt: '2024-03-10', address: 'KN 12 Ave, Kigali',
  },
  {
    id: 'o3', buyerId: 'u4', buyerName: 'Patrick Nkurunziza', buyerEmail: 'patrick@sokomart.rw',
    items: [{ product: MOCK_PRODUCTS[3], quantity: 3 }],
    total: 24000, status: 'pending', createdAt: '2024-03-15', address: 'KG 45 St, Kigali',
  },
];
