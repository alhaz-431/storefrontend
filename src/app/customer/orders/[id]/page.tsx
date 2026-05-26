"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Package, MapPin, ArrowLeft, CheckCircle2, 
  Clock, Truck, ShieldCheck, Phone, User, CreditCard, Loader2, AlertCircle
} from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast";

interface OrderItem {
  id: string;
  medicineId: string;
  name: string;
  quantity: number;
  price: number;
  medicine?: { name: string };
}

export default function OrderDetails() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchOrderDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      // ✅ সঠিক এপিআই মেথড 'getById' ব্যবহার করা হয়েছে
      const res = await api.orders.getById(id);
      const data = res.data || res;
      setOrder({
        ...data,
        items: (data.items || []).map((item: any, idx: number) => ({
          ...item,
          name: item.medicine?.name || item.name || "Unknown",
          id: item.id || `item-${idx}`
        }))
      });
    } catch (err) {
      toast.error("অর্ডারের তথ্য পাওয়া যায়নি");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!confirm("আপনি কি নিশ্চিত যে অর্ডারটি বাতিল করতে চান?")) return;
    setCancelling(true);
    try {
      // ✅ সঠিক এবং ডেডিকেটেড মেথড 'cancel' ব্যবহার করা হয়েছে
      await api.orders.cancel(id);
      toast.success("Order Cancelled Successfully");
      await fetchOrderDetails();
    } catch (error) {
      toast.error("Failed to cancel order");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#020d0a] flex items-center justify-center text-slate-200 font-black text-xs uppercase tracking-widest gap-2">
      <Loader2 className="animate-spin text-[#006643]" size={22} /> Loading details...
    </div>
  );

  if (!order) return (
    <div className="min-h-screen bg-[#020d0a] flex flex-col items-center justify-center text-center p-4">
      <AlertCircle size={48} className="text-red-500 mb-4" />
      <div className="text-white font-black text-lg uppercase tracking-wider">Order not found</div>
      <button onClick={() => router.push("/customer/orders")} className="mt-4 px-4 py-2 bg-white/5 rounded-xl text-xs font-bold text-slate-300 hover:text-white transition-colors">
        Back to Orders
      </button>
    </div>
  );

  const steps = ["PLACED", "PROCESSING", "SHIPPED", "DELIVERED"];
  const stepIcons = [
    <Clock size={16} key="placed" />,
    <Loader2 size={16} className="animate-spin-slow" key="processing" />,
    <Truck size={16} key="shipped" />,
    <CheckCircle2 size={16} key="delivered" />
  ];
  const isCancelled = order.status?.toUpperCase() === "CANCELLED";
  const currentStep = isCancelled ? -1 : steps.indexOf(order.status?.toUpperCase());

  return (
    <div className="min-h-screen bg-[#020d0a] bg-[radial-gradient(circle_at_top_right,_#006643,_#020d0a)] text-slate-200 py-8 sm:py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <button onClick={() => router.push("/customer/orders")} className="text-slate-400 hover:text-white flex items-center gap-2 mb-8 font-black uppercase text-[10px] tracking-wider transition-colors">
          <ArrowLeft size={14} /> Back to Orders
        </button>

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <p className="text-[#006643] text-[10px] font-black uppercase tracking-widest">ID: #{id.slice(-8).toUpperCase()}</p>
            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight">Order <span className="text-[#006643]">Summary</span></h1>
          </div>
          <div className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider border self-start sm:self-auto ${
            isCancelled 
              ? "bg-red-500/10 border-red-500/20 text-red-400" 
              : order.status === "DELIVERED"
              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
              : "bg-[#006643]/10 border-[#006643]/20 text-[#006643]"
          }`}>
            {order.status}
          </div>
        </div>

        {/* Tracker Section */}
        {!isCancelled && (
          <div className="bg-white/[0.02] border border-white/5 p-6 sm:p-8 rounded-[24px] backdrop-blur-md mb-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative">
              {steps.map((step, i) => {
                const isCompleted = i <= currentStep;
                return (
                  <div key={step} className="flex flex-col items-center text-center relative group">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 border transition-all ${
                      isCompleted 
                        ? "bg-[#006643] border-[#006643] text-white shadow-md shadow-[#006643]/20" 
                        : "bg-[#020d0a] border-white/5 text-slate-600"
                    }`}>
                      {stepIcons[i]}
                    </div>
                    <span className={`text-[10px] font-black tracking-wider uppercase ${isCompleted ? "text-slate-200" : "text-slate-500"}`}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Main Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Column: Items and Delivery Address */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Items Card */}
            <div className="space-y-4">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 ml-1">Products Ordered</h3>
              {order.items?.map((item: OrderItem) => (
                <div key={item.id} className="flex justify-between items-center p-4 sm:p-5 bg-white/[0.02] border border-white/5 rounded-2xl hover:border-[#006643]/20 transition-colors backdrop-blur-sm">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="w-12 h-12 bg-[#006643]/10 border border-[#006643]/20 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                      💊
                    </div>
                    <div className="min-w-0">
                      <p className="font-black text-sm uppercase tracking-tight text-slate-200 truncate">{item.name}</p>
                      <p className="text-xs font-bold text-slate-500 mt-0.5">৳{item.price} × {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-black text-sm text-slate-100 pl-4">৳{item.price * item.quantity}</p>
                </div>
              ))}
            </div>

            {/* Shipping/Delivery Information Card */}
            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 space-y-6 backdrop-blur-md">
              <h3 className="font-black uppercase text-sm tracking-tight text-slate-200 flex items-center gap-2 pb-3 border-b border-white/5">
                <MapPin size={16} className="text-[#006643]" /> Delivery Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Receiver Name</p>
                  <p className="text-slate-200 flex items-center gap-2"><User size={14} className="text-slate-600" /> {order.shippingName || "N/A"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Contact Number</p>
                  <p className="text-slate-200 flex items-center gap-2"><Phone size={14} className="text-slate-600" /> {order.shippingPhone || "N/A"}</p>
                </div>
                <div className="sm:col-span-2 space-y-1 pt-2 border-t border-white/5">
                  <p className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Shipping Address</p>
                  <p className="text-slate-300 leading-relaxed">{order.shippingAddress || "N/A"}</p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Pricing & Cancel Handler */}
          <div className="space-y-6 lg:sticky top-24">
            
            {/* Bill Summary Panel */}
            <div className="bg-white/[0.02] border border-white/5 rounded-[32px] p-6 backdrop-blur-md space-y-6">
              <h3 className="text-lg font-black uppercase tracking-tight text-slate-200 pb-3 border-b border-white/5">Payment Details</h3>
              
              <div className="space-y-3 text-xs font-bold">
                <div className="flex justify-between">
                  <span className="text-slate-500 uppercase text-[10px] tracking-wider">Payment Method</span>
                  <span className="text-slate-300 uppercase flex items-center gap-1.5"><CreditCard size={14} className="text-[#006643]" /> Cash on Delivery</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 uppercase text-[10px] tracking-wider">Delivery Fee</span>
                  <span className="text-[#006643] uppercase text-[10px] tracking-widest bg-[#006643]/10 border border-[#006643]/20 px-2 py-0.5 rounded">FREE</span>
                </div>
                <div className="h-[1px] bg-white/5 w-full my-2" />
                <div className="flex justify-between items-end pt-1">
                  <span className="font-black text-[#006643] uppercase text-[10px] tracking-widest mb-0.5">Total Paid</span>
                  <span className="text-3xl font-black text-slate-100 tracking-tight">৳{order.totalAmount}</span>
                </div>
              </div>
            </div>

            {/* Cancel Action Button */}
            {(order.status?.toUpperCase() === "PENDING" || order.status?.toUpperCase() === "PLACED") && (
              <button 
                onClick={handleCancelOrder}
                disabled={cancelling}
                className="w-full py-4 bg-red-500/10 border border-red-500/20 text-red-400 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-red-500 hover:text-white transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {cancelling ? (
                  <>
                    <Loader2 size={14} className="animate-spin" /> Cancelling...
                  </>
                ) : (
                  "Cancel Order"
                )}
              </button>
            )}

            <div className="flex items-center justify-center gap-2 text-[9px] text-slate-600 font-black uppercase tracking-wider pt-2">
              <ShieldCheck size={14} className="text-[#006643]" /> Verified MediStore Order
            </div>

          </div>
          
        </div>

      </div>
    </div>
  );
}