"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiArrowRight } from "react-icons/fi";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const toastId = toast.loading("Verifying credentials...");

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
        "https://storemedistore.onrender.com/api";

      const res = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      const token = data.token || data.accessToken || data.data?.token;
      const user = data.user || data.data?.user;

      if (!token || !user) {
        throw new Error("Invalid response from server");
      }

      // ✅ Token save (API use এর জন্য)
      localStorage.setItem("token", token);

      // ⚠️ Cookie optional (middleware থাকলে দরকার)
      document.cookie = `token=${token}; path=/; SameSite=Lax`;

      // ✅ User save
      localStorage.setItem("medistore_user", JSON.stringify(user));

      // ✅ Context update
      login(user);

      toast.success(`Welcome back, ${user?.name || "User"}!`, {
        id: toastId,
      });

      // 🔥 ROLE FIX (100% safe)
      const role = user?.role?.toUpperCase()?.trim();

      setTimeout(() => {
        if (role === "ADMIN") {
          router.replace("/admin/dashboard");
        } else if (role === "SELLER") {
          router.replace("/seller/dashboard");
        } else if (role === "CUSTOMER") {
          router.replace("/customer/dashboard");
        } else {
          router.replace("/");
        }
      }, 800);

    } catch (error: any) {
      toast.error(error.message || "Something went wrong!", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#040610] relative overflow-hidden">

      {/* 🌊 WATER WAVE */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg
          className="w-[200%] h-40 animate-wave"
          viewBox="0 0 1440 320"
        >
          <path
            fill="#2563eb20"
            d="M0,192L60,181.3C120,171,240,149,360,144C480,139,600,149,720,165.3C840,181,960,203,1080,202.7C1200,203,1320,181,1380,170.7L1440,160V320H0Z"
          />
        </svg>
      </div>

      {/* 💊 Floating Icons */}
      <motion.div
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity }}
        className="absolute left-5 top-10 text-blue-500 text-3xl opacity-20"
      >
        💊
      </motion.div>

      <motion.div
        animate={{ y: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity }}
        className="absolute right-10 bottom-20 text-blue-400 text-4xl opacity-20"
      >
        🏥
      </motion.div>

      {/* 🔥 LOGIN CARD */}
      <div className="max-w-md w-full bg-[#0d111c] border border-white/10 p-6 md:p-10 rounded-[30px] shadow-2xl z-10">

        <div className="text-center mb-8">
          <h2 className="text-3xl font-black text-white italic uppercase">
            Medi<span className="text-blue-600">Store</span>
          </h2>
          <p className="text-slate-500 text-xs uppercase mt-2">
            Login to your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">

          <div className="relative">
            <FiMail className="absolute left-4 top-4 text-slate-500" />
            <input
              type="email"
              placeholder="Email"
              required
              className="w-full bg-white/5 border border-white/10 px-10 py-4 rounded-xl text-white outline-none focus:border-blue-600"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="relative">
            <FiLock className="absolute left-4 top-4 text-slate-500" />
            <input
              type="password"
              placeholder="Password"
              required
              className="w-full bg-white/5 border border-white/10 px-10 py-4 rounded-xl text-white outline-none focus:border-blue-600"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-500 transition disabled:opacity-50"
          >
            {loading ? "Signing In..." : "Sign In"} <FiArrowRight />
          </button>

        </form>

        <div className="text-center mt-6">
          <p className="text-slate-500 text-xs">
            Don’t have an account?{" "}
            <Link href="/register" className="text-blue-500 underline">
              Register
            </Link>
          </p>
        </div>
      </div>

      {/* 🌊 CSS */}
      <style jsx>{`
        .animate-wave {
          animation: wave 10s linear infinite;
        }
        @keyframes wave {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}