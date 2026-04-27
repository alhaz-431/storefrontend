"use client";
import { motion } from "framer-motion";
import { 
  Users, ShoppingBag, DollarSign, Package, 
  TrendingUp, ArrowRight, Activity 
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  // স্ট্যাটিক ডাটা (পরে আপনি API থেকে নিয়ে আসবেন)
  const stats = [
    { label: "Total Users", value: "1,240", icon: <Users size={24} />, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Total Orders", value: "856", icon: <ShoppingBag size={24} />, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Total Revenue", value: "$15,240", icon: <DollarSign size={24} />, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Medicines", value: "320", icon: <Package size={24} />, color: "text-orange-500", bg: "bg-orange-500/10" },
  ];

  return (
    <div className="p-6 lg:p-10">
      {/* হেডার সেকশন */}
      <div className="mb-10">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl font-black italic uppercase tracking-tighter text-white"
        >
          Admin <span className="text-blue-600">Dashboard</span>
        </motion.h1>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">
          Welcome back, Alfaz. Here is what's happening today.
        </p>
      </div>

      {/* ১. Statistics Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/[0.03] border border-white/10 p-8 rounded-[32px] hover:border-blue-600/30 transition-all group"
          >
            <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
            <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">{stat.label}</h3>
            <p className="text-3xl font-black mt-1 text-white">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* ২. Quick Management Links (আপনার অন্য পেজগুলোর শর্টকাট) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/[0.03] border border-white/10 p-8 rounded-[40px]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black uppercase italic tracking-tight text-white">Recent Activities</h3>
            <Activity className="text-blue-600" size={20} />
          </div>
          <div className="space-y-4">
            <p className="text-sm text-slate-400 italic">No recent logs found. Connect your database to see live updates.</p>
          </div>
        </div>

        <div className="bg-blue-600 p-8 rounded-[40px] flex flex-col justify-between group cursor-pointer overflow-hidden relative">
            {/* ব্যাকগ্রাউন্ড ডিজাইন */}
            <div className="absolute top-[-20%] right-[-10%] w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:bg-white/20 transition-all" />
            
            <div>
                <h3 className="text-2xl font-black uppercase italic text-white leading-tight">Manage your <br /> Platform Users</h3>
                <p className="text-blue-100 text-xs mt-2 font-medium opacity-80">Check new sellers and customers</p>
            </div>
            
            <Link href="/admin/users" className="mt-8 flex items-center gap-2 text-white font-black uppercase text-[10px] tracking-widest bg-black/20 self-start px-6 py-3 rounded-xl hover:bg-black/40 transition-all">
                Go to User Management <ArrowRight size={14} />
            </Link>
        </div>
      </div>
    </div>
  );
}