'use client';
import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Store, Eye, EyeOff, ShoppingBag, Package } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../lib/store/hooks';
import { registerThunk } from '../../../lib/features/authSlice';
import toast from 'react-hot-toast';

// ── Inner component uses useSearchParams — must be inside <Suspense> ──────────
function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(s => s.auth);
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'buyer' as 'buyer' | 'seller',
  });

  useEffect(() => {
    const r = searchParams.get('role');
    if (r === 'buyer' || r === 'seller') setForm(f => ({ ...f, role: r }));
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    const result = await dispatch(registerThunk(form));
    if (registerThunk.fulfilled.match(result)) {
      const user = result.payload;
      toast.success(`Welcome to SokoMart, ${user.name.split(' ')[0]}! 🎉`);
      if (user.role === 'seller') router.push('/seller');
      else router.push('/');
    } else {
      toast.error((result.payload as string) || 'Registration failed');
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl shadow-emerald-100/60 p-8">
      {/* Logo */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-200">
          <Store className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
        <p className="text-gray-400 text-sm mt-1">Join Rwanda&apos;s local marketplace</p>
      </div>

      {/* Role selector */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {[
          { role: 'buyer',  icon: <ShoppingBag className="w-6 h-6" />, title: 'I want to Buy',  sub: 'Browse & shop products' },
          { role: 'seller', icon: <Package     className="w-6 h-6" />, title: 'I want to Sell', sub: 'List & sell products' },
        ].map(({ role, icon, title, sub }) => (
          <button
            key={role}
            type="button"
            onClick={() => setForm({ ...form, role: role as 'buyer' | 'seller' })}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
              form.role === role
                ? 'border-emerald-500 bg-emerald-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <span className={form.role === role ? 'text-emerald-600' : 'text-gray-400'}>{icon}</span>
            <span className={`text-sm font-semibold ${form.role === role ? 'text-emerald-700' : 'text-gray-500'}`}>{title}</span>
            <span className="text-xs text-gray-400 text-center">{sub}</span>
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
          <input
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            placeholder="Jean Pierre Hakizimana"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
          <input
            type="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
          <div className="relative">
            <input
              type={showPw ? 'text' : 'password'}
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
              placeholder="Min. 6 characters"
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {form.role === 'seller' && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
            <strong>Note:</strong> Your products will be reviewed by our admin team before going live.
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-semibold py-3.5 rounded-xl transition-all hover:-translate-y-0.5 shadow-sm mt-2 flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Creating account...
            </>
          ) : (
            `Create ${form.role === 'seller' ? 'Seller ' : ''}Account`
          )}
        </button>
      </form>

      <p className="text-center text-sm text-gray-400 mt-6">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-emerald-600 font-semibold hover:underline">
          Sign in
        </Link>
      </p>
      <p className="text-center text-sm text-gray-400 mt-2">
        <Link href="/shop" className="hover:text-gray-600 transition-colors">
          Continue as guest →
        </Link>
      </p>
    </div>
  );
}

// ── Page wraps the form in Suspense (required for useSearchParams) ────────────
export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 px-4 py-16">
      <div className="w-full max-w-md">
        <Suspense
          fallback={
            <div className="bg-white rounded-3xl shadow-xl p-8 flex items-center justify-center min-h-64">
              <span className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
            </div>
          }
        >
          <RegisterForm />
        </Suspense>
      </div>
    </div>
  );
}
