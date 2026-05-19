"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, ShoppingCart, User, Loader2 } from "lucide-react";

export default function CustomerDashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userData = localStorage.getItem("medistore_user");

    if (!userData) {
      router.replace("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(userData);
      
      // রোল কেস-সেন্সিটিভ সেফটি চেক
      const role = parsedUser.role?.toUpperCase();
      if (role !== "CUSTOMER") {
        router.replace("/");
        return;
      }
      
      setUser(parsedUser);
      setLoading(false);
    } catch (error) {
      localStorage.removeItem("medistore_user");
      router.replace("/login");
    }
  }, [router]);

  // হোয়াইট থিম লোডার
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-800 font-black text-xs uppercase tracking-widest gap-2">
        <Loader2 className="animate-spin text-emerald-600" size={18} /> 
        Loading Secure Panel...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-10 min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* Header Section */}
      <div className="mb-8 md:mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tight">
            Welcome back, <span className="text-emerald-600">{user?.name || "Customer"}</span> 👋
          </h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">
            Manage your health and orders from one place
          </p>
        </div>
        
        {/* একটিভ স্ট্যাটাস ব্যাজ (সেলার পেজের সাথে মিল রেখে) */}
        <div className="bg-white border border-slate-200 px-4 py-2 rounded-2xl flex items-center gap-3 shadow-sm">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-slate-600 text-[10px] font-bold uppercase tracking-widest">Account Active</span>
        </div>
      </div>

      {/* Cards Grid (১০০% হোয়াইট থিম ও প্রিমিয়াম ডিজাইন) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* My Orders Card */}
        <div 
          onClick={() => router.push("/customer/orders")}
          className="bg-white border border-slate-200 p-6 rounded-[32px] hover:shadow-xl hover:shadow-slate-200/50 hover:border-emerald-500/50 transition-all duration-300 cursor-pointer group"
        >
          <div className="bg-emerald-50 text-emerald-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <ShoppingBag size={24} />
          </div>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">History</p>
          <h2 className="text-lg font-black text-slate-900 mt-1 uppercase tracking-tight">My Orders</h2>
          <p className="text-slate-400 mt-1 text-xs font-semibold leading-relaxed">Track, cancel, and view your pharmacy medicine orders.</p>
        </div>

        {/* Shopping Cart Card */}
        <div 
          onClick={() => router.push("/customer/cart")}
          className="bg-white border border-slate-200 p-6 rounded-[32px] hover:shadow-xl hover:shadow-slate-200/50 hover:border-blue-500/50 transition-all duration-300 cursor-pointer group"
        >
          <div className="bg-blue-50 text-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <ShoppingCart size={24} />
          </div>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Basket</p>
          <h2 className="text-lg font-black text-slate-900 mt-1 uppercase tracking-tight">Shopping Cart</h2>
          <p className="text-slate-400 mt-1 text-xs font-semibold leading-relaxed">Check items, change quantities, and proceed to buy.</p>
        </div>

        {/* My Profile Card */}
        <div 
          onClick={() => router.push("/customer/profile")}
          className="bg-white border border-slate-200 p-6 rounded-[32px] hover:shadow-xl hover:shadow-slate-200/50 hover:border-purple-500/50 transition-all duration-300 cursor-pointer group"
        >
          <div className="bg-purple-50 text-purple-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
            <User size={24} />
          </div>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Account</p>
          <h2 className="text-lg font-black text-slate-900 mt-1 uppercase tracking-tight">My Profile</h2>
          <p className="text-slate-400 mt-1 text-xs font-semibold leading-relaxed">Update your shipping address, password, and info.</p>
        </div>

      </div>
    </div>
  );
}