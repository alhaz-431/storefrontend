"use client";
import { useState, useEffect } from "react"; // useEffect যোগ করা হয়েছে
import { motion } from "framer-motion";
import { api } from "@/lib/api"; // আপনার api ইমপোর্ট করুন
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  Truck, 
  User, 
  Search,
  MoreVertical
} from "lucide-react";

export default function SellerOrders() {
  const [filter, setFilter] = useState("ALL");
  const [orders, setOrders] = useState<any[]>([]); // স্টেট হিসেবে ডিক্লেয়ার করলাম
  const [loading, setLoading] = useState(true);

  // ✅ ডাটাবেজ থেকে অর্ডার নিয়ে আসার লজিক
  useEffect(() => {
    const fetchOrders = async () => {
      const user = JSON.parse(localStorage.getItem("medistore_user") || "{}");
      if (user.id) {
        try {
          setLoading(true);
          // আপনার API কল
          const response = await api.orders.getUserOrders(user.id); 
          // ডাটা যদি response.data তে থাকে তবে সেটা দিন
          setOrders(response.data || response); 
        } catch (error) {
          console.error("Orders load failed", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DELIVERED": return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
      case "PROCESSING": return "text-blue-500 bg-blue-500/10 border-blue-500/20";
      default: return "text-orange-500 bg-orange-500/10 border-orange-500/20";
    }
  };

  // ফিল্টার অনুযায়ী অর্ডার আলাদা করা
  const filteredOrders = orders.filter(order => 
    filter === "ALL" ? true : order.status === filter
  );

  if (loading) return <div className="p-10 text-white italic">Loading your orders...</div>;

  return (
    <div className="p-6 lg:p-10 min-h-screen bg-[#02040a]">
      {/* হেডার */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white">
            My <span className="text-emerald-500">Orders</span>
          </h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">
            Track your medicine deliveries
          </p>
        </div>

        {/* ফিল্টার ট্যাব */}
        <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10">
          {["ALL", "PENDING", "DELIVERED"].map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === tab ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'text-slate-500 hover:text-white'}`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* অর্ডার লিস্ট */}
      <div className="grid grid-cols-1 gap-4">
        {filteredOrders.length === 0 ? (
           <p className="text-slate-500 italic">No orders found.</p>
        ) : (
          filteredOrders.map((order, i) => (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group bg-white/[0.02] border border-white/5 p-6 rounded-[32px] hover:border-emerald-500/30 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-6"
            >
              <div className="flex flex-wrap items-center gap-6">
                <div className="w-16 h-16 bg-white/5 rounded-[24px] flex items-center justify-center text-emerald-500 border border-white/5">
                  <ShoppingBag size={24} />
                </div>

                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-black text-white italic uppercase tracking-tight">#{order.id.slice(-6).toUpperCase()}</h3>
                    <span className={`px-3 py-0.5 rounded-full text-[9px] font-black uppercase border ${getStatusColor(order.status)}`}>
                      {order.status || "PENDING"}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                    <span className="flex items-center gap-1.5"><User size={12} className="text-emerald-500"/> {order.shippingName || "Customer"}</span>
                    <span className="flex items-center gap-1.5"><Clock size={12} className="text-emerald-500"/> {new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* প্রোডাক্ট ডিটেইলস (প্রথম আইটেমটি দেখাচ্ছি উদাহরণ হিসেবে) */}
              <div className="flex items-center gap-8 px-6 py-4 bg-white/[0.03] rounded-3xl border border-white/5">
                 <div>
                    <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">Items</p>
                    <p className="text-white font-bold italic text-sm">
                      {order.items?.length} Medicine(s)
                    </p>
                 </div>
                 <div className="w-[1px] h-8 bg-white/10" />
                 <div>
                    <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest mb-1">Total Bill</p>
                    <p className="text-xl font-black text-white italic">৳{order.totalAmount || order.price}</p>
                 </div>
              </div>

              <div className="flex items-center gap-3">
                <button className="flex-1 lg:flex-none bg-white/5 hover:bg-white/10 text-white px-6 py-3.5 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all">
                  View Details
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}