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

  const getDashboardPath = () => {
    if (userRole === "ADMIN") return "/admin/dashboard";
    if (userRole === "SELLER") return "/seller/dashboard";
    return "/customer/dashboard";
  };

  const navLinks = [
    { name: "Home", href: "/", icon: <Home size={16} /> },
    { name: "Shop", href: "/shop", icon: <Store size={16} /> },
    ...(isAdmin ? [{ name: "Categories", href: "/admin/categories", icon: <Layers3 size={16} /> }] : []),
  ];

  return (
    /* 🎯 সম্পূর্ণ ডার্ক ডেটল গ্রিন থিম ব্যাকগ্রাউন্ড এবং গ্লাস-মর্ফিজম বর্ডার */
    <nav className="sticky top-0 w-full bg-[#020d0a]/90 backdrop-blur-md border-b border-white/5 z-[100] shadow-lg shadow-[#020d0a]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* LOGO - গ্লোয়িং ডেটল গ্রিন */}
        <Link href="/" className="flex items-center gap-2 text-xl font-black text-white tracking-tighter italic group">
          <div className="w-9 h-9 rounded-xl bg-[#006643]/20 border border-[#006643]/40 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Pill className="text-[#006643] drop-shadow-[0_0_8px_#006643]" size={22} />
          </div>
          <span>MEDI<span className="text-[#006643]">STORE</span></span>
        </Link>

        {/* DESKTOP LINKS - ফুললি রেসপন্সিভ এবং নিট টেক্সট */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.name} 
                href={link.href} 
                className={`flex items-center gap-2 text-[11px] font-black uppercase tracking-wider transition-all py-2 px-1 border-b-2 ${
                  isActive ? "text-[#006643] border-[#006643]" : "text-slate-400 border-transparent hover:text-slate-200"
                }`}
              >
                {link.icon} {link.name}
              </Link>
            );
          })}
          
          {isLoggedIn && (
            <button 
              onClick={() => router.push(getDashboardPath())} 
              className={`flex items-center gap-2 text-[11px] font-black uppercase tracking-wider transition-all py-2 px-1 border-b-2 ${
                pathname.includes("dashboard") ? "text-[#006643] border-[#006643]" : "text-slate-400 border-transparent hover:text-slate-200"
              }`}
            >
              <LayoutDashboard size={16} /> Dashboard
            </button>
          )}
        </div>

        {/* RIGHT CONTROLS - কার্ট এবং লগইন/লগআউট */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* কার্ট বাটন - ডার্ক থিম গ্লো */}
          <Link href="/customer/cart" className="relative p-2.5 rounded-xl bg-white/[0.03] border border-white/5 text-slate-300 hover:bg-[#006643] hover:text-white hover:border-[#006643] transition-all shadow-inner">
            <ShoppingCart size={18} />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span 
                  initial={{ scale: 0 }} 
                  animate={{ scale: 1 }} 
                  exit={{ scale: 0 }}
                  className="absolute -top-1.5 -right-1.5 bg-[#006643] text-white text-[9px] w-5 h-5 flex items-center justify-center rounded-full font-black shadow-lg shadow-[#006643]/30"
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          {/* লগইন/লগআউট ডেস্কটপ বাটন */}
          <div className="hidden md:block">
            {isLoggedIn ? (
              <button onClick={handleLogout} className="px-4 py-2.5 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-red-500 hover:text-white transition-all">
                Logout
              </button>
            ) : (
              <Link href="/login" className="px-5 py-2.5 bg-[#006643] text-white rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-[#004d32] transition-all shadow-md shadow-[#006643]/20 block">
                Login
              </Link>
            )}
          </div>

          {/* মোবাইল মেনু টগল বাটন */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="md:hidden p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-slate-400 hover:text-white transition-colors"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER - ১০০% রেসপন্সিভ এবং ক্লিপড লেআউট */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: "auto" }} 
            exit={{ opacity: 0, height: 0 }} 
            className="md:hidden bg-[#020d0a] border-b border-white/5 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 flex flex-col gap-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link 
                    key={link.name} 
                    href={link.href} 
                    onClick={() => setIsMenuOpen(false)} 
                    className={`flex items-center gap-4 p-3 rounded-xl font-bold uppercase text-xs tracking-wider transition-all ${
                      isActive ? "bg-[#006643]/20 text-[#006643] border border-[#006643]/20" : "text-slate-400 hover:bg-white/[0.02] hover:text-slate-200"
                    }`}
                  >
                    {link.icon} {link.name}
                  </Link>
                );
              })}
              
              {isLoggedIn && (
                <button 
                  onClick={() => { router.push(getDashboardPath()); setIsMenuOpen(false); }} 
                  className={`flex items-center gap-4 p-3 rounded-xl font-bold uppercase text-xs tracking-wider text-left w-full transition-all ${
                    pathname.includes("dashboard") ? "bg-[#006643]/20 text-[#006643] border border-[#006643]/20" : "text-slate-400 hover:bg-white/[0.02] hover:text-slate-200"
                  }`}
                >
                  <LayoutDashboard size={16} /> Dashboard
                </button>
              )}
              
              <div className="h-[1px] bg-white/5 my-2" />
              
              {isLoggedIn ? (
                <button onClick={handleLogout} className="w-full p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl font-bold text-xs uppercase tracking-wider text-left flex items-center gap-4 hover:bg-red-500 hover:text-white transition-all">
                  <LogOut size={16} /> Logout
                </button>
              ) : (
                <Link href="/login" onClick={() => setIsMenuOpen(false)} className="w-full p-3 bg-[#006643] text-white rounded-xl font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2 hover:bg-[#004d32] transition-all">
                  <User size={16} /> Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}