'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Store, Eye, EyeOff } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../lib/store/hooks';
import { loginThunk } from '../../../lib/features/authSlice';
import toast from 'react-hot-toast';

const DEMO_ACCOUNTS = [
  { role: 'Admin',  email: 'admin@sokomart.rw',   password: 'admin123'  },
  { role: 'Seller', email: 'jean@sokomart.rw',    password: 'seller123' },
  { role: 'Buyer',  email: 'patrick@sokomart.rw', password: 'buyer123'  },
];

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(s => s.auth);
  const [email, setEmail]   = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(loginThunk({ email, password }));
    if (loginThunk.fulfilled.match(result)) {
      const user = result.payload;
      toast.success(`Welcome back, ${user.name.split(' ')[0]}! 👋`);
      if (user.role === 'admin')  router.push('/admin');
      else if (user.role === 'seller') router.push('/seller');
      else router.push('/');
    } else {
      toast.error(result.payload as string || 'Login failed');
    }
  };

  const quickLogin = (acc: typeof DEMO_ACCOUNTS[0]) => {
    setEmail(acc.email);
    setPassword(acc.password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50 px-4 py-16">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl shadow-emerald-100/60 p-8">

          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-200">
              <Store className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
            <p className="text-gray-400 text-sm mt-1">Sign in to your SokoMart account</p>
          </div>

          {/* Demo accounts */}
          <div className="bg-emerald-50 hidden rounded-2xl p-4 mb-6 border border-emerald-100">
            <p className="text-xs font-semibold text-emerald-700 mb-3 uppercase tracking-wide">⚡ Quick Demo Login</p>
            <div className="flex gap-2">
              {DEMO_ACCOUNTS.map(acc => (
                <button key={acc.role} onClick={() => quickLogin(acc)}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold capitalize border-2 border-emerald-200 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-400 transition-all">
                  {acc.role}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Server error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                placeholder="you@example.com" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={password}
                  onChange={e => setPassword(e.target.value)} required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  placeholder="••••••••" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-semibold py-3.5 rounded-xl transition-all hover:-translate-y-0.5 shadow-sm mt-2 flex items-center justify-center gap-2">
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="text-emerald-600 font-semibold hover:underline">Create one</Link>
          </p>
          <p className="text-center text-sm text-gray-400 mt-2">
            <Link href="/shop" className="hover:text-gray-600 transition-colors">Continue as guest →</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
