"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  // ✅ Auth check (realtime + safe)
  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
      }
    };

    checkAuth();

    // অন্য tab / login change detect করবে
    window.addEventListener("storage", checkAuth);

    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  // ✅ Logout (fully clean)
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("medistore_user");
    setIsLoggedIn(false);
    setIsMenuOpen(false);
    router.push("/");
  };

  // ✅ Menu click করলে auto close
  const handleNavClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="relative flex items-center justify-between p-6 bg-[#02040a] text-white z-50">

      {/* Logo */}
      <Link href="/" className="text-2xl font-black italic">
        MEDI<span className="text-emerald-500">STORE</span>
      </Link>

      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-white p-2"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {isMenuOpen ? "✕" : "☰"}
      </button>

      {/* Menu */}
      <div
        className={`
          ${isMenuOpen ? "flex" : "hidden"}
          md:flex flex-col md:flex-row absolute md:static top-full left-0 w-full md:w-auto
          bg-[#02040a] md:bg-transparent p-6 md:p-0 gap-6 items-center shadow-lg md:shadow-none
        `}
      >
        <Link
          href="/"
          onClick={handleNavClick}
          className="text-xs font-bold uppercase hover:text-emerald-500 transition-colors"
        >
          Home
        </Link>

        <Link
          href="/shop"
          onClick={handleNavClick}
          className="text-xs font-bold uppercase hover:text-emerald-500 transition-colors"
        >
          Shop
        </Link>

        {isLoggedIn ? (
          <>
            <Link
              href="/dashboard"
              onClick={handleNavClick}
              className="bg-emerald-500 px-4 py-2 rounded-lg text-xs font-black hover:bg-emerald-600 transition-all"
            >
              Dashboard
            </Link>

            <button
              onClick={handleLogout}
              className="text-xs font-bold uppercase text-red-500 hover:text-red-400"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link
              href="/login"
              onClick={handleNavClick}
              className="text-xs font-bold uppercase hover:text-emerald-500 transition-colors"
            >
              Login
            </Link>

            <Link
              href="/register"
              onClick={handleNavClick}
              className="bg-white text-black px-4 py-2 rounded-lg text-xs font-black hover:bg-emerald-500 hover:text-white transition-all"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}