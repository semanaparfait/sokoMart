'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, MapPin, User, Mail, Phone } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../lib/store/hooks';
import { clearCart } from '../../lib/features/cartSlice';
import { useCreateOrderMutation } from '../../lib/features/apiSlice';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items } = useAppSelector(s => s.cart);
  const { currentUser } = useAppSelector(s => s.auth);
  const [createOrder, { isLoading }] = useCreateOrderMutation();
  const [done, setDone] = useState(false);

  const [form, setForm] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: '',
    address: '',
    payment: 'momo',
  });

  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.address) {
      toast.error('Please fill in all required fields');
      return;
    }
    try {
      await createOrder({
        buyerId: currentUser?.id || null,
        buyerName: form.name,
        buyerEmail: form.email,
        items,
        total,
        address: form.address,
      }).unwrap();
      dispatch(clearCart());
      setDone(true);
    } catch {
      toast.error('Order failed. Please try again.');
    }
  };

  if (done) return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
        <CheckCircle className="w-12 h-12 text-emerald-500" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Placed! 🎉</h2>
      <p className="text-gray-500 max-w-sm mb-8">
        Thank you, {form.name}! Your order has been received and will be processed shortly. We&apos;ll send updates to {form.email}.
      </p>
      <button onClick={() => router.push('/shop')} className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-8 py-3 rounded-2xl transition-all">
        Continue Shopping
      </button>
    </div>
  );

  if (items.length === 0) {
    router.push('/cart');
    return null;
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-gray-800 text-lg mb-5 flex items-center gap-2">
              <User className="w-5 h-5 text-emerald-500" /> Contact Information
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  placeholder="Jean Pierre" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="jean@example.com" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="+250 788 000 000" />
                </div>
              </div>
            </div>
          </div>

          {/* Delivery */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-gray-800 text-lg mb-5 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-500" /> Delivery Address
            </h2>
            <textarea value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              rows={3} placeholder="Street, District, Kigali, Rwanda" required />
          </div>

          {/* Payment */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-bold text-gray-800 text-lg mb-5">Payment Method</h2>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { id: 'momo', label: 'MTN MoMo', emoji: '📱' },
                { id: 'airtel', label: 'Airtel Money', emoji: '💳' },
                { id: 'cash', label: 'Cash on Delivery', emoji: '💵' },
              ].map(({ id, label, emoji }) => (
                <label key={id} className={`flex items-center gap-3 border-2 rounded-xl p-4 cursor-pointer transition-colors ${form.payment === id ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="radio" name="payment" value={id} checked={form.payment === id}
                    onChange={e => setForm({ ...form, payment: e.target.value })} className="sr-only" />
                  <span className="text-2xl">{emoji}</span>
                  <span className="text-sm font-medium text-gray-700">{label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h2 className="font-bold text-gray-800 text-lg mb-5">Order Summary</h2>
            <div className="space-y-3 mb-5 max-h-48 overflow-y-auto">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between text-sm text-gray-600">
                  <span className="line-clamp-1 flex-1 pr-2">{product.name} ×{quantity}</span>
                  <span className="font-medium text-gray-800">{(product.price * quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 pt-4 mb-5">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>Delivery</span><span className="text-emerald-600">Free</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 text-lg">
                <span>Total</span><span>{total.toLocaleString()} RWF</span>
              </div>
            </div>
            <button type="submit" disabled={isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-semibold py-4 rounded-2xl transition-all hover:-translate-y-0.5 shadow-sm">
              {isLoading ? 'Placing Order...' : `Place Order · ${total.toLocaleString()} RWF`}
            </button>
            {!currentUser && (
              <p className="text-xs text-gray-400 text-center mt-3">
                Ordering as guest. <a href="/auth/login" className="text-emerald-600 hover:underline">Login</a> for order tracking.
              </p>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
