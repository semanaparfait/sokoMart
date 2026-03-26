'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useGetProductsQuery } from '../../lib/features/apiSlice';
import ProductCard from '../../components/ProductCard';
import { CATEGORIES } from '../../lib/mockData';

export default function ShopPage() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState(searchParams.get('category') || '');
  const [sort, setSort] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  const { data: products = [], isLoading } = useGetProductsQuery({ status: 'approved' });

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCat(cat);
  }, [searchParams]);

  const filtered = products
    .filter(p => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      const matchCat = !selectedCat || p.category === selectedCat;
      return matchSearch && matchCat;
    })
    .sort((a, b) => {
      if (sort === 'price-asc') return a.price - b.price;
      if (sort === 'price-desc') return b.price - a.price;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {selectedCat || 'All Products'}
        </h1>
        <p className="text-gray-500 mt-1">{filtered.length} products found</p>
      </div>

      {/* Search + Filter Bar */}
      <div className="flex flex-wrap gap-3 mb-6">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
        </div>
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
        >
          <option value="newest">Newest First</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm hover:bg-gray-50 transition-colors"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setSelectedCat('')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!selectedCat ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
        >
          All
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat === selectedCat ? '' : cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCat === cat ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Active filters */}
      {(selectedCat || search) && (
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <span className="text-sm text-gray-500">Active filters:</span>
          {selectedCat && (
            <span className="flex items-center gap-1 bg-emerald-100 text-emerald-700 text-sm px-3 py-1 rounded-full">
              {selectedCat}
              <button onClick={() => setSelectedCat('')}><X className="w-3 h-3" /></button>
            </span>
          )}
          {search && (
            <span className="flex items-center gap-1 bg-emerald-100 text-emerald-700 text-sm px-3 py-1 rounded-full">
              &quot;{search}&quot;
              <button onClick={() => setSearch('')}><X className="w-3 h-3" /></button>
            </span>
          )}
        </div>
      )}

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm h-72 animate-pulse">
              <div className="h-48 bg-gray-100 rounded-t-2xl" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-100 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-6xl mb-4">🔍</p>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
          <p className="text-gray-400">Try adjusting your filters or search term</p>
          <button onClick={() => { setSearch(''); setSelectedCat(''); }} className="mt-4 text-emerald-600 font-medium hover:underline">
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  );
}
