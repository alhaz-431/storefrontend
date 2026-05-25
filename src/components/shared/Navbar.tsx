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

        if (token && userStr) {
          const user = JSON.parse(userStr);
          setIsLoggedIn(true);
          setIsAdmin(user.role?.toUpperCase() === "ADMIN");
        } else {
          setIsLoggedIn(false);
          setIsAdmin(false);
        }

        if (cartStr) {
          const cart = JSON.parse(cartStr);
          const totalItems = cart.reduce((acc: any, item: any) => acc + (Number(item.quantity) || 1), 0);
          setCartCount(totalItems);
        }
      } catch (e) {
        console.error("Navbar sync error:", e);
      }
    };

    checkData();
    window.addEventListener("storage", checkData);
    return () => window.removeEventListener("storage", checkData);
  }, [pathname]);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const navLinks = [
    { name: "Home", href: "/", icon: <Home size={18} /> },
    { name: "Shop", href: "/shop", icon: <Store size={18} /> },
    ...(isAdmin ? [{ name: "Categories", href: "/admin/categories", icon: <Layers3 size={18} /> }] : []),
  ];

  return (
    <nav className="sticky top-0 w-full bg-white border-b border-[#E6F4ED] z-[100] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2 text-xl font-black text-[#008249]">
          <Pill className="text-[#008249]" size={28} /> MEDISTORE
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="flex items-center gap-2 text-[11px] font-black uppercase text-slate-600 hover:text-[#008249] transition-all">
              {link.icon} {link.name}
            </Link>
          ))}
          {isLoggedIn && (
            <button onClick={() => router.push("/dashboard")} className="flex items-center gap-2 text-[11px] font-black uppercase text-slate-600 hover:text-[#008249]">
              <LayoutDashboard size={16} /> Dashboard
            </button>
          )}
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-4">
          <Link href="/customer/cart" className="relative p-2.5 rounded-xl bg-[#E6F4ED] text-[#008249] hover:bg-[#008249] hover:text-white transition-all">
            <ShoppingCart size={20} />
            <span className="absolute -top-1 -right-1 bg-[#008249] text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
              {cartCount}
            </span>
          </Link>

          <div className="hidden md:block">
            {isLoggedIn ? (
              <button onClick={handleLogout} className="px-5 py-2 bg-red-50 text-red-600 rounded-lg text-[10px] font-black uppercase hover:bg-red-500 hover:text-white transition-all">
                Logout
              </button>
            ) : (
              <Link href="/login" className="px-5 py-2 bg-[#008249] text-white rounded-lg text-[10px] font-black uppercase hover:bg-[#006633] transition-all">
                Login
              </Link>
            )}
          </div>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden p-2 text-[#008249]">
            {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="md:hidden bg-white border-b border-[#E6F4ED] overflow-hidden">
            <div className="p-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link key={link.name} href={link.href} onClick={() => setIsMenuOpen(false)} className="flex items-center gap-4 text-slate-600 font-bold uppercase text-sm">
                  {link.icon} {link.name}
                </Link>
              ))}
              <hr />
              {isLoggedIn ? (
                <button onClick={handleLogout} className="text-red-600 font-bold text-sm">Logout</button>
              ) : (
                <Link href="/login" className="text-[#008249] font-bold text-sm">Login</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}