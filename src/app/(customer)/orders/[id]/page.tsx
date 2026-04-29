"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Package, MapPin, CreditCard, Hash } from "lucide-react";
import { api } from "@/lib/api";

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();

  // ✅ Safe params handling
  const id =
    typeof params?.id === "string"
      ? params.id
      : Array.isArray(params?.id)
      ? params.id[0]
      : "";

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);

        // ✅ CLEAN API CALL (no any)
        const response = await api.orders.getOrderById(id);

        // API safe handling
        setOrder(response?.data || response || null);
      } catch (error) {
        console.error("Failed to load order details", error);
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [id]);

  // ---------------- LOADING UI ----------------
  if (loading) {
    return (
      <div className="min-h-screen bg-[#02040a] flex items-center justify-center text-white font-black italic tracking-widest">
        LOADING ORDER INFO...
      </div>
    );
  }

  // ---------------- NOT FOUND UI ----------------
  if (!order) {
    return (
      <div className="min-h-screen bg-[#02040a] flex items-center justify-center text-white font-black italic uppercase text-center p-6">
        <div className="bg-white/5 p-10 rounded-[40px] border border-white/10">
          <p className="text-slate-500 mb-6">Order Not Found</p>
          <button
            onClick={() => router.back()}
            className="text-emerald-500 text-[10px] font-black tracking-widest border border-emerald-500/20 px-8 py-3 rounded-2xl hover:bg-emerald-500/10 transition-all"
          >
            GO BACK
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#02040a] text-white p-6 lg:p-20">
      <div className="max-w-4xl mx-auto">

        {/* BACK BUTTON */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-500 hover:text-emerald-500 transition-colors mb-10 font-bold uppercase text-[10px] tracking-widest group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Back to History
        </button>

        {/* HEADER */}
        <header className="flex flex-wrap justify-between items-end gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter">
              Order <span className="text-emerald-500">Invoice</span>
            </h1>

            <p className="text-[10px] text-slate-500 uppercase tracking-[0.4em] font-bold mt-2">
              Transaction ID: #{id ? id.slice(-8).toUpperCase() : "N/A"}
            </p>
          </div>

          <div
            className={`px-6 py-3 rounded-2xl border font-black uppercase text-[10px] tracking-widest ${
              order?.status === "DELIVERED"
                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500"
                : "bg-amber-500/10 border-amber-500/20 text-amber-500"
            }`}
          >
            Status: {order?.status || "PENDING"}
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* ITEMS */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-500 ml-4 mb-4">
              Purchased Items
            </h2>

            {order?.items?.map((item: any, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/[0.03] border border-white/10 p-6 rounded-[32px] flex justify-between items-center"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-emerald-500">
                    <Package size={20} />
                  </div>

                  <div>
                    <h4 className="font-bold">{item?.name || "Medicine"}</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">
                      Qty: {item?.quantity || 0}
                    </p>
                  </div>
                </div>

                <p className="font-mono font-black text-emerald-500">
                  ৳{(item?.price || 0) * (item?.quantity || 0)}
                </p>
              </motion.div>
            ))}
          </div>

          {/* SUMMARY */}
          <div className="lg:col-span-1 space-y-6">

            <div className="bg-white/[0.02] border border-white/10 p-8 rounded-[40px]">

              {/* ADDRESS */}
              <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                <MapPin size={14} className="text-emerald-500" />
                Delivery Address
              </h3>

              <p className="text-sm text-slate-400 leading-relaxed italic">
                {order?.shippingAddress || order?.address || "No address provided"}
              </p>

              <div className="h-px bg-white/10 my-8" />

              {/* PAYMENT */}
              <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                <CreditCard size={14} className="text-emerald-500" />
                Payment Info
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between text-[10px] uppercase font-bold text-slate-500">
                  <span>Subtotal</span>
                  <span>৳{(order?.totalAmount || 0) - 60}</span>
                </div>

                <div className="flex justify-between text-[10px] uppercase font-bold text-slate-500">
                  <span>Shipping</span>
                  <span>৳60</span>
                </div>

                <div className="flex justify-between text-lg font-black uppercase italic pt-2 text-white border-t border-white/5">
                  <span>Total</span>
                  <span className="text-emerald-500">
                    ৳{order?.totalAmount || 0}
                  </span>
                </div>
              </div>
            </div>

            {/* PAYMENT METHOD */}
            <div className="bg-emerald-600/10 border border-emerald-500/20 p-6 rounded-[32px] flex items-center gap-4">
              <Hash className="text-emerald-500" size={24} />

              <div>
                <p className="text-[8px] text-emerald-500 font-black uppercase tracking-widest">
                  Payment Method
                </p>
                <p className="text-xs font-bold uppercase">
                  Cash on Delivery
                </p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}