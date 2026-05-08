"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Package, Calendar, MapPin, 
  ShoppingBag, ArrowLeft, CheckCircle2, 
  Clock, Truck, Star 
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
      setOrder(res.data || res);
    } catch (err) {
      toast.error("অর্ডারের তথ্য পাওয়া যায়নি");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#020d0a] flex items-center justify-center text-emerald-500 font-black italic tracking-widest animate-pulse">
      FETCHING DETAILS...
    </div>
  );

  if (!order) return <div className="p-10 text-white text-center">অর্ডার খুঁজে পাওয়া যায়নি।</div>;

  // ✅ প্রোগ্রেস বার লজিক
  const steps = ["PLACED", "PROCESSING", "SHIPPED", "DELIVERED"];
  const currentStep = steps.indexOf(order.status);

  return (
    <div className="min-h-screen bg-[#020d0a] bg-[radial-gradient(circle_at_top_right,_#062d24,_#020d0a)] text-white p-6 lg:p-12">
      <div className="max-w-5xl mx-auto">
        
        {/* Back Button & Header */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-emerald-500/60 hover:text-emerald-400 mb-8 transition-all text-xs font-black uppercase tracking-widest"
        >
          <ArrowLeft size={16} /> Back to Orders
        </button>

        <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter mb-2">
              Order <span className="text-emerald-500">#{order.orderNumber}</span>
            </h1>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
              <Calendar size={12} className="text-emerald-500" /> Placed on {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          
          {/* ✅ রিভিউ বাটন (শুধুমাত্র ডেলিভারড হলে আসবে) */}
          {order.status === "DELIVERED" && (
            <button className="bg-emerald-500 text-black px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 shadow-xl shadow-emerald-500/20 hover:scale-105 transition-transform">
              <Star size={14} fill="currentColor" /> Write a Review
            </button>
          )}
        </div>

        {/* ✅ ১. ভিজ্যুয়াল ট্র্যাকার (Timeline UI) */}
        <div className="bg-white/[0.03] border border-white/10 rounded-[40px] p-10 mb-10 relative overflow-hidden">
          <div className="flex justify-between items-center relative z-10">
            {steps.map((step, index) => (
              <div key={step} className="flex flex-col items-center gap-3">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center border-4 border-[#020d0a] transition-all duration-700 ${
                  index <= currentStep ? "bg-emerald-500 text-black" : "bg-slate-800 text-slate-500"
                }`}>
                  {index <= currentStep ? <CheckCircle2 size={20} /> : <Clock size={18} />}
                </div>
                <span className={`text-[8px] font-black tracking-widest ${
                  index <= currentStep ? "text-emerald-500" : "text-slate-600"
                }`}>{step}</span>
              </div>
            ))}
            
            {/* কানেক্টিং লাইন */}
            <div className="absolute top-5 left-0 w-full h-1 bg-white/5 -z-10"></div>
            <div 
              className="absolute top-5 left-0 h-1 bg-emerald-500 -z-10 transition-all duration-1000"
              style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          
          {/* ✅ ২. আইটেম লিস্ট (Medicine List) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/[0.03] border border-white/10 rounded-[35px] p-8">
              <h2 className="text-lg font-black italic uppercase tracking-widest mb-6 flex items-center gap-3 text-emerald-500">
                <ShoppingBag size={20} /> Items Purchased
              </h2>
              <div className="space-y-4">
                {order.items?.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl group hover:border-emerald-500/30 transition-all">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
                        <Package size={24} />
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm tracking-tight">{item.medicine?.name || "Medicine Name"}</p>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-black text-emerald-400">৳{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ✅ ৩. সাইডবার (Summary & Shipping) */}
          <div className="space-y-8">
            <div className="bg-white/[0.03] border border-white/10 rounded-[35px] p-8 shadow-2xl">
              <h2 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] mb-6">Payment Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between text-xs font-bold text-slate-400">
                  <span>Subtotal</span>
                  <span>৳{order.totalPrice}</span>
                </div>
                <div className="flex justify-between text-xs font-bold text-slate-400">
                  <span>Shipping</span>
                  <span className="text-emerald-500 uppercase text-[9px]">Free</span>
                </div>
                <div className="h-[1px] bg-white/10 my-4"></div>
                <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black uppercase tracking-widest">Total Bill</span>
                  <span className="text-3xl font-black text-emerald-500 italic">৳{order.totalPrice}</span>
                </div>
              </div>
            </div>

            <div className="bg-white/[0.03] border border-white/10 rounded-[35px] p-8">
              <h2 className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] mb-6 flex items-center gap-2">
                <MapPin size={12} className="text-emerald-500" /> Delivery Address
              </h2>
              <p className="text-xs font-bold text-slate-300 leading-relaxed italic">
                {order.shippingAddress}
              </p>
            </div>
            
            {/* ✅ ক্যানসেল বাটন (যদি PLACED থাকে) */}
            {order.status === "PLACED" && (
              <button 
                className="w-full bg-red-500/10 hover:bg-red-500 border border-red-500/20 text-red-500 hover:text-white py-5 rounded-[20px] font-black text-[10px] uppercase tracking-[0.2em] transition-all"
                onClick={() => {
                   if(confirm("অর্ডারটি বাতিল করতে চান?")) {
                      api.orders.updateStatus(order.id, "CANCELLED").then(() => fetchOrderDetails());
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