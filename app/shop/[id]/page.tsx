'use client';
import { use } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShoppingCart, ArrowLeft, Star, Package, Shield, Truck } from 'lucide-react';
import { useGetProductByIdQuery } from '../../../lib/features/apiSlice';
import { useAppDispatch } from '../../../lib/store/hooks';
import { addToCart } from '../../../lib/features/cartSlice';
import toast from 'react-hot-toast';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { data: product, isLoading } = useGetProductByIdQuery(id);

  if (isLoading) return (
    <div className="max-w-6xl mx-auto px-4 py-12 animate-pulse">
      <div className="grid md:grid-cols-2 gap-10">
        <div className="h-96 bg-gray-100 rounded-3xl" />
        <div className="space-y-4">
          <div className="h-8 bg-gray-100 rounded w-3/4" />
          <div className="h-4 bg-gray-100 rounded w-1/2" />
          <div className="h-20 bg-gray-100 rounded" />
          <div className="h-12 bg-gray-100 rounded" />
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="text-center py-24">
      <p className="text-5xl mb-4">😕</p>
      <h2 className="text-xl font-semibold text-gray-700">Product not found</h2>
      <button onClick={() => router.push('/shop')} className="mt-4 text-emerald-600 hover:underline">Back to shop</button>
    </div>
  );

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    toast.success('Added to cart!');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back */}
      <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-500 hover:text-gray-800 mb-8 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to shop
      </button>

      <div className="grid md:grid-cols-2 gap-10">
        {/* Image */}
        <div className="relative h-96 md:h-[480px] rounded-3xl overflow-hidden bg-gray-50 shadow-sm">
          <Image
            src={product.images[0] || 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600&q=80'}
            alt={product.name}
            fill
            className="object-cover"
          />
          <div className="absolute top-4 left-4">
            <span className="bg-emerald-500 text-white text-sm font-medium px-3 py-1.5 rounded-full">
              {product.category}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <p className="text-gray-400 text-sm mb-1">Sold by <span className="text-emerald-600 font-medium">{product.sellerName}</span></p>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{product.name}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex text-yellow-400">{[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}</div>
            <span className="text-sm text-gray-500">(4.8 · 24 reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-4xl font-bold text-emerald-600">{product.price.toLocaleString()}</span>
            <span className="text-gray-500 font-medium">RWF</span>
          </div>

          {/* Description */}
          <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

          {/* Stock */}
          <div className="flex items-center gap-2 mb-6">
            <Package className="w-4 h-4 text-gray-400" />
            <span className={`text-sm font-medium ${product.stock > 10 ? 'text-emerald-600' : product.stock > 0 ? 'text-orange-500' : 'text-red-500'}`}>
              {product.stock > 10 ? `In Stock (${product.stock} available)` : product.stock > 0 ? `Only ${product.stock} left!` : 'Out of Stock'}
            </span>
          </div>

          {/* CTA */}
          <div className="flex gap-3 mb-8">
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-200 disabled:text-gray-400 text-white font-semibold py-4 rounded-2xl transition-all hover:-translate-y-0.5 shadow-sm"
            >
              <ShoppingCart className="w-5 h-5" /> Add to Cart
            </button>
          </div>

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: <Shield className="w-5 h-5 text-emerald-500" />, label: 'Secure Payment' },
              { icon: <Truck className="w-5 h-5 text-emerald-500" />, label: 'Fast Delivery' },
              { icon: <Star className="w-5 h-5 text-emerald-500" />, label: 'Verified Seller' },
            ].map(({ icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-1 bg-gray-50 rounded-2xl p-3 text-center border border-gray-100">
                {icon}
                <span className="text-xs text-gray-500 font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
