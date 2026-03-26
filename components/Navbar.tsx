'use client';
import Link from 'next/link';
import { useState } from 'react';
import { ShoppingCart, Menu, X, Store, User, LogOut, ChevronDown } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../lib/store/hooks';
import { logout } from '../lib/features/authSlice';

export default function Navbar() {
  const dispatch = useAppDispatch();
  const { currentUser, isAuthenticated } = useAppSelector(s => s.auth);
  const cartCount = useAppSelector(s => s.cart.items.reduce((a, i) => a + i.quantity, 0));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const dashboardHref =
    currentUser?.role === 'admin' ? '/admin' :
    currentUser?.role === 'seller' ? '/seller' : '/account';

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-emerald-600">
            <Store className="w-6 h-6" />
            <span>SokoMart</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/shop" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">Shop</Link>
            <Link href="/shop?category=Electronics" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">Electronics</Link>
            <Link href="/shop?category=Clothing" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">Clothing</Link>
            <Link href="/shop?category=Food+%26+Drinks" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">Food</Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <Link href="/cart" className="relative p-2 text-gray-600 hover:text-emerald-600 transition-colors">
              <ShoppingCart className="w-6 h-6" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User menu */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 px-3 py-2 rounded-full transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span className="hidden sm:block text-sm font-medium">{currentUser?.name.split(' ')[0]}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800">{currentUser?.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{currentUser?.role}</p>
                    </div>
                    <Link href={dashboardHref} onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <User className="w-4 h-4" /> Dashboard
                    </Link>
                    <button onClick={() => { dispatch(logout()); setUserMenuOpen(false); }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                      <LogOut className="w-4 h-4" /> Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/login" className="text-sm font-medium text-gray-600 hover:text-emerald-600 transition-colors px-3 py-2">
                  Login
                </Link>
                <Link href="/auth/register" className="text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-full transition-colors">
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button className="md:hidden p-2 text-gray-600" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 flex flex-col gap-3">
          <Link href="/shop" className="text-gray-700 font-medium py-2" onClick={() => setMobileOpen(false)}>Shop</Link>
          <Link href="/shop?category=Electronics" className="text-gray-700 font-medium py-2" onClick={() => setMobileOpen(false)}>Electronics</Link>
          <Link href="/shop?category=Clothing" className="text-gray-700 font-medium py-2" onClick={() => setMobileOpen(false)}>Clothing</Link>
          <Link href="/shop?category=Food+%26+Drinks" className="text-gray-700 font-medium py-2" onClick={() => setMobileOpen(false)}>Food & Drinks</Link>
        </div>
      )}
    </nav>
  );
}
