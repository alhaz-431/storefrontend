"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ShoppingBag, Package, User } from "lucide-react";

export default function CustomerDashboard() {
  return (
    <div className="p-6 lg:p-10">
      {/* শুধুমাত্র মেইন কন্টেন্টের হেডার */}
      <h1 className="text-3xl font-black italic text-white">
        Welcome to <span className="text-emerald-500">MediStore</span>
      </h1>

      <p className="text-slate-500 text-sm mt-2">
        Customer Dashboard Overview
      </p>

      {/* কন্টেন্টের কার্ডগুলো - এগুলো লেআউটের সাইডবারের পাশে দেখাবে */}
      <div className="grid md:grid-cols-3 gap-6 mt-10">
        
        <Link href="/customer/cart">
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-emerald-500 transition cursor-pointer"
          >
            <ShoppingBag className="text-emerald-500" />
            <h2 className="font-bold mt-4 text-white">Cart</h2>
            <p className="text-sm text-slate-400">View your selected items</p>
          </motion.div>
        </Link>

        <Link href="/customer/orders">
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-emerald-500 transition cursor-pointer"
          >
            <Package className="text-emerald-500" />
            <h2 className="font-bold mt-4 text-white">Orders</h2>
            <p className="text-sm text-slate-400">Track your recent orders</p>
          </motion.div>
        </Link>

        <Link href="/customer/profile">
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-emerald-500 transition cursor-pointer"
          >
            <User className="text-emerald-500" />
            <h2 className="font-bold mt-4 text-white">Profile</h2>
            <p className="text-sm text-slate-400">Update your account info</p>
          </motion.div>
        </Link>

      </div>
    </div>
  );
}