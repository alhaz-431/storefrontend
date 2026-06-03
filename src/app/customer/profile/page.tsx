"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Package, LogOut } from "lucide-react";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [orderCount, setOrderCount] = useState<number>(0);

  useEffect(() => {
    // লোকাল স্টোরেজ থেকে ইউজার ডাটা নেওয়া
    const data = localStorage.getItem("medistore_user");
    if (data) {
      const userData = JSON.parse(data);
      setUser(userData);

      // ব্যাকএন্ড থেকে অর্ডার ফেচ করা (আপনার এনভায়রনমেন্ট ভেরিয়েবল ব্যবহার করে)
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/orders`;
      
      fetch(apiUrl)
        .then((res) => res.json())
        .then((orders) => {
          // বর্তমান ইউজারের ID অনুযায়ী অর্ডার ফিল্টার করা এবং সংখ্যা বের করা
          const myOrders = orders.filter((order: any) => order.userId === userData.id);
          setOrderCount(myOrders.length);
        })
        .catch((err) => console.error("অর্ডার ফেচ করতে সমস্যা হয়েছে:", err));
    }
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading Profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#02040a] text-white p-6 lg:p-10">
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* বাম দিকের সাইডবার */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/5 border border-white/10 rounded-3xl p-6 h-fit"
        >
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-24 h-24 rounded-full bg-emerald-600 flex items-center justify-center text-3xl font-black mb-3">
              {user.name?.charAt(0) || "U"}
            </div>
            <h2 className="text-xl font-black">{user.name}</h2>
            <p className="text-xs text-slate-400">{user.role}</p>
          </div>

          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-3 text-slate-300">
              <Mail size={16} /> {user.email}
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <Phone size={16} /> {user.phone || "Not added"}
            </div>
            <div className="flex items-center gap-3 text-slate-300">
              <MapPin size={16} /> {user.address || "No address"}
            </div>
          </div>

          <button 
            onClick={() => { localStorage.removeItem("medistore_user"); window.location.href = "/login"; }}
            className="w-full mt-6 bg-red-500/10 border border-red-500/20 text-red-400 py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-red-500/20 transition"
          >
            <LogOut size={16} /> Logout
          </button>
        </motion.div>

        {/* মূল প্রোফাইল কন্টেন্ট */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-8"
          >
            <h1 className="text-3xl font-black">
              My <span className="text-emerald-500">Profile</span>
            </h1>
            <p className="text-slate-500 text-xs mt-2">Manage your account information</p>
          </motion.div>

          {/* ডাইনামিক স্ট্যাটাস কার্ড */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
              <Package className="text-emerald-500 mb-2" />
              <p className="text-xs text-slate-400">Total Orders</p>
              <p className="text-2xl font-black">{orderCount}</p>
            </div>

            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
              <User className="text-emerald-500 mb-2" />
              <p className="text-xs text-slate-400">Account Type</p>
              <p className="text-2xl font-black">{user.role}</p>
            </div>

            <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
              <Mail className="text-emerald-500 mb-2" />
              <p className="text-xs text-slate-400">Email Status</p>
              <p className="text-2xl font-black">Verified</p>
            </div>
          </div>

          {/* একাউন্ট ইনফো */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-6"
          >
            <h2 className="font-black mb-4">Account Info</h2>
            <div className="space-y-3 text-sm text-slate-300">
              <p><span className="text-slate-500">Name:</span> {user.name}</p>
              <p><span className="text-slate-500">Email:</span> {user.email}</p>
              <p><span className="text-slate-500">Role:</span> {user.role}</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}