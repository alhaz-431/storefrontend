"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Package, Clock, Truck, CheckCircle2, 
  RefreshCcw, Hash, Calendar, DollarSign, 
  ChevronRight, ArrowLeftRight, Search, Filter
} from "lucide-react";
import { api } from "@/lib/api"; 
import { toast } from "react-hot-toast";

export default function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // ১. সব অর্ডার লোড করা
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.orders.getAllOrders();
      // রেসপন্স ডাটা অ্যারে কিনা তা চেক করে সেট করা
      const data = Array.isArray(response?.data) ? response.data : response || [];
      setOrders(data);
    } catch (error) {
      toast.error("অর্ডার লিস্ট লোড করা যায়নি");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  // ২. অর্ডারের স্ট্যাটাস আপডেট করা (যেমন: Pending -> Shipped)
  const updateStatus = async (orderId: string, status: string) => {
    const toastId = toast.loading(`${status} আপডেট হচ্ছে...`);
    try {
      await api.admin.updateOrderStatus(orderId, status);
      toast.success(`অর্ডার এখন ${status}`, { id: toastId });
      fetchOrders(); // লিস্ট রিফ্রেশ করা
    } catch (error) {
      toast.error("স্ট্যাটাস আপডেট ব্যর্থ হয়েছে", { id: toastId });
    }
  };

  // সার্চ ফিল্টার
  const filteredOrders = orders.filter((order: any) => 
    order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id?.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-[#030305] text-slate-300 p-4 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* হেডার সেকশন */}
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black italic text-white uppercase tracking-tighter">
              Order <span className="text-indigo-500">Logistics</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em] mt-2">
              Real-time Inventory & Shipment Control
            </p>
          </div>
          <div className="flex items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/5">
            <div className="text-right">
              <p className="text-[9px] font-black text-indigo-500 uppercase">Total Orders</p>
              <p className="text-2xl font-black text-white leading-none">{orders.length}</p>
            </div>
            <div className="h-8 w-[1px] bg-white/10 mx-2" />
            <Package className="text-indigo-500" size={24} />
          </div>
        </header>

        {/* সার্চ এবং ফিল্টার বার */}
        <div className="relative mb-8 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-500 transition-colors" size={20} />
          <input 
            type="text"
            placeholder="Search by Order ID or Customer Name..."
            className="w-full bg-[#08080f] border border-white/5 rounded-2xl py-5 pl-16 pr-6 outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/5 transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* অর্ডার লিস্ট */}
        <div className="space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 opacity-50">
              <RefreshCcw className="animate-spin text-indigo-500 mb-4" size={40} />
              <p className="font-black uppercase text-[10px] tracking-widest text-indigo-500">Syncing with Server...</p>
            </div>
          ) : filteredOrders.length > 0 ? (
            filteredOrders.map((order: any) => (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#08080f] border border-white/5 rounded-[2.5rem] overflow-hidden hover:border-indigo-500/30 transition-all duration-500 group shadow-2xl"
              >
                {/* কার্ডের উপরের অংশ (ID & Date) */}
                <div className="bg-white/[0.02] px-8 py-4 flex justify-between items-center border-b border-white/5 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  <div className="flex items-center gap-2">
                    <Hash size={14} className="text-indigo-500" />
                    <span>ID: {order.id?.slice(-10)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-indigo-500" />
                    <span>{new Date(order.createdAt).toLocaleDateString('en-GB')}</span>
                  </div>
                </div>

                <div className="p-8 grid lg:grid-cols-12 gap-10 items-start">
                  
                  {/* কাস্টমার এবং আইটেম সেকশন */}
                  <div className="lg:col-span-5 space-y-8">
                    <div className="flex gap-5">
                      <div className="h-14 w-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 border border-indigo-500/20 shrink-0 shadow-inner">
                        <User size={24} />
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Customer Profile</p>
                        <h3 className="text-white font-bold text-lg leading-tight">{order.user?.name || "Guest User"}</h3>
                        <p className="text-xs text-slate-500 mt-1">{order.user?.email || "No email provided"}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                        <Package size={12} className="text-indigo-500" /> Order Details
                      </p>
                      <div className="grid gap-2">
                        {order.items?.map((item: any, i: number) => (
                          <div key={i} className="flex justify-between items-center bg-white/[0.03] p-4 rounded-2xl border border-white/5 group-hover:bg-white/[0.05] transition-colors">
                            <span className="text-sm font-bold text-slate-300">{item.medicine?.name}</span>
                            <span className="bg-indigo-600/20 text-indigo-400 text-[10px] font-black px-3 py-1 rounded-lg border border-indigo-500/20">
                              QTY: {item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* পেমেন্ট এবং বর্তমান স্ট্যাটাস */}
                  <div className="lg:col-span-3 flex flex-col items-center lg:items-start justify-center h-full p-8 bg-indigo-500/5 rounded-[2rem] border border-indigo-500/10 relative overflow-hidden">
                    <div className="absolute -right-4 -top-4 opacity-5 text-indigo-500 rotate-12">
                      <DollarSign size={120} />
                    </div>
                    <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest mb-2">Total Amount</p>
                    <p className="text-4xl font-black text-white italic">৳{order.totalAmount}</p>
                    <div className={`mt-6 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border shadow-lg
                      ${order.status === 'DELIVERED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                      ● {order.status}
                    </div>
                  </div>

                  {/* কন্ট্রোল বাটন (Status Update) */}
                  <div className="lg:col-span-4 space-y-4">
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest text-center lg:text-left flex items-center gap-2">
                      <ArrowLeftRight size={12} className="text-indigo-500" /> Update Progression
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <StatusBtn onClick={() => updateStatus(order.id, "PENDING")} icon={<Clock size={16}/>} label="Pending" theme="amber" />
                      <StatusBtn onClick={() => updateStatus(order.id, "PROCESSING")} icon={<RefreshCcw size={16}/>} label="Processing" theme="blue" />
                      <StatusBtn onClick={() => updateStatus(order.id, "SHIPPED")} icon={<Truck size={16}/>} label="Shipped" theme="purple" />
                      <StatusBtn onClick={() => updateStatus(order.id, "DELIVERED")} icon={<CheckCircle2 size={16}/>} label="Delivered" theme="emerald" />
                    </div>
                  </div>

                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-32 border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.01]">
              <Package className="mx-auto text-slate-800 mb-4" size={48} />
              <p className="text-slate-600 font-black uppercase tracking-[0.4em] text-xs">No Records in Archive</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// স্ট্যাটাস বাটনের জন্য আলাদা কম্পোনেন্ট
function StatusBtn({ onClick, icon, label, theme }: any) {
    const themes: any = {
        amber: "hover:bg-amber-500 text-amber-500 border-amber-500/20",
        blue: "hover:bg-blue-500 text-blue-500 border-blue-500/20",
        purple: "hover:bg-purple-500 text-purple-500 border-purple-500/20",
        emerald: "hover:bg-emerald-500 text-emerald-500 border-emerald-500/20"
    };

    return (
        <button 
            onClick={onClick} 
            className={`flex flex-col items-center justify-center gap-2 py-4 px-2 bg-white/5 rounded-2xl border transition-all duration-300 hover:text-white group/btn ${themes[theme]}`}
        >
            <span className="transition-transform group-hover/btn:scale-110">{icon}</span>
            <span className="font-black uppercase text-[8px] tracking-widest">{label}</span>
        </button>
    );
}