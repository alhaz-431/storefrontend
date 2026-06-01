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
    { name: "Home", href: "/", icon: <Home size={15} /> },
    { name: "Shop", href: "/shop", icon: <Store size={15} /> },
    ...(isAdmin ? [{ name: "Categories", href: "/admin/categories", icon: <Layers3 size={15} /> }] : []),
  ];

  return (
    <nav className="sticky top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/80 z-[100] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        <Link href="/" className="flex items-center gap-2 text-xl font-black text-slate-900 tracking-tighter italic group">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:scale-105 transition-transform">
            <Pill className="text-emerald-600" size={20} />
          </div>
          <span>MEDI<span className="text-emerald-600 font-bold">STORE</span></span>
        </Link>

        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.name} 
                href={link.href} 
                className={`flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider transition-all py-2 px-1 border-b-2 ${
                  isActive ? "text-emerald-600 border-emerald-600" : "text-slate-500 border-transparent hover:text-slate-900"
                }`}
              >
                {link.icon} {link.name}
              </Link>
            );
          })}
          
          {isLoggedIn && (
            <button 
              onClick={() => router.push(getDashboardPath())} 
              className={`flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider transition-all py-2 px-1 border-b-2 ${
                pathname.includes("dashboard") ? "text-emerald-600 border-emerald-600" : "text-slate-500 border-transparent hover:text-slate-900"
              }`}
            >
              <LayoutDashboard size={15} /> Dashboard
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* 🛒 CART ICON: শুধুমাত্র কাস্টমারদের জন্য */}
          {userRole !== "ADMIN" && userRole !== "SELLER" && (
            <Link href="/customer/cart" className="relative p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all shadow-sm">
              <ShoppingCart size={16} />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }} 
                    animate={{ scale: 1 }} 
                    exit={{ scale: 0 }}
                    className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[9px] w-5 h-5 flex items-center justify-center rounded-full font-extrabold shadow-md border-2 border-white"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          )}

          <div className="hidden md:block">
            {isLoggedIn ? (
              <button onClick={handleLogout} className="px-4 py-2 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-rose-600 hover:text-white transition-all shadow-sm">
                Logout
              </button>
            ) : (
              <Link href="/login" className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-emerald-700 transition-all shadow-md shadow-emerald-600/10 block">
                Login
              </Link>
            )}
          </div>

          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="md:hidden p-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }} 
            animate={{ opacity: 1, height: "auto" }} 
            exit={{ opacity: 0, height: 0 }} 
            className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
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
                      isActive ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
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
                    pathname.includes("dashboard") ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <LayoutDashboard size={15} /> Dashboard
                </button>
              )}
              
              <div className="h-[1px] bg-slate-200/60 my-2" />
              
              {isLoggedIn ? (
                <button onClick={handleLogout} className="w-full p-3 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl font-bold text-xs uppercase tracking-wider text-left flex items-center gap-4 hover:bg-rose-600 hover:text-white transition-all">
                  <LogOut size={15} /> Logout
                </button>
              ) : (
                <Link href="/login" onClick={() => setIsMenuOpen(false)} className="w-full p-3 bg-emerald-600 text-white rounded-xl font-bold text-xs uppercase tracking-wider text-center flex items-center justify-center gap-2 hover:bg-emerald-700 transition-all">
                  <User size={15} /> Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}