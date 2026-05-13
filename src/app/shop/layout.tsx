"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingCart, User, Pill, Sparkles, TrendingUp, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  const [cartCount, setCartCount] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);

    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("medistore_cart") || "[]");
      const totalItems = cart.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0);
      setCartCount(totalItems);
    };

    updateCartCount();
    window.addEventListener("storage", updateCartCount);
    window.addEventListener("cartUpdated", updateCartCount);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", updateCartCount);
      window.removeEventListener("cartUpdated", updateCartCount);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#020a08] text-slate-200 font-sans selection:bg-emerald-500/30">
      
      {/* FEATURE: PROMO ANNOUNCEMENT BAR */}
      <div className="bg-emerald-500/10 border-b border-emerald-500/20 py-2 overflow-hidden sticky top-0 z-[60] backdrop-blur-md">
        <motion.div 
          animate={{ x: [1000, -1000] }}
          transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
          className="whitespace-nowrap flex gap-20 items-center"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 text-emerald-400">
            <Sparkles size={12} /> 10% Discount on First Purchase!
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 text-emerald-400">
            <ShieldCheck size={12} /> 100% Genuine Medicines Guaranteed
          </span>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 text-emerald-400">
             <TrendingUp size={12} /> Fast Home Delivery in Dhaka
          </span>
        </motion.div>
      </div>

      {/* BACKGROUND ORNAMENT */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-emerald-900/10 blur-[150px] rounded-full" />
      </div>

      {/* STICKY NAVIGATION */}
      <nav className={`fixed top-12 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 transition-all duration-500 rounded-[2.5rem] border ${
        scrolled 
        ? "bg-[#020a08]/80 backdrop-blur-2xl border-white/10 shadow-2xl py-3 px-8" 
        : "bg-transparent border-transparent py-6 px-4"
      }`}>
        <div className="flex justify-between items-center">
          <Link href="/shop" className="group flex items-center gap-2">
            <div className="p-2 bg-emerald-500 rounded-2xl group-hover:rotate-[360deg] transition-all duration-700 shadow-lg shadow-emerald-500/20">
                <Pill size={18} className="text-[#020a08]" />
            </div>
            <h1 className="text-xl font-black tracking-tighter uppercase text-white">
              Medi<span className="text-emerald-500">Store</span>
            </h1>
          </Link>

          <div className="flex items-center gap-4">
            <Link 
              href="/cart" 
              className="relative p-3 bg-white/5 border border-white/5 rounded-2xl hover:border-emerald-500/50 transition-all group"
            >
              <ShoppingCart size={20} className="text-slate-300 group-hover:text-emerald-400 transition-colors" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 bg-emerald-500 text-[#020a08] text-[9px] font-black rounded-full h-5 w-5 flex items-center justify-center shadow-lg shadow-emerald-500/40"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
            
            <Link href="/profile" className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl hover:bg-emerald-500 transition-all group overflow-hidden relative">
              <User size={20} className="text-emerald-500 group-hover:text-[#020a08] transition-colors relative z-10" />
              <div className="absolute inset-0 bg-emerald-500 translate-y-10 group-hover:translate-y-0 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="relative z-10 pt-40">
        {children}
      </main>

      {/* FEATURE: FLOATING QUICK CATEGORY NAV */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 hidden md:block">
        <div className="bg-[#0f172a]/80 backdrop-blur-xl border border-white/10 p-2 rounded-3xl flex items-center gap-2 shadow-2xl">
            {['All', 'Vitamins', 'Antibiotics', 'Fever', 'Diabetes'].map((cat) => (
                <button 
                  key={cat}
                  className="px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 hover:text-black transition-all border border-transparent hover:border-emerald-400"
                >
                    {cat}
                </button>
            ))}
        </div>
      </div>
    </div>
  );
}