"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading("Verifying credentials...");

    try {
      // API URL ঠিক করা
      const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "https://storemedistore.onrender.com/api";
      
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // ১. টোকেনটি লোকাল স্টোরেজে সেভ করা (যাতে Add/Delete কাজ করে)
        if (data.token) {
          localStorage.setItem("token", data.token);
        } else if (data.accessToken) {
          // যদি ব্যাকএন্ড থেকে accessToken নামে আসে
          localStorage.setItem("token", data.accessToken);
        }

        // ২. ইউজারের ডাটা কনটেক্সটে সেভ করা
        login(data.user); 
        toast.success(`Welcome back, ${data.user.name}!`, { id: toastId });

        // ৩. রোল অনুযায়ী সঠিক পেজে পাঠানো
        const userRole = data.user.role?.toUpperCase(); // বড় হাতের অক্ষরে চেক করা নিরাপদ
        
        if (userRole === "ADMIN") {
          router.push("/admin/dashboard");
        } else if (userRole === "SELLER") {
          router.push("/seller/dashboard");
        } else {
          router.push("/"); // কাস্টমার হলে হোমে
        }

      } else {
        toast.error(data.message || "Invalid Email or Password!", { id: toastId });
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Network error! Server may be sleeping. Please try again.", { id: toastId });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-[#040610]">
      <div className="max-w-md w-full bg-[#0d111c] border border-white/5 p-10 rounded-[40px] shadow-2xl shadow-blue-600/5">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">
            Welcome <span className="text-blue-600">Back</span>
          </h2>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-2">
            Login to your medistore account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative group">
            <FiMail className="absolute left-5 top-5 text-slate-600 group-focus-within:text-blue-600 transition-colors" />
            <input 
              type="email" 
              placeholder="Email Address" 
              required
              className="w-full bg-white/5 border border-white/5 px-12 py-5 rounded-2xl text-white outline-none focus:border-blue-600 transition-all font-medium"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="relative group">
            <FiLock className="absolute left-5 top-5 text-slate-600 group-focus-within:text-blue-600 transition-colors" />
            <input 
              type="password" 
              placeholder="Password" 
              required
              className="w-full bg-white/5 border border-white/5 px-12 py-5 rounded-2xl text-white outline-none focus:border-blue-600 transition-all font-medium"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest flex items-center justify-center gap-2 hover:bg-white hover:text-blue-600 transition-all active:scale-95 shadow-lg shadow-blue-600/20"
          >
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