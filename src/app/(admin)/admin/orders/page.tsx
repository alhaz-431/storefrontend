"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Search, X, CheckCircle2, Clock, Truck } from "lucide-react";

export default function AdminOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null); // মোডালের জন্য

  const orders = [
    { id: "ORD-7721", customer: "ALFAZ ARBBY", date: "24 April 2026", amount: "$45.00", status: "DELIVERED", email: "alfaz@example.com", items: "Napa Extra x5, Sergel x2" },
    { id: "ORD-8842", customer: "RAHIM AHMED", date: "25 April 2026", amount: "$120.00", status: "PROCESSING", email: "rahim@example.com", items: "Ace Plus x10" },
    { id: "ORD-9910", customer: "KARIM KHAN", date: "26 April 2026", amount: "$15.50", status: "PENDING", email: "karim@example.com", items: "Fexo 120mg x3" },
  ];

  // ১. সার্চ লজিক
  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "DELIVERED": return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      case "PROCESSING": return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      case "PENDING": return "text-orange-500 bg-orange-500/10 border-orange-500/20";
      default: return "text-slate-500 bg-slate-500/10 border-slate-500/20";
    }
  };

  return (
    <div className="p-6 lg:p-10 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white">Order <span className="text-blue-600">History</span></h1>
        </div>

        {/* ২. সার্চ ইনপুট এখন কাজ করবে */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search by ID or Name..."
            className="bg-white/5 border border-white/10 pl-12 pr-6 py-3 rounded-2xl text-sm outline-none focus:border-blue-600 text-white w-full md:w-80"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white/[0.02] border border-white/10 rounded-[32px] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            <tr>
              <th className="px-8 py-6">Order ID</th>
              <th className="px-8 py-6">Customer</th>
              <th className="px-8 py-6">Status</th>
              <th className="px-8 py-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 italic">
            {filteredOrders.map((order) => (
              <tr key={order.id} className="hover:bg-white/[0.03] transition-colors">
                <td className="px-8 py-6 font-mono text-blue-500 text-xs">{order.id}</td>
                <td className="px-8 py-6 font-bold text-white uppercase">{order.customer}</td>
                <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${getStatusStyle(order.status)}`}>
                        {order.status}
                    </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <button 
                    onClick={() => setSelectedOrder(order)} // ৩. এখানে ক্লিক করলে মোডাল ওপেন হবে
                    className="p-3 bg-blue-600/10 text-blue-500 hover:bg-blue-600 hover:text-white rounded-xl transition-all"
                  >
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- ৪. ORDER DETAILS MODAL --- */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-[#0a0c14] border border-white/10 p-8 rounded-[40px] w-full max-w-lg relative z-10 shadow-2xl"
            >
              <button onClick={() => setSelectedOrder(null)} className="absolute top-6 right-6 text-slate-500 hover:text-white"><X size={24}/></button>
              
              <h2 className="text-2xl font-black italic uppercase text-blue-600 mb-2">{selectedOrder.id}</h2>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-8 border-b border-white/5 pb-4">Order Details Information</p>
              
              <div className="space-y-6">
                <div>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Customer Info</p>
                  <p className="text-white font-bold italic">{selectedOrder.customer}</p>
                  <p className="text-slate-400 text-xs">{selectedOrder.email}</p>
                </div>
                <div>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Purchased Items</p>
                  <p className="text-white font-medium text-sm bg-white/5 p-4 rounded-2xl italic border border-white/5">{selectedOrder.items}</p>
                </div>
                <div className="flex justify-between items-center bg-blue-600/5 p-6 rounded-3xl border border-blue-600/10">
                   <div>
                      <p className="text-blue-500 text-[10px] font-black uppercase tracking-widest mb-1">Total Paid</p>
                      <p className="text-2xl font-black text-white">{selectedOrder.amount}</p>
                   </div>
                   <span className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase border ${getStatusStyle(selectedOrder.status)}`}>
                      {selectedOrder.status}
                   </span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}