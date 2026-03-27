'use client';
import { useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  Package, PlusCircle, ShoppingBag, TrendingUp, Clock,
  CheckCircle, XCircle, Trash2, X, Upload, ChevronDown
} from 'lucide-react';
import { useAppSelector } from '../../lib/store/hooks';
import {
  useGetProductsQuery, useGetOrdersQuery,
  useAddProductMutation, useDeleteProductMutation
} from '../../lib/features/apiSlice';
import { CATEGORIES } from '../../lib/mockData';
import { ProductStatus } from '../../lib/types';
import toast from 'react-hot-toast';

const STATUS_STYLES: Record<ProductStatus, string> = {
  pending: 'bg-amber-100 text-amber-700',
  approved: 'bg-emerald-100 text-emerald-700',
  rejected: 'bg-red-100 text-red-700',
};

const STATUS_ICONS: Record<ProductStatus, React.ReactNode> = {
  pending: <Clock className="w-3.5 h-3.5" />,
  approved: <CheckCircle className="w-3.5 h-3.5" />,
  rejected: <XCircle className="w-3.5 h-3.5" />,
};

const MAX_IMAGE_SIZE_BYTES = 2 * 1024 * 1024;
const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export default function SellerDashboard() {
  const router = useRouter();
  const { currentUser, isAuthenticated } = useAppSelector(s => s.auth);
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'add'>('overview');
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const { data: products = [], isLoading: loadingProducts } = useGetProductsQuery({ sellerId: currentUser?.id });
  const { data: orders = [] } = useGetOrdersQuery({ sellerId: currentUser?.id });
  const [addProduct, { isLoading: adding }] = useAddProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const [form, setForm] = useState({
    name: '', description: '', price: '', category: CATEGORIES[0],
    stock: '', imageUrl: '', imageName: '',
  });

  // Guard
  if (!isAuthenticated || currentUser?.role !== 'seller') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <Package className="w-16 h-16 text-gray-200 mb-4" />
        <h2 className="text-xl font-bold text-gray-700 mb-2">Seller Access Required</h2>
        <p className="text-gray-400 mb-4">Please log in as a seller to access this dashboard.</p>
        <button onClick={() => router.push('/auth/login')} className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-medium">
          Login as Seller
        </button>
      </div>
    );
  }

  const approved = products.filter(p => p.status === 'approved');
  const pending = products.filter(p => p.status === 'pending');
  const rejected = products.filter(p => p.status === 'rejected');
  const revenue = orders.reduce((sum, o) =>
    sum + o.items.filter(i => i.product.sellerId === currentUser.id).reduce((s, i) => s + i.product.price * i.quantity, 0), 0);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.description || !form.price || !form.stock) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (!form.imageUrl) {
      toast.error('Please upload a product image');
      return;
    }
    try {
      await addProduct({
        sellerId: currentUser.id,
        sellerName: currentUser.name,
        name: form.name,
        description: form.description,
        price: Number(form.price),
        category: form.category,
        stock: Number(form.stock),
        images: [form.imageUrl],
      }).unwrap();
      toast.success('Product submitted for review!');
      setForm({ name: '', description: '', price: '', category: CATEGORIES[0], stock: '', imageUrl: '', imageName: '' });
      if (imageInputRef.current) imageInputRef.current.value = '';
      setActiveTab('products');
    } catch {
      toast.error('Failed to add product');
    }
  };

  const handleImagePick = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!SUPPORTED_IMAGE_TYPES.includes(file.type)) {
      toast.error('Use JPG, PNG, or WEBP image files');
      e.target.value = '';
      return;
    }

    if (file.size > MAX_IMAGE_SIZE_BYTES) {
      toast.error('Image must be 2MB or smaller');
      e.target.value = '';
      return;
    }

    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error('Failed to read selected file'));
      reader.readAsDataURL(file);
    }).catch(() => {
      toast.error('Could not read selected image');
      return '';
    });

    if (!dataUrl) return;
    setForm(prev => ({ ...prev, imageUrl: dataUrl, imageName: file.name }));
  };

  const handleDelete = async (id: string) => {
    await deleteProduct(id).unwrap();
    toast.success('Product deleted');
    setDeleteId(null);
  };

  const TABS = [
    { id: 'overview', label: 'Overview', icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'products', label: 'My Products', icon: <Package className="w-4 h-4" /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'add', label: 'Add Product', icon: <PlusCircle className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Seller Dashboard</h1>
            <p className="text-sm text-gray-400">Welcome back, {currentUser.name} 👋</p>
          </div>
          <button onClick={() => setActiveTab('add')}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all">
            <PlusCircle className="w-4 h-4" /> Add Product
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-gray-100 rounded-2xl p-1 mb-6 w-fit shadow-sm">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* ── Overview ── */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Revenue', value: `${revenue.toLocaleString()} RWF`, icon: <TrendingUp className="w-5 h-5" />, color: 'emerald' },
                { label: 'Live Products', value: approved.length, icon: <CheckCircle className="w-5 h-5" />, color: 'blue' },
                { label: 'Pending Review', value: pending.length, icon: <Clock className="w-5 h-5" />, color: 'amber' },
                { label: 'Total Orders', value: orders.length, icon: <ShoppingBag className="w-5 h-5" />, color: 'purple' },
              ].map(({ label, value, icon, color }) => (
                <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                    color === 'emerald' ? 'bg-emerald-100 text-emerald-600' :
                    color === 'blue' ? 'bg-blue-100 text-blue-600' :
                    color === 'amber' ? 'bg-amber-100 text-amber-600' : 'bg-purple-100 text-purple-600'
                  }`}>{icon}</div>
                  <p className="text-2xl font-bold text-gray-900">{value}</p>
                  <p className="text-sm text-gray-400 mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Recent products */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-800 mb-4">Recent Products</h3>
              {products.slice(0, 5).map(p => (
                <div key={p.id} className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0">
                  <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                    <Image src={p.images[0] || ''} alt={p.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 text-sm truncate">{p.name}</p>
                    <p className="text-xs text-gray-400">{p.price.toLocaleString()} RWF · {p.category}</p>
                  </div>
                  <span className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[p.status]}`}>
                    {STATUS_ICONS[p.status]} {p.status}
                  </span>
                </div>
              ))}
              {products.length === 0 && (
                <p className="text-gray-400 text-sm text-center py-4">No products yet. Add your first product!</p>
              )}
            </div>
          </div>
        )}

        {/* ── Products ── */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            {loadingProducts ? (
              <div className="grid md:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => <div key={i} className="bg-white rounded-2xl h-32 animate-pulse border border-gray-100" />)}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
                <Package className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-500 font-medium">No products yet</p>
                <button onClick={() => setActiveTab('add')} className="mt-3 text-emerald-600 font-medium text-sm hover:underline">
                  Add your first product →
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {products.map(p => (
                  <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 flex overflow-hidden">
                    <div className="relative w-28 flex-shrink-0">
                      <Image src={p.images[0] || ''} alt={p.name} fill className="object-cover" />
                    </div>
                    <div className="p-4 flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-gray-800 text-sm leading-tight truncate">{p.name}</p>
                        <button onClick={() => setDeleteId(p.id)} className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5 mb-2">{p.category} · Stock: {p.stock}</p>
                      <p className="text-emerald-600 font-bold text-sm mb-2">{p.price.toLocaleString()} RWF</p>
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full capitalize ${STATUS_STYLES[p.status]}`}>
                        {STATUS_ICONS[p.status]} {p.status}
                      </span>
                      {p.status === 'rejected' && p.rejectionReason && (
                        <p className="text-xs text-red-500 mt-1.5 line-clamp-2">⚠️ {p.rejectionReason}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Orders ── */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100">
              <h3 className="font-bold text-gray-800">Orders Containing My Products</h3>
            </div>
            {orders.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingBag className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400">No orders yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {orders.map(o => {
                  const myItems = o.items.filter(i => i.product.sellerId === currentUser.id);
                  const myTotal = myItems.reduce((s, i) => s + i.product.price * i.quantity, 0);
                  return (
                    <div key={o.id} className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-semibold text-gray-800 text-sm">Order #{o.id}</p>
                          <p className="text-xs text-gray-400">{o.buyerName} · {o.createdAt}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-emerald-600 text-sm">{myTotal.toLocaleString()} RWF</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            o.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' :
                            o.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                            o.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                            o.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                          } capitalize`}>{o.status}</span>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        {myItems.map(({ product, quantity }) => (
                          <div key={product.id} className="flex justify-between text-xs text-gray-500">
                            <span>{product.name} × {quantity}</span>
                            <span>{(product.price * quantity).toLocaleString()} RWF</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── Add Product ── */}
        {activeTab === 'add' && (
          <div className="max-w-2xl">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-800 text-lg mb-1">List a New Product</h3>
              <p className="text-sm text-gray-400 mb-6">Your product will be reviewed by admin before going live.</p>

              <form onSubmit={handleAddProduct} className="space-y-5">
                {/* Image preview */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
                  <div className="relative h-40 rounded-2xl overflow-hidden bg-gray-50 border-2 border-dashed border-gray-200 mb-3">
                    {form.imageUrl && <Image src={form.imageUrl} alt="preview" fill className="object-cover" />}
                    {!form.imageUrl && (
                      <div className="flex flex-col items-center justify-center h-full text-gray-300">
                        <Upload className="w-8 h-8 mb-2" />
                        <p className="text-sm">Upload your own product image</p>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={handleImagePick}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => imageInputRef.current?.click()}
                      className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
                    >
                      <Upload className="w-4 h-4" />
                      Choose Image
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setForm(prev => ({ ...prev, imageUrl: '', imageName: '' }));
                        if (imageInputRef.current) imageInputRef.current.value = '';
                      }}
                      disabled={!form.imageUrl}
                      className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-red-500 disabled:text-gray-300"
                    >
                      Remove
                    </button>
                    <p className="text-xs text-gray-400 w-full">
                      JPG, PNG, or WEBP. Max size 2MB.
                      {form.imageName ? ` Selected: ${form.imageName}` : ''}
                    </p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Product Name *</label>
                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="e.g. Handwoven Basket" />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Description *</label>
                    <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} required rows={3}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                      placeholder="Describe your product clearly..." />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Price (RWF) *</label>
                    <input type="number" min="1" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="5000" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Stock Quantity *</label>
                    <input type="number" min="1" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} required
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="20" />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Category *</label>
                    <div className="relative">
                      <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none bg-white pr-10">
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
                  🔍 Your product will be reviewed by an admin. Once approved, it will be visible to all buyers on the marketplace.
                </div>

                <button type="submit" disabled={adding}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-semibold py-4 rounded-xl transition-all hover:-translate-y-0.5 shadow-sm">
                  {adding ? 'Submitting...' : 'Submit Product for Review'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-900">Delete Product?</h3>
              <button onClick={() => setDeleteId(null)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-gray-500 text-sm mb-6">This action cannot be undone. The product will be permanently removed.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 border border-gray-200 text-gray-600 font-medium py-3 rounded-xl hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium py-3 rounded-xl transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
