"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Package, Calendar, MapPin, Eye, XCircle, ChevronRight } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast";
import Link from "next/link";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  totalPrice: number;
  shippingAddress: string;
  createdAt: string;
  items: any[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.orders.getMyOrders();
      setOrders(res.data || res || []);
    } catch (error: any) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  // ✅ অর্ডার ক্যানসেল করার লজিক
  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    
    try {
      await api.orders.updateStatus(orderId, "CANCELLED"); 
      toast.success("Order cancelled successfully");
      fetchOrders(); // লিস্ট রিফ্রেশ করা
    } catch (error) {
      toast.error("Could not cancel order");
    }
  };

  const statusStyle = (status: string) => {
    switch (status) {
      case "PLACED": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "PROCESSING": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "SHIPPED": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "DELIVERED": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "CANCELLED": return "bg-red-500/10 text-red-400 border-red-500/20";
      default: return "bg-white/10 text-white/60 border-white/10";
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020d0a] flex items-center justify-center text-white italic font-black uppercase tracking-widest">
        Loading <span className="text-emerald-500 ml-2 animate-pulse">Orders...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020d0a] bg-[radial-gradient(circle_at_top_right,_#062d24,_#020d0a)] text-white p-6 lg:p-12">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter"
          >
            My <span className="text-emerald-500">Orders</span>
          </motion.h1>
          <p className="text-emerald-500/40 text-[10px] font-black uppercase tracking-[0.3em] mt-3">
            Track and manage your recent medicine purchases
          </p>
        </div>

        {/* EMPTY STATE */}
        {orders.length === 0 ? (
          <div className="bg-white/[0.02] border border-white/5 rounded-[40px] p-24 text-center">
            <Package className="mx-auto mb-6 text-emerald-500/20" size={60} />
            <p className="text-slate-500 uppercase font-black text-[10px] tracking-[0.4em]">No orders found yet</p>
            <Link href="/shop" className="mt-8 inline-block bg-emerald-600 px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest hover:bg-emerald-500 transition-all">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[35px] p-8 group relative overflow-hidden transition-all hover:border-emerald-500/30"
              >
                {/* সিরিয়াল নম্বর (বড় করে পেছনে দেখা যাবে) */}
                <div className="absolute -top-4 -left-2 text-white/[0.03] text-8xl font-black italic pointer-events-none">
                  {index + 1}
                </div>

                {/* TOP SECTION */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-8 relative z-10">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-[10px] font-black px-2 py-1 bg-emerald-500 text-black uppercase rounded">Order #{index + 1}</span>
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{formatDate(order.createdAt)}</span>
                    </div>
                    <h3 className="text-2xl font-black italic tracking-tight">Ref: {order.orderNumber}</h3>
                  </div>

                  <div className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border shadow-xl ${statusStyle(order.status)}`}>
                    {order.status}
                  </div>
                </div>

                {/* INFO GRID */}
                <div className="grid md:grid-cols-3 gap-8 border-y border-white/5 py-8 mb-8 relative z-10">
                  <div className="space-y-2">
                    <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Shipping To</p>
                    <p className="text-xs font-bold text-slate-300 flex items-start gap-2">
                      <MapPin size={14} className="text-emerald-500 shrink-0" /> {order.shippingAddress}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Bill Amount</p>
                    <p className="text-3xl font-black text-emerald-400 italic">৳{order.totalPrice}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Package Contents</p>
                    <p className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                      <Package size={14} className="text-emerald-500" /> {order.items?.length || 0} Medicines
                    </p>
                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex flex-wrap items-center gap-4 relative z-10">
                  <Link
                    href={`/customer/orders/${order.id}`}
                    className="flex-1 md:flex-none inline-flex items-center justify-center gap-3 bg-white/5 hover:bg-emerald-600 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all group/btn"
                  >
                    <Eye size={16} /> View Details <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                  </Link>

                  {/* ✅ ক্যানসেল বাটন লজিক: শুধুমাত্র PLACED হলে দেখাবে */}
                  {order.status === "PLACED" && (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      className="flex-1 md:flex-none inline-flex items-center justify-center gap-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                    >
                      <XCircle size={16} /> Cancel Order
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}