// ─── Types ───────────────────────────────────────────────────────────────────

export type Role = 'buyer' | 'seller' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  createdAt: string;
}

export type ProductStatus = 'pending' | 'approved' | 'rejected';

export interface Product {
  id: string;
  sellerId: string;
  sellerName: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  status: ProductStatus;
  createdAt: string;
  rejectionReason?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  buyerId: string | null;
  buyerName: string;
  buyerEmail: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  address: string;
}
