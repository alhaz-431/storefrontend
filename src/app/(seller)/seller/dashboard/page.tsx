"use client";
import { motion } from "framer-motion";
import { DollarSign, Package, ShoppingCart, TrendingUp, Activity, ArrowUpRight } from "lucide-react";

export default function SellerDashboard() {
  const stats = [
    { label: "Revenue", value: "৳12,450", icon: <DollarSign size={24}/>, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Items", value: "48", icon: <Package size={24}/>, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Sales", value: "850", icon: <ShoppingCart size={24}/>, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Growth", value: "+12%", icon: <TrendingUp size={24}/>, color: "text-orange-500", bg: "bg-orange-500/10" },
  ];

  return (
    <div className="p-6 lg:p-10 min-h-screen bg-[#02040a]">
      <div className="mb-12 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter text-white">
            Seller <span className="text-emerald-500">Analytics</span>
          </h1>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Live performance of your pharmacy</p>
        </div>
        <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-3">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-white text-[10px] font-black uppercase tracking-widest">Live Updates</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/[0.02] border border-white/5 p-8 rounded-[40px] relative overflow-hidden group hover:border-emerald-500/30 transition-all"
          >
            <div className={`${stat.bg} ${stat.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
              {stat.icon}
            </div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-3xl font-black text-white mt-1 italic uppercase tracking-tighter">{stat.value}</h3>
            <Activity className="absolute -right-4 -bottom-4 text-white/[0.02] group-hover:text-emerald-500/10 transition-colors" size={120} />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          {/* Recent Orders Shortlist */}
          <div className="bg-white/[0.02] border border-white/5 rounded-[48px] p-10">
              <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-black italic text-white uppercase tracking-tight text-emerald-500">Quick Sales</h2>
                  <button className="text-[10px] font-black uppercase text-slate-500 hover:text-white transition-colors">View All Orders</button>
              </div>
              <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                      <div key={item} className="flex items-center justify-between p-5 bg-white/[0.03] rounded-[24px] border border-white/5 hover:bg-white/[0.05] transition-all cursor-pointer">
                          <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-500 text-xs font-bold italic">#{item}</div>
                              <div>
                                  <p className="text-white font-bold text-sm uppercase italic">Napa Extra</p>
                                  <p className="text-slate-500 text-[10px] font-bold">SUCCESSFUL DELIVERY</p>
                              </div>
                          </div>
                          <ArrowUpRight size={18} className="text-slate-600" />
                      </div>
                  ))}
              </div>
          </div>

          {/* Stock Alert */}
          <div className="bg-emerald-600/5 border border-emerald-600/10 rounded-[48px] p-10">
              <h2 className="text-xl font-black italic text-white uppercase tracking-tight mb-8">Stock <span className="text-emerald-500">Alerts</span></h2>
              <div className="bg-[#0a0c14] border border-white/5 p-6 rounded-3xl flex items-center justify-between">
                  <div>
                      <p className="text-white font-bold italic uppercase">Fexo 120mg</p>
                      <p className="text-orange-500 text-[10px] font-black uppercase tracking-widest mt-1">Only 12 items left</p>
                  </div>
                  <button className="bg-white/5 text-white px-5 py-2.5 rounded-xl text-[9px] font-black uppercase hover:bg-white/10 transition-all border border-white/10">Restock Now</button>
              </div>
          </div>
      </div>
    </div>
  );
}