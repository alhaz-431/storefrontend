"use client";
import { motion } from "framer-motion";
import { FiSearch, FiShoppingCart, FiTruck, FiShield, FiArrowRight, FiStar } from "react-icons/fi";
import Link from "next/link";

export default function Hero({ searchQuery, setSearchQuery }: any) {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0f172a]">
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] left-[-5%] w-80 h-80 bg-emerald-600/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-[30%] left-[40%] w-60 h-60 bg-purple-600/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '2s' }} />
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-6 md:space-y-8">
            <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-lg px-4 py-2 rounded-full border border-white/10">
              <FiShield className="text-emerald-400" />
              <span className="text-[10px] md:text-xs font-black uppercase tracking-wider text-blue-400">Trusted Pharmacy in Bangladesh</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white italic uppercase tracking-tighter leading-[0.95]">
              Your Health <br />
              <span className="bg-gradient-to-r from-blue-500 via-emerald-500 to-cyan-500 bg-clip-text text-transparent">Our Priority.</span>
            </h1>
            <p className="max-w-lg text-slate-300 text-sm md:text-base leading-relaxed">
              মেডিসিন এখন আপনার হাতের মুঠোয়। জেনুইন ওষুধ কিনুন সবচেয়ে দ্রুততম সময়ে এবং সেরা দামে। 
              <span className="text-emerald-400 font-semibold"> ১০০% অরিজিনাল ওষুধের নিশ্চয়তা।</span>
            </p>
            <div className="relative max-w-2xl group">
              <input type="text" placeholder="Search medicines, vitamins, supplements..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full bg-white/5 backdrop-blur-lg border border-white/10 px-6 py-4 md:py-5 rounded-2xl text-white outline-none focus:border-blue-500 focus:bg-white/10 transition-all placeholder:text-slate-500 placeholder:text-xs md:placeholder:text-sm" />
              <Link href={`/shop?search=${searchQuery}`}>
                <button className="absolute right-2 top-2 md:right-3 md:top-2.5 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl transition-all shadow-lg flex items-center gap-2 font-semibold text-sm">
                  <FiSearch size={18} /> <span className="hidden sm:inline">Search</span>
                </button>
              </Link>
            </div>
            <div className="flex flex-wrap gap-3 md:gap-4">
              <Link href="/shop" className="bg-white text-black px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[9px] md:text-[10px] flex items-center gap-2 hover:bg-gradient-to-r hover:from-blue-600 hover:to-emerald-600 hover:text-white transition-all shadow-xl">
                <FiShoppingCart size={16} /> Shop Now <FiArrowRight />
              </Link>
              <Link href="/register" className="bg-white/10 backdrop-blur-lg border border-white/20 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-black uppercase text-[9px] md:text-[10px] hover:bg-white hover:text-black transition-all">Register as Seller</Link>
            </div>
            <div className="flex flex-wrap items-center gap-4 md:gap-6 pt-2 md:pt-4">
              <div className="flex -space-x-3">
                {[1,2,3,4,5].map(i => <div key={i} className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 md:border-4 border-[#0a0e27] bg-slate-800 overflow-hidden ring-2 ring-white/10"><img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="customer" className="w-full h-full object-cover" /></div>)}
              </div>
              <div>
                <div className="flex items-center gap-1 text-yellow-400 mb-1">{[1,2,3,4,5].map(i => <FiStar key={i} size={12} fill="currentColor" />)}</div>
                <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-wider">15K+ Happy Customers</p>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, delay: 0.3 }} className="relative hidden lg:block">
            <div className="relative z-10 w-full h-[500px] bg-gradient-to-br from-blue-600/20 to-transparent rounded-[60px] border border-white/10 overflow-hidden backdrop-blur-sm flex items-center justify-center group">
              <img src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=2030&auto=format&fit=crop" alt="Medicine" className="w-[70%] h-auto drop-shadow-2xl rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-700" />
            </div>
            <motion.div animate={{ y: [0, -20, 0] }} transition={{ repeat: Infinity, duration: 3 }} className="absolute top-10 -left-10 bg-white/10 backdrop-blur-xl p-4 md:p-6 rounded-[32px] border border-white/20 shadow-2xl">
              <p className="text-blue-400 font-black text-[10px] uppercase mb-1">Flash Sale </p>
              <h4 className="text-white font-bold text-sm">20% Off Vitamins</h4>
            </motion.div>
            <motion.div animate={{ y: [0, 20, 0] }} transition={{ repeat: Infinity, duration: 3, delay: 1 }} className="absolute bottom-10 -right-10 bg-emerald-600/90 backdrop-blur-xl p-4 md:p-6 rounded-[32px] shadow-2xl">
              <div className="flex items-center gap-3">
                <FiTruck className="text-white" size={24} />
                <div><p className="text-white/80 text-xs font-semibold">Free Delivery</p><p className="text-white font-bold">Orders 500৳+</p></div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}