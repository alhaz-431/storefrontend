"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Package, MapPin, Eye, XCircle, ChevronRight, Phone, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast";
import Link from "next/link";

interface Order {
  id: string;
  orderNumber?: string;
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
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.orders.getMyOrders();
      setOrders(Array.isArray(res) ? res : (res?.data || []));
    } catch (error) {
      toast.error("Failed to load orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    if (!confirm("Are you sure?")) return;
    setCancellingId(orderId);
    const toastId = toast.loading("Cancelling...");
    try {
      // এখানে সরাসরি স্ট্রিং পাঠানো হয়েছে (api.ts এর সাথে সামঞ্জস্যপূর্ণ)
      await api.orders.updateStatus(orderId, "CANCELLED");
      toast.success("Order cancelled", { id: toastId });
      await fetchOrders();
    } catch (error: any) {
      toast.error("Failed to cancel", { id: toastId });
    } finally {
      setCancellingId(null);
    }
  };

  const statusStyle = (status: string) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
      case "PLACED": return "bg-[#E6F4ED] text-[#008249] border-[#008249]/20";
      case "CANCELLED": return "bg-rose-50 text-rose-600 border-rose-100";
      default: return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  // ... (বাকি কোড আগের মতোই, শুধু কালার ক্লাসগুলোতে #008249 এবং #E6F4ED ব্যবহার করবেন)
  return (
    <div className="min-h-screen bg-slate-50 p-4 lg:p-12">
      {/* হেডিং */}
      <h1 className="text-4xl font-black text-slate-900">My <span className="text-[#008249]">Orders</span></h1>
      
      {/* বাটন (শপিং এর জন্য) */}
      <Link href="/shop" className="bg-[#008249] hover:bg-[#006633] text-white px-8 py-3 rounded-xl font-bold transition-all">
        Start Shopping
      </Link>
      
      {/* অর্ডার লিস্ট ম্যাপ করুন... */}
    </div>
  );
}