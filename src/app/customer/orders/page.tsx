"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import { ShoppingBag, Loader2, Calendar, AlertCircle } from "lucide-react";
import Link from "next/link";

interface OrderItem {
  id: string;
  medicineId: string;
  quantity: number;
  price: number;
  medicine?: {
    name: string;
  };
}

interface Order {
  id: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  items?: OrderItem[];
}

export default function CustomerOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.orders.getMyOrders();
      const fetchedOrders = response?.data || response || [];
      
      if (Array.isArray(fetchedOrders)) {
        setOrders(fetchedOrders);
      } else {
        setOrders([]);
      }
    } catch (error: any) {
      // 🎯 ব্যাকএন্ড অর্ডার না পেয়ে মেসেজ দিলে টার্মিনাল নোংরা না করে ডিরেক্ট খালি স্টেট সেট করবে
      if (error?.message?.includes("পাওয়া যায়নি") || error?.message?.includes("failed")) {
        setOrders([]);
        setLoading(false);
        return;
      }
      
      // অন্য কোনো জেনুইন নেটওয়ার্ক এরর হলে ব্যাকআপ ট্রাই করবে
      try {
        const token = localStorage.getItem("token")?.replace(/['"]+/g, '');
        const res = await fetch("https://storemedistore.onrender.com/api/orders/my-orders", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(data?.data || data || []);
        } else {
          setOrders([]);
        }
      } catch (innerErr) {
        setOrders([]);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "DELIVERED":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "PENDING":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      default:
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-[#006643] mb-4" size={36} />
        <p className="text-[10px] font-black uppercase tracking-widest text-[#006643]/60 animate-pulse">
          Loading Your Orders...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020d0a] bg-[radial-gradient(circle_at_top_right,_#006643,_#020d0a)] p-4 md:p-8 max-w-full font-sans text-slate-200">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter leading-none text-slate-100">
              My <span className="text-[#006643]">Orders</span>
            </h1>
            <p className="text-[10px] font-bold text-emerald-500/40 uppercase tracking-[0.3em] mt-2">
              Track and manage your purchase history
            </p>
          </div>
          
          <Link 
            href="/shop" 
            className="bg-[#006643] hover:bg-[#004d32] text-white px-5 py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#006643]/20 flex items-center gap-2"
          >
            <ShoppingBag size={14} /> Start Shopping
          </Link>
        </div>

        {orders.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/[0.02] border border-white/5 rounded-3xl p-12 text-center max-w-md mx-auto mt-12 backdrop-blur-md"
          >
            <AlertCircle className="mx-auto text-slate-500 mb-4" size={44} />
            <h3 className="text-lg font-bold text-slate-300 uppercase tracking-tight">No Orders Found</h3>
            <p className="text-xs text-slate-500 mt-2 mb-6">You haven't placed any medicine orders yet.</p>
            <Link 
              href="/shop" 
              className="inline-block bg-[#006643] hover:bg-[#004d32] text-white px-6 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wide transition-all"
            >
              Browse Medicines
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, idx) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white/[0.02] hover:bg-white/[0.04] border border-white/5 rounded-2xl p-5 md:p-6 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 backdrop-blur-sm"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                      Order #{order.id.slice(-8).toUpperCase()}
                    </span>
                    <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md border ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Calendar size={14} />
                    <span>{new Date(order.createdAt).toLocaleDateString("bn-BD")}</span>
                  </div>

                  {order.items && order.items.length > 0 && (
                    <p className="text-xs text-[#006643] font-bold mt-1">
                      {order.items.map(item => item.medicine?.name || `Medicine (x${item.quantity})`).join(", ")}
                    </p>
                  )}
                </div>

                <div className="flex md:flex-col justify-between items-end w-full md:w-auto pt-4 md:pt-0 border-t border-white/5 md:border-none">
                  <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest md:mb-1">Total Payable</span>
                  <span className="text-xl font-black italic text-slate-100">
                    ৳{order.totalAmount.toLocaleString()}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}