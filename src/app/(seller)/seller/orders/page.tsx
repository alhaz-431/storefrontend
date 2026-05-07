"use client";

import { useEffect, useState } from "react";
import { User, Package, Clock, Truck, CheckCircle2, RefreshCcw } from "lucide-react";
import { api } from "@/lib/api"; 
import { toast } from "react-hot-toast";

export default function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.orders.getAllOrders();
      setOrders(Array.isArray(response?.data) ? response.data : response || []);
    } catch (error) {
      toast.error("অর্ডার লিস্ট লোড করা যায়নি");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (orderId: string, status: string) => {
    try {
      await api.admin.updateStatus(orderId, status);
      toast.success(`অর্ডার স্ট্যাটাস এখন ${status}`);
      fetchOrders();
    } catch (error) {
      toast.error("স্ট্যাটাস আপডেট করা যায়নি");
    }
  };

  return (
    <div className="p-3 sm:p-6 md:p-8 bg-[#02040a] min-h-screen text-white">
      {/* Header - Center for mobile, left for desktop */}
      <h1 className="text-xl md:text-2xl font-black italic uppercase mb-6 md:mb-10 text-center sm:text-left tracking-tighter">
        Order <span className="text-emerald-500">Management</span>
      </h1>

      <div className="grid gap-4 md:gap-6">
        {loading ? (
          <p className="text-center py-10 opacity-50 animate-pulse font-bold text-sm">লোড হচ্ছে...</p>
        ) : orders.length > 0 ? (
          orders.map((order: any) => (
            <div key={order.id} className="bg-white/5 border border-white/10 rounded-2xl md:rounded-[2rem] p-4 md:p-6 transition-all hover:bg-white/[0.07]">
              <div className="flex flex-col lg:flex-row justify-between gap-6">
                
                {/* ১. কাস্টমার ও আইটেম ইনফো */}
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500 shrink-0">
                        <User size={18} className="md:w-5 md:h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[8px] md:text-[10px] uppercase font-bold text-slate-500 tracking-wider">Customer</p>
                      <p className="font-bold text-sm md:text-base truncate">{order.user?.name || "Unknown User"}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500 shrink-0">
                        <Package size={18} className="md:w-5 md:h-5" />
                    </div>
                    <div className="w-full min-w-0">
                      <p className="text-[8px] md:text-[10px] uppercase font-bold text-slate-500 tracking-wider">Items</p>
                      <div className="space-y-1.5 mt-1">
                        {order.items?.map((item: any, i: number) => (
                          <div key={i} className="text-xs md:text-sm font-medium flex justify-between lg:justify-start gap-4 bg-white/[0.03] lg:bg-transparent p-2 lg:p-0 rounded-lg border border-white/5 lg:border-none">
                            <span className="truncate">{item.medicine?.name}</span>
                            <span className="text-emerald-500 font-bold whitespace-nowrap">x{item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* ২. দাম ও স্ট্যাটাস - Mobile: Row, Desktop: Column */}
                <div className="flex flex-row lg:flex-col justify-between items-center lg:items-end border-t border-b lg:border-none border-white/5 py-4 lg:py-0">
                  <div className="lg:text-right">
                    <p className="text-[8px] md:text-[10px] uppercase font-bold text-slate-500">Total Amount</p>
                    <p className="text-lg md:text-2xl font-black text-white">৳{order.totalAmount}</p>
                  </div>
                  <div className="lg:mt-2 px-3 py-1 rounded-full bg-emerald-500/10 text-[8px] md:text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 text-emerald-500">
                    {order.status}
                  </div>
                </div>

                {/* ৩. স্ট্যাটাস বাটন - Auto Grid Layout */}
                <div className="flex flex-col gap-3">
                  <p className="text-[8px] md:text-[10px] uppercase font-black text-slate-500 text-center lg:text-right">Update Status:</p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:flex lg:flex-col gap-2">
                      <button onClick={() => updateStatus(order.id, "PENDING")} className="flex items-center justify-center gap-2 p-2.5 md:p-3 bg-amber-500/10 text-amber-500 rounded-xl hover:bg-amber-500 hover:text-white transition-all border border-amber-500/10" title="Pending">
                        <Clock size={16}/><span className="text-[10px] font-bold uppercase lg:hidden">Pending</span>
                      </button>
                      <button onClick={() => updateStatus(order.id, "PROCESSING")} className="flex items-center justify-center gap-2 p-2.5 md:p-3 bg-blue-500/10 text-blue-500 rounded-xl hover:bg-blue-500 hover:text-white transition-all border border-blue-500/10" title="Processing">
                        <RefreshCcw size={16}/><span className="text-[10px] font-bold uppercase lg:hidden">Process</span>
                      </button>
                      <button onClick={() => updateStatus(order.id, "SHIPPED")} className="flex items-center justify-center gap-2 p-2.5 md:p-3 bg-purple-500/10 text-purple-500 rounded-xl hover:bg-purple-500 hover:text-white transition-all border border-purple-500/10" title="Shipped">
                        <Truck size={16}/><span className="text-[10px] font-bold uppercase lg:hidden">Ship</span>
                      </button>
                      <button onClick={() => updateStatus(order.id, "DELIVERED")} className="flex items-center justify-center gap-2 p-2.5 md:p-3 bg-emerald-500/10 text-emerald-500 rounded-xl hover:bg-emerald-500 hover:text-white transition-all border border-emerald-500/10" title="Delivered">
                        <CheckCircle2 size={16}/><span className="text-[10px] font-bold uppercase lg:hidden">Done</span>
                      </button>
                  </div>
                </div>

              </div>
            </div>
          ))
        ) : (
            <div className="text-center py-20 opacity-30 font-black uppercase tracking-[0.5em] text-[10px]">No orders found</div>
        )}
      </div>
    </div>
  );
}