'use client';
import { Store, Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 text-white font-bold text-xl mb-3">
              <Store className="w-6 h-6 text-emerald-400" />
              <span>SokoMart</span>
            </div>
            <p className="text-sm leading-relaxed max-w-xs">
              Empowering small businesses and young entrepreneurs in Rwanda to sell online and reach broader markets.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="p-2 bg-gray-800 hover:bg-emerald-600 rounded-lg transition-colors"><Facebook className="w-4 h-4" /></a>
              <a href="#" className="p-2 bg-gray-800 hover:bg-emerald-600 rounded-lg transition-colors"><Twitter className="w-4 h-4" /></a>
              <a href="#" className="p-2 bg-gray-800 hover:bg-emerald-600 rounded-lg transition-colors"><Instagram className="w-4 h-4" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/shop" className="hover:text-emerald-400 transition-colors">Shop</Link></li>
              <li><Link href="/auth/register?role=seller" className="hover:text-emerald-400 transition-colors">Become a Seller</Link></li>
              <li><Link href="/auth/login" className="hover:text-emerald-400 transition-colors">Login</Link></li>
              <li><Link href="/cart" className="hover:text-emerald-400 transition-colors">My Cart</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-emerald-400" /> info@sokomart.rw</li>
              <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-emerald-400" /> +250 788 000 000</li>
              <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-emerald-400" /> Kigali, Rwanda</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} SokoMart. All rights reserved. Built for Rwanda&apos;s youth entrepreneurs.
        </div>
      </div>
    </footer>
  );
}
