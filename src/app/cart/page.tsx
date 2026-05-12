"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package, Calendar, MapPin,
  ShoppingBag, ArrowLeft, CheckCircle2,
  Clock, Star, XCircle, Phone, User
} from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast";

export default function OrderDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const res = await api.orders.getOrderById(id as string);
      const data = res.data || res;

      // ✅ ডাটা নরমালাইজেশন (যাতে ডাটাবেসের সব ফরম্যাটেই কাজ করে)
      const normalizedItems = (data.items || []).map((item: any) => ({
        ...item,
        name: item.medicine?.name || item.name || "Unknown Medicine",
        id: item.id || item.medicineId || Math.random(),
        price: item.price || item.medicine?.price || 0
      }));

      setOrder({
        ...data,
        items: normalizedItems
      });

    } catch (err) {
      console.error("Fetch Error:", err);
      toast.error("অর্ডারের তথ্য পাওয়া যায়নি");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!confirm("আপনি কি নিশ্চিত যে অর্ডারটি বাতিল করতে চান?")) return;
    
    const toastId = toast.loading("বাতিল করা হচ্ছে...");
    try {
      await api.orders.updateStatus(order.id, "CANCELLED");
      toast.success("অর্ডারটি বাতিল করা হয়েছে", { id: toastId });
      fetchOrderDetails(); 
    } catch (error: any) {
      toast.error(error.response?.data?.message || "বাতিল করা সম্ভব হয়নি", { id: toastId });
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#061626] flex items-center justify-center">
      <div className="text-center">
         <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
         <p className="text-emerald-500 font-black italic tracking-widest animate-pulse">FETCHING ORDER INFO...</p>
      </div>
    </div>
  );

  if (!order) return (
    <div className="min-h-screen bg-[#061626] flex flex-col items-center justify-center text-center">
      <XCircle size={64} className="text-red-500 mb-4 opacity-20" />
      <h2 className="text-2xl font-black text-white italic uppercase">Order Not Found</h2>
      <button onClick={() => router.back()} className="mt-4 text-emerald-500 underline">ফিরে যান</button>
    </div>
  );

  const steps = ["PLACED", "PROCESSING", "SHIPPED", "DELIVERED"];
  const currentStep = steps.indexOf(order.status);

  return (
    <div className="min-h-screen bg-[#061626] bg-gradient-to-br from-[#061626] via-[#0a2e26] to-[#10b981]/20 text-white p-6 lg:p-12 selection:bg-emerald-500 selection:text-black relative overflow-hidden">
      
      {/* 🟢 BACKGROUND GLOW EFFECTS */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* HEADER */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-emerald-400/60 hover:text-emerald-400 mb-10 text-[10px] font-black uppercase tracking-[0.2em] transition-all"
        >
          <ArrowLeft size={16} /> Return to list
        </button>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
          <div>
            <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none mb-4">
              ORDER <span className="text-emerald-400">#{order.orderNumber || order.id.slice(-6)}</span>
            </h1>
            <div className="flex items-center gap-4 text-white/40 font-black uppercase text-[10px] tracking-widest">
              <span className="flex items-center gap-1"><Calendar size={12}/> {new Date(order.createdAt).toLocaleDateString()}</span>
              <span className="w-1 h-1 bg-white/20 rounded-full"></span>
              <span className="text-emerald-400 font-bold">{order.status}</span>
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 px-8 py-4 rounded-3xl shadow-2xl">
             <p className="text-[9px] font-black uppercase text-emerald-400/50 tracking-[0.3em] mb-1">Total Bill</p>
             <p className="text-4xl font-black italic text-white">৳{order.totalPrice}</p>
          </div>
        </div>

        {/* PROGRESS TRACKER */}
        <div className="mb-16 bg-white/5 border border-white/5 rounded-[40px] p-8 md:p-12 backdrop-blur-md">
          <div className="relative flex justify-between items-center max-w-4xl mx-auto">
            {/* Background Line */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[2px] bg-white/10" />
            
            {/* Active Line */}
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-[2px] bg-emerald-500 transition-all duration-1000 shadow-[0_0_15px_rgba(16,185,129,0.5)]" 
              style={{ width: `${(Math.max(0, currentStep) / (steps.length - 1)) * 100}%` }}
            />

            {steps.map((step, index) => (
              <div key={step} className="relative z-10 flex flex-col items-center">
                <div className={`h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-2xl ${
                  index <= currentStep ? "bg-emerald-500 text-black scale-110" : "bg-slate-800 text-white/20"
                }`}>
                  {index < currentStep ? <CheckCircle2 size={24} /> : <Clock size={24} />}
                </div>
                <p className={`text-[9px] font-black mt-4 uppercase tracking-widest ${index <= currentStep ? "text-emerald-400" : "text-white/20"}`}>
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          
          {/* ITEMS LIST */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/30 mb-6 flex items-center gap-2">
              <Package size={14}/> Items In This Order
            </h3>
            {order.items.map((item: any, idx: number) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group flex justify-between items-center p-6 bg-white/5 border border-white/5 rounded-[30px] hover:bg-white/10 transition-all"
              >
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                    <ShoppingBag size={24} />
                  </div>
                  <div>
                    <p className="font-black italic uppercase text-lg leading-none mb-1">{item.name}</p>
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest">Quantity: {item.quantity}</p>
                  </div>
                </div>
                <div className="text-right">
                   <p className="text-2xl font-black italic">৳{item.price * item.quantity}</p>
                   <p className="text-[9px] font-bold text-emerald-400/40 uppercase">৳{item.price} / unit</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* SIDEBAR INFO */}
          <div className="space-y-6">
            <div className="bg-white/5 border border-white/5 p-8 rounded-[40px] backdrop-blur-xl">
              <div className="flex items-center gap-3 text-emerald-400 mb-8 border-b border-white/5 pb-4">
                <MapPin size={20} />
                <h3 className="text-xs font-black uppercase tracking-widest">Shipping Details</h3>
              </div>
              
              <div className="space-y-6">
                <div>
                    <p className="text-[9px] font-black uppercase text-white/30 tracking-widest mb-2 flex items-center gap-2"><User size={12}/> Customer Name</p>
                    <p className="font-bold italic uppercase">{order.shippingName || "N/A"}</p>
                </div>
                <div>
                    <p className="text-[9px] font-black uppercase text-white/30 tracking-widest mb-2 flex items-center gap-2"><Phone size={12}/> Contact Number</p>
                    <p className="font-bold italic">{order.shippingPhone || "N/A"}</p>
                </div>
                <div>
                    <p className="text-[9px] font-black uppercase text-white/30 tracking-widest mb-2 flex items-center gap-2"><MapPin size={12}/> Address</p>
                    <p className="text-white/70 font-medium leading-relaxed">{order.shippingAddress}</p>
                </div>
              </div>
            </div>

            {/* ACTIONS */}
            <div className="space-y-3">
              {order.status === "DELIVERED" && (
                <button className="w-full bg-emerald-500 text-black py-6 rounded-3xl font-black uppercase italic text-xs tracking-widest hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20">
                  <Star size={16} /> Rate Order
                </button>
              )}

              {order.status === "PLACED" && (
                <button
                  onClick={handleCancelOrder}
                  className="w-full bg-red-500/10 border-2 border-red-500/20 text-red-500 py-6 rounded-3xl font-black uppercase italic text-xs tracking-widest hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2 group"
                >
                  <XCircle size={16} /> Cancel Order
                </button>
              )}
              
              <button 
                onClick={() => window.print()}
                className="w-full bg-white/5 text-white/40 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] hover:bg-white/10 transition-all"
              >
                Print Invoice
              </button>
            </div>
          </div>

        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(16, 185, 129, 0.2); border-radius: 10px; }
      `}</style>
    </div>
  );
}