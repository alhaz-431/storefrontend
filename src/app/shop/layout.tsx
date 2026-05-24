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
    <div className="min-h-screen bg-gradient-to-b from-[#021e17] via-[#01140f] to-[#000b08] text-slate-200 font-sans selection:bg-[#c5a880]/30 overflow-x-hidden relative">
      
      {/* 👑 TOP PREMIUM GOLD PROGRESS BAR */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#8a7355] via-[#c5a880] to-[#8a7355] origin-left z-[100] shadow-[0_0_10px_rgba(197,168,128,0.5)]"
        style={{ scaleX }}
      />

      {/* ✨ LUXURY GOLDEN-EMERALD MOUSE SPOTLIGHT */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none opacity-25 transition-opacity duration-500"
        style={{
          background: `radial-gradient(700px at ${mousePos.x}px ${mousePos.y}px, rgba(197, 168, 128, 0.08), transparent 80%)`
        }}
      />

      {/* 🏛️ PREMIUM LUXURY TOP HEADER & NAVBAR */}
      <nav className="w-full bg-[#02231b]/90 border-b border-[#c5a880]/10 backdrop-blur-md sticky top-0 z-50 px-6 lg:px-16 py-4 flex items-center justify-between shadow-[0_4px_30px_rgba(0,0,0,0.4)]">
        {/* Logo Section */}
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="bg-gradient-to-br from-[#c5a880] to-[#8a7355] p-2.5 rounded-2xl shadow-[0_0_15px_rgba(197,168,128,0.2)]">
            <svg className="w-6 h-6 text-[#021e17]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M4.5 10.5C3.67 10.5 3 11.17 3 12s.67 1.5 1.5 1.5h15c.83 0 1.5-.67 1.5-1.5s-.67-1.5-1.5-1.5h-15z M10.5 4.5C10.5 3.67 11.17 3 12 3s1.5.67 1.5 1.5v15c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5v-15z"/>
            </svg>
          </div>
          <span className="text-2xl font-black uppercase tracking-[0.15em] text-white group-hover:text-[#c5a880] transition-colors duration-300">
            MEDI <span className="text-[#c5a880] font-normal font-serif italic">STORE</span>
          </span>
        </div>

        {/* Right Side Control Panel */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* User Status Badge */}
          <div className="hidden sm:flex items-center gap-2.5 px-4 py-2 bg-[#01140f] border border-[#c5a880]/20 rounded-full text-xs font-bold uppercase tracking-wider text-slate-300">
            <User size={14} className="text-[#c5a880]" />
            <span>Logged In</span>
          </div>

          {/* Cart Floating Trigger */}
          <button className="p-3 bg-[#01140f] border border-[#c5a880]/20 text-[#c5a880] rounded-2xl hover:bg-gradient-to-br hover:from-[#c5a880] hover:to-[#8a7355] hover:text-[#021e17] transition-all duration-300 shadow-xl relative group">
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#02231b] shadow-lg animate-pulse">
                {cartCount}
              </span>
            )}
          </button>

          {/* Luxury Logout Button */}
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-[#c5a880] to-[#8a7355] hover:from-white hover:to-slate-200 text-[#021e17] text-xs font-black uppercase tracking-wider rounded-2xl shadow-[0_4px_15px_rgba(197,168,128,0.2)] transition-all duration-300 active:scale-95"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </nav>

      {/* 📣 WORLD-CLASS INFINITE GOLDEN MARQUEE ANNOUNCEMENT BAR */}
      <div className="bg-[#01140f] border-b border-[#c5a880]/10 py-3 overflow-hidden sticky top-[73px] z-40 backdrop-blur-xl w-full">
        <div className="flex whitespace-nowrap animate-marquee">
          <div className="flex gap-20 items-center pr-20 shrink-0">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] flex items-center gap-2 text-[#c5a880]">
              <Sparkles size={12} className="text-[#c5a880] shadow-sm" /> SPARKLES Gold-Tier Membership Benefits!
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.25em] flex items-center gap-2 text-slate-300">
              <ShieldCheck size={12} className="text-[#c5a880]" /> Shield-Check Certified Genuine Medicines
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.25em] flex items-center gap-2 text-slate-300">
               <TrendingUp size={12} className="text-[#c5a880]" /> Trending-Up Fast, Reliable Global Delivery
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.25em] flex items-center gap-2 text-slate-300">
               <Zap size={12} className="text-[#c5a880]" /> Zap Expert Pharmacist Support
            </span>
          </div>
          
          {/* Loop Continuity Layer */}
          <div className="flex gap-20 items-center pr-20 shrink-0" aria-hidden="true">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] flex items-center gap-2 text-[#c5a880]">
              <Sparkles size={12} className="text-[#c5a880]" /> SPARKLES Gold-Tier Membership Benefits!
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.25em] flex items-center gap-2 text-slate-300">
              <ShieldCheck size={12} className="text-[#c5a880]" /> Shield-Check Certified Genuine Medicines
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.25em] flex items-center gap-2 text-slate-300">
               <TrendingUp size={12} className="text-[#c5a880]" /> Trending-Up Fast, Reliable Global Delivery
            </span>
            <span className="text-[10px] font-black uppercase tracking-[0.25em] flex items-center gap-2 text-slate-300">
               <Zap size={12} className="text-[#c5a880]" /> Zap Expert Pharmacist Support
            </span>
          </div>
        </div>
      </div>

      {/* 🚀 BACK TO TOP LUXURY FLOATING TRIGGER */}
      <div className="fixed right-6 bottom-8 z-50">
        <motion.button 
          onClick={scrollToTop}
          whileHover={{ y: -5, scale: 1.05 }}
          className="p-4 bg-[#02231b]/80 border border-[#c5a880]/20 rounded-2xl backdrop-blur-md text-[#c5a880] hover:border-[#c5a880] transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
        >
          <ArrowUp size={18} />
        </motion.button>
      </div>

      {/* ARCHITECTURAL BACKGROUND ORNAMENTS */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-20%] w-[1000px] h-[1000px] bg-[#022c22]/15 blur-[200px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[800px] h-[800px] bg-[#c5a880]/3 blur-[180px] rounded-full" />
      </div>

      {/* MAIN DYNAMIC CHILDS AREA */}
      <main className="relative z-10 mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl pb-24">
        {children}
      </main>

      {/* CUSTOM LUXURY ANIMATION & PREMIUM SCROLLBAR */}
      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 28s linear infinite;
        }
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #01140f;
        }
        ::-webkit-scrollbar-thumb {
          background: #02362a;
          border: 2px solid #01140f;
          border-radius: 20px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #c5a880;
        }
      `}</style>
    </div>
  );
}