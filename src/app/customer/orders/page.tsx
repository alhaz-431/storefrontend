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
      // ✅ CUSTOMER SAFE USER FETCH
      const user = JSON.parse(localStorage.getItem("medistore_user") || "{}");

      if (!user?.id) {
        toast.error("Please login first");
        setLoading(false);
        return;
      }

      // ✅ ONLY USER ORDERS (NOT ADMIN)
      const res = await api.orders.getUserOrders(user.id);

      setOrders(res.data || []);
    } catch (error: any) {
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
      <div className="min-h-screen bg-[#02040a] flex items-center justify-center text-white">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#02040a] text-white p-6 lg:p-10">

      {/* HEADER */}
      <h1 className="text-3xl font-black mb-8">
        My <span className="text-emerald-500">Orders</span>
      </h1>

      {/* EMPTY STATE */}
      {orders.length === 0 ? (
        <div className="text-center py-20 text-slate-400">
          No orders found
        </div>
      ) : (
        <div className="space-y-5">

          {orders.map((order, index) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-emerald-500/30 transition"
            >

              {/* TOP */}
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-4">

                <div>
                  <p className="font-bold text-white">
                    Order #{order.orderNumber}
                  </p>

                  <p className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar size={14} />
                    {formatDate(order.createdAt)}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold border ${statusStyle(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>

              </div>

              {/* INFO GRID */}
              <div className="grid md:grid-cols-3 gap-4 text-sm mb-4">

                <div>
                  <p className="text-slate-400 text-xs">Address</p>
                  <p>{order.shippingAddress}</p>
                </div>

                <div>
                  <p className="text-slate-400 text-xs">Total</p>
                  <p className="text-emerald-400 font-bold">
                    ৳{order.totalPrice}
                  </p>
                </div>

                <div>
                  <p className="text-slate-400 text-xs">Items</p>
                  <p>{order.items?.length || 0}</p>
                </div>

              </div>

              {/* VIEW DETAILS */}
              <Link
                href={`/customer/orders/${order.id}`}
                className="inline-flex items-center gap-2 text-emerald-400 text-sm hover:underline"
              >
                <Eye size={14} />
                View Details
              </Link>

            </motion.div>
          ))}

        </div>
      )}

    </div>
  );
}