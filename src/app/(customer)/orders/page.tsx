"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Package, Clock, CheckCircle2, ChevronRight } from "lucide-react";
import { api } from "@/lib/api";
import Link from "next/link";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // ১. LocalStorage থেকে ইউজার ডাটা নেওয়া
        const userData = localStorage.getItem("user"); 
        
        if (!userData) {
          console.error("User not logged in");
          setLoading(false);
          return;
        }

        const user = JSON.parse(userData);
        const userId = user.id; // নিশ্চিত করুন যে আপনার ইউজার অবজেক্টে 'id' প্রপার্টি আছে

        // ২. ID সহ API কল করা (এই আর্গুমেন্টটাই মিসিং ছিল)
        const response = await api.orders.getUserOrders(userId);
        
        setOrders(response.data || []);
      } catch (error) {
        console.error("Order fetch failed", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, []);

  if (loading) return <div className="min-h-screen bg-[#02040a] flex items-center justify-center text-white italic uppercase font-black tracking-widest">Loading Records...</div>;

  return (
    <div className="min-h-screen bg-[#02040a] text-white p-6 lg:p-20">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">
            Order <span className="text-emerald-500">History</span>
          </h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-[0.4em] font-bold mt-2">Track your medicine deliveries</p>
        </header>

        {orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={order.id}
                className="bg-white/[0.02] border border-white/10 p-6 rounded-[32px] hover:border-emerald-500/30 transition-all group"
              >
                <div className="flex flex-wrap justify-between items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors">
                      <Package size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm tracking-tight">Order #{order.id.slice(-6).toUpperCase()}</h3>
                      <p className="text-[10px] text-slate-500 font-bold uppercase">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-[9px] text-slate-500 uppercase font-black mb-1 tracking-widest">Amount</p>
                      <p className="font-mono font-black text-emerald-500">৳{order.totalAmount}</p>
                    </div>

                    <div className={`px-4 py-2 rounded-full flex items-center gap-2 border ${
                      order.status === 'DELIVERED' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                    }`}>
                      {order.status === 'DELIVERED' ? <CheckCircle2 size={12}/> : <Clock size={12}/>}
                      <span className="text-[9px] font-black uppercase tracking-widest">{order.status}</span>
                    </div>

                    <Link href={`/orders/${order.id}`}>
                      <button className="p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-all">
                        <ChevronRight size={18} />
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-[40px]">
             <p className="text-slate-600 font-bold uppercase text-xs tracking-widest">No orders found yet</p>
          </div>
        )}
      </div>
    </div>
  );
}