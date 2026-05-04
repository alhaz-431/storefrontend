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
                    ? "bg-emerald-600 text-white"
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
          className="flex items-center gap-3 text-red-500 text-xs font-bold mt-auto hover:bg-red-500/10 p-3 rounded-xl"
        >
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* MAIN AREA */}
      <main className="flex-1 flex flex-col">

        {/* MOBILE HEADER */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-white/10">
          <h1 className="font-black italic">
            Medi<span className="text-emerald-500">Store</span>
          </h1>

          <button onClick={() => setOpen(true)}>
            <Menu />
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
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="fixed inset-0 bg-[#02040a] z-50 p-6 lg:hidden"
          >
            <button onClick={() => setOpen(false)} className="mb-8">
              <X />
            </button>

            <nav className="space-y-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-4 text-lg font-bold text-slate-400"
                >
                  <item.icon />
                  {item.name}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}