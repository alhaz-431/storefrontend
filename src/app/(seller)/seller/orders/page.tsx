"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Package, Clock, Truck, CheckCircle2,
  RefreshCcw, Search
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
      // ✅ সঠিক এপিআই মেথড 'getAll()' ব্যবহার করা হয়েছে
      const data = await api.orders.getAll();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error: any) {
      toast.error(error.message || "অর্ডার লিস্ট লোড করা যায়নি");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId: string, status: string) => {
    const toastId = toast.loading("আপডেট হচ্ছে...");
    try {
      // ✅ সঠিক এপিআই মেথড 'api.seller.updateOrderStatus' ব্যবহার করা হয়েছে
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

  // সার্চ ফিল্টারিং লজিক (কাস্টমারের নাম বা আইডি দিয়ে)
  const filteredOrders = orders.filter((order) => {
    const customerName = order.customer?.name?.toLowerCase() || "";
    const orderId = order.id?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();
    return customerName.includes(search) || orderId.includes(search);
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 p-4 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
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

        <div className="space-y-6">
          {loading ? (
            <div className="flex justify-center py-32"><RefreshCcw className="animate-spin text-[#008249]" size={40} /></div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-20 text-slate-400 font-medium bg-white border border-slate-100 rounded-[2rem]">
              কোনো অর্ডার পাওয়া যায়নি।
            </div>
          ) : (
            <div className="space-y-6">
              <AnimatePresence>
                {filteredOrders.map((order: any) => (
                  <motion.div key={order.id} className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-sm">
                    <div className="flex justify-between items-center mb-6 border-b pb-4">
                      <span className="text-[10px] font-black uppercase text-slate-400">ID: #{order.id?.slice(-8).toUpperCase()}</span>
                      <span className="px-4 py-1 bg-[#E6F4ED] text-[#008249] rounded-full text-[10px] font-black">{order.status}</span>
                    </div>
                    <div className="grid lg:grid-cols-3 gap-8 items-center">
                      <div>
                        <h3 className="font-bold text-lg">{order.customer?.name || "Customer"}</h3>
                        <p className="text-xs text-slate-400">{order.customer?.email}</p>
                      </div>
                      <div className="font-black text-xl text-slate-900">৳{order.totalAmount}</div>
                      <div className="flex gap-2 flex-wrap">
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