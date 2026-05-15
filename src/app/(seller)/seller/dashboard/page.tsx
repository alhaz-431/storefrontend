"use client";
import { motion } from "framer-motion";
import { DollarSign, Package, ShoppingCart, Activity, ArrowUpRight, Clock, ShieldCheck } from "lucide-react";

export default function SellerDashboard() {
  const stats = [
    { label: "Total Revenue", value: "৳12,450", icon: <DollarSign size={24}/>, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Total Medicines", value: "48", icon: <Package size={24}/>, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Total Orders", value: "850", icon: <ShoppingCart size={24}/>, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Pending Orders", value: "12", icon: <Clock size={24}/>, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-10 min-h-screen bg-slate-50 font-sans">
      
      {/* Header */}
      <div className="mb-8 md:mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tight">
            Seller <span className="text-emerald-600">Analytics</span>
          </h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Live performance of your pharmacy</p>
        </div>
        <div className="bg-white border border-slate-200 px-4 py-2 rounded-2xl flex items-center gap-3 shadow-sm">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">System Active</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white border border-slate-200 p-6 rounded-[32px] relative overflow-hidden group hover:shadow-xl hover:shadow-slate-200/50 transition-all cursor-default"
          >
            <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 relative z-10`}>
              {stat.icon}
            </div>
            <div className="relative z-10">
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-2xl md:text-3xl font-black text-slate-900 mt-1 tracking-tight">{stat.value}</h3>
            </div>
            {/* Background Decoration */}
            <Activity className="absolute -right-4 -bottom-4 text-slate-50 group-hover:text-slate-100 transition-colors pointer-events-none" size={100} />
          </motion.div>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          
          {/* Quick Sales */}
          <div className="bg-white border border-slate-200 rounded-[40px] p-8 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                  <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Recent <span className="text-emerald-600">Sales</span></h2>
                  <button className="text-[10px] font-black uppercase text-emerald-600 hover:underline">View All</button>
              </div>
              <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                      <div key={item} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-emerald-200 transition-all cursor-pointer group">
                          <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-emerald-600 shadow-sm font-bold">#{item}</div>
                              <div>
                                  <p className="text-slate-900 font-bold text-sm uppercase">Napa Extra</p>
                                  <p className="text-slate-400 text-[9px] font-bold">10 mins ago • <span className="text-emerald-600">Success</span></p>
                              </div>
                          </div>
                          <ArrowUpRight size={18} className="text-slate-300 group-hover:text-emerald-500 transition-colors" />
                      </div>
                  ))}
              </div>
          </div>

          {/* Stock Alert */}
          <div className="bg-white border border-slate-200 rounded-[40px] p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-8">
                <ShieldCheck className="text-orange-500" size={24} />
                <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Inventory <span className="text-orange-500">Alerts</span></h2>
              </div>
              <div className="space-y-4">
                <div className="bg-orange-50/50 border border-orange-100 p-6 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <p className="text-slate-900 font-bold uppercase text-base">Fexo 120mg</p>
                        <p className="text-orange-600 text-[10px] font-black uppercase tracking-widest mt-1">Low Stock: Only 12 items left</p>
                    </div>
                    <button className="w-full sm:w-auto bg-orange-500 text-white px-6 py-2.5 rounded-xl text-[10px] font-black uppercase hover:bg-orange-600 transition-all shadow-md shadow-orange-100">Restock Now</button>
                </div>
                
                <div className="p-4 border border-dashed border-slate-200 rounded-2xl text-center">
                   <p className="text-slate-400 text-[10px] font-bold uppercase">Other products are in good standing</p>
                </div>
              </div>
          </div>

      </div>
    </div>
  );
}