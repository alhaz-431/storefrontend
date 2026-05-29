"use client";
import { motion } from "framer-motion";
import { FiSearch, FiShoppingCart, FiTruck, FiShield, FiArrowRight, FiStar } from "react-icons/fi";
import Link from "next/link";

export default function Hero({ searchQuery, setSearchQuery }: any) {
  return (
    // 🎯 ব্যাকগ্রাউন্ড পরিবর্তন: নেভবারের সাথে মিল রেখে সফট গ্রেডিয়েন্ট লাইট থিম দেওয়া হয়েছে
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-emerald-50/30 to-blue-50/20">
      
      {/* 🔮 সফট লাইট ব্যাকগ্রাউন্ড অর্বস (আগে ডার্ক ছিল, এখন লাইট থিমের সাথে মানানসই করা হয়েছে) */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-400/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-5%] w-80 h-80 bg-emerald-400/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          {/* 📝 LEFT CONTENT */}
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-6 md:space-y-8">
            
            {/* ব্যাজ লাইট থিম */}
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-100/80 px-4 py-2 rounded-full">
              <FiShield className="text-emerald-600" />
              <span className="text-[10px] md:text-xs font-black uppercase tracking-wider text-emerald-700">Trusted Pharmacy in Bangladesh</span>
            </div>
            
            {/* মেইন হেডিং কালার: লাইট থিমের জন্য টেক্সট এখন গাঢ় স্লেট (text-slate-900) */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-slate-900 italic uppercase tracking-tighter leading-[0.95]">
              Your Health <br />
              <span className="bg-gradient-to-r from-blue-600 via-emerald-600 to-cyan-600 bg-clip-text text-transparent">Our Priority.</span>
            </h1>
            
            <p className="max-w-lg text-slate-600 text-sm md:text-base leading-relaxed">
              মেডিসিন এখন আপনার হাতের মুঠোয়। জেনুইন ওষুধ কিনুন সবচেয়ে দ্রুততম সময়ে এবং সেরা দামে। 
              <span className="text-emerald-600 font-bold"> ১০০% অরিজিনাল ওষুধের নিশ্চয়তা।</span>
            </p>
            
            {/* 🔍 SEARCH BAR (ইনপুট ফিল্ডটি এখন হোয়াইট এবং শ্যাডো করা হয়েছে যাতে লাইট থিমে সুন্দর ফোটে) */}
            <div className="relative max-w-2xl group">
              <input 
                type="text" 
                placeholder="Search medicines, vitamins, supplements..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                className="w-full bg-white border border-slate-200/80 px-6 py-4 md:py-5 rounded-2xl text-slate-800 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 transition-all placeholder:text-slate-400 text-xs md:text-sm shadow-sm" 
              />
              <Link href={`/shop?search=${searchQuery}`}>
                <button className="absolute right-2 top-2 md:right-3 md:top-2.5 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl transition-all shadow-md flex items-center gap-2 font-semibold text-sm">
                  <FiSearch size={18} /> <span className="hidden sm:inline">Search</span>
                </button>
              </Link>
            </div>

            {/* 🛒 ACTION BUTTONS (বাটনগুলোর কন্ট্রাস্ট লাইট ব্যাকগ্রাউন্ডের সাথে ম্যাচ করা হয়েছে) */}
            <div className="flex flex-wrap gap-3 md:gap-4">
              <Link href="/shop" className="bg-slate-900 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[9px] md:text-[10px] flex items-center gap-2 hover:bg-emerald-600 transition-all shadow-lg shadow-slate-900/10">
                <FiShoppingCart size={16} /> Shop Now <FiArrowRight />
              </Link>
              <Link href="/register" className="bg-white border border-slate-200 text-slate-700 px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-black uppercase text-[9px] md:text-[10px] hover:bg-slate-50 transition-all shadow-sm">
                Register as Seller
              </Link>
            </div>

            {/* 👥 SOCIAL PROOF */}
            <div className="flex flex-wrap items-center gap-4 md:gap-6 pt-2 md:pt-4">
              <div className="flex -space-x-3">
                {[1,2,3,4,5].map(i => (
                  <div key={i} className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white bg-slate-100 overflow-hidden shadow-sm">
                    <img src={`https://i.pravatar.cc/100?img=${i+15}`} alt="customer" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 text-amber-500 mb-1">
                  {[1,2,3,4,5].map(i => <FiStar key={i} size={12} fill="currentColor" />)}
                </div>
                <p className="text-[9px] md:text-[10px] font-black text-slate-500 uppercase tracking-wider">15K+ Happy Customers</p>
              </div>
            </div>
          </motion.div>

          {/* 📸 RIGHT IMAGE SECTION */}
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.3 }} className="relative hidden lg:block">
            
            {/* মেইন ইমেজ কন্টেইনার (বর্ডার এবং শ্যাডো মডিফাই করা হয়েছে) */}
            <div className="relative z-10 w-full h-[450px] lg:h-[550px] bg-slate-100 rounded-[40px] md:rounded-[60px] border border-slate-200/60 overflow-hidden shadow-xl flex items-center justify-center">
              <img 
                src="/img/medi13.jpg" 
                alt="Healthcare Service" 
                className="w-full h-full object-cover"
              />
              {/* নিচের ডার্ক শ্যাডো সরিয়ে লাইট শ্যাডো গ্রেডিয়েন্ট দেওয়া হয়েছে */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-50/40 via-transparent to-transparent" />
            </div>

            {/* 🏷️ FLOATING OFFER CARD */}
            <motion.div 
              animate={{ y: [0, -15, 0] }} 
              transition={{ repeat: Infinity, duration: 4 }} 
              className="absolute top-10 -left-10 z-20 bg-white/95 backdrop-blur-md p-5 rounded-[24px] md:rounded-[32px] border border-slate-100 shadow-xl"
            >
              <p className="text-emerald-600 font-black text-[10px] uppercase mb-1">Flash Sale</p>
              <h4 className="text-slate-800 font-black text-sm md:text-base">20% Off Vitamins</h4>
            </motion.div>

            {/* 🚚 FLOATING DELIVERY CARD */}
            <motion.div 
              animate={{ y: [0, 15, 0] }} 
              transition={{ repeat: Infinity, duration: 4, delay: 1 }} 
              className="absolute bottom-10 -right-5 z-20 bg-emerald-600 p-5 md:p-6 rounded-[24px] md:rounded-[32px] shadow-lg shadow-emerald-600/20"
            >
              <div className="flex items-center gap-3">
                <FiTruck className="text-white" size={24} />
                <div>
                  <p className="text-emerald-100 text-[10px] font-bold uppercase">Free Delivery</p>
                  <p className="text-white font-black text-sm md:text-base">Orders 500৳+</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}