"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingCart,
  Menu,
  X,
  Pill,
  LayoutDashboard,
  Home,
  Store,
  Layers3,
  LogOut,
} from "lucide-react";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const router = useRouter();

  // ✅ auth + cart
  useEffect(() => {
    const checkData = () => {
      const token = localStorage.getItem("token");
      const cart = JSON.parse(localStorage.getItem("medistore_cart") || "[]");

      setIsLoggedIn(!!token);
      setCartCount(cart.length);
    };

    checkData();
    window.addEventListener("storage", checkData);

    return () => window.removeEventListener("storage", checkData);
  }, []);

  // logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("medistore_user");
    setIsLoggedIn(false);
    setIsMenuOpen(false);
    router.push("/");
  };

  // dashboard redirect
  const handleDashboard = () => {
    const user = JSON.parse(localStorage.getItem("medistore_user") || "{}");
    const role = (user?.role || "").toUpperCase();

    if (role === "ADMIN") router.push("/admin/dashboard");
    else if (role === "SELLER") router.push("/seller/dashboard");
    else router.push("/customer/dashboard");
  };

  const navLinks = [
    { name: "Home", href: "/", icon: <Home size={18} /> },
    { name: "Shop", href: "/shop", icon: <Store size={18} /> },
    { name: "Categories", href: "/categories", icon: <Layers3 size={18} /> },
  ];

  return (
    <nav className="sticky top-0 w-full bg-[#02040a]/90 backdrop-blur-md border-b border-white/10 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl sm:text-2xl font-black italic text-white">
          <Pill className="text-emerald-500" size={26} />
          MEDI<span className="text-emerald-500">STORE</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="flex items-center gap-2 text-xs font-bold uppercase text-slate-300 hover:text-emerald-500 transition"
            >
              {link.icon} {link.name}
            </Link>
          ))}

          {isLoggedIn && (
            <button
              onClick={handleDashboard}
              className="flex items-center gap-2 text-xs font-bold uppercase text-slate-300 hover:text-emerald-500"
            >
              <LayoutDashboard size={16} /> Dashboard
            </button>
          )}
        </div>

        {/* Right */}
        <div className="hidden md:flex items-center gap-5">

          {/* Cart */}
          <Link href="/cart" className="relative text-white hover:text-emerald-500">
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-emerald-500 text-[10px] px-1.5 py-[1px] rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Auth */}
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="text-xs font-bold uppercase text-red-500 hover:text-red-400 flex items-center gap-2"
            >
              <LogOut size={16} /> Logout
            </button>
          ) : (
            <>
              <Link href="/login" className="text-xs font-bold uppercase text-white hover:text-emerald-500">
                Login
              </Link>
              <Link
                href="/register"
                className="bg-white text-black px-4 py-2 rounded-lg text-xs font-black hover:bg-emerald-500 hover:text-white transition"
              >
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile Button */}
        <div className="md:hidden flex items-center gap-3 text-white">

          {/* Cart */}
          <Link href="/cart" className="relative">
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-emerald-500 text-[10px] px-1.5 py-[1px] rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Menu */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-[#02040a] border-t border-white/10 px-5 py-6 flex flex-col gap-5"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 text-sm font-bold uppercase text-white py-2"
              >
                {link.icon} {link.name}
              </Link>
            ))}

            {isLoggedIn && (
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  handleDashboard();
                }}
                className="flex items-center gap-3 text-sm font-bold uppercase text-white py-2"
              >
                <LayoutDashboard size={18} /> Dashboard
              </button>
            )}

            <div className="h-px bg-white/10" />

            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 text-sm font-bold uppercase text-red-500 py-2"
              >
                <LogOut size={18} /> Logout
              </button>
            ) : (
              <div className="flex flex-col gap-3">
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-sm font-bold uppercase text-white py-2"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="bg-emerald-500 text-center py-3 rounded-lg text-sm font-black text-white"
                >
                  Register
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}