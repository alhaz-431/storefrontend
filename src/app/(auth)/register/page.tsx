"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiUser, FiArrowRight, FiShield } from "react-icons/fi";
import { toast } from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer" 
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading("Creating your account...");

    try {
      // API URL ঠিক করা (প্রয়োজনে সরাসরি Render URL ব্যবহার করা হয়েছে)
      const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "https://storemedistore.onrender.com/api";
      
      const res = await fetch(`${baseUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          role: formData.role.toUpperCase() // ব্যাকএন্ডের জন্য রোল বড় হাতের করা হলো
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ রেজিস্ট্রেশন সফল হলে টোকেনটি লোকাল স্টোরেজে সেভ করা (সবচেয়ে জরুরি)
        const authToken = data.token || data.accessToken;
        if (authToken) {
          localStorage.setItem("token", authToken);
        }

        toast.success(data.message || "Registration Successful!", { id: toastId });
        
        // সেলার হলে সরাসরি ড্যাশবোর্ডে পাঠানো, অন্যথায় লগইন পেজে
        setTimeout(() => {
          if (formData.role === "seller") {
            router.push("/seller/dashboard");
          } else {
            router.push("/login");
          }
        }, 1500);
      } else {
        // ব্যাকএন্ড থেকে আসা আসল এরর মেসেজটি দেখা যাবে
        toast.error(data.message || "Registration failed!", { id: toastId });
      }
    } catch (error) {
      console.error("Register Error:", error);
      toast.error("Network error! Make sure your server is active.", { id: toastId });
    }
  };

  const containerVars = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 }
    }
  };

  const itemVars = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-20 relative overflow-hidden bg-[#040610]">
      <motion.div 
        animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
        transition={{ duration: 20, repeat: Infinity }}
        className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px]" 
      />
      
      <motion.div 
        variants={containerVars}
        initial="hidden"
        animate="visible"
        className="max-w-md w-full bg-white/[0.02] backdrop-blur-xl border border-white/10 p-10 rounded-[48px] shadow-3xl relative z-10"
      >
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-500/30"
          >
            <FiShield className="text-blue-500 text-3xl" />
          </motion.div>
          <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">
            Create <span className="text-blue-600">Account</span>
          </h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mt-3">Start your journey with MediStore</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { id: 'name', icon: <FiUser />, placeholder: 'Full Name', type: 'text' },
            { id: 'email', icon: <FiMail />, placeholder: 'Email Address', type: 'email' },
            { id: 'password', icon: <FiLock />, placeholder: 'Secure Password', type: 'password' },
          ].map((field) => (
            <motion.div key={field.id} variants={itemVars} className="relative group">
              <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-blue-500 transition-colors">
                {field.icon}
              </div>
              <input 
                type={field.type}
                placeholder={field.placeholder}
                required
                className="w-full bg-white/5 border border-white/10 px-12 py-5 rounded-[20px] text-white outline-none focus:border-blue-600/50 focus:bg-blue-600/5 transition-all placeholder:text-slate-700 font-medium"
                onChange={(e) => setFormData({...formData, [field.id]: e.target.value})}
              />
            </motion.div>
          ))}

          <motion.div variants={itemVars} className="grid grid-cols-3 gap-2 pt-2">
             {['customer', 'seller', 'admin'].map((r) => (
               <button 
                 key={r}
                 type="button"
                 onClick={() => setFormData({...formData, role: r})}
                 className={`py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
                   formData.role === r 
                   ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-600/20' 
                   : 'bg-white/5 border-white/10 text-slate-500 hover:border-white/20'
                 }`}
               >
                 {r}
               </button>
             ))}
          </motion.div>
          
          <motion.button 
            variants={itemVars}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-[20px] font-black uppercase text-[11px] tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-900/20 mt-6"
          >
            Join the Community <FiArrowRight size={18} />
          </motion.button>
        </form>

        <motion.p 
          variants={itemVars}
          className="text-center mt-10 text-slate-500 text-[10px] font-black uppercase tracking-widest"
        >
          Already a member? <Link href="/login" className="text-blue-500 hover:text-white transition-colors underline-offset-4 underline">Sign In</Link>
        </motion.p>
      </motion.div>
    </div>
  );
}