"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Package, MapPin, CreditCard, Hash } from "lucide-react";
import { api } from "@/lib/api";

export default function OrderDetailsPage() {
  const params = useParams();
  // ✅ টাইপ সেফটি নিশ্চিত করা
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : "";
  
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!id) return;

      // 🛡️ ভার্সেল বিল্ড সেফটি এবং ইউজার আইডি চেক
      if (typeof window === "undefined") return;
      
      const userData = localStorage.getItem("medistore_user");
      const user = userData ? JSON.parse(userData) : null;

      if (!user?.id) {
        console.error("User ID not found");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // ✅ FIXED: api.ts এর রিকোয়ারমেন্ট অনুযায়ী user.id পাঠানো হলো
        const response = await api.orders.getUserOrders(user.id); 
        
        // ডাটা স্ট্রাকচার চেক করা (response.data অথবা সরাসরি response)
        const allOrders = response.data || response;
        
        if (Array.isArray(allOrders)) {
          const foundOrder = allOrders.find((o: any) => o.id === id);
          setOrder(foundOrder);
        }
      } catch (error) {
        console.error("Failed to load order details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrderDetails();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-[#02040a] flex items-center justify-center text-white font-black italic tracking-widest">
      LOADING ORDER INFO...
    </div>
  );

  if (!order) return (
    <div className="min-h-screen bg-[#02040a] flex items-center justify-center text-white font-black italic uppercase text-center p-6">
      <div>
        <p className="text-slate-500 mb-4">Order Not Found</p>
        <button onClick={() => router.back()} className="text-emerald-500 text-xs border border-emerald-500/20 px-4 py-2 rounded-xl">GO BACK</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#02040a] text-white p-6 lg:p-20">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-slate-500 hover:text-emerald-500 transition-colors mb-10 font-bold uppercase text-[10px] tracking-widest"
        >
          <ArrowLeft size={16} /> Back to History
        </button>

        <header className="flex flex-wrap justify-between items-end gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter">
              Order <span className="text-emerald-500">Invoice</span>
            </h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.4em] font-bold mt-2">
              Transaction ID: #{id.slice(-8).toUpperCase()}
            </p>
          </div>
          <div className={`px-6 py-3 rounded-2xl border font-black uppercase text-[10px] tracking-widest ${
            order.status === 'DELIVERED' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-amber-500/10 border-amber-500/20 text-amber-500'
          }`}>
            Status: {order.status || "PENDING"}
          </div>
        </header>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items List */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-sm font-black uppercase tracking-widest text-slate-500 ml-4 mb-4">Purchased Items</h2>
            {order.items?.map((item: any, index: number) => (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                key={index} 
                className="bg-white/[0.03] border border-white/10 p-6 rounded-[32px] flex justify-between items-center"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-emerald-500">
                    <Package size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold">{item.name || "Medicine Item"}</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-mono font-black text-emerald-500">৳{item.price * item.quantity}</p>
              </motion.div>
            ))}
          </div>

          {/* Shipping & Payment Summary */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white/[0.02] border border-white/10 p-8 rounded-[40px]">
              <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                <MapPin size={14} className="text-emerald-500" /> Delivery Address
              </h3>
              <p className="text-sm text-slate-400 leading-relaxed italic">
                {order.shippingAddress || order.address || "No address provided"}
              </p>

              <div className="h-px bg-white/10 my-8" />

              <h3 className="text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                <CreditCard size={14} className="text-emerald-500" /> Payment Info
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] uppercase font-bold text-slate-500 tracking-tighter">
                  <span>Subtotal</span>
                  <span>৳{(order.totalAmount || 0) - 60}</span>
                </div>
                <div className="flex justify-between text-[10px] uppercase font-bold text-slate-500 tracking-tighter">
                  <span>Shipping</span>
                  <span>৳60</span>
                </div>
                <div className="flex justify-between text-lg font-black uppercase italic pt-2 text-white border-t border-white/5">
                  <span>Total</span>
                  <span className="text-emerald-500">৳{order.totalAmount}</span>
                </div>
              </div>
            </div>

            <div className="bg-emerald-600/10 border border-emerald-500/20 p-6 rounded-[32px] flex items-center gap-4">
              <Hash className="text-emerald-500" size={24} />
              <div>
                <p className="text-[8px] text-emerald-500 font-black uppercase tracking-widest">Payment Method</p>
                <p className="text-xs font-bold uppercase">Cash on Delivery</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}