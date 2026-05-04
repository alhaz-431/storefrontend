"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ShoppingBag, Package, User } from "lucide-react";

export default function CustomerHome() {
  return (
    <div className="p-6 lg:p-10">

      <h1 className="text-3xl font-black italic">
        Welcome to <span className="text-emerald-500">MediStore</span>
      </h1>

      <p className="text-slate-500 text-sm mt-2">
        Customer Dashboard Overview
      </p>

      {/* QUICK ACTION CARDS */}
      <div className="grid md:grid-cols-3 gap-6 mt-10">

        <Link href="/customer/cart">
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-white/5 p-6 rounded-2xl border border-white/10"
          >
            <ShoppingBag className="text-emerald-500" />
            <h2 className="font-bold mt-4">Cart</h2>
          </motion.div>
        </Link>

        <Link href="/customer/orders">
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-white/5 p-6 rounded-2xl border border-white/10"
          >
            <Package className="text-emerald-500" />
            <h2 className="font-bold mt-4">Orders</h2>
          </motion.div>
        </Link>

        <Link href="/customer/profile">
          <motion.div
            whileHover={{ scale: 1.03 }}
            className="bg-white/5 p-6 rounded-2xl border border-white/10"
          >
            <User className="text-emerald-500" />
            <h2 className="font-bold mt-4">Profile</h2>
          </motion.div>
        </Link>

      </div>
    </div>
  );
}