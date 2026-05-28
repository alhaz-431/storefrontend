"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast";
import { Package, Clock, CheckCircle2, XCircle, RefreshCcw } from "lucide-react";
import Link from "next/link";

export default function CustomerOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      // ✅ 'getMyOrders()' এর বদলে সঠিক এপিআই মেথড 'getAll()' ব্যবহার করা হয়েছে
      const response = await api.orders.getAll();
      
      // রেসপন্স ডাটা অ্যারে কিনা তা চেক করে সেট করা
      const fetchedOrders = response?.data || response || [];
      if (Array.isArray(fetchedOrders)) {
        setOrders(fetchedOrders);
      } else {
        setOrders([]);
      }
    } catch (error: any) {
      toast.error(error.message || "অর্ডার হিস্ট্রি লোড করা যায়নি");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm("আপনি কি নিশ্চিত যে এই অর্ডারটি বাতিল করতে চান?")) return;
    
    const toastId = toast.loading("অর্ডার বাতিল করা হচ্ছে...");
    try {
      await api.orders.cancel(orderId);
      toast.success("অর্ডারটি সফলভাবে বাতিল হয়েছে", { id: toastId });
      // লোকাল স্টেট আপডেট করে স্ট্যাটাস CANCELLED করে দেওয়া
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: "CANCELLED" } : order
        )
      );
    } catch (error: any) {
      toast.error(error.message || "অর্ডার বাতিল করা যায়নি", { id: toastId });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toUpperCase()) {
      case "PLACED":
      case "PENDING":
        return <Clock className="text-amber-500" size={18} />;
      case "PROCESSING":
        return <RefreshCcw className="text-blue-500 animate-spin" size={18} />;
      case "SHIPPED":
        return <Package className="text-indigo-500" size={18} />;
      case "DELIVERED":
        return <CheckCircle2 className="text-emerald-500" size={18} />;
      case "CANCELLED":
        return <XCircle className="text-rose-500" size={18} />;
      default:
        return <Clock className="text-slate-500" size={18} />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#040610]">
        <RefreshCcw className="animate-spin text-blue-500" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#040610] text-slate-100 p-4 md:p-10 font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-black uppercase tracking-tight text-white">
            My <span className="text-blue-500">Orders History</span>
          </h1>
          <p className="text-slate-400 text-xs mt-1">আপনার করা সকল অর্ডারের তালিকা ও বর্তমান অবস্থা</p>
        </header>

        {orders.length === 0 ? (
          <div className="text-center py-20 bg-[#0d111c] border border-white/10 rounded-2xl">
            <Package className="mx-auto text-slate-600 mb-4" size={48} />
            <p className="text-slate-400 font-medium">আপনি এখনও কোনো অর্ডার করেননি।</p>
            <Link href="/shop" className="mt-4 inline-block bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-6 py-3 rounded-xl transition">
              মেডিসিন কিনুন
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order: any) => (
              <div key={order.id} className="bg-[#0d111c] border border-white/10 p-6 rounded-2xl shadow-sm hover:border-white/20 transition">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/5 pb-4 mb-4">
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase block">ORDER ID</span>
                    <span className="text-sm font-bold text-white">#{order.id?.slice(-8).toUpperCase()}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
                    {getStatusIcon(order.status)}
                    <span className="text-xs font-black uppercase tracking-wider">{order.status}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <p className="text-xs text-slate-400">Total Amount</p>
                    <p className="text-xl font-black text-blue-400">৳{order.totalAmount}</p>
                  </div>
                  
                  <div className="flex gap-3 w-full sm:w-auto">
                    {/* রিকোয়ারমেন্ট ডায়াগ্রাম অনুযায়ী কাস্টমার শুধু PLACED বা PENDING অবস্থায় অর্ডার ক্যানসেল করতে পারবে */}
                    {(order.status === "PLACED" || order.status === "PENDING") && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        className="w-full sm:w-auto px-4 py-2 bg-rose-600/10 hover:bg-rose-600 border border-rose-500/30 text-rose-400 hover:text-white rounded-xl text-xs font-bold transition"
                      >
                        Cancel Order
                      </button>
                    )}
                    <Link
                      href={`/customer/orders/${order.id}`}
                      className="w-full sm:w-auto text-center px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}