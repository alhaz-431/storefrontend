"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Package, Calendar, MapPin, DollarSign, Eye } from "lucide-react";
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
      // ✅ ফিক্সড: টাইপ এরর দূর করতে 'getUserOrders' এর বদলে 'getMyOrders' ব্যবহার করা হয়েছে
      const res = await api.orders.getMyOrders();

      // API রেসপন্স ফরম্যাট অনুযায়ী ডাটা সেট করা
      setOrders(res.data || res || []);
    } catch (error: any) {
      console.error("Order fetching error:", error);
      toast.error(error?.response?.data?.error || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const statusStyle = (status: string) => {
    switch (status) {
      case "PLACED":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "PROCESSING":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "SHIPPED":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "DELIVERED":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "CANCELLED":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      default:
        return "bg-white/10 text-white/60 border-white/10";
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#02040a] flex items-center justify-center text-white italic font-black uppercase tracking-widest">
        Loading <span className="text-emerald-500 ml-2 text-xl">Orders...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#02040a] text-white p-6 lg:p-10">
      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-white">
          My <span className="text-emerald-500">Orders</span>
        </h1>
        <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2">
          Track and manage your recent purchases
        </p>
      </div>

      {/* EMPTY STATE */}
      {orders.length === 0 ? (
        <div className="bg-white/[0.02] border border-white/5 rounded-[40px] p-20 text-center text-slate-500 uppercase font-black text-[10px] tracking-[0.3em]">
          No orders found yet
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white/[0.02] border border-white/5 rounded-[32px] p-6 hover:border-emerald-500/30 transition-all group"
            >
              {/* TOP SECTION */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
                <div>
                  <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1">
                    Order Reference
                  </p>
                  <p className="font-black text-lg text-white italic tracking-tight">
                    #{order.orderNumber}
                  </p>
                  <div className="flex items-center gap-2 text-slate-400 mt-2">
                    <Calendar size={14} className="text-emerald-500" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">
                      {formatDate(order.createdAt)}
                    </span>
                  </div>
                </div>

                <div
                  className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.15em] border ${statusStyle(
                    order.status
                  )}`}
                >
                  {order.status}
                </div>
              </div>

              {/* DETAILS GRID */}
              <div className="grid md:grid-cols-3 gap-6 border-t border-white/5 pt-6 mb-6">
                <div className="space-y-1">
                  <p className="text-[8px] font-black uppercase text-slate-500 tracking-widest">
                    Shipping Address
                  </p>
                  <p className="text-xs font-bold text-slate-300 leading-relaxed">
                    <MapPin size={12} className="inline mr-1 text-emerald-500" />
                    {order.shippingAddress}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-[8px] font-black uppercase text-slate-500 tracking-widest">
                    Total Amount
                  </p>
                  <p className="text-xl font-black text-emerald-500 italic">
                    ৳{order.totalPrice}
                  </p>
                </div>

                <div className="space-y-1">
                  <p className="text-[8px] font-black uppercase text-slate-500 tracking-widest">
                    Items Purchased
                  </p>
                  <p className="text-xs font-bold text-white uppercase tracking-widest">
                    {order.items?.length || 0} Products
                  </p>
                </div>
              </div>

              {/* FOOTER ACTION */}
              <Link
                href={`/customer/orders/${order.id}`}
                className="inline-flex items-center gap-3 bg-white/5 hover:bg-emerald-600 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all group-hover:shadow-lg group-hover:shadow-emerald-900/20"
              >
                <Eye size={16} />
                View Details
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}