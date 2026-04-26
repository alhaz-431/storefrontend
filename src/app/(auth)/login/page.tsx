"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // আপাতত ডামি ডাটা দিয়ে লগইন করাচ্ছি
    login({ id: "1", name: "Alfaz ARbby", email, role: "seller" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-[#0d111c] border border-white/5 p-10 rounded-[40px] shadow-2xl shadow-blue-600/5">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Welcome <span className="text-blue-600">Back</span></h2>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-2">Login to your medistore account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <FiMail className="absolute left-5 top-5 text-slate-600" />
            <input 
              type="email" placeholder="Email Address" required
              className="w-full bg-white/5 border border-white/5 px-12 py-5 rounded-2xl text-white outline-none focus:border-blue-600 transition-all"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="relative">
            <FiLock className="absolute left-5 top-5 text-slate-600" />
            <input 
              type="password" placeholder="Password" required
              className="w-full bg-white/5 border border-white/5 px-12 py-5 rounded-2xl text-white outline-none focus:border-blue-600 transition-all"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-white hover:text-blue-600 transition-all">
            Sign In <FiArrowRight size={18} />
          </button>
        </form>

        <p className="text-center mt-8 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
          Don't have an account? <Link href="/register" className="text-blue-500 hover:underline">Register Now</Link>
        </p>
      </div>
    </div>
  );
}