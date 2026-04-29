"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  FiShoppingCart,
  FiActivity,
  FiMenu,
  FiX,
  FiLayout,
} from "react-icons/fi";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  // 🛡️ Vercel Build Friendly User Check
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("medistore_user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    }
  }, [pathname]);

  const dashboardPath =
    user?.role === "admin" ? "/admin/dashboard" : "/dashboard";

  // Reusable Link Component
  const navLink = (href: string, label: string) => (
    <Link
      href={href}
      onClick={() => setIsOpen(false)}
      className={`relative transition-all duration-200 hover:text-white text-[12px] font-bold uppercase tracking-widest ${
        pathname === href ? "text-emerald-500" : "text-slate-400"
      }`}
    >
      {label}
      {pathname === href && (
        <span className="absolute left-0 -bottom-2 w-full h-[2px] bg-emerald-500" />
      )}
    </Link>
  );

  return (
    <nav className="w-full h-20 bg-[#040610]/90 backdrop-blur-md border-b border-white/5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <FiActivity className="text-emerald-500 text-2xl" />
          <span className="text-xl font-black text-white italic uppercase tracking-tighter">
            Medi<span className="text-emerald-500">Store</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10">
          {navLink("/", "Home")}
          {navLink("/shop", "Shop")}

          {user ? (
            <Link
              href={dashboardPath}
              className="flex items-center gap-2 bg-white/5 px-5 py-2.5 rounded-xl border border-white/10 text-white text-[11px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
            >
              <FiLayout className="text-emerald-500" />
              Dashboard
            </Link>
          ) : (
            <div className="flex items-center gap-6 border-l border-white/10 pl-6">
              <Link href="/login" className="text-slate-400 hover:text-white text-[11px] font-bold uppercase tracking-widest transition-colors">
                Login
              </Link>
              <Link
                href="/register"
                className="bg-emerald-600 px-5 py-2.5 rounded-xl text-white text-[11px] font-bold uppercase tracking-widest hover:bg-emerald-500 shadow-lg shadow-emerald-600/20 transition-all"
              >
                Join Now
              </Link>
            </div>
          )}
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center gap-3">
          <Link href="/cart" className="relative p-2 text-slate-400 hover:text-white transition-colors">
            <FiShoppingCart size={22} />
            <span className="absolute top-1 right-1 bg-emerald-500 text-[8px] text-white w-4 h-4 rounded-full flex items-center justify-center font-bold">
              0
            </span>
          </Link>

          {/* Mobile Toggle Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-white bg-white/5 rounded-lg border border-white/10"
          >
            <FiMenu size={24} />
          </button>
        </div>
      </div>

      {/* Mobile Menu (FULL SCREEN) */}
      <div
        className={`md:hidden fixed top-0 left-0 w-full h-screen bg-[#040610] z-[60] transition-transform duration-500 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close Button inside Mobile Menu */}
        <button 
          onClick={() => setIsOpen(false)}
          className="absolute top-6 right-6 text-white p-2 bg-white/5 rounded-full border border-white/10"
        >
          <FiX size={28} />
        </button>

        <div className="p-8 flex flex-col gap-8 mt-24">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.3em]">Navigation</p>
          
          <div className="flex flex-col gap-6 text-2xl font-black italic uppercase tracking-tight">
            {navLink("/", "Home")}
            {navLink("/shop", "Shop")}
          </div>

          <div className="h-[1px] bg-white/5 my-4" />

          {user ? (
            <Link
              href={dashboardPath}
              onClick={() => setIsOpen(false)}
              className="w-full bg-emerald-600 text-center py-5 rounded-2xl text-white font-black uppercase text-xs tracking-widest shadow-xl shadow-emerald-600/20"
            >
              Go to Dashboard
            </Link>
          ) : (
            <div className="flex flex-col gap-4">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-5 rounded-2xl bg-white/5 border border-white/10 text-white font-black uppercase text-xs tracking-widest"
              >
                Login
              </Link>

              <Link
                href="/register"
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-5 rounded-2xl bg-emerald-600 text-white font-black uppercase text-xs tracking-widest"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}