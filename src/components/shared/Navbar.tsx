"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X, Pill, LayoutDashboard, Home, Store, Layers3, LogOut, User } from "lucide-react";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const checkData = () => {
      const token = localStorage.getItem("token");
      const cart = JSON.parse(localStorage.getItem("medistore_cart") || "[]");
      const user = JSON.parse(localStorage.getItem("medistore_user") || "{}");

      setIsLoggedIn(!!token);
      setIsAdmin(user?.role === "ADMIN");
      setCartCount(cart.length);
    };

    checkData();
    window.addEventListener("storage", checkData);
    return () => window.removeEventListener("storage", checkData);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("medistore_user");
    setIsMenuOpen(false);
    window.location.reload();
  };

  const handleDashboard = () => {
    const user = JSON.parse(localStorage.getItem("medistore_user") || "{}");
    const role = (user?.role || "").toUpperCase();
    setIsMenuOpen(false);
    if (role === "ADMIN") router.push("/admin/dashboard");
    else if (role === "SELLER") router.push("/seller/dashboard");
    else router.push("/customer/dashboard");
  };

  const navLinks = [
    { name: "Home", href: "/", icon: <Home size={18} /> },
    { name: "Shop", href: "/shop", icon: <Store size={18} /> },
    ...(isAdmin ? [{ name: "Categories", href: "/admin/categories", icon: <Layers3 size={18} /> }] : []),
  ];

  return (
    <nav className="sticky top-0 w-full bg-[#02040a]/90 backdrop-blur-md border-b border-white/10 z-[100]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between h-16">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 text-xl font-black italic text-white z-[110]">
          <Pill className="text-emerald-500" size={26} /> MEDI<span className="text-emerald-500">STORE</span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-300 hover:text-emerald-500 tracking-widest transition-all">
              {link.icon} {link.name}
            </Link>
          ))}
          {isLoggedIn && (
            <button onClick={handleDashboard} className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-300 hover:text-emerald-500 tracking-widest transition-all">
              <LayoutDashboard size={16} /> Dashboard
            </button>
          )}
        </div>

        {/* DESKTOP & MOBILE RIGHT SECTION */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Cart Icon - Always Visible */}
          <Link href="/cart" className="relative text-white hover:text-emerald-500 transition-colors p-2 z-[110]">
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 bg-emerald-500 text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full text-white">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Desktop Auth */}
          <div className="hidden md:block">
            {isLoggedIn ? (
              <button onClick={handleLogout} className="text-[10px] font-black uppercase text-red-500 hover:text-red-400 tracking-widest">Logout</button>
            ) : (
              <Link href="/login" className="text-[10px] font-black uppercase text-white hover:text-emerald-500 tracking-widest">Login</Link>
            )}
          </div>

          {/* Hamburger Menu Button - Mobile Only */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white p-2 z-[110] hover:text-emerald-500 transition-colors"
          >
            {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU OVERLAY */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-0 left-0 w-full bg-[#05070f] z-[105] flex flex-col pt-24 px-6 overflow-hidden md:hidden"
          >
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-4 text-xl font-black italic uppercase text-white hover:text-emerald-500"
                >
                  <span className="p-3 bg-white/5 rounded-2xl text-emerald-500">{link.icon}</span>
                  {link.name}
                </Link>
              ))}
              
              {isLoggedIn && (
                <button 
                  onClick={handleDashboard}
                  className="flex items-center gap-4 text-xl font-black italic uppercase text-white hover:text-emerald-500 text-left"
                >
                  <span className="p-3 bg-white/5 rounded-2xl text-emerald-500"><LayoutDashboard size={18} /></span>
                  Dashboard
                </button>
              )}

              <hr className="border-white/5 my-4" />

              {isLoggedIn ? (
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-4 text-xl font-black italic uppercase text-red-500"
                >
                  <span className="p-3 bg-red-500/10 rounded-2xl"><LogOut size={18} /></span>
                  Logout
                </button>
              ) : (
                <Link 
                  href="/login" 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-4 text-xl font-black italic uppercase text-emerald-500"
                >
                  <span className="p-3 bg-emerald-500/10 rounded-2xl"><User size={18} /></span>
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}