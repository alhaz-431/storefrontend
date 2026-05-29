"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ShoppingCart, User, Package, ArrowUpRight, 
  Plus, Zap, Clock, ShieldCheck, 
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
    <div className="min-h-screen bg-[#051a14] bg-gradient-to-br from-[#051a14] via-[#0a2e26] to-[#10b981]/5 text-white p-4 sm:p-6 lg:p-12 relative overflow-hidden flex items-center">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-emerald-500/5 rounded-full blur-[100px] sm:blur-[150px] pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto relative z-10 py-6">
        
        {/* 📑 Header Section - মোবাইলে সুন্দরভাবে এলাইন করা হয়েছে */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 md:mb-12 gap-6">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <div className="flex items-center gap-2 mb-2 sm:mb-4 text-emerald-500">
              <ShieldCheck size={14} />
              <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em]">Secure Health Portal</span>
            </div>
            {/* 🎯 মোবাইলে টেক্সট ভেঙে যাওয়া আটকাতে text-4xl করা হয়েছে */}
            <h1 className="text-4xl sm:text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
              DASH<span className="text-emerald-500">BOARD</span>
            </h1>
          </motion.div>
          
          {/* ইউজার ব্যাজ */}
          <div className="flex items-center gap-4 bg-white/5 p-3 sm:p-4 rounded-[20px] sm:rounded-[25px] border border-white/5 backdrop-blur-md w-full sm:w-auto">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-500 rounded-full flex items-center justify-center font-black text-black italic text-lg sm:text-xl shadow-lg shadow-emerald-500/20 shrink-0">
              {user?.name?.[0]}
            </div>
            <div>
              <p className="text-[9px] sm:text-[10px] font-black text-white/30 uppercase tracking-widest">Active Member</p>
              <p className="text-xs sm:text-sm font-black italic uppercase truncate max-w-[180px]">{user?.name}</p>
            </div>
          </div>
        </div>

        {/* ⚡ Top Grid: Hero & Status (মোবাইলে ১ কলাম, ল্যাপটপে গ্রিড) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 mb-8 md:mb-12">
          
          {/* Welcome Hero Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-8 bg-emerald-500 rounded-[35px] sm:rounded-[50px] p-6 sm:p-10 md:p-14 text-black relative overflow-hidden group shadow-2xl shadow-emerald-500/10"
          >
            <div className="relative z-10">
              {/* মোবাইলে হেডিং সাইজ রেসপন্সিভ */}
              <h2 className="text-2xl sm:text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-[0.95]">
                Everything you need <br /> to stay <span className="text-white">healthy</span>
              </h2>
              <p className="mt-4 sm:mt-6 text-black/70 font-bold uppercase text-[10px] sm:text-xs tracking-wider max-w-sm italic">
                Get your medications delivered at your doorstep with 100% authenticity.
              </p>
              
              {/* অ্যাকশন বাটন - মোবাইলে নিচে নিচে বা পাশাপাশি সেফ থাকবে */}
              <div className="flex flex-wrap gap-3 mt-8 sm:mt-10">
                <Link href="/shop" className="bg-black text-white px-6 sm:px-10 py-3.5 sm:py-5 rounded-xl sm:rounded-2xl font-black uppercase italic text-[10px] sm:text-xs hover:scale-105 transition-all inline-flex items-center justify-center gap-2 shadow-xl grow sm:grow-0">
                  Order Now <Plus size={14} />
                </Link>
                <Link href="/customer/orders" className="bg-white/20 backdrop-blur-md text-black border border-black/10 px-6 sm:px-10 py-3.5 sm:py-5 rounded-xl sm:rounded-2xl font-black uppercase italic text-[10px] sm:text-xs hover:bg-white/40 transition-all inline-flex items-center justify-center gap-2 grow sm:grow-0">
                  Track Orders <Clock size={14} />
                </Link>
              </div>
            </div>
            <Zap className="absolute right-[-60px] sm:right-[-40px] bottom-[-60px] sm:bottom-[-40px] size-48 sm:size-80 text-black/10 -rotate-12 pointer-events-none" />
          </motion.div>

          {/* Activity Stats Card */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 lg:grid-rows-2 gap-6 md:gap-8"
          >
            <div className="bg-white/5 border border-white/5 rounded-[28px] sm:rounded-[40px] p-6 sm:p-8 backdrop-blur-xl relative group hover:border-emerald-500/30 transition-all flex flex-col justify-between">
              <div>
                <TrendingUp className="text-emerald-500 mb-3 sm:mb-4" size={22} />
                <p className="text-[9px] sm:text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Last Purchase</p>
                <h3 className="text-xl sm:text-2xl font-black italic uppercase">৳{user?.lastAmount || '0.00'}</h3>
              </div>
              <div className="mt-4 flex items-center gap-2 text-emerald-500 font-bold text-[9px] uppercase tracking-widest cursor-pointer">
                View Receipt <ChevronRight size={10} />
              </div>
            </div>

            <div className="bg-white/5 border border-white/5 rounded-[28px] sm:rounded-[40px] p-6 sm:p-8 backdrop-blur-xl group hover:border-emerald-500/30 transition-all">
              <Heart className="text-red-500 mb-3 sm:mb-4 animate-pulse" size={22} />
              <p className="text-[9px] sm:text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Health Tips</p>
              <p className="text-xs sm:text-sm font-bold text-white/70 italic leading-tight uppercase">Stay hydrated and take medicines on time.</p>
            </div>
          </motion.div>
        </div>

        {/* 🗂️ Navigation Cards Grid - মোবাইল টু ডেস্কটপ ফুল রেসপন্সিভ গ্রিড */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12">
          {[
            { title: "My Orders", icon: Package, link: "/customer/orders", desc: "Check your order status" },
            { title: "My Cart", icon: ShoppingCart, link: "/customer/cart", desc: "Items ready to purchase" },
            { title: "Settings", icon: User, link: "/customer/profile", desc: "Manage your address" }
          ].map((item, idx) => (
            <Link key={idx} href={item.link} className="group">
              <motion.div 
                whileHover={{ y: -5 }}
                className="h-full bg-white/5 border border-white/5 p-6 sm:p-10 rounded-[30px] sm:rounded-[45px] hover:bg-white/[0.08] transition-all relative overflow-hidden min-h-[180px] sm:min-h-[220px] flex flex-col justify-center"
              >
                <item.icon className="text-emerald-500 mb-4 sm:mb-8 group-hover:scale-105 transition-transform" size={28} />
                <h2 className="text-xl sm:text-3xl font-black italic uppercase tracking-tighter leading-none mb-2">{item.title}</h2>
                <p className="text-white/20 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em]">{item.desc}</p>
                <div className="absolute top-6 right-6 sm:top-10 sm:right-10 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
                  <ArrowUpRight className="text-emerald-500" />
                </div>
                <div className="absolute bottom-[-20px] right-[-20px] w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl" />
              </motion.div>
            </Link>
          ))}
        </div>

        {/* 📊 Recent Activity Information Bar - মোবাইলে কলাম আর বড় স্ক্রিনে রো (Row) */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="bg-black/20 border border-white/5 rounded-[24px] sm:rounded-[30px] p-6 sm:p-8 flex flex-col sm:grid sm:grid-cols-2 lg:flex lg:flex-row items-center justify-between gap-6"
        >
          <div className="flex items-center gap-4 sm:gap-6 w-full lg:w-auto">
            <div className="flex -space-x-3 sm:反space-x-4 shrink-0">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-[#051a14] bg-emerald-700 flex items-center justify-center text-[10px] font-black shadow-md">
                  +
                </div>
              ))}
            </div>
            <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-white/40 leading-relaxed">
              Joined by <span className="text-emerald-500">500+</span> New Customers this week
            </p>
          </div>
          
          <div className="flex gap-8 sm:gap-10 justify-end w-full lg:w-auto border-t border-white/5 sm:border-none pt-4 sm:pt-0">
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-black italic leading-none">100%</p>
              <p className="text-[8px] font-black uppercase tracking-widest text-emerald-500/60 mt-1">Authentic</p>
            </div>
            <div className="text-center">
              <p className="text-xl sm:text-2xl font-black italic leading-none">24/7</p>
              <p className="text-[8px] font-black uppercase tracking-widest text-emerald-500/60 mt-1">Support</p>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}