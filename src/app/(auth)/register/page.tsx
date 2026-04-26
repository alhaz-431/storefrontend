"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { FiMail, FiLock, FiUser, FiArrowRight, FiCheckCircle } from "react-icons/fi";

export default function RegisterPage() {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer" // ডিফল্ট রোল কাস্টমার
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // আপাতত সরাসরি লগইন করিয়ে দিচ্ছি (পরে ব্যাকএন্ড কানেক্ট করবো)
    login({ 
      id: Math.random().toString(), 
      name: formData.name, 
      email: formData.email, 
      role: formData.role 
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20">
      <div className="max-w-md w-full bg-[#0d111c] border border-white/5 p-10 rounded-[40px] shadow-2xl shadow-blue-600/5 relative overflow-hidden">
        
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-[50px] rounded-full -mr-16 -mt-16" />

        <div className="text-center mb-10 relative z-10">
          <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">
            Join <span className="text-blue-600">MediStore</span>
          </h2>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-2">Create your account to start shopping</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          {/* Full Name */}
          <div className="relative">
            <FiUser className="absolute left-5 top-5 text-slate-600" />
            <input 
              type="text" placeholder="Full Name" required
              className="w-full bg-white/5 border border-white/5 px-12 py-5 rounded-2xl text-white outline-none focus:border-blue-600 transition-all placeholder:text-slate-600"
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          {/* Email */}
          <div className="relative">
            <FiMail className="absolute left-5 top-5 text-slate-600" />
            <input 
              type="email" placeholder="Email Address" required
              className="w-full bg-white/5 border border-white/5 px-12 py-5 rounded-2xl text-white outline-none focus:border-blue-600 transition-all placeholder:text-slate-600"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <FiLock className="absolute left-5 top-5 text-slate-600" />
            <input 
              type="password" placeholder="Create Password" required
              className="w-full bg-white/5 border border-white/5 px-12 py-5 rounded-2xl text-white outline-none focus:border-blue-600 transition-all placeholder:text-slate-600"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          {/* Role Selection (Optional but good for your project) */}
          <div className="grid grid-cols-2 gap-3">
             <button 
               type="button"
               onClick={() => setFormData({...formData, role: "customer"})}
               className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${formData.role === 'customer' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white/5 border-white/10 text-slate-500'}`}
             >
               Customer
             </button>
             <button 
               type="button"
               onClick={() => setFormData({...formData, role: "seller"})}
               className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${formData.role === 'seller' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white/5 border-white/10 text-slate-500'}`}
             >
               Seller
             </button>
          </div>
          
          <button type="submit" className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-white hover:text-blue-600 transition-all shadow-xl shadow-blue-600/20 active:scale-95">
            Register Now <FiArrowRight size={18} />
          </button>
        </form>

        <p className="text-center mt-8 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
          Already have an account? <Link href="/login" className="text-blue-500 hover:underline">Login Here</Link>
        </p>
      </div>
    </div>
  );
}