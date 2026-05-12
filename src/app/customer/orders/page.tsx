"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Package, MapPin, Eye, XCircle, ChevronRight, Phone, ShoppingBag } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast";
import Link from "next/link";

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number; 
  shippingAddress: string;
  shippingPhone: string;
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
      // ডাটা হ্যান্ডলিং যাতে এরে না আসলেও ক্রাশ না করে
      const data = res?.data?.data || res?.data || res;
      setOrders(Array.isArray(data) ? data : []);
    } catch (error: any) {
      toast.error("অর্ডার লিস্ট লোড করা সম্ভব হয়নি");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("আপনি কি নিশ্চিত যে অর্ডারটি বাতিল করতে চান?")) return;
    try {
      await api.orders.updateStatus(orderId, "CANCELLED"); 
      toast.success("অর্ডারটি বাতিল করা হয়েছে");
      fetchOrders();
    } catch (error) {
      toast.error("অর্ডার বাতিল করা সম্ভব হয়নি");
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

  if (loading) {
    return (
      <div className="min-h-screen bg-[#051a14] flex items-center justify-center">
        <div className="text-center">
           <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
           <p className="text-emerald-500 font-black italic tracking-widest animate-pulse uppercase text-xs">Fetching Orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#051a14] bg-gradient-to-br from-[#051a14] via-[#0a2e26] to-[#10b981]/10 text-white p-6 lg:p-12 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-16">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none"
          >
            MY <span className="text-emerald-500">ORDERS</span>
          </motion.h1>
          <p className="text-emerald-500/30 text-[10px] font-black uppercase tracking-[0.4em] mt-4">
            Track your medical supplies and history
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white/5 border border-white/5 rounded-[50px] p-24 text-center backdrop-blur-xl">
            <ShoppingBag className="mx-auto mb-6 text-emerald-500/10" size={100} />
            <p className="text-white/20 uppercase font-black text-xs tracking-[0.4em] mb-10">You haven't placed any orders yet</p>
            <Link href="/customer" className="bg-emerald-500 text-black px-12 py-5 rounded-2xl text-xs font-black uppercase italic tracking-widest hover:scale-105 transition-all inline-block shadow-2xl shadow-emerald-500/20">
              Start Exploring
            </Link>
          </div>
        ) : (
          <div className="grid gap-8">
            <AnimatePresence>
              {orders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white/5 backdrop-blur-xl border border-white/5 rounded-[40px] p-8 md:p-10 group relative overflow-hidden transition-all hover:bg-white/[0.08] hover:border-emerald-500/20"
                >
                  {/* Order Header */}
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10 pb-8 border-b border-white/5">
                    <div>
                      <div className="flex items-center gap-4 mb-3">
                        <span className="text-[10px] font-black px-4 py-1.5 bg-emerald-500 text-black uppercase rounded-full shadow-lg shadow-emerald-500/20">
                          #{index + 1}
                        </span>
                        <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">
                          {new Date(order.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      <h3 className="text-3xl font-black italic tracking-tighter uppercase leading-none">
                        Ref: <span className="text-white/80">{order.orderNumber}</span>
                      </h3>
                    </div>

                    <div className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border shadow-xl ${statusStyle(order.status)}`}>
                      {order.status}
                    </div>
                  </div>

                  {/* Order Body */}
                  <div className="grid md:grid-cols-3 gap-10 mb-10">
                    <div className="space-y-4">
                      <p className="text-[10px] font-black uppercase text-white/20 tracking-widest flex items-center gap-2">
                         <MapPin size={14} className="text-emerald-500" /> Delivery To
                      </p>
                      <p className="text-sm font-bold text-white/70 leading-relaxed italic uppercase">
                         {order.shippingAddress}
                      </p>
                      <div className="flex items-center gap-2 text-emerald-500/60 font-black text-[11px]">
                        <Phone size={14} /> {order.shippingPhone || "No Phone Provided"}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="text-[10px] font-black uppercase text-white/20 tracking-widest">Total Payable</p>
                      <p className="text-5xl font-black text-white italic tracking-tighter">
                          ৳{order.totalAmount || 0}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <p className="text-[10px] font-black uppercase text-white/20 tracking-widest flex items-center gap-2">
                         <Package size={14} className="text-emerald-500" /> Package
                      </p>
                      <p className="text-xs font-black text-white/80 uppercase tracking-widest">
                         {order.items?.length || 0} Items in Order
                      </p>
                    </div>
                  </div>

                  {/* Order Footer / Actions */}
                  <div className="flex flex-wrap items-center gap-4">
                    <Link
                      href={`/customer/orders/${order.id}`}
                      className="flex-1 md:flex-none inline-flex items-center justify-center gap-4 bg-white/5 hover:bg-white/10 border border-white/10 px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all group/btn shadow-xl shadow-black/20"
                    >
                      <Eye size={18} /> View Details <ChevronRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>

                    {order.status === "PLACED" && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="flex-1 md:flex-none inline-flex items-center justify-center gap-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-red-500/20 shadow-xl shadow-red-500/5"
                      >
                        <XCircle size={18} /> Cancel Order
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}