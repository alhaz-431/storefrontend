"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiUser, FiArrowRight, FiShield } from "react-icons/fi";
import { toast } from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const toastId = toast.loading("Creating your account...");

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ||
        "https://storemedistore.onrender.com/api";

      const res = await fetch(`${baseUrl}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          role: formData.role.toUpperCase(),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // ❌ token save REMOVE করা হয়েছে

        toast.success("Registration Successful 🎉", { id: toastId });

        // ✅ সব user login page এ যাবে
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        toast.error(data.message || "Registration failed!", { id: toastId });
      }
    } catch (error) {
      toast.error("Network error!", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const containerVars = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 },
    },
  };

  const itemVars = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 md:px-6 py-10 md:py-20 relative overflow-hidden bg-[#040610]">
      
      {/* 🔥 Floating Medical Animation */}
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

      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 12, repeat: Infinity }}
        className="absolute top-[-10%] right-[-5%] w-[300px] md:w-[400px] h-[300px] md:h-[400px] bg-blue-600/10 rounded-full blur-[100px]"
      />

      <motion.div
        variants={containerVars}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md bg-white/[0.03] backdrop-blur-xl border border-white/10 p-6 md:p-10 rounded-[32px] md:rounded-[48px] shadow-2xl relative z-10"
      >
        {/* 🔥 Header */}
        <div className="text-center mb-8 md:mb-10">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-14 h-14 md:w-16 md:h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center mx-auto mb-5 border border-blue-500/30"
          >
            <FiShield className="text-blue-500 text-2xl md:text-3xl" />
          </motion.div>

          <h2 className="text-2xl md:text-4xl font-black text-white italic uppercase">
            Create <span className="text-blue-600">Account</span>
          </h2>

          <p className="text-slate-500 text-[10px] md:text-xs font-bold uppercase tracking-widest mt-2">
            MediStore Registration
          </p>
        </div>

        {/* 🔥 Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { id: "name", icon: <FiUser />, placeholder: "Full Name", type: "text" },
            { id: "email", icon: <FiMail />, placeholder: "Email Address", type: "email" },
            { id: "password", icon: <FiLock />, placeholder: "Password", type: "password" },
          ].map((field) => (
            <motion.div key={field.id} variants={itemVars} className="relative group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500">
                {field.icon}
              </div>

              <input
                type={field.type}
                placeholder={field.placeholder}
                required
                className="w-full bg-white/5 border border-white/10 px-10 py-4 rounded-xl text-white outline-none focus:border-blue-600/50 focus:bg-blue-600/5 placeholder:text-slate-600 text-sm"
                onChange={(e) =>
                  setFormData({ ...formData, [field.id]: e.target.value })
                }
              />
            </motion.div>
          ))}

          {/* 🔥 Role নির্বাচন */}
          <motion.div variants={itemVars} className="grid grid-cols-3 gap-2 pt-2">
            {["customer", "seller", "admin"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setFormData({ ...formData, role: r })}
                className={`py-2 md:py-3 rounded-xl text-[9px] md:text-[10px] font-bold uppercase tracking-widest border transition-all ${
                  formData.role === r
                    ? "bg-blue-600 border-blue-500 text-white"
                    : "bg-white/5 border-white/10 text-slate-500"
                }`}
              >
                {r}
              </button>
            ))}
          </motion.div>

          {/* 🔥 Submit */}
          <motion.button
            variants={itemVars}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-bold text-sm tracking-widest flex items-center justify-center gap-2 mt-5 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Register"} <FiArrowRight />
          </motion.button>
        </form>

        {/* 🔥 Footer */}
        <motion.p className="text-center mt-8 text-slate-500 text-[10px] md:text-xs font-bold uppercase tracking-widest">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-500 hover:text-white underline">
            Login
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
}