"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, ShoppingCart, User, Package } from "lucide-react";
import { motion } from "framer-motion";

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
      <div className="flex items-center justify-center h-full text-emerald-500 font-bold">
        Loading MediStore...
      </div>
    );
  }

  return (
    <div className="p-8 lg:p-12">
      {/* ওয়েলকাম সেকশন */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-black mb-3">
          Welcome back, <span className="text-emerald-500">{user?.name}</span> 👋
        </h1>
        <p className="text-slate-500 text-lg mb-10">Manage your health and orders from one place.</p>
      </motion.div>

      {/* কার্ড গ্রিড - অ্যানিমেশনসহ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1 */}
        <motion.div 
          whileHover={{ scale: 1.03 }}
          className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-emerald-500/50 transition cursor-pointer"
        >
          <div className="text-emerald-500 mb-4"><Package size={28} /></div>
          <h2 className="text-xl font-bold">My Orders</h2>
          <p className="text-slate-400 mt-2 text-sm">Track and view your medicine orders.</p>
        </motion.div>

        {/* Card 2 */}
        <motion.div 
          whileHover={{ scale: 1.03 }}
          className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-blue-500/50 transition cursor-pointer"
        >
          <div className="text-blue-500 mb-4"><ShoppingCart size={28} /></div>
          <h2 className="text-xl font-bold">Shopping Cart</h2>
          <p className="text-slate-400 mt-2 text-sm">Check items you've added to buy.</p>
        </motion.div>

        {/* Card 3 */}
        <motion.div 
          whileHover={{ scale: 1.03 }}
          className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-purple-500/50 transition cursor-pointer"
        >
          <div className="text-purple-500 mb-4"><User size={28} /></div>
          <h2 className="text-xl font-bold">My Profile</h2>
          <p className="text-slate-400 mt-2 text-sm">Update your address and info.</p>
        </motion.div>

      </div>
    </div>
  );
}