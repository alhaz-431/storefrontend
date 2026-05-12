"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ShoppingBag,
  Package,
  User,
  Home,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Toaster } from "react-hot-toast"; // ১. এটা ইমপোর্ট করুন

const navItems = [
  { name: "Home", href: "/customer", icon: Home },
  { name: "Cart", href: "/customer/cart", icon: ShoppingBag },
  { name: "Orders", href: "/customer/orders", icon: Package },
  { name: "Profile", href: "/customer/profile", icon: User },
];

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const logout = () => {
    localStorage.clear();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#02040a] text-white flex">
      {/* ২. Toaster কম্পোনেন্টটি এখানে বসিয়ে দিন */}
      <Toaster 
        position="top-center" 
        reverseOrder={false}
        toastOptions={{
          style: {
            background: '#0a2e26',
            color: '#fff',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            fontSize: '12px',
            textTransform: 'uppercase',
            fontWeight: 'bold'
          }
        }}
      />

      {/* SIDEBAR DESKTOP */}
      <aside className="hidden lg:flex w-72 flex-col border-r border-white/10 p-6 sticky top-0 h-screen">
        <Link href="/customer" className="mb-10">
          <h1 className="text-2xl font-black italic">
            Medi<span className="text-emerald-500">Store</span>
          </h1>
          <p className="text-[10px] text-slate-500 tracking-widest">
            CUSTOMER DASHBOARD
          </p>
        </Link>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition ${
                  active
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                    : "text-slate-500 hover:bg-white/5"
                }`}
              >
                <item.icon size={18} />
                <span className="text-xs font-bold uppercase tracking-widest">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>

        <button
          onClick={logout}
          className="flex items-center gap-3 text-red-500 text-[10px] font-black uppercase tracking-widest mt-auto hover:bg-red-500/10 p-4 rounded-2xl transition-all"
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* MAIN AREA */}
      <main className="flex-1 flex flex-col">
        {/* MOBILE HEADER */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-white/10 bg-[#02040a]/80 backdrop-blur-md sticky top-0 z-40">
          <h1 className="font-black italic text-xl">
            Medi<span className="text-emerald-500">Store</span>
          </h1>
          <button onClick={() => setOpen(true)} className="p-2 bg-white/5 rounded-xl">
            <Menu size={20} />
          </button>
        </div>

        {/* PAGE ANIMATION WRAPPER */}
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex-1"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* MOBILE SIDEBAR */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-[80%] bg-[#051a14] z-[60] p-8 lg:hidden border-r border-white/10"
            >
              <div className="flex justify-between items-center mb-12">
                <h1 className="font-black italic text-2xl">
                  Medi<span className="text-emerald-500">Store</span>
                </h1>
                <button onClick={() => setOpen(false)} className="p-2 bg-white/5 rounded-xl">
                  <X size={20} />
                </button>
              </div>

              <nav className="space-y-4">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-4 p-4 rounded-2xl text-sm font-black uppercase tracking-widest ${
                      pathname === item.href ? "bg-emerald-500 text-black" : "text-white/40 bg-white/5"
                    }`}
                  >
                    <item.icon size={20} />
                    {item.name}
                  </Link>
                ))}
              </nav>

              <button
                onClick={logout}
                className="flex items-center gap-4 text-red-500 text-sm font-black uppercase tracking-widest absolute bottom-10 left-8"
              >
                <LogOut size={20} /> Logout
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}