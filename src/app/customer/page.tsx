"use client";

import { motion } from "framer-motion";
import { ShoppingBag, Package, User } from "lucide-react";
import Link from "next/link";

export default function CustomerDashboardPage() {
  return (
    <div className="p-8">
      {/* শুধু মেইন হেডিং এবং কার্ড */}
      <h1 className="text-3xl font-bold mb-8 text-white">
        Welcome back, <span className="text-emerald-500">babli</span> 👋
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/customer/orders">
           <div className="bg-[#111] p-6 rounded-xl border border-white/10 hover:border-emerald-500 transition">
             <ShoppingBag className="text-emerald-500 mb-2" />
             <h2 className="text-lg font-semibold text-white">My Orders</h2>
             <p className="text-slate-400 mt-2 text-sm">Track and view your medicine orders.</p>
           </div>
        </Link>
        
        <Link href="/customer/cart">
           <div className="bg-[#111] p-6 rounded-xl border border-white/10 hover:border-emerald-500 transition">
             <Package className="text-emerald-500 mb-2" />
             <h2 className="text-lg font-semibold text-white">Shopping Cart</h2>
             <p className="text-slate-400 mt-2 text-sm">Check items you've added.</p>
           </div>
        </Link>

        <Link href="/customer/profile">
           <div className="bg-[#111] p-6 rounded-xl border border-white/10 hover:border-emerald-500 transition">
             <User className="text-emerald-500 mb-2" />
             <h2 className="text-lg font-semibold text-white">My Profile</h2>
             <p className="text-slate-400 mt-2 text-sm">Update your info.</p>
           </div>
        </Link>
      </div>
    </div>
  );
}