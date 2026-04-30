"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X, Pill, LayoutDashboard, Home, Store, Layers3, LogIn, UserPlus, LogOut } from "lucide-react";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
      }
    };
    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("medistore_user");
    setIsLoggedIn(false);
    setIsMenuOpen(false);
    router.push("/");
  };

  const navLinks = [
    { name: "Home", href: "/", icon: <Home size={16} /> },
    { name: "Shop", href: "/shop", icon: <Store size={16} /> },
    { name: "Categories", href: "/categories", icon: <Layers3 size={16} /> },
    { name: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={16} /> },
  ];

  return (
    <nav className="sticky top-0 w-full bg-[#02040a]/90 backdrop-blur-md border-b border-white/10 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Left: Logo */}
        <Link href="/" className="flex items-center gap-2 text-2xl font-black italic text-white">
          <Pill className="text-emerald-500" size={28} />
          MEDI<span className="text-emerald-500">STORE</span>
        </Link>

        {/* Center: Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="flex items-center gap-2 text-xs font-bold uppercase text-slate-300 hover:text-emerald-500 transition-colors">
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right: Cart & Auth (Desktop) */}
        <div className="hidden md:flex items-center gap-6">
          <Link href="/cart" className="text-white hover:text-emerald-500 transition-colors relative">
            <ShoppingCart size={20} />
          </Link>
          
          {isLoggedIn ? (
            <button onClick={handleLogout} className="text-xs font-bold uppercase text-red-500 hover:text-red-400 flex items-center gap-2">
              <LogOut size={16} /> Logout
            </button>
          ) : (
            <>
              <Link href="/login" className="text-xs font-bold uppercase text-white hover:text-emerald-500">Login</Link>
              <Link href="/register" className="bg-white text-black px-4 py-2 rounded-lg text-xs font-black hover:bg-emerald-500 hover:text-white transition-all">Register</Link>
            </>
          )}
        </div>

        {/* Mobile: Cart & Menu Toggle */}
        <div className="md:hidden flex items-center gap-4 text-white">
          <Link href="/cart"><ShoppingCart size={20} /></Link>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-[#02040a] border-t border-white/10 p-6 flex flex-col gap-6"
          >
            {navLinks.map((link) => (
              <Link key={link.name} href={link.href} onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-sm font-bold uppercase text-white">
                {link.icon} {link.name}
              </Link>
            ))}
            <div className="h-px bg-white/10" />
            {isLoggedIn ? (
              <button onClick={handleLogout} className="flex items-center gap-3 text-sm font-bold uppercase text-red-500">
                <LogOut size={18} /> Logout
              </button>
            ) : (
              <>
                <Link href="/login" onClick={() => setIsMenuOpen(false)} className="text-sm font-bold uppercase text-white">Login</Link>
                <Link href="/register" onClick={() => setIsMenuOpen(false)} className="bg-emerald-500 text-center py-3 rounded-lg text-sm font-black text-white">Register</Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}