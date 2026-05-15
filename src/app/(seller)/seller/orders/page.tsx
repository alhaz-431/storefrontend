"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Package, Clock, Truck, CheckCircle2,
  RefreshCcw, Search, ArrowLeftRight
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
      const response = await api.orders.getAllOrders();
      const data = response?.data || response || [];
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error("অর্ডার লিস্ট লোড করা যায়নি");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId: string, status: string) => {
    const upperStatus = status.toUpperCase();
    const toastId = toast.loading(`${upperStatus} আপডেট হচ্ছে...`);
    
    try {
      await api.orders.updateStatus(orderId, { status: upperStatus }); 
      toast.success(`অর্ডার এখন ${upperStatus}`, { id: toastId });
      
      setOrders((prevOrders) => 
        prevOrders.map((order: any) => 
          order.id === orderId ? { ...order, status: upperStatus } : order
        )
      );
    } catch (error: any) {
      toast.error("আপডেট ব্যর্থ হয়েছে", { id: toastId });
    }
  };

  const filteredOrders = orders.filter((order: any) =>
    order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* হেডার */}
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight">
              Order <span className="text-emerald-600">Logistics</span>
            </h1>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
              Management Dashboard
            </p>
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

        {/* সার্চ বার */}
        <div className="relative mb-8">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text"
            placeholder="Search by Customer Name or ID..."
            className="w-full bg-white border border-slate-200 rounded-2xl py-4 pl-16 pr-6 outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all text-slate-700 text-sm shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* অর্ডার লিস্ট */}
        <div className="space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <RefreshCcw className="animate-spin text-emerald-500 mb-4" size={40} />
              <p className="font-bold uppercase text-[10px] tracking-widest text-slate-400">Loading Orders...</p>
            </div>
          ) : filteredOrders.length > 0 ? (
            <AnimatePresence>
              {filteredOrders.map((order: any) => (
                <motion.div 
                  key={order.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 transition-all mb-6"
                >
                  {/* আইডি বার */}
                  <div className="bg-slate-50 px-8 py-3 flex justify-between items-center border-b border-slate-100 text-[10px] font-bold uppercase text-slate-500">
                    <span>Order ID: #{order.id?.slice(-8).toUpperCase()}</span>
                    <span>Date: {new Date(order.createdAt).toLocaleDateString('en-GB')}</span>
                  </div>

                  <div className="p-8 grid lg:grid-cols-12 gap-10 items-start">
                    {/* কাস্টমার ইনফো */}
                    <div className="lg:col-span-5 space-y-6">
                      <div className="flex gap-4 items-center">
                        <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200 overflow-hidden">
                          {order.customer?.image ? (
                            <img src={order.customer.image} alt="User" className="w-full h-full object-cover" />
                          ) : (
                            <User size={24} />
                          )}
                        </div>
                        <div>
                          <h3 className="text-slate-900 font-bold text-lg leading-tight">{order.customer?.name || "Anonymous Customer"}</h3>
                          <p className="text-xs text-slate-400 mt-0.5">{order.customer?.email}</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                          Ordered Items
                        </p>
                        <div className="grid gap-2">
                          {order.items?.map((item: any, i: number) => (
                            <div key={i} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100">
                              <span className="text-sm font-semibold text-slate-700">{item.medicine?.name}</span>
                              <span className="bg-white border border-slate-200 text-slate-600 text-[10px] font-black px-2.5 py-1 rounded-lg">QTY: {item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* এমাউন্ট ও স্ট্যাটাস */}
                    <div className="lg:col-span-3 flex flex-col items-center justify-center h-full p-8 bg-slate-50/50 rounded-3xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Total Payable</p>
                      <p className="text-3xl font-black text-slate-900">৳{order.totalAmount}</p>
                      <div className={`mt-4 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase border
                        ${order.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-orange-50 text-orange-600 border-orange-100'}`}>
                        {order.status}
                      </div>
                    </div>

                    {/* একশন বাটন */}
                    <div className="lg:col-span-4 space-y-4">
                      <p className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-2">Change Status</p>
                      <div className="grid grid-cols-2 gap-2">
                        <StatusBtn onClick={() => updateStatus(order.id, "PENDING")} icon={<Clock size={14}/>} label="Pending" active={order.status === "PENDING"} />
                        <StatusBtn onClick={() => updateStatus(order.id, "PROCESSING")} icon={<RefreshCcw size={14}/>} label="Process" active={order.status === "PROCESSING"} />
                        <StatusBtn onClick={() => updateStatus(order.id, "SHIPPED")} icon={<Truck size={14}/>} label="Shipped" active={order.status === "SHIPPED"} />
                        <StatusBtn onClick={() => updateStatus(order.id, "DELIVERED")} icon={<CheckCircle2 size={14}/>} label="Done" active={order.status === "DELIVERED"} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          ) : (
            <div className="text-center py-32 border-2 border-dashed border-slate-200 rounded-[3rem] bg-white">
              <Package className="mx-auto text-slate-200 mb-4" size={48} />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No orders found</p>
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
      onClick={onClick}
      type="button"
      className={`flex items-center gap-2 py-3 px-3 rounded-xl border text-[10px] font-bold uppercase transition-all duration-200 ${
        active 
        ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-100' 
        : 'bg-white text-slate-500 border-slate-200 hover:border-emerald-300 hover:text-emerald-600'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}