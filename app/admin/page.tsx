'use client';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck, Package, ShoppingBag, Users, TrendingUp,
  CheckCircle, XCircle, Clock, Eye, X, ChevronDown, Search
} from 'lucide-react';
import { useAppSelector } from '../../lib/store/hooks';
import {
  useGetProductsQuery, useGetOrdersQuery, useGetUsersQuery,
  useUpdateProductStatusMutation, useUpdateOrderStatusMutation,
} from '../../lib/features/apiSlice';
import { Product, ProductStatus, OrderStatus } from '../../lib/types';
import toast from 'react-hot-toast';

const PRODUCT_STATUS_STYLES: Record<ProductStatus, string> = {
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  approved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  rejected: 'bg-red-100 text-red-700 border-red-200',
};

const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  pending: 'bg-gray-100 text-gray-600',
  processing: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700',
};

export default function AdminDashboard() {
  const router = useRouter();
  const { currentUser, isAuthenticated } = useAppSelector(s => s.auth);
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders' | 'users'>('overview');
  const [reviewProduct, setReviewProduct] = useState<Product | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [productFilter, setProductFilter] = useState<ProductStatus | 'all'>('pending');
  const [orderSearch, setOrderSearch] = useState('');

  const { data: allProducts = [] } = useGetProductsQuery({});
  const { data: allOrders   = [] } = useGetOrdersQuery({});
  const { data: allUsers    = [] } = useGetUsersQuery();
  const [updateStatus,      { isLoading: updating }] = useUpdateProductStatusMutation();
  const [updateOrderStatus]                           = useUpdateOrderStatusMutation();

  // Guard
  if (!isAuthenticated || currentUser?.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <ShieldCheck className="w-16 h-16 text-gray-200 mb-4" />
        <h2 className="text-xl font-bold text-gray-700 mb-2">Admin Access Required</h2>
        <p className="text-gray-400 mb-4">You need admin privileges to access this page.</p>
        <button onClick={() => router.push('/auth/login')}
          className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-medium">
          Login as Admin
        </button>
      </div>
    );
  }

  const pending  = allProducts.filter(p => p.status === 'pending');
  const approved = allProducts.filter(p => p.status === 'approved');
  const rejected = allProducts.filter(p => p.status === 'rejected');
  const totalRevenue = allOrders.reduce((s, o) => s + o.total, 0);

  const filteredProducts = productFilter === 'all' ? allProducts : allProducts.filter(p => p.status === productFilter);
  const filteredOrders   = allOrders.filter(o =>
    o.buyerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
    o.id.toLowerCase().includes(orderSearch.toLowerCase())
  );

  const handleApprove = async (id: string) => {
    await updateStatus({ id, status: 'approved' }).unwrap();
    toast.success('Product approved and now live! ✅');
    setReviewProduct(null);
  };

  const handleReject = async (id: string) => {
    if (!rejectionReason.trim()) { toast.error('Please provide a rejection reason'); return; }
    await updateStatus({ id, status: 'rejected', rejectionReason }).unwrap();
    toast.success('Product rejected — seller notified');
    setReviewProduct(null);
    setRejectionReason('');
  };

  const handleOrderStatus = async (orderId: string, status: OrderStatus) => {
    await updateOrderStatus({ id: orderId, status }).unwrap();
    toast.success(`Order updated to "${status}"`);
  };

  const TABS = [
    { id: 'overview', label: 'Overview',  icon: <TrendingUp className="w-4 h-4" /> },
    { id: 'products', label: 'Products',  icon: <Package    className="w-4 h-4" />, badge: pending.length },
    { id: 'orders',   label: 'Orders',    icon: <ShoppingBag className="w-4 h-4" /> },
    { id: 'users',    label: 'Users',     icon: <Users      className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-400">SokoMart Control Panel</p>
            </div>
          </div>
          {pending.length > 0 && (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-sm font-medium px-4 py-2 rounded-xl">
              <Clock className="w-4 h-4" />
              {pending.length} product{pending.length > 1 ? 's' : ''} awaiting review
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-gray-100 rounded-2xl p-1 mb-6 w-fit shadow-sm overflow-x-auto">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}`}>
              {tab.icon} {tab.label}
              {tab.badge ? (
                <span className={`absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center ${activeTab === tab.id ? 'bg-white text-emerald-600' : 'bg-red-500 text-white'}`}>
                  {tab.badge}
                </span>
              ) : null}
            </button>
          ))}
        </div>

        {/* ── Overview ── */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Revenue',  value: `${totalRevenue.toLocaleString()} RWF`, icon: <TrendingUp  className="w-5 h-5" />, color: 'emerald', sub: 'All-time sales' },
                { label: 'Live Products',  value: approved.length,  icon: <CheckCircle  className="w-5 h-5" />, color: 'blue',   sub: 'Approved & active' },
                { label: 'Pending Review', value: pending.length,   icon: <Clock        className="w-5 h-5" />, color: 'amber',  sub: 'Need your attention' },
                { label: 'Total Orders',   value: allOrders.length, icon: <ShoppingBag  className="w-5 h-5" />, color: 'purple', sub: 'All-time orders' },
              ].map(({ label, value, icon, color, sub }) => (
                <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${
                    color === 'emerald' ? 'bg-emerald-100 text-emerald-600' :
                    color === 'blue'   ? 'bg-blue-100 text-blue-600'   :
                    color === 'amber'  ? 'bg-amber-100 text-amber-600'  : 'bg-purple-100 text-purple-600'
                  }`}>{icon}</div>
                  <p className="text-2xl font-bold text-gray-900">{value}</p>
                  <p className="text-sm text-gray-500 mt-0.5">{label}</p>
                  <p className="text-xs text-gray-300 mt-0.5">{sub}</p>
                </div>
              ))}
            </div>

            {/* Pending quick actions */}
            {pending.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-amber-500" /> Products Awaiting Approval
                  </h3>
                  <button onClick={() => setActiveTab('products')} className="text-emerald-600 text-sm font-medium hover:underline">
                    View all →
                  </button>
                </div>
                <div className="space-y-3">
                  {pending.slice(0, 3).map(p => (
                    <div key={p.id} className="flex items-center gap-4 p-3 bg-amber-50 rounded-xl border border-amber-100">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                        {p.images[0] && <Image src={p.images[0]} alt={p.name} fill className="object-cover" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 text-sm truncate">{p.name}</p>
                        <p className="text-xs text-gray-500">{p.sellerName} · {p.price.toLocaleString()} RWF</p>
                      </div>
                      <button onClick={() => setReviewProduct(p)}
                        className="flex items-center gap-1.5 bg-white border border-amber-200 text-amber-700 text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-amber-50 transition-colors flex-shrink-0">
                        <Eye className="w-3.5 h-3.5" /> Review
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent orders */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h3 className="font-bold text-gray-800 mb-4">Recent Orders</h3>
              <div className="divide-y divide-gray-50">
                {allOrders.slice(0, 5).map(o => (
                  <div key={o.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-gray-800 text-sm">#{o.id.slice(0, 8)} · {o.buyerName}</p>
                      <p className="text-xs text-gray-400">{o.items.length} item(s) · {String(o.createdAt).split('T')[0]}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800 text-sm">{o.total.toLocaleString()} RWF</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${ORDER_STATUS_COLORS[o.status]}`}>{o.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Products Tab ── */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              {(['all', 'pending', 'approved', 'rejected'] as const).map(f => (
                <button key={f} onClick={() => setProductFilter(f)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors capitalize ${productFilter === f ? 'bg-emerald-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
                  {f === 'all' ? `All (${allProducts.length})` :
                   f === 'pending'  ? `Pending (${pending.length})`  :
                   f === 'approved' ? `Approved (${approved.length})` : `Rejected (${rejected.length})`}
                </button>
              ))}
            </div>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                <Package className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400">No products in this category</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {filteredProducts.map(p => (
                  <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 flex overflow-hidden">
                    <div className="relative w-32 flex-shrink-0 bg-gray-50">
                      {p.images[0] && <Image src={p.images[0]} alt={p.name} fill className="object-cover" />}
                    </div>
                    <div className="p-4 flex-1 min-w-0">
                      <div className="flex items-start gap-2 justify-between">
                        <div className="min-w-0">
                          <p className="font-semibold text-gray-800 text-sm leading-tight truncate">{p.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">by {p.sellerName} · {p.category}</p>
                          <p className="text-emerald-600 font-bold text-sm mt-1">{p.price.toLocaleString()} RWF</p>
                        </div>
                        <span className={`flex-shrink-0 text-xs font-medium px-2.5 py-1 rounded-full border capitalize ${PRODUCT_STATUS_STYLES[p.status]}`}>
                          {p.status}
                        </span>
                      </div>
                      {p.status === 'rejected' && p.rejectionReason && (
                        <p className="text-xs text-red-500 mt-1.5 line-clamp-1">⚠️ {p.rejectionReason}</p>
                      )}
                      <div className="flex gap-2 mt-3">
                        <button onClick={() => setReviewProduct(p)}
                          className="flex items-center gap-1 text-xs font-medium bg-gray-50 hover:bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg transition-colors border border-gray-200">
                          <Eye className="w-3.5 h-3.5" /> Review
                        </button>
                        {p.status !== 'approved' && (
                          <button onClick={() => handleApprove(p.id)}
                            className="flex items-center gap-1 text-xs font-medium bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg transition-colors border border-emerald-200">
                            <CheckCircle className="w-3.5 h-3.5" /> Approve
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Orders Tab ── */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="relative max-w-sm">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input value={orderSearch} onChange={e => setOrderSearch(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Search by buyer or order ID..." />
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50">
                      {['Order', 'Buyer', 'Items', 'Total', 'Status', 'Update'].map(h => (
                        <th key={h} className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wide">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredOrders.map(o => (
                      <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-5 py-4">
                          <p className="font-semibold text-gray-800">#{o.id.slice(0, 8)}</p>
                          <p className="text-xs text-gray-400">{String(o.createdAt).split('T')[0]}</p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-medium text-gray-700">{o.buyerName}</p>
                          <p className="text-xs text-gray-400">{o.buyerEmail}</p>
                        </td>
                        <td className="px-5 py-4 text-gray-500">{o.items.length} item(s)</td>
                        <td className="px-5 py-4 font-bold text-emerald-600">{o.total.toLocaleString()} RWF</td>
                        <td className="px-5 py-4">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${ORDER_STATUS_COLORS[o.status]}`}>
                            {o.status}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="relative">
                            <select value={o.status} onChange={e => handleOrderStatus(o.id, e.target.value as OrderStatus)}
                              className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none pr-6 cursor-pointer">
                              {(['pending','processing','shipped','delivered','cancelled'] as OrderStatus[]).map(s => (
                                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                              ))}
                            </select>
                            <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredOrders.length === 0 && (
                  <div className="text-center py-12 text-gray-400">No orders found</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Users Tab ── */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-gray-800">All Users</h3>
              <span className="text-sm text-gray-400">{allUsers.length} registered</span>
            </div>
            <div className="divide-y divide-gray-50">
              {allUsers.map(u => (
                <div key={u.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50/50 transition-colors">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${
                    u.role === 'admin'  ? 'bg-purple-500' :
                    u.role === 'seller' ? 'bg-emerald-500' : 'bg-blue-500'
                  }`}>
                    {u.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800 text-sm">{u.name}</p>
                    <p className="text-xs text-gray-400">{u.email}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${
                      u.role === 'admin'  ? 'bg-purple-100 text-purple-700' :
                      u.role === 'seller' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                    }`}>{u.role}</span>
                    <p className="text-xs text-gray-400 mt-1">{String(u.createdAt).split('T')[0]}</p>
                  </div>
                </div>
              ))}
              {allUsers.length === 0 && (
                <div className="text-center py-12 text-gray-400">No users found</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ── Product Review Modal ── */}
      {reviewProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-8">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 text-lg">Review Product</h3>
              <button onClick={() => { setReviewProduct(null); setRejectionReason(''); }}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="relative h-56 rounded-2xl overflow-hidden bg-gray-50">
                {reviewProduct.images[0] && (
                  <Image src={reviewProduct.images[0]} alt={reviewProduct.name} fill className="object-cover" />
                )}
                <div className="absolute top-3 left-3">
                  <span className={`text-xs font-medium px-3 py-1.5 rounded-full border capitalize ${PRODUCT_STATUS_STYLES[reviewProduct.status]}`}>
                    {reviewProduct.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: 'Product Name', value: reviewProduct.name },
                  { label: 'Seller',       value: reviewProduct.sellerName },
                  { label: 'Price',        value: `${reviewProduct.price.toLocaleString()} RWF` },
                  { label: 'Category',     value: reviewProduct.category },
                  { label: 'Stock',        value: `${reviewProduct.stock} units` },
                  { label: 'Submitted',    value: String(reviewProduct.createdAt).split('T')[0] },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-0.5">{label}</p>
                    <p className="font-semibold text-gray-800 text-sm">{value}</p>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-1">Description</p>
                <p className="text-sm text-gray-700 leading-relaxed">{reviewProduct.description}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Rejection Reason <span className="text-gray-400 font-normal">(required only when rejecting)</span>
                </label>
                <textarea value={rejectionReason} onChange={e => setRejectionReason(e.target.value)} rows={2}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
                  placeholder="e.g. Product doesn't meet our quality standards..." />
              </div>

              <div className="flex gap-3">
                <button onClick={() => handleReject(reviewProduct.id)} disabled={updating}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl transition-colors">
                  <XCircle className="w-4 h-4" /> Reject
                </button>
                <button onClick={() => handleApprove(reviewProduct.id)} disabled={updating}
                  className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold py-3.5 rounded-xl transition-colors">
                  <CheckCircle className="w-4 h-4" /> Approve & Publish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
