"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Package, Calendar, MapPin, 
  ArrowLeft, CheckCircle2, 
  Clock, Star, Phone, Hash, CreditCard
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

      const normalizedItems = (data.items || []).map((item: any) => ({
        ...item,
        name: item.medicine?.name || item.name || "Unknown Medicine",
        id: item.id || item.medicineId || Math.random()
      }));

      setOrder({
        ...data,
        items: normalizedItems
      });
    } catch (err) {
      toast.error("অর্ডারের তথ্য পাওয়া যায়নি");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#020d0a] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
        <p className="text-emerald-500 font-black italic tracking-[0.2em] animate-pulse uppercase text-xs">Loading Details</p>
      </div>
    </div>
  );

  if (!order) return <div className="min-h-screen bg-[#020d0a] flex items-center justify-center text-white font-black italic">অর্ডার খুঁজে পাওয়া যায়নি।</div>;

  const steps = ["PLACED", "PROCESSING", "SHIPPED", "DELIVERED"];
  const currentStep = steps.indexOf(order.status);

  return (
    <div className="min-h-screen bg-[#020d0a] bg-[radial-gradient(circle_at_top_right,_#062d24,_#020d0a)] text-white p-6 lg:p-12">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <button 
              onClick={() => router.back()}
              className="flex items-center gap-2 text-emerald-500/60 hover:text-emerald-400 mb-6 text-[10px] font-black uppercase tracking-widest transition-all"
            >
              <ArrowLeft size={14} /> Go Back
            </button>
            <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none">
              Order <span className="text-emerald-500">Summary</span>
            </h1>
            <p className="text-emerald-500/40 text-[10px] font-black uppercase tracking-[0.4em] mt-4">
              Reference: {order.orderNumber}
            </p>
          </div>
          
          <div className="px-8 py-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl backdrop-blur-xl">
             <p className="text-[9px] font-black uppercase text-emerald-500/60 tracking-widest mb-1">Status</p>
             <p className="text-xl font-black italic text-emerald-500 uppercase">{order.status}</p>
          </div>
        </div>

        {/* TRACKER SECTION */}
        <div className="bg-white/[0.02] border border-white/5 rounded-[40px] p-8 md:p-12 mb-10 relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-1 bg-white/5"></div>
           <div 
             className="absolute top-0 left-0 h-1 bg-emerald-500 transition-all duration-1000 shadow-[0_0_20px_#10b981]" 
             style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
           ></div>
           
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {steps.map((step, index) => (
                <div key={step} className={`relative flex flex-col items-center ${index <= currentStep ? "opacity-100" : "opacity-30"}`}>
                   <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${index <= currentStep ? "bg-emerald-500 text-black shadow-[0_0_30px_rgba(16,185,129,0.4)]" : "bg-white/5 text-white/40"}`}>
                      {index <= currentStep ? <CheckCircle2 size={20} /> : <Clock size={20} />}
                   </div>
                   <p className="text-[10px] font-black mt-4 uppercase tracking-widest">{step}</p>
                </div>
              ))}
           </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          
          {/* ITEMS LIST */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 mb-6">Ordered Medicines</h3>
            {order.items.map((item: any, idx: number) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={item.id} 
                className="group flex items-center justify-between p-6 bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 rounded-[30px] transition-all"
              >
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
                    <Package size={24} />
                  </div>
                  <div>
                    <p className="text-lg font-black italic uppercase text-slate-100">{item.name}</p>
                    <p className="text-[10px] font-bold text-emerald-500/60 uppercase tracking-widest">Quantity: {item.quantity}</p>
                  </div>
                </div>
                <div className="text-right">
                   <p className="text-xl font-black italic">৳{item.price * item.quantity}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* SIDEBAR - TOTAL & INFO */}
          <div className="space-y-6">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-500 mb-6">Payment & Shipping</h3>
            
            <div className="bg-emerald-500 p-10 rounded-[40px] text-black shadow-[0_20px_50px_rgba(16,185,129,0.2)] relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform">
                 <CreditCard size={120} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-60">Total Bill Amount</p>
              {/* ✅ FIXED: order.totalAmount used here */}
              <h2 className="text-6xl font-black italic tracking-tighter">৳{order.totalAmount || 0}</h2>
              <div className="mt-6 pt-6 border-t border-black/10 flex justify-between items-center">
                 <span className="text-[9px] font-black uppercase tracking-widest">Status: Paid via COD</span>
                 <CheckCircle2 size={20} />
              </div>
            </div>

            <div className="bg-white/[0.03] border border-white/5 p-8 rounded-[40px] space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-emerald-500"><MapPin size={18}/></div>
                <div>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Delivery Address</p>
                  <p className="text-sm font-bold text-slate-200 mt-1">{order.shippingAddress}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-emerald-500"><Phone size={18}/></div>
                <div>
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Contact Phone</p>
                  <p className="text-sm font-bold text-slate-200 mt-1">{order.shippingPhone || "N/A"}</p>
                </div>
              </div>
            </div>

            {order.status === "DELIVERED" && (
              <button className="w-full bg-white text-black font-black uppercase italic py-5 rounded-[25px] flex items-center justify-center gap-3 hover:bg-emerald-500 transition-colors">
                <Star size={18} fill="currentColor" /> Write a Review
              </button>
            )}

            {order.status === "PLACED" && (
              <button 
                className="w-full bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white font-black uppercase italic py-5 rounded-[25px] transition-all border border-red-500/20"
                onClick={() => {
                  if(confirm("Are you sure you want to cancel this order?")) {
                    api.orders.updateStatus(order.id, "CANCELLED")
                      .then(() => {
                        toast.success("Order Cancelled");
                        fetchOrderDetails();
                      });
                  }
                }}
              >
                Cancel Order
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}