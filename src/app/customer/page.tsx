"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ShoppingCart, User, Package, ArrowUpRight, 
  Plus, Activity, Zap, Clock, ShieldCheck, 
  ChevronRight, TrendingUp, Heart 
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function CustomerDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("medistore_user");
    if (!userData) {
      router.replace("/login");
      return;
    }
    try {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setLoading(false);
    } catch (error) {
      router.replace("/login");
    }
  }, [router]);

  if (loading) return null;

  return (
    <div className="min-h-screen bg-[#051a14] bg-gradient-to-br from-[#051a14] via-[#0a2e26] to-[#10b981]/5 text-white p-6 lg:p-12 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-2 mb-4 text-emerald-500">
              <ShieldCheck size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Secure Health Portal</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
              DASH<span className="text-emerald-500">BOARD</span>
            </h1>
          </motion.div>
          
          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-[25px] border border-white/5 backdrop-blur-md">
            <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center font-black text-black italic text-xl shadow-lg shadow-emerald-500/20">
              {user?.name?.[0]}
            </div>
            <div>
              <p className="text-[10px] font-black text-white/30 uppercase tracking-widest">Active Member</p>
              <p className="text-sm font-black italic uppercase">{user?.name}</p>
            </div>
          </div>
        </div>

        {/* Top Grid: Hero & Status */}
        <div className="grid lg:grid-cols-12 gap-8 mb-12">
          
          {/* Welcome Hero - 8 Cols */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-8 bg-emerald-500 rounded-[50px] p-10 md:p-14 text-black relative overflow-hidden group shadow-2xl shadow-emerald-500/10"
          >
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-[0.9]">
                Everything you need <br /> to stay <span className="text-white">healthy</span>
              </h2>
              <p className="mt-6 text-black/70 font-bold uppercase text-xs tracking-wider max-w-sm italic">
                Get your medications delivered at your doorstep with 100% authenticity.
              </p>
              <div className="flex flex-wrap gap-4 mt-10">
                <Link href="/shop" className="bg-black text-white px-10 py-5 rounded-2xl font-black uppercase italic text-xs hover:scale-105 transition-all inline-flex items-center gap-2 shadow-xl">
                  Order Now <Plus size={16} />
                </Link>
                <Link href="/customer/orders" className="bg-white/20 backdrop-blur-md text-black border border-black/10 px-10 py-5 rounded-2xl font-black uppercase italic text-xs hover:bg-white/40 transition-all inline-flex items-center gap-2">
                  Track Orders <Clock size={16} />
                </Link>
              </div>
            </div>
            <Zap className="absolute right-[-40px] bottom-[-40px] size-80 text-black/10 -rotate-12 pointer-events-none" />
          </motion.div>

          {/* Activity Stats - 4 Cols */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-4 grid grid-rows-2 gap-8"
          >
            <div className="bg-white/5 border border-white/5 rounded-[40px] p-8 backdrop-blur-xl relative group hover:border-emerald-500/30 transition-all">
              <TrendingUp className="text-emerald-500 mb-4" size={24} />
              <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Last Purchase</p>
              <h3 className="text-2xl font-black italic uppercase">৳{user?.lastAmount || '0.00'}</h3>
              <div className="mt-4 flex items-center gap-2 text-emerald-500 font-bold text-[9px] uppercase tracking-widest">
                View Receipt <ChevronRight size={10} />
              </div>
            </div>
            <div className="bg-white/5 border border-white/5 rounded-[40px] p-8 backdrop-blur-xl group hover:border-emerald-500/30 transition-all">
              <Heart className="text-red-500 mb-4 animate-pulse" size={24} />
              <p className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Health Tips</p>
              <p className="text-sm font-bold text-white/70 italic leading-tight uppercase">Stay hydrated and take medicines on time.</p>
            </div>
          </motion.div>
        </div>

        {/* Navigation Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          
          {[
            { title: "My Orders", icon: Package, link: "/customer/orders", desc: "Check your order status", color: "emerald" },
            { title: "My Cart", icon: ShoppingCart, link: "/customer/cart", desc: "Items ready to purchase", color: "emerald" },
            { title: "Settings", icon: User, link: "/customer/profile", desc: "Manage your address", color: "emerald" }
          ].map((item, idx) => (
            <Link key={idx} href={item.link} className="group">
              <motion.div 
                whileHover={{ y: -10 }}
                className="h-full bg-white/5 border border-white/5 p-10 rounded-[45px] hover:bg-white/[0.08] transition-all relative overflow-hidden"
              >
                <item.icon className="text-emerald-500 mb-8 group-hover:scale-110 transition-transform" size={32} />
                <h2 className="text-3xl font-black italic uppercase tracking-tighter leading-none mb-2">{item.title}</h2>
                <p className="text-white/20 text-[10px] font-black uppercase tracking-[0.2em]">{item.desc}</p>
                <div className="absolute top-10 right-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ArrowUpRight className="text-emerald-500" />
                </div>
                {/* Visual Accent */}
                <div className="absolute bottom-[-20px] right-[-20px] w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl" />
              </motion.div>
            </Link>
          ))}
        </div>

        {/* Recent Activity / Information Bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="bg-black/20 border border-white/5 rounded-[30px] p-8 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-6">
            <div className="flex -space-x-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#051a14] bg-emerald-700 flex items-center justify-center text-[10px] font-black">
                  +
                </div>
              ))}
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
              Joined by <span className="text-emerald-500">500+</span> New Customers this week
            </p>
          </div>
          <div className="flex gap-10">
            <div className="text-center">
              <p className="text-2xl font-black italic leading-none">100%</p>
              <p className="text-[8px] font-black uppercase tracking-widest text-emerald-500/60 mt-1">Authentic</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-black italic leading-none">24/7</p>
              <p className="text-[8px] font-black uppercase tracking-widest text-emerald-500/60 mt-1">Support</p>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}