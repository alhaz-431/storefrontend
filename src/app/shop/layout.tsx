"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, User } from "lucide-react";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  const [cartCount, setCartCount] = useState(0);

  // কার্টের আইটেম গণনা করার জন্য useEffect
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("medistore_cart") || "[]");
      // প্রতিটি আইটেমের quantity যোগ করে মোট সংখ্যা বের করা
      const totalItems = cart.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0);
      setCartCount(totalItems);
    };

    // পেজ লোড হওয়ার সময় একবার কল হবে
    updateCartCount();

    // যদি অন্য কোনো পেজ থেকে কার্ট আপডেট হয়, তাও ট্র্যাক করবে
    window.addEventListener("storage", updateCartCount);
    return () => window.removeEventListener("storage", updateCartCount);
  }, []);

  return (
    <div className="min-h-screen bg-[#02040a] text-white">
      {/* Shop Header */}
      <nav className="border-b border-white/5 bg-[#02040a]/80 backdrop-blur-md sticky top-0 z-50 p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link href="/shop">
            <h1 className="text-xl font-black italic uppercase">
              Medi<span className="text-emerald-500">Store</span>
            </h1>
          </Link>
          
          <div className="flex items-center gap-6">
            {/* Cart Link with Badge */}
            <Link 
              href="/cart" 
              className="relative p-2 bg-white/5 rounded-xl hover:bg-emerald-500/20 transition-all group"
            >
              <ShoppingCart size={20} className="group-hover:text-emerald-500" />
              
              {/* ডাইনামিক কাউন্টার ব্যাজ */}
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-emerald-500 text-black text-[10px] font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
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