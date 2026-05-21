"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X, Pill, LayoutDashboard, Home, Store, Layers3, LogOut, User } from "lucide-react";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkData = () => {
      try {
        const token = localStorage.getItem("token");
        const userStr = localStorage.getItem("medistore_user");
        const cartStr = localStorage.getItem("medistore_cart");

        // 🛡️ নিখুঁত লগইন ভ্যালিডেশন চেক
        if (token && userStr) {
          const user = JSON.parse(userStr);
          if (user && user.role) {
            setIsLoggedIn(true);
            setIsAdmin(user.role.toUpperCase() === "ADMIN");
          } else {
            setIsLoggedIn(false);
            setIsAdmin(false);
          }
        } else {
          // 🎯 পরিবর্তন ১: টোকেন বা ইউজার না থাকলে স্টেট সাথে সাথে ফলস হবে (ড্যাশবোর্ড হাইড হবে)
          setIsLoggedIn(false);
          setIsAdmin(false);
        }

        // 🛒 ডায়নামিক কার্ট কাউন্ট ভ্যালিডেশন
        if (cartStr) {
          const cart = JSON.parse(cartStr);
          if (Array.isArray(cart) && cart.length > 0) { // 🎯 পরিবর্তন ২: কার্টে প্রোডাক্ট থাকলেই কেবল হিসাব হবে
            const totalItems = cart.reduce((acc, item) => acc + (Number(item.quantity) || 1), 0);
            setCartCount(totalItems);
          } else {
            setCartCount(0);
          }
        } else {
          setCartCount(0); 
        }
      } catch (e) {
        console.error("Error synchronizing navbar state:", e);
        setIsLoggedIn(false);
        setIsAdmin(false);
        setCartCount(0);
      }
    };

    checkData();

    window.addEventListener("storage", checkData);
    window.addEventListener("cartUpdated", checkData); 

    return () => {
      window.removeEventListener("storage", checkData);
      window.removeEventListener("cartUpdated", checkData);
    };
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("medistore_user");
    localStorage.removeItem("medistore_cart"); // 🎯 পরিবর্তন ৩: লগআউট করলে কার্টও একদম ০ হয়ে যাবে
    
    setIsLoggedIn(false);
    setIsAdmin(false);
    setIsMenuOpen(false);
    setCartCount(0);
    
    router.push("/");
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const handleDashboard = () => {
    try {
      const userStr = localStorage.getItem("medistore_user");
      if (!userStr) return;
      
      const user = JSON.parse(userStr);
      const role = (user?.role || "").toUpperCase();
      setIsMenuOpen(false);

      if (role === "ADMIN") router.push("/admin/dashboard");
      else if (role === "SELLER") router.push("/seller/dashboard");
      else router.push("/customer/dashboard");
    } catch (e) {
      console.error(e);
    }
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
          
          {/* 🛡️ ডেক্সটপ সিকিউরড ড্যাশবোর্ড লিঙ্ক - শুধুমাত্র লগইন থাকলেই দেখাবে */}
          {isLoggedIn && (
            <button onClick={handleDashboard} className="flex items-center gap-2 text-[10px] font-black uppercase text-slate-300 hover:text-emerald-500 tracking-widest transition-all">
              <LayoutDashboard size={16} /> Dashboard
            </button>
          )}
        </div>

        {/* DESKTOP & MOBILE RIGHT SECTION */}
        <div className="flex items-center gap-4 md:gap-6">
          
          {/* Cart Icon */}
          <Link href="/customer/cart" className="relative text-emerald-500 bg-emerald-500/10 p-2.5 rounded-2xl hover:bg-emerald-500 hover:text-black transition-all z-[110] border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <ShoppingCart size={20} />
            {/* 🛒 কার্ট কাউন্ট ০ এর বেশি হলে আসল সংখ্যা দেখাবে, না হলে ০ দেখাবে */}
            <span className="absolute -top-1 -right-1 bg-white text-[9px] font-black w-4 h-4 flex items-center justify-center rounded-full text-emerald-600 shadow-lg">
              {cartCount}
            </span>
          </Link>

          {/* Desktop Auth */}
          <div className="hidden md:block">
            {isLoggedIn ? (
              <button 
                onClick={handleLogout} 
                className="flex items-center gap-2 px-5 py-2 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all active:scale-95"
              >
                <LogOut size={14} /> Logout
              </button>
            ) : (
              <Link 
                href="/login" 
                className="px-5 py-2 bg-emerald-500 text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-lg active:scale-95"
              >
                Login
              </Link>
            )}
          </div>

          {/* Hamburger Menu Button */}
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
              
              {/* 🛡️ মোবাইল সিকিউরড ড্যাশবোর্ড লিঙ্ক */}
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

              {/* Mobile Auth Button */}
              {isLoggedIn ? (
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-4 w-full p-4 bg-red-500/10 rounded-3xl text-xl font-black italic uppercase text-red-500 border border-red-500/20 shadow-lg active:scale-95 transition-all"
                >
                  <LogOut size={20} /> Logout
                </button>
              ) : (
                <Link 
                  href="/login" 
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-4 w-full p-4 bg-emerald-500 rounded-3xl text-xl font-black italic uppercase text-black shadow-lg active:scale-95 transition-all"
                >
                  <User size={20} /> Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
