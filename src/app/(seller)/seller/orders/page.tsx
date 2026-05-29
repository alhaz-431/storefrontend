"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Package, Clock, Truck, CheckCircle2,
  RefreshCcw, Search, ShoppingBag
} from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast";

export default function SellerOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // ✅ FIX: জেনারিক অর্ডারের বদলে সেলারের নির্দিষ্ট অর্ডার রুট কল করা হলো
      const data = await api.seller.getOrders();
      setOrders(Array.isArray(data) ? data : (data?.data || []));
    } catch (error: any) {
      toast.error(error.message || "অর্ডার লিস্ট লোড করা যায়নি");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateStatus = async (orderId: string, status: string) => {
    const toastId = toast.loading("আপডেট হচ্ছে...");
    try {
      await api.seller.updateOrderStatus(orderId, status); 
      toast.success(`অর্ডার এখন ${status}`, { id: toastId });
      setOrders((prevOrders) => 
        prevOrders.map((order: any) => 
          order.id === orderId ? { ...order, status: status } : order
        )
      );
    } catch (error: any) {
      toast.error("আপডেট ব্যর্থ হয়েছে", { id: toastId });
    }
  };

  // সার্চ ফিল্টারিং লজিক (কাস্টমারের নাম বা আইডি দিয়ে)
  const filteredOrders = orders.filter((order) => {
    const customerName = order.customer?.name?.toLowerCase() || "";
    const orderId = order.id?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();
    return customerName.includes(search) || orderId.includes(search);
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 p-4 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
              Order <span className="text-[#008249]">Logistics</span>
            </h1>
          </div>
          <div className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-[#E6F4ED] shadow-sm">
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Active Orders</p>
              <p className="text-2xl font-black text-[#008249]">{filteredOrders.length}</p>
            </div>
            <div className="bg-[#E6F4ED] p-2 rounded-xl text-[#008249]">
              <Package size={24} />
            </div>
          </div>
        </header>

        {/* SEARCH BAR */}
        <div className="relative mb-8">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text"
            placeholder="Search by Customer Name or ID..."
            className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-16 pr-6 outline-none focus:ring-2 focus:ring-[#008249]/20 focus:border-[#008249] transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* ORDERS SECTION */}
        <div className="space-y-6">
          {loading ? (
            <div className="flex justify-center py-32">
              <RefreshCcw className="animate-spin text-[#008249]" size={40} />
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-20 text-slate-400 font-medium bg-white border border-slate-100 rounded-[2rem]">
              কোনো অর্ডার পাওয়া যায়নি।
            </div>
          ) : (
            <div className="space-y-6">
              <AnimatePresence>
                {filteredOrders.map((order: any) => (
                  <motion.div key={order.id} className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-sm">
                    
                    {/* Top Order Meta */}
                    <div className="flex justify-between items-center mb-6 border-b pb-4">
                      <span className="text-[10px] font-black uppercase text-slate-400">
                        ID: #{order.id?.slice(-8).toUpperCase()}
                      </span>
                      <span className={`px-4 py-1 rounded-full text-[10px] font-black ${
                        order.status === "DELIVERED" ? "bg-green-100 text-green-700" : "bg-[#E6F4ED] text-[#008249]"
                      }`}>
                        {order.status}
                      </span>
                    </div>

                    {/* Order Information Grid */}
                    <div className="grid lg:grid-cols-3 gap-8 items-start">
                      
                      {/* Customer Info */}
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase mb-1">Customer</p>
                        <h3 className="font-bold text-lg text-slate-900">{order.customer?.name || "Unknown Customer"}</h3>
                        <p className="text-xs text-slate-500">{order.customer?.email}</p>
                      </div>

                      {/* ✅ FIX FOR ASSIGNMENT: ordered item details list */}
                      <div>
                        <p className="text-xs font-bold text-slate-400 uppercase mb-2">Ordered Items</p>
                        <div className="space-y-2 bg-slate-50 p-4 rounded-xl">
                          {order.items && order.items.length > 0 ? (
                            order.items.map((item: any, idx: number) => (
                              <div key={idx} className="flex justify-between items-center text-xs">
                                <span className="font-medium text-slate-700">
                                  📦 {item.medicine?.name || "Medicine"} <span className="text-slate-400 font-bold">x{item.quantity}</span>
                                </span>
                                <span className="font-bold text-slate-500">৳{item.price * item.quantity}</span>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-slate-400 italic">No details available</p>
                          )}
                        </div>
                        <div className="mt-3 font-black text-xl text-slate-900 flex justify-between items-center px-1">
                          <span className="text-xs font-bold text-slate-400 uppercase">Total:</span>
                          <span>৳{order.totalAmount}</span>
                        </div>
                      </div>

                      {/* Order Action/Status Manager */}
                      <div className="flex gap-2 flex-wrap lg:justify-end h-full items-center">
                        <StatusBtn onClick={() => updateStatus(order.id, "PENDING")} icon={<Clock size={14}/>} label="Pending" active={order.status === "PENDING"} />
                        <StatusBtn onClick={() => updateStatus(order.id, "SHIPPED")} icon={<Truck size={14}/>} label="Shipped" active={order.status === "SHIPPED"} />
                        <StatusBtn onClick={() => updateStatus(order.id, "DELIVERED")} icon={<CheckCircle2 size={14}/>} label="Done" active={order.status === "DELIVERED"} />
                      </div>

                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBtn({ onClick, icon, label, active }: any) {
  return (
    <button 
      type="button"
      onClick={onClick} 
      className={`flex items-center gap-2 py-2 px-3 rounded-lg border text-[10px] font-bold uppercase transition-all ${
        active 
        ? 'bg-[#008249] text-white border-[#008249]' 
        : 'bg-white text-slate-600 border-slate-200 hover:border-[#008249] hover:text-[#008249]'
      }`}
    >
      {icon} {label}
    </button>
  );
}