"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Eye, Clock, CheckCircle2, Truck, XCircle, Search } from "lucide-react";

export default function AdminOrdersPage() {
  // স্যাম্পল অর্ডার ডাটা
  const orders = [
    { id: "ORD-7721", customer: "Alfaz ARbby", date: "24 April 2026", amount: "$45.00", status: "Delivered" },
    { id: "ORD-8842", customer: "Rahim Ahmed", date: "25 April 2026", amount: "$120.00", status: "Processing" },
    { id: "ORD-9910", customer: "Karim Khan", date: "26 April 2026", amount: "$15.50", status: "Pending" },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Delivered": return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      case "Processing": return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      case "Pending": return "text-orange-500 bg-orange-500/10 border-orange-500/20";
      default: return "text-slate-500 bg-slate-500/10 border-slate-500/20";
    }
  };

  return (
    <div className="p-6 lg:p-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white">
            Order <span className="text-blue-600">History</span>
          </h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">
            Monitor all transactions across MediStore
          </p>
        </div>

        {/* সার্চ ফিল্টার */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500" size={18} />
          <input 
            type="text" 
            placeholder="Search by Order ID..."
            className="bg-white/5 border border-white/10 pl-12 pr-6 py-3 rounded-2xl text-sm outline-none focus:border-blue-600 transition-all w-full md:w-64"
          />
        </div>
      </div>

      {/* অর্ডার টেবিল */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/[0.02] border border-white/10 rounded-[32px] overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              <tr>
                <th className="px-8 py-6">Order ID</th>
                <th className="px-8 py-6">Customer</th>
                <th className="px-8 py-6">Date</th>
                <th className="px-8 py-6">Amount</th>
                <th className="px-8 py-6">Status</th>
                <th className="px-8 py-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 italic">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-white/[0.03] transition-colors group">
                  <td className="px-8 py-6 font-mono text-blue-500 text-xs">{order.id}</td>
                  <td className="px-8 py-6 font-bold text-white uppercase tracking-tight">{order.customer}</td>
                  <td className="px-8 py-6 text-slate-500 text-xs not-italic">{order.date}</td>
                  <td className="px-8 py-6 font-black text-white">{order.amount}</td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-3 bg-white/5 hover:bg-blue-600 hover:text-white rounded-xl transition-all text-slate-400">
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}