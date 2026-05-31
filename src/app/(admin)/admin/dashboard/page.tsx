"use client";
import { motion } from "framer-motion";
import { Users, ShoppingBag, DollarSign, Package, ArrowRight, Activity, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const stats = [
    { label: "Total Users", value: "1,240", icon: <Users size={24} />, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Total Orders", value: "856", icon: <ShoppingBag size={24} />, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Total Revenue", value: "$15,240", icon: <DollarSign size={24} />, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Medicines", value: "320", icon: <Package size={24} />, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  return (
    <div className="p-4 md:p-8 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-10">
        <h1 className="text-3xl font-black uppercase text-gray-900 tracking-tight">Admin Overview</h1>
        <p className="text-gray-500 font-medium">Welcome back, Alfaz. Track your pharmacy growth.</p>
      </div>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all"
          >
            <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
              {stat.icon}
            </div>
            <h3 className="text-gray-400 text-[11px] font-bold uppercase tracking-widest">{stat.label}</h3>
            <p className="text-2xl font-black mt-1 text-gray-900">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Management Sections */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity Card */}
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-black uppercase text-gray-900">Recent Activity</h3>
            <Activity className="text-gray-400" size={20} />
          </div>
          <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-xl">
             <p className="text-gray-400 text-sm italic">No recent logs found. Ready for data integration.</p>
          </div>
        </div>

        {/* Quick Links Card */}
        <div className="bg-blue-600 p-8 rounded-2xl flex flex-col justify-between text-white shadow-lg shadow-blue-200">
          <div>
            <h3 className="text-xl font-black uppercase leading-tight mb-2">Platform Control</h3>
            <p className="text-blue-100 text-xs font-medium">Use these shortcuts to manage users and inventory quickly.</p>
          </div>
          <div className="mt-8 space-y-3">
             <Link href="/admin/users" className="flex items-center justify-between w-full bg-white/10 hover:bg-white/20 p-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all">
                Manage Users <ArrowRight size={16} />
             </Link>
             <Link href="/admin/orders" className="flex items-center justify-between w-full bg-white/10 hover:bg-white/20 p-4 rounded-xl text-xs font-bold uppercase tracking-widest transition-all">
                All Orders <ArrowRight size={16} />
             </Link>
          </div>
        </div>
      </div>
    </div>
  );
}