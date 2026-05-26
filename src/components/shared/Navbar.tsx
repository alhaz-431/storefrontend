"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X, Pill, LayoutDashboard, Home, Store, Layers3, LogOut, User } from "lucide-react";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

  const checkData = () => {
    try {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("medistore_user");
      const cartStr = localStorage.getItem("medistore_cart");

      if (token && userStr) {
        const user = JSON.parse(userStr);
        setIsLoggedIn(true);
        const role = user.role?.toUpperCase() || "";
        setUserRole(role);
        setIsAdmin(role === "ADMIN");
      } else {
        setIsLoggedIn(false);
        setIsAdmin(false);
        setUserRole("");
      }

      if (cartStr) {
        const cart = JSON.parse(cartStr);
        const totalItems = cart.reduce((acc: any, item: any) => acc + (Number(item.quantity) || 1), 0);
        setCartCount(totalItems);
      } else {
        setCartCount(0);
      }
    } catch (e) {
      console.error("Navbar sync error:", e);
    }
  };

  useEffect(() => {
    checkData();
    
    // 🎯 কার্ট আপডেট ট্র্যাকিংয়ের জন্য কাস্টম লিসেনার
    window.addEventListener("storage", checkData);
    window.addEventListener("cartUpdated", checkData);
    
    return () => {
      window.removeEventListener("storage", checkData);
      window.removeEventListener("cartUpdated", checkData);
    };
  }, [pathname]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  // 🎯 ইউজারের রোল অনুযায়ী ডাইনামিক ড্যাশবোর্ড ইউআরএল জেনারেটর
  const getDashboardPath = () => {
    if (userRole === "ADMIN") return "/admin/dashboard";
    if (userRole === "SELLER") return "/seller/dashboard";
    return "/customer/dashboard";
  };

  const navLinks = [
    { name: "Home", href: "/", icon: <Home size={18} /> },
    { name: "Shop", href: "/shop", icon: <Store size={18} /> },
    ...(isAdmin ? [{ name: "Categories", href: "/admin/categories", icon: <Layers3 size={18} /> }] : []),
  ];

  return (
    /* 🎯 বর্ডার টিন্ট এবং শ্যাডো ডেটল থিমে মেলানো হয়েছে */
    <nav className="sticky top-0 w-full bg-white border-b border-[#e5f0ec] z-[100] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        
        {/* 🎯 LOGO - Dettol Brand Green (#006643) */}
        <Link href="/" className="flex items-center gap-2 text-xl font-black text-[#006643] tracking-tighter italic">
          <Pill className="text-[#006643]" size={28} /> MEDISTORE
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="flex items-center gap-2 text-[11px] font-black uppercase text-slate-600 hover:text-[#006643] transition-all">
              {link.icon} {link.name}
            </Link>
          ))}
          {isLoggedIn && (
            <button 
              onClick={() => router.push(getDashboardPath())} 
              className="flex items-center gap-2 text-[11px] font-black uppercase text-slate-600 hover:text-[#006643] transition-colors"
            >
              <LayoutDashboard size={16} /> Dashboard
            </button>
          )}
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-4">
          {/* 🎯 কার্ট লিংক আপডেট ও ডেটল গ্রিন ব্যাকগ্রাউন্ড গ্লো */}
          <Link href="/customer/cart" className="relative p-2.5 rounded-xl bg-[#006643]/10 text-[#006643] hover:bg-[#006643] hover:text-white transition-all">
            <ShoppingCart size={20} />
            <span className="absolute -top-1 -right-1 bg-[#006643] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-md">
              {cartCount}
            </span>
          </Link>

          <div className="hidden md:block">
            {isLoggedIn ? (
              <button onClick={handleLogout} className="px-5 py-2 bg-red-50 text-red-600 rounded-lg text-[10px] font-black uppercase hover:bg-red-500 hover:text-white transition-all">
                Logout
              </button>
            ) : (
              /* 🎯 লগইন বাটন থিম কালার */
              <Link href="/login" className="px-5 py-2 bg-[#006643] text-white rounded-lg text-[10px] font-black uppercase hover:bg-[#004d32] transition-all shadow-md shadow-[#006643]/10">
                Login
              </Link>
            )}
          </div>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-[#006643]">
            {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-white border-b border-[#e5f0ec] overflow-hidden">
            <div className="p-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href} onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 text-slate-600 font-bold uppercase text-sm hover:text-[#006643]">
                  {link.icon} {link.name}
                </Link>
              ))}
              
              {isLoggedIn && (
                <button 
                  onClick={() => { router.push(getDashboardPath()); setIsMenuOpen(false); }} 
                  className="flex items-center gap-4 text-[#006643] font-bold uppercase text-sm text-left"
                >
                  <LayoutDashboard size={18} /> Dashboard
                </button>
              )}
              
              <hr className="border-slate-100" />
              {isLoggedIn ? (
                <button onClick={handleLogout} className="text-red-600 font-bold text-sm text-left flex items-center gap-2">
                  <LogOut size={18} /> Logout
                </button>
              ) : (
                <Link href="/login" onClick={() => setIsMenuOpen(false)} className="text-[#006643] font-bold text-sm flex items-center gap-2">
                  <User size={18} /> Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}