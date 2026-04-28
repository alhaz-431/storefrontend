"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  ShoppingBag, 
  Package, 
  User, 
  LayoutDashboard, 
  LogOut, 
  Menu, 
  X 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { name: "Cart", href: "/cart", icon: ShoppingBag },
  { name: "My Orders", href: "/orders", icon: Package },
  { name: "Profile", href: "/profile", icon: User },
];

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-[#02040a] text-white flex">
      {/* --- Desktop Sidebar --- */}
      <aside className="hidden lg:flex w-72 border-r border-white/5 flex-col p-8 bg-[#02040a] sticky top-0 h-screen">
        <div className="mb-12 px-4">
          <Link href="/">
            <h1 className="text-2xl font-black italic uppercase tracking-tighter">
              Medi<span className="text-emerald-500">Store</span>
            </h1>
            <p className="text-[8px] text-slate-500 uppercase font-black tracking-[0.3em]">Customer Portal</p>
          </Link>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group ${
                  isActive 
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/20" 
                    : "text-slate-500 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon size={20} className={isActive ? "text-white" : "group-hover:text-emerald-500"} />
                <span className="text-xs font-black uppercase tracking-widest">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-4 px-6 py-4 rounded-2xl text-slate-600 hover:bg-red-500/10 hover:text-red-500 transition-all mt-auto border border-transparent hover:border-red-500/20"
        >
          <LogOut size={20} />
          <span className="text-xs font-black uppercase tracking-widest">Logout</span>
        </button>
      </aside>

      {/* --- Main Content Area --- */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden p-6 flex justify-between items-center border-b border-white/5 bg-[#02040a]/80 backdrop-blur-md sticky top-0 z-40">
          <h1 className="text-xl font-black italic uppercase">Medi<span className="text-emerald-500">Store</span></h1>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 bg-white/5 rounded-xl"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>

        <div className="flex-1">
          {children}
        </div>
      </main>

      {/* --- Mobile Nav Overlay --- */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="fixed inset-0 z-50 bg-[#02040a] p-10 lg:hidden flex flex-col"
          >
            <div className="flex justify-between items-center mb-20">
              <h1 className="text-2xl font-black italic uppercase">Medi<span className="text-emerald-500">Store</span></h1>
              <button onClick={() => setIsMobileMenuOpen(false)}><X size={32}/></button>
            </div>

            <nav className="space-y-6 flex-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-6 text-2xl font-black italic uppercase tracking-tighter text-slate-500 hover:text-emerald-500"
                >
                  <item.icon size={28} />
                  {item.name}
                </Link>
              ))}
            </nav>

            <button 
              onClick={handleLogout}
              className="mt-auto flex items-center gap-4 text-red-500 font-black uppercase tracking-widest"
            >
              <LogOut size={24} /> Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}