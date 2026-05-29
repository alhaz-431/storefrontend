"use client";
import React, { useState, useEffect } from "react";
import { Sparkles, TrendingUp, ShieldCheck, ArrowUp, Zap, User, LogOut, ShoppingCart } from "lucide-react";
import { motion, useScroll, useSpring } from "framer-motion";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [cartCount, setCartCount] = useState(0);
  const { scrollYProgress } = useScroll();
  
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // ১. মাউসের লাক্সারি গ্লো স্পটলাইট এফেক্ট
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // ২. কার্ট কাউন্ট হ্যান্ডলিং লজিক
  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem("medistore_cart") || "[]");
      const total = cart.reduce((acc: number, item: any) => acc + item.quantity, 0);
      setCartCount(total);
    };

    updateCartCount();
    window.addEventListener("cartUpdated", updateCartCount);
    return () => window.removeEventListener("cartUpdated", updateCartCount);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/auth/login";
  };

  return (
    // 🎯 ওল্ড গ্রিন কালার চেঞ্জ করে মডার্ন মেটালিক ডার্ক ব্যাকগ্রাউন্ড আনা হলো
    <div className="min-h-screen bg-[#0a0f1d] via-[#0d1324] to-[#070b14] text-slate-200 font-sans selection:bg-emerald-500/30 overflow-x-hidden relative">
      
      {/* 👑 TOP PREMIUM EMERALD PROGRESS BAR */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 origin-left z-[100] shadow-[0_0_10px_rgba(16,185,129,0.5)]"
        style={{ scaleX }}
      />

      {/* ✨ LUXURY EMERALD-CYAN MOUSE SPOTLIGHT */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none opacity-20 transition-opacity duration-500"
        style={{
          background: `radial-gradient(600px at ${mousePos.x}px ${mousePos.y}px, rgba(16, 185, 129, 0.06), transparent 80%)`
        }}
      />

      {/* 🏛️ PREMIUM LUXURY TOP HEADER & NAVBAR */}
      <nav className="w-full bg-[#0d1527]/80 border-b border-slate-800/80 backdrop-blur-md sticky top-0 z-50 px-6 lg:px-16 py-4 flex items-center justify-between shadow-lg">
        {/* Logo Section */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-2.5 rounded-2xl shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            <svg className="w-5 h-5 text-slate-950" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4.5 10.5C3.67 10.5 3 11.17 3 12s.67 1.5 1.5 1.5h15c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5h-15z M10.5 4.5C10.5 3.67 11.17 3 12 3s1.5.67 1.5 1.5v15c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5v-15z"/>
            </svg>
          </div>
          <span className="text-xl font-black uppercase tracking-[0.15em] text-white group-hover:text-emerald-400 transition-colors duration-300">
            MEDI <span className="text-emerald-400 font-normal font-serif italic">STORE</span>
          </span>
        </div>

        {/* Right Side Control Panel */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* User Status Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 bg-slate-950 border border-slate-800 rounded-full text-[11px] font-bold uppercase tracking-wider text-slate-400">
            <User size={13} className="text-emerald-400" />
            <span>Logged In</span>
          </div>

          {/* Cart Floating Trigger */}
          <button className="p-3 bg-slate-950 border border-slate-800 text-slate-300 rounded-xl hover:bg-emerald-500 hover:text-slate-950 hover:border-emerald-500 transition-all duration-300 shadow-md relative group">
            <ShoppingCart size={16} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#0a0f1d] shadow-lg">
                {cartCount}
              </span>
            )}
          </button>

          {/* Luxury Logout Button */}
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border border-slate-800 hover:bg-rose-500/10 hover:border-rose-500/30 text-slate-300 hover:text-rose-400 text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-200 active:scale-95"
          >
            <LogOut size={13} /> Logout
          </button>
        </div>
      </nav>

      {/* 📣 WORLD-CLASS INFINITE GOLDEN MARQUEE ANNOUNCEMENT BAR */}
      <div className="bg-slate-950/60 border-b border-slate-900 py-2.5 overflow-hidden sticky top-[69px] z-40 backdrop-blur-md w-full">
        <div className="flex whitespace-nowrap animate-marquee">
          <div className="flex gap-20 items-center pr-20 shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 text-emerald-400">
              <Sparkles size={11} className="text-emerald-400" /> Gold-Tier Membership Benefits!
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 text-slate-400">
              <ShieldCheck size={11} className="text-emerald-400" /> Shield-Check Certified Genuine Medicines
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 text-slate-400">
               <TrendingUp size={11} className="text-emerald-400" /> Fast, Reliable Global Delivery
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 text-slate-400">
               <Zap size={11} className="text-emerald-400" /> Expert Pharmacist Support
            </span>
          </div>
          
          {/* Loop Continuity Layer */}
          <div className="flex gap-20 items-center pr-20 shrink-0" aria-hidden="true">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 text-emerald-400">
              <Sparkles size={11} className="text-emerald-400" /> Gold-Tier Membership Benefits!
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 text-slate-400">
              <ShieldCheck size={11} className="text-emerald-400" /> Shield-Check Certified Genuine Medicines
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 text-slate-400">
               <TrendingUp size={11} className="text-emerald-400" /> Fast, Reliable Global Delivery
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 text-slate-400">
               <Zap size={11} className="text-emerald-400" /> Expert Pharmacist Support
            </span>
          </div>
        </div>
      </div>

      {/* 🚀 BACK TO TOP LUXURY FLOATING TRIGGER */}
      <div className="fixed right-6 bottom-8 z-50">
        <motion.button 
          onClick={scrollToTop}
          whileHover={{ y: -3 }}
          className="p-3.5 bg-slate-900/90 border border-slate-800 rounded-xl backdrop-blur-md text-slate-400 hover:text-emerald-400 hover:border-emerald-500/40 transition-all duration-200 shadow-xl"
        >
          <ArrowUp size={16} />
        </motion.button>
      </div>

      {/* ARCHITECTURAL BACKGROUND ORNAMENTS */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[800px] h-[800px] bg-emerald-500/[0.02] blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-slate-500/[0.02] blur-[150px] rounded-full" />
      </div>

      {/* MAIN DYNAMIC CHILDS AREA */}
      <main className="relative z-10 mx-auto pt-6 pb-24">
        {children}
      </main>

      {/* CUSTOM LUXURY ANIMATION & PREMIUM SCROLLBAR */}
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 35s linear infinite;
        }
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #0a0f1d;
        }
        ::-webkit-scrollbar-thumb {
          background: #1e293b;
          border: 2px solid #0a0f1d;
          border-radius: 20px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #10b981;
        }
      `}</style>
    </div>
  );
}