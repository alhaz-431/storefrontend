"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Menu, X, Pill, LayoutDashboard, Home, Store, Layers3, LogOut } from "lucide-react";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false); // Admin check
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const checkData = () => {
      const token = localStorage.getItem("token");
      const cart = JSON.parse(localStorage.getItem("medistore_cart") || "[]");
      const user = JSON.parse(localStorage.getItem("medistore_user") || "{}");

      setIsLoggedIn(!!token);
      setIsAdmin(user?.role === "ADMIN"); // Check if Admin
      setCartCount(cart.length);
    };

    checkData();
    window.addEventListener("storage", checkData);
    return () => window.removeEventListener("storage", checkData);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("medistore_user");
    window.location.reload(); // Force refresh to clear UI state
  };

  const handleDashboard = () => {
    const user = JSON.parse(localStorage.getItem("medistore_user") || "{}");
    const role = (user?.role || "").toUpperCase();
    if (role === "ADMIN") router.push("/admin/dashboard");
    else if (role === "SELLER") router.push("/seller/dashboard");
    else router.push("/customer/dashboard");
  };

  // Dynamic Links
  const navLinks = [
    { name: "Home", href: "/", icon: <Home size={18} /> },
    { name: "Shop", href: "/shop", icon: <Store size={18} /> },
    ...(isAdmin ? [{ name: "Categories", href: "/admin/categories", icon: <Layers3 size={18} /> }] : []),
  ];

  return (
    <nav className="sticky top-0 w-full bg-[#02040a]/90 backdrop-blur-md border-b border-white/10 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-black italic text-white">
          <Pill className="text-emerald-500" size={26} /> MEDI<span className="text-emerald-500">STORE</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link key={link.name} href={link.href} className="flex items-center gap-2 text-xs font-bold uppercase text-slate-300 hover:text-emerald-500 transition">
              {link.icon} {link.name}
            </Link>
          ))}
          {isLoggedIn && (
            <button onClick={handleDashboard} className="flex items-center gap-2 text-xs font-bold uppercase text-slate-300 hover:text-emerald-500">
              <LayoutDashboard size={16} /> Dashboard
            </button>
          )}
        </div>

        {/* Auth Buttons */}
        <div className="hidden md:flex items-center gap-5">
           {/* Cart icon code remains same */}
           <Link href="/cart" className="relative text-white hover:text-emerald-500">
             <ShoppingCart size={20} />
             {cartCount > 0 && <span className="absolute -top-2 -right-2 bg-emerald-500 text-[10px] px-1.5 rounded-full">{cartCount}</span>}
           </Link>
           {isLoggedIn ? (
            <button onClick={handleLogout} className="text-xs font-bold uppercase text-red-500 hover:text-red-400">Logout</button>
           ) : (
            <Link href="/login" className="text-xs font-bold uppercase text-white">Login</Link>
           )}
        </div>
      </div>
    </nav>
  );
}