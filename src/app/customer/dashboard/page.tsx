"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, ShoppingCart, User } from "lucide-react";

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
      if (parsedUser.role !== "CUSTOMER") {
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#02040a] text-white">
        <div className="animate-pulse text-emerald-500 font-bold">Loading...</div>
      </div>
    );
  }

  return (
    // এখানে কোনো sidebar div নেই, কারণ layout.tsx থেকে সাইডবার আসবে
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-2">
        Welcome back, <span className="text-emerald-500">{user?.name}</span> 👋
      </h1>
      <p className="text-slate-500 mb-10">Manage your health and orders from one place.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 p-6 rounded-xl border border-white/10 hover:border-emerald-500/50 transition cursor-pointer">
          <div className="text-emerald-500 mb-4"><ShoppingBag size={24} /></div>
          <h2 className="text-lg font-semibold">My Orders</h2>
          <p className="text-slate-400 mt-2 text-sm">Track and view your medicine orders.</p>
        </div>

        <div className="bg-white/5 p-6 rounded-xl border border-white/10 hover:border-blue-500/50 transition cursor-pointer">
          <div className="text-blue-500 mb-4"><ShoppingCart size={24} /></div>
          <h2 className="text-lg font-semibold">Shopping Cart</h2>
          <p className="text-slate-400 mt-2 text-sm">Check items you've added to buy.</p>
        </div>

        <div className="bg-white/5 p-6 rounded-xl border border-white/10 hover:border-purple-500/50 transition cursor-pointer">
          <div className="text-purple-500 mb-4"><User size={24} /></div>
          <h2 className="text-lg font-semibold">My Profile</h2>
          <p className="text-slate-400 mt-2 text-sm">Update your address and info.</p>
        </div>
      </div>
    </div>
  );
}