"use client";
import { motion } from "framer-motion";
import { DollarSign, Package, ShoppingCart, TrendingUp, Activity, ArrowUpRight, Clock } from "lucide-react";

export default function SellerDashboard() {
  // আপনার রিকোয়ারমেন্ট অনুযায়ী স্ট্যাটাস সাজানো হয়েছে
  const stats = [
    { label: "Total Revenue", value: "৳12,450", icon: <DollarSign size={24}/>, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Total Medicines", value: "48", icon: <Package size={24}/>, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Total Orders", value: "850", icon: <ShoppingCart size={24}/>, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Pending Orders", value: "12", icon: <Clock size={24}/>, color: "text-orange-500", bg: "bg-orange-500/10" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-10 min-h-screen bg-[#02040a]">
      {/* Header - Mobile friendly */}
      <div className="mb-8 md:mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-white">
            Seller <span className="text-emerald-500">Analytics</span>
          </h1>
          <p className="text-slate-500 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] mt-2">Live performance of your pharmacy</p>
        </div>
        <div className="bg-white/5 border border-white/10 px-4 md:px-6 py-2 md:py-3 rounded-2xl flex items-center gap-3 self-end sm:self-auto">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest">Live Updates</span>
        </div>
      </div>

      {/* Stats Grid - Auto responsive columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/[0.02] border border-white/5 p-6 md:p-8 rounded-[24px] md:rounded-[40px] relative overflow-hidden group hover:border-emerald-500/30 transition-all"
          >
            <div className={`${stat.bg} ${stat.color} w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-500 relative z-10`}>
              {stat.icon}
            </div>
            <div className="relative z-10">
              <p className="text-slate-500 text-[9px] md:text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-2xl md:text-3xl font-black text-white mt-1 italic uppercase tracking-tighter">{stat.value}</h3>
            </div>
            {/* Background Decoration - Icon position fixed for mobile */}
            <Activity className="absolute -right-4 -bottom-4 text-white/[0.02] group-hover:text-emerald-500/10 transition-colors pointer-events-none" size={100} />
          </motion.div>
        ))}
      </div>

      {/* Bottom Section - Responsive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mt-8 md:mt-12">
          
          {/* Quick Sales - Recent Orders */}
          <div className="bg-white/[0.02] border border-white/5 rounded-[32px] md:rounded-[48px] p-6 md:p-10">
              <div className="flex justify-between items-center mb-6 md:mb-8">
                  <h2 className="text-lg md:text-xl font-black italic text-white uppercase tracking-tight text-emerald-500">Quick Sales</h2>
                  <button className="text-[9px] md:text-[10px] font-black uppercase text-slate-500 hover:text-white transition-colors">View All</button>
              </div>
              <div className="space-y-3 md:space-y-4">
                  {[1, 2, 3].map((item) => (
                      <div key={item} className="flex items-center justify-between p-4 md:p-5 bg-white/[0.03] rounded-[20px] md:rounded-[24px] border border-white/5 hover:bg-white/[0.05] transition-all cursor-pointer">
                          <div className="flex items-center gap-3 md:gap-4">
                              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-500 text-[10px] font-bold italic shrink-0">#{item}</div>
                              <div className="min-w-0">
                                  <p className="text-white font-bold text-xs md:text-sm uppercase italic truncate">Napa Extra</p>
                                  <p className="text-slate-500 text-[8px] md:text-[9px] font-bold">DELIVERED</p>
                              </div>
                          </div>
                          <ArrowUpRight size={16} className="text-slate-600 shrink-0" />
                      </div>
                  ))}
              </div>
          </div>

          {/* Stock Alert - Low Inventory */}
          <div className="bg-emerald-600/5 border border-emerald-600/10 rounded-[32px] md:rounded-[48px] p-6 md:p-10">
              <h2 className="text-lg md:text-xl font-black italic text-white uppercase tracking-tight mb-6 md:mb-8">Stock <span className="text-emerald-500">Alerts</span></h2>
              <div className="space-y-4">
                <div className="bg-[#0a0c14] border border-white/5 p-5 md:p-6 rounded-[24px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="min-w-0">
                        <p className="text-white font-bold italic uppercase text-sm md:text-base truncate">Fexo 120mg</p>
                        <p className="text-orange-500 text-[9px] md:text-[10px] font-black uppercase tracking-widest mt-1">Only 12 items left</p>
                    </div>
                    <button className="w-full sm:w-auto bg-white/5 text-white px-5 py-2.5 rounded-xl text-[9px] font-black uppercase hover:bg-white/10 transition-all border border-white/10 text-center">Restock</button>
                </div>
              </div>
          </div>

      </div>
    </div>
  );
}