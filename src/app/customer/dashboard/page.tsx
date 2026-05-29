"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, ShoppingCart, User, Loader2, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

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
      const role = parsedUser.role?.toUpperCase();
      
      if (role !== "CUSTOMER") {
        router.replace("/");
        return;
      }
      
      setUser(parsedUser);
      loading && setLoading(false);
    } catch (error) {
      localStorage.removeItem("medistore_user");
      router.replace("/login");
    }
  }, [router, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020d0a] text-slate-200 font-black text-xs uppercase tracking-widest gap-2">
        <Loader2 className="animate-spin text-[#006643]" size={20} /> 
        Loading Secure Panel...
      </div>
    );
  }

  const cards = [
    {
      title: "My Orders",
      tag: "History",
      desc: "Track, cancel, and view your pharmacy medicine orders.",
      icon: <ShoppingBag size={24} />,
      path: "/customer/orders",
    },
    {
      title: "Shopping Cart",
      tag: "Basket",
      desc: "Check items, change quantities, and proceed to buy.",
      icon: <ShoppingCart size={24} />,
      path: "/customer/cart",
    },
    {
      title: "My Profile",
      tag: "Account",
      desc: "Update your shipping address, password, and personal info.",
      icon: <User size={24} />,
      path: "/customer/profile",
    }
  ];

  return (
    /* 🎯 রেসপন্সিভ প্যাডিং এবং ব্যাকগ্রাউন্ড সেট */
    <div className="px-4 sm:px-6 md:px-10 lg:px-16 xl:px-24 min-h-screen bg-[#020d0a] bg-[radial-gradient(circle_at_top_right,_#006643,_#020d0a)] font-sans text-slate-200 py-12 md:py-20 flex items-center">
      <div className="w-full max-w-7xl mx-auto">
        
        {/* Header Section - মোবাইল টু ডেস্কটপ ফ্লুইড লেআউট */}
        <div className="mb-10 md:mb-16 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {/* মোবাইল স্ক্রিনের জন্য টেক্সট সাইজ অপ্টিমাইজ করা হয়েছে (text-2xl থেকে md:text-5xl) */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-slate-100 uppercase tracking-tight leading-tight">
              Welcome back, <br className="sm:hidden" />
              <span className="text-[#006643]">{user?.name || "Customer"}</span> 👋
            </h1>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-3">
              Manage your health and orders from one place
            </p>
          </motion.div>
          
          {/* একটিভ স্ট্যাটাস ব্যাজ - মোবাইলে যাতে ভেঙে না যায় */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/[0.02] border border-white/5 px-4 py-2 rounded-2xl flex items-center gap-3 backdrop-blur-md shadow-sm shrink-0">
            <div className="w-2 h-2 bg-[#006643] rounded-full animate-pulse" />
            <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Account Active</span>
          </motion.div>
        </div>

        {/* Cards Grid - 🎯 ১ কলাম (মোবাইল), ২ কলাম (ট্যাবলেট) এবং ৩ কলাম (ডেস্কটপ) করা হয়েছে */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <motion.div 
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => router.push(card.path)}
              className="bg-white/[0.02] border border-white/5 p-6 sm:p-8 rounded-[28px] md:rounded-[32px] hover:border-[#006643]/30 hover:bg-white/[0.04] transition-all duration-300 cursor-pointer group backdrop-blur-md flex flex-col justify-between relative overflow-hidden min-h-[250px]"
            >
              <div>
                {/* আইকন বক্স */}
                <div className="bg-[#006643]/10 border border-[#006643]/20 text-[#006643] w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-105 group-hover:bg-[#006643] group-hover:text-white transition-all duration-300 shadow-inner">
                  {card.icon}
                </div>
                
                <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest">{card.tag}</p>
                <h2 className="text-lg md:text-xl font-black text-slate-100 mt-1 uppercase tracking-tight transition-colors duration-200">
                  {card.title}
                </h2>
                <p className="text-slate-400 mt-2 text-xs font-semibold leading-relaxed max-w-sm">
                  {card.desc}
                </p>
              </div>

              {/* বটম ট্রানজিশনাল অ্যারো */}
              <div className="mt-8 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-500 group-hover:text-white transition-colors">
                <span>Explore Panel</span>
                <ArrowRight size={14} className="transform group-hover:translate-x-1 transition-transform text-[#006643]" />
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}