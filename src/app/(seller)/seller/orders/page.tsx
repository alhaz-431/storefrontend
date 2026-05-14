"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  User, Package, Clock, Truck, CheckCircle2, 
  RefreshCcw, Hash, Calendar, DollarSign, 
  Search, ArrowLeftRight
} from "lucide-react";
import { api } from "@/lib/api"; 
import { toast } from "react-hot-toast";

export default function SellerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await api.orders.getAllOrders();
      const data = Array.isArray(response?.data) ? response.data : response || [];
      setOrders(data);
    } catch (error) {
      toast.error("অর্ডার লিস্ট লোড করা যায়নি");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (orderId: string, status: string) => {
    const toastId = toast.loading(`${status} আপডেট হচ্ছে...`);
    try {
      // এখানে api.admin এর বদলে আপনার রাউট অনুযায়ী api.orders ব্যবহার করুন
      await api.orders.updateStatus(orderId, status); 
      toast.success(`অর্ডার এখন ${status}`, { id: toastId });
      fetchOrders(); 
    } catch (error) {
      toast.error("স্ট্যাটাস আপডেট ব্যর্থ হয়েছে", { id: toastId });
    }
  };

  // সার্চ ফিল্টার - এখানেও order.customer ব্যবহার করা হয়েছে
  const filteredOrders = orders.filter((order: any) => 
    order.customer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id?.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-[#05120d] text-emerald-100 p-4 md:p-10 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* হেডার */}
        <header className="mb-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black italic text-white uppercase tracking-tighter">
              Order <span className="text-emerald-500">Logistics</span>
            </h1>
            <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-[0.3em] mt-2">
              Seller Control Panel
            </p>
          </div>
          <div className="flex items-center gap-4 bg-emerald-900/20 p-4 rounded-3xl border border-emerald-500/10">
            <div className="text-right">
              <p className="text-[9px] font-black text-emerald-500 uppercase">Total Orders</p>
              <p className="text-2xl font-black text-white leading-none">{orders.length}</p>
            </div>
            <Package className="text-emerald-500" size={24} />
          </div>
        </header>

        {/* সার্চ বার */}
        <div className="relative mb-8 group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-800" size={20} />
          <input 
            type="text"
            placeholder="Search by Customer Name or ID..."
            className="w-full bg-[#071a12] border border-emerald-500/10 rounded-2xl py-5 pl-16 pr-6 outline-none focus:border-emerald-500/50 text-emerald-100 transition-all text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* অর্ডার লিস্ট */}
        <div className="space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <RefreshCcw className="animate-spin text-emerald-500 mb-4" size={40} />
              <p className="font-black uppercase text-[10px] tracking-widest text-emerald-500">Syncing Data...</p>
            </div>
          ) : filteredOrders.length > 0 ? (
            filteredOrders.map((order: any) => (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#071a12] border border-emerald-500/5 rounded-[2.5rem] overflow-hidden hover:border-emerald-500/20 transition-all shadow-2xl"
              >
                <div className="bg-emerald-500/[0.02] px-8 py-4 flex justify-between items-center border-b border-emerald-500/5 text-[10px] font-bold uppercase text-emerald-800">
                  <div className="flex items-center gap-2">
                    <Hash size={14} className="text-emerald-500" />
                    <span>ID: {order.id?.slice(-10)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-emerald-500" />
                    <span>{new Date(order.createdAt).toLocaleDateString('en-GB')}</span>
                  </div>
                </div>

                <div className="p-8 grid lg:grid-cols-12 gap-10 items-start">
                  
                  {/* কাস্টমার তথ্য - এখানে customer ব্যবহার করা হয়েছে */}
                  <div className="lg:col-span-5 space-y-8">
                    <div className="flex gap-5">
                      <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                        {order.customer?.image ? (
                          <img src={order.customer.image} alt="User" className="w-full h-full rounded-2xl object-cover" />
                        ) : (
                          <User size={24} />
                        )}
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-emerald-700 uppercase tracking-widest mb-1">Customer Profile</p>
                        <h3 className="text-white font-bold text-lg leading-tight">{order.customer?.name || "Unknown Customer"}</h3>
                        <p className="text-xs text-emerald-700 mt-1">{order.customer?.email || "No email provided"}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-[9px] font-black text-emerald-700 uppercase tracking-widest flex items-center gap-2">
                        <Package size={12} className="text-emerald-500" /> Medicines ordered
                      </p>
                      <div className="grid gap-2">
                        {order.items?.map((item: any, i: number) => (
                          <div key={i} className="flex justify-between items-center bg-emerald-900/10 p-4 rounded-2xl border border-emerald-500/5">
                            <span className="text-sm font-bold text-emerald-100">{item.medicine?.name}</span>
                            <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black px-3 py-1 rounded-lg">
                              QTY: {item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* পেমেন্ট */}
                  <div className="lg:col-span-3 flex flex-col items-center lg:items-start justify-center h-full p-8 bg-emerald-500/5 rounded-[2rem] border border-emerald-500/10 relative overflow-hidden">
                    <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-2">Total Amount</p>
                    <p className="text-4xl font-black text-white italic">৳{order.totalAmount}</p>
                    <div className={`mt-6 px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border
                      ${order.status === 'DELIVERED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border-amber-500/20'}`}>
                      ● {order.status}
                    </div>
                  </div>

                  {/* স্ট্যাটাস কন্ট্রোল */}
                  <div className="lg:col-span-4 space-y-4">
                    <p className="text-[9px] font-black text-emerald-700 uppercase tracking-widest flex items-center gap-2">
                      <ArrowLeftRight size={12} className="text-emerald-500" /> Update Progression
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <StatusBtn onClick={() => updateStatus(order.id, "PENDING")} icon={<Clock size={16}/>} label="Pending" active={order.status === "PENDING"} />
                      <StatusBtn onClick={() => updateStatus(order.id, "PROCESSING")} icon={<RefreshCcw size={16}/>} label="Processing" active={order.status === "PROCESSING"} />
                      <StatusBtn onClick={() => updateStatus(order.id, "SHIPPED")} icon={<Truck size={16}/>} label="Shipped" active={order.status === "SHIPPED"} />
                      <StatusBtn onClick={() => updateStatus(order.id, "DELIVERED")} icon={<CheckCircle2 size={16}/>} label="Delivered" active={order.status === "DELIVERED"} />
                    </div>
                  </div>

                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center py-32 border-2 border-dashed border-emerald-900/20 rounded-[3rem]">
              <Package className="mx-auto text-emerald-900 mb-4" size={48} />
              <p className="text-emerald-900 font-black uppercase tracking-[0.4em] text-xs">No Records Found</p>
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
      className={`flex flex-col items-center justify-center gap-2 py-4 px-2 rounded-2xl border transition-all duration-300
      ${active 
        ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/20' 
        : 'bg-emerald-900/10 text-emerald-700 border-emerald-500/5 hover:bg-emerald-500/20 hover:text-emerald-400'}`}
    >
      <span className={active ? "scale-110 transition-transform" : ""}>{icon}</span>
      <span className="font-black uppercase text-[8px] tracking-widest">{label}</span>
    </button>
  );
}