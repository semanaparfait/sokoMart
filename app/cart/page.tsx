'use client';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../lib/store/hooks';
import { removeFromCart, updateQuantity } from '../../lib/features/cartSlice';

export default function CartPage() {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector(s => s.cart);
  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  if (items.length === 0) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <ShoppingBag className="w-20 h-20 text-gray-200 mb-6" />
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
      <p className="text-gray-400 mb-6">Looks like you haven&apos;t added anything yet.</p>
      <Link href="/shop" className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3 rounded-2xl transition-all">
        Browse Products
      </Link>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Cart <span className="text-gray-400 font-normal text-xl">({items.length} items)</span></h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="flex gap-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50">
                <Image src={product.images[0] || ''} alt={product.name} fill className="object-cover" />
              </div>
              <div className="flex-1">
                <Link href={`/shop/${product.id}`} className="font-semibold text-gray-800 hover:text-emerald-600 transition-colors line-clamp-2 text-sm">
                  {product.name}
                </Link>
                <p className="text-xs text-gray-400 mt-0.5">{product.category} · by {product.sellerName}</p>
                <p className="text-emerald-600 font-bold mt-2">{product.price.toLocaleString()} RWF</p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button onClick={() => dispatch(removeFromCart(product.id))} className="text-gray-300 hover:text-red-500 transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="flex items-center gap-2 bg-gray-50 rounded-xl p-1">
                  <button onClick={() => dispatch(updateQuantity({ productId: product.id, quantity: quantity - 1 }))}
                    className="w-7 h-7 bg-white rounded-lg shadow-sm flex items-center justify-center hover:bg-emerald-50 transition-colors">
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="text-sm font-semibold w-5 text-center">{quantity}</span>
                  <button onClick={() => dispatch(updateQuantity({ productId: product.id, quantity: quantity + 1 }))}
                    className="w-7 h-7 bg-white rounded-lg shadow-sm flex items-center justify-center hover:bg-emerald-50 transition-colors">
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h2 className="text-lg font-bold text-gray-900 mb-5">Order Summary</h2>
            <div className="space-y-3 mb-5">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between text-sm text-gray-600">
                  <span className="line-clamp-1 flex-1 pr-2">{product.name} × {quantity}</span>
                  <span className="font-medium text-gray-800 flex-shrink-0">{(product.price * quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-4 mb-5">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>Subtotal</span><span>{total.toLocaleString()} RWF</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>Delivery</span><span className="text-emerald-600">Free</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 text-lg mt-3">
                <span>Total</span><span>{total.toLocaleString()} RWF</span>
              </div>
            </div>
            <Link href="/checkout"
              className="flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 rounded-2xl transition-all hover:-translate-y-0.5 shadow-sm">
              Proceed to Checkout <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/shop" className="flex items-center justify-center text-sm text-gray-400 hover:text-gray-600 mt-4 transition-colors">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
