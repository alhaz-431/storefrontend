"use client";
import React, { useState, useEffect } from "react";
import { Sparkles, TrendingUp, ShieldCheck, MessageCircle, ArrowUp, Zap } from "lucide-react";
import { motion, useScroll, useSpring } from "framer-motion";

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Mouse Spotlight Effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#020a08] text-slate-200 font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      
      {/* 1. TOP PROGRESS BAR */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-emerald-500 origin-left z-[100]"
        style={{ scaleX }}
      />

      {/* 2. DYNAMIC MOUSE SPOTLIGHT */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none opacity-40 transition-opacity duration-500"
        style={{
          background: `radial-gradient(600px at ${mousePos.x}px ${mousePos.y}px, rgba(16, 185, 129, 0.05), transparent 80%)`
        }}
      />

      {/* 3. PROMO ANNOUNCEMENT BAR (ENHANCED) */}
      <div className="bg-emerald-950/40 border-b border-emerald-500/10 py-2 overflow-hidden sticky top-0 z-[60] backdrop-blur-xl">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
          className="whitespace-nowrap flex gap-20 items-center"
        >
          {[1, 2].map((i) => (
            <React.Fragment key={i}>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 text-emerald-400/80">
                <Sparkles size={12} className="text-emerald-500" /> 10% Discount on First Purchase!
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 text-emerald-400/80">
                <ShieldCheck size={12} className="text-emerald-500" /> 100% Genuine Medicines Guaranteed
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 text-emerald-400/80">
                 <TrendingUp size={12} className="text-emerald-500" /> Fast Home Delivery in Dhaka
              </span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 text-emerald-400/80">
                 <Zap size={12} className="text-emerald-500" /> 24/7 Professional Pharmacist Support
              </span>
            </React.Fragment>
          ))}
        </motion.div>
      </div>

      {/* 4. SIDE QUICK-ACTION DOCK */}
      <div className="fixed left-6 bottom-10 z-50 flex flex-col gap-4">
        <motion.button 
          whileHover={{ scale: 1.1, x: 5 }}
          className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl backdrop-blur-md text-emerald-500 hover:bg-emerald-500 hover:text-black transition-all shadow-2xl"
        >
          <MessageCircle size={20} />
        </motion.button>
      </div>

      {/* 5. BACK TO TOP BUTTON */}
      <div className="fixed right-6 bottom-10 z-50">
        <motion.button 
          onClick={scrollToTop}
          whileHover={{ y: -5 }}
          className="p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md text-slate-400 hover:text-white transition-all shadow-2xl"
        >
          <ArrowUp size={20} />
        </motion.button>
      </div>

      {/* BACKGROUND ORNAMENT */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-emerald-900/10 blur-[180px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-emerald-800/5 blur-[150px] rounded-full" />
      </div>

      {/* MAIN CONTENT AREA */}
      <main className="relative z-10 pt-10">
        {children}
      </main>

      {/* CUSTOM SCROLLBAR CSS */}
      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #020a08;
        }
        ::-webkit-scrollbar-thumb {
          background: #064e3b;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #10b981;
        }
      `}</style>
    </div>
  );
}