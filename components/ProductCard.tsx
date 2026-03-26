'use client';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Star, Clock } from 'lucide-react';
import { Product } from '../lib/types';
import { useAppDispatch } from '../lib/store/hooks';
import { addToCart } from '../lib/features/cartSlice';
import toast from 'react-hot-toast';

interface Props { product: Product; }

export default function ProductCard({ product }: Props) {
  const dispatch = useAppDispatch();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(addToCart(product));
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <Link href={`/shop/${product.id}`} className="group bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col">
      {/* Image */}
      <div className="relative h-52 overflow-hidden bg-gray-50">
        <Image
          src={product.images[0] || 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&q=80'}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-emerald-500 text-white text-xs font-medium px-2 py-1 rounded-full">
            {product.category}
          </span>
        </div>
        {product.stock < 5 && product.stock > 0 && (
          <div className="absolute top-3 right-3">
            <span className="bg-orange-500 text-white text-xs font-medium px-2 py-1 rounded-full">
              Only {product.stock} left!
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-800 text-sm leading-tight mb-1 group-hover:text-emerald-600 transition-colors line-clamp-2">
          {product.name}
        </h3>
        <p className="text-gray-500 text-xs mb-3 line-clamp-2 flex-1">{product.description}</p>

        <div className="flex items-center gap-1 text-yellow-400 text-xs mb-3">
          {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 fill-current" />)}
          <span className="text-gray-400 ml-1">(4.8)</span>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="text-xl font-bold text-emerald-600">
              {product.price.toLocaleString()} RWF
            </span>
            <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
              <Clock className="w-3 h-3" /> by {product.sellerName}
            </p>
          </div>
          <button
            onClick={handleAddToCart}
            className="bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-xl transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </Link>
  );
}
