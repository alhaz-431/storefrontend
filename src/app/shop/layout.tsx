"use client";
import React from "react";
import Link from "next/link";
import { ShoppingCart, User, Search } from "lucide-react";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#02040a] text-white">
      {/* Shop Header */}
      <nav className="border-b border-white/5 bg-[#02040a]/80 backdrop-blur-md sticky top-0 z-50 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/shop">
            <h1 className="text-xl font-black italic uppercase">Medi<span className="text-emerald-500">Store</span></h1>
          </Link>
          
          <div className="flex items-center gap-6">
            <Link href="/cart" className="relative p-2 bg-white/5 rounded-xl hover:bg-emerald-500/20 transition-all group">
              <ShoppingCart size={20} className="group-hover:text-emerald-500" />
            </Link>
            <Link href="/profile" className="p-2 bg-white/5 rounded-xl hover:bg-emerald-500/20 transition-all group">
              <User size={20} className="group-hover:text-emerald-500" />
            </Link>
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
}