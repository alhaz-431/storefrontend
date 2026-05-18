"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Package, MapPin, Eye, XCircle, ChevronRight, Phone, Loader2 } from "lucide-react";
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
      // API রেসপন্স হ্যান্ডলিং ফিক্স
      setOrders(res.data || res || []);
    } catch (error: any) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    try {
      // ব্যাকএন্ড updateOrderStatus ফাংশন অনুযায়ী CANCELLED স্ট্যাটাস পুশ
      await api.orders.updateStatus(orderId, { status: "CANCELLED" }); 
      toast.success("Order cancelled successfully");
      fetchOrders();
    } catch (error) {
      toast.error("Could not cancel order");
    }
  };

  // লাইট মোডের জন্য স্ট্যাটাস কালার প্যালেট
  const statusStyle = (status: string) => {
    const formattedStatus = status?.toUpperCase();
    switch (formattedStatus) {
      case "PENDING":
      case "PLACED": 
        return "bg-blue-50 text-blue-600 border-blue-100";
      case "PROCESSING": 
        return "bg-amber-50 text-amber-600 border-amber-100";
      case "SHIPPED": 
        return "bg-purple-50 text-purple-600 border-purple-100";
      case "DELIVERED": 
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "CANCELLED": 
        return "bg-rose-50 text-rose-600 border-rose-100";
      default: 
        return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-800 font-black text-xs uppercase tracking-widest gap-2">
        <Loader2 className="animate-spin text-emerald-600" size={18} /> Loading <span className="text-emerald-600">Orders...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 sm:p-6 lg:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        
        <div className="mb-10">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tight"
          >
            My <span className="text-emerald-600">Orders</span>
          </motion.h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2">
            Track and manage your recent medicine purchases
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-[32px] p-16 md:p-24 text-center shadow-sm">
            <Package className="mx-auto mb-4 text-slate-300" size={56} />
            <p className="text-slate-400 uppercase font-black text-[10px] tracking-widest">No orders found yet</p>
            <Link href="/customer/shop" className="mt-6 inline-block bg-emerald-600 text-white px-8 py-3.5 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-emerald-700 transition-all shadow-md shadow-emerald-50">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white border border-slate-200 rounded-[24px] p-6 md:p-8 group relative overflow-hidden shadow-sm hover:shadow-md transition-all hover:border-slate-300"
              >
                {/* ব্যাকগ্রাউন্ড ওয়াটারমার্ক ইনডেক্স */}
                <div className="absolute -top-3 -left-1 text-slate-50 text-7xl font-black italic pointer-events-none select-none group-hover:text-slate-100/70 transition-colors">
                  {index + 1}
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6 relative z-10">
                  <div>
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className="text-[9px] font-black px-2 py-0.5 bg-slate-900 text-white uppercase rounded">Order #{index + 1}</span>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{formatDate(order.createdAt)}</span>
                    </div>
                    <h3 className="text-lg md:text-xl font-black text-slate-800 tracking-tight">Ref: {order.orderNumber}</h3>
                  </div>

                  <div className={`sm:self-center self-start px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider border shadow-sm ${statusStyle(order.status)}`}>
                    {order.status || "PENDING"}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-y border-slate-100 py-6 mb-6 relative z-10">
                  <div className="space-y-1.5">
                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Shipping & Contact</p>
                    <p className="text-xs font-bold text-slate-600 flex items-start gap-2 leading-relaxed">
                      <MapPin size={14} className="text-emerald-600 shrink-0 mt-0.5" /> {order.shippingAddress}
                    </p>
                    <p className="text-xs font-bold text-slate-500 flex items-center gap-2 pt-1">
                      <Phone size={12} className="text-slate-400" /> {order.shippingPhone || "No contact info"}
                    </p>
                  </div>
                  
                  <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Total Payable</p>
                    <p className="text-3xl font-black text-slate-900 tracking-tight">
                       ৳{order.totalAmount || 0}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Package Details</p>
                    <p className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                      <Package size={14} className="text-emerald-600" /> {order.items?.length || 0} Medicines
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 relative z-10">
                  <Link
                    href={`/customer/orders/${order.id}`}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-900 border border-slate-200 hover:border-slate-900 text-slate-700 hover:text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all group/btn shadow-sm"
                  >
                    <Eye size={14} /> View Details <ChevronRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
                  </Link>

                  {(order.status === "PENDING" || order.status === "PLACED") && (
                    <button
                      onClick={() => handleCancelOrder(order.id)}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-rose-50 hover:bg-rose-600 border border-rose-100 hover:border-rose-600 text-rose-600 hover:text-white px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
                    >
                      <XCircle size={14} /> Cancel Order
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