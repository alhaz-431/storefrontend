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
      // api.orders.getAllOrders টি api.ts থেকে আসছে
      const data = await api.orders.getAllOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error: any) {
      toast.error(error.message || "অর্ডার লিস্ট লোড করা যায়নি");
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
      // api.ts এ আমরা updateStatus: (id, status) রেখেছি, তাই এখানে status পাঠাচ্ছি
      await api.orders.updateStatus(orderId, status); 
      
      toast.success(`অর্ডার এখন ${status}`, { id: toastId });
      
      setOrders((prevOrders) => 
        prevOrders.map((order: any) => 
          order.id === orderId ? { ...order, status: status } : order
        )
      );
    } catch (error: any) {
      toast.error(error.message || "আপডেট ব্যর্থ হয়েছে", { id: toastId });
    }
  };

  const filteredOrders = orders.filter((order: any) =>
    order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
              Order <span className="text-emerald-600">Logistics</span>
            </h1>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">Management Dashboard</p>
          </div>
          <div className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Total Active Orders</p>
              <p className="text-2xl font-black text-emerald-600 leading-none">{orders.length}</p>
            </div>
            <div className="bg-emerald-50 p-2 rounded-xl text-emerald-600">
              <Package size={24} />
            </div>
          </div>
        </header>

        <div className="relative mb-8">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text"
            placeholder="Search by Customer Name or ID..."
            className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-16 pr-6 outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-sm shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <RefreshCcw className="animate-spin text-emerald-500 mb-4" size={40} />
            </div>
          ) : (
            <AnimatePresence>
              {filteredOrders.map((order: any) => (
                <motion.div key={order.id} className="bg-white border p-8 rounded-[2rem] shadow-sm">
                  <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <span className="text-[10px] font-black uppercase text-slate-400">ID: #{order.id?.slice(-8)}</span>
                    <span className="px-4 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black">{order.status}</span>
                  </div>
                  <div className="grid lg:grid-cols-3 gap-8">
                    <div>
                      <h3 className="font-bold text-lg">{order.customer?.name || "Customer"}</h3>
                      <p className="text-xs text-slate-400">{order.customer?.email}</p>
                    </div>
                    <div className="font-black text-xl">৳{order.totalAmount}</div>
                    <div className="flex gap-2 flex-wrap">
                      <StatusBtn onClick={() => updateStatus(order.id, "PENDING")} icon={<Clock size={14}/>} label="Pending" active={order.status === "PENDING"} />
                      <StatusBtn onClick={() => updateStatus(order.id, "SHIPPED")} icon={<Truck size={14}/>} label="Shipped" active={order.status === "SHIPPED"} />
                      <StatusBtn onClick={() => updateStatus(order.id, "DELIVERED")} icon={<CheckCircle2 size={14}/>} label="Done" active={order.status === "DELIVERED"} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}

function StatusBtn({ onClick, icon, label, active }: any) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 py-2 px-3 rounded-lg border text-[10px] font-bold uppercase ${active ? 'bg-emerald-600 text-white' : 'bg-white border-slate-200'}`}>
      {icon} {label}
    </button>
  );
}