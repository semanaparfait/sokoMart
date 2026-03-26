'use client';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ShieldCheck, Truck, HeartHandshake, TrendingUp, Star, ChevronRight } from 'lucide-react';
import { useGetProductsQuery } from '../lib/features/apiSlice';
import ProductCard from '../components/ProductCard';
import { CATEGORIES } from '../lib/mockData';

const CATEGORY_ICONS: Record<string, string> = {
  'Electronics': '📱', 'Clothing': '👗', 'Food & Drinks': '☕',
  'Home & Garden': '🏡', 'Beauty': '✨', 'Sports': '⚽', 'Books': '📚', 'Other': '🛍️',
};

const HERO_SLIDES = [
  { title: 'Shop Local,\nSupport Rwanda', sub: 'Discover unique products from small businesses and young entrepreneurs near you.', bg: 'from-emerald-600 to-teal-700', cta: 'Shop Now', href: '/shop' },
];

export default function HomePage() {
  const { data: products = [], isLoading } = useGetProductsQuery({ status: 'approved' });
  const featured = products.slice(0, 4);
  const newest = products.slice(-3).reverse();

  return (
    <div className="min-h-screen">
      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-yellow-300 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-white">
            <span className="inline-block bg-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
              🇷🇼 Made for Rwanda
            </span>
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
              Shop Local,<br />
              <span className="text-yellow-300">Support Rwanda</span>
            </h1>
            <p className="text-emerald-100 text-lg leading-relaxed mb-8 max-w-md">
              Discover unique products from small businesses and young entrepreneurs. Every purchase empowers a local dream.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/shop"
                className="flex items-center gap-2 bg-white text-emerald-700 font-semibold px-8 py-4 rounded-2xl hover:bg-emerald-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                Shop Now <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/auth/register?role=seller"
                className="flex items-center gap-2 border-2 border-white/60 text-white font-semibold px-8 py-4 rounded-2xl hover:bg-white/10 transition-all backdrop-blur-sm">
                Start Selling <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="flex items-center gap-6 mt-10 text-emerald-100 text-sm">
              <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-yellow-300" /> Secure Payments</div>
              <div className="flex items-center gap-2"><Truck className="w-4 h-4 text-yellow-300" /> Fast Delivery</div>
              <div className="flex items-center gap-2"><Star className="w-4 h-4 text-yellow-300" /> Verified Sellers</div>
            </div>
          </div>

          {/* Hero product grid */}
          <div className="hidden lg:grid grid-cols-2 gap-4">
            {[
              { img: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=300&q=80', label: 'Electronics' },
              { img: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&q=80', label: 'Fashion' },
              { img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&q=80', label: 'Food' },
              { img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=80', label: 'Crafts' },
            ].map(({ img, label }) => (
              <div key={label} className="relative rounded-2xl overflow-hidden shadow-lg aspect-square bg-white/10 backdrop-blur-sm border border-white/20">
                <Image src={img} alt={label} fill className="object-cover opacity-90" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                  <span className="text-white text-sm font-semibold">{label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats Bar ────────────────────────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { value: '500+', label: 'Products Listed' },
            { value: '200+', label: 'Local Sellers' },
            { value: '5,000+', label: 'Happy Buyers' },
            { value: '10+', label: 'Categories' },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="text-2xl font-bold text-emerald-600">{value}</p>
              <p className="text-sm text-gray-500">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Browse Categories</h2>
            <p className="text-gray-500 text-sm mt-1">Find exactly what you&apos;re looking for</p>
          </div>
          <Link href="/shop" className="text-emerald-600 font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {CATEGORIES.map((cat) => (
            <Link key={cat} href={`/shop?category=${encodeURIComponent(cat)}`}
              className="flex flex-col items-center gap-2 bg-white hover:bg-emerald-50 border border-gray-100 hover:border-emerald-200 rounded-2xl p-4 transition-all hover:-translate-y-0.5 hover:shadow-md group">
              <span className="text-2xl">{CATEGORY_ICONS[cat] || '🛍️'}</span>
              <span className="text-xs font-medium text-gray-600 group-hover:text-emerald-700 text-center leading-tight">{cat}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Featured Products</h2>
            <p className="text-gray-500 text-sm mt-1">Handpicked top items from our sellers</p>
          </div>
          <Link href="/shop" className="text-emerald-600 font-medium text-sm flex items-center gap-1 hover:gap-2 transition-all">
            See all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm h-72 animate-pulse border border-gray-100">
                <div className="h-48 bg-gray-100 rounded-t-2xl" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {featured.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* ── Sell Banner ───────────────────────────────────────────────────── */}
      <section className="bg-gradient-to-r from-gray-900 to-gray-800 py-16 mx-4 sm:mx-6 lg:mx-8 rounded-3xl mb-14 max-w-7xl lg:mx-auto overflow-hidden relative">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute -top-10 -right-10 w-72 h-72 bg-emerald-400 rounded-full blur-3xl" />
        </div>
        <div className="relative px-8 md:px-16 grid md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="text-emerald-400 text-sm font-semibold uppercase tracking-widest">For Entrepreneurs</span>
            <h2 className="text-3xl font-bold text-white mt-2 mb-4">Start Selling Today —<br />It&apos;s Free to Join</h2>
            <p className="text-gray-400 leading-relaxed mb-6">
              List your products, reach thousands of customers, and grow your business — all from your phone. No technical skills required.
            </p>
            <Link href="/auth/register?role=seller"
              className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-8 py-4 rounded-2xl transition-all hover:-translate-y-0.5 shadow-lg shadow-emerald-900/30">
              Create Seller Account <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <div className="hidden md:grid grid-cols-3 gap-4">
            {[
              { icon: <TrendingUp className="w-6 h-6" />, title: 'Track Sales', desc: 'Real-time analytics dashboard' },
              { icon: <ShieldCheck className="w-6 h-6" />, title: 'Secure Pay', desc: 'Protected transactions' },
              { icon: <HeartHandshake className="w-6 h-6" />, title: 'Support', desc: '24/7 seller assistance' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                <div className="text-emerald-400 mb-2">{icon}</div>
                <p className="text-white font-semibold text-sm">{title}</p>
                <p className="text-gray-400 text-xs mt-1">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── New Arrivals ──────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">New Arrivals</h2>
            <p className="text-gray-500 text-sm mt-1">Fresh products just listed</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {newest.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      </section>
    </div>
  );
}
