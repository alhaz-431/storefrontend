"use client";
import Link from "next/link";
import { useState } from "react"; 
import { usePathname } from "next/navigation"; // এক্টিভ লিংক দেখানোর জন্য
import { FiShoppingCart, FiUser, FiActivity, FiLayout, FiLogOut, FiHome } from "react-icons/fi";

export default function Navbar() {
  const pathname = usePathname();
  
  // পরে এই স্টেটগুলো সরিয়ে useAuth() থেকে ডাটা নিবেন
  const [isLoggedIn, setIsLoggedIn] = useState(true); 
  const [userRole, setUserRole] = useState("seller"); 

  return (
    <nav className="w-full h-20 bg-[#040610]/80 backdrop-blur-md border-b border-white/5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <FiActivity className="text-blue-500 text-2xl animate-pulse" />
          <span className="text-2xl font-black italic uppercase tracking-tighter text-white">
            Medi<span className="text-blue-500">Store</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8 text-[11px] font-black uppercase tracking-widest text-slate-400">
          {/* Home Link যোগ করা হয়েছে */}
          <Link 
            href="/" 
            className={`flex items-center gap-1.5 transition-colors ${pathname === "/" ? "text-blue-500" : "hover:text-blue-500"}`}
          >
            <FiHome size={14} /> Home
          </Link>

          <Link 
            href="/shop" 
            className={`transition-colors ${pathname === "/shop" ? "text-blue-500" : "hover:text-blue-500"}`}
          >
            Shop
          </Link>

          <Link 
            href="/categories" 
            className={`transition-colors ${pathname === "/categories" ? "text-blue-500" : "hover:text-blue-500"}`}
          >
            Categories
          </Link>

          {/* যদি কাস্টমার হয় তবেই My Orders দেখাবে */}
          {isLoggedIn && userRole === "customer" && (
             <Link 
               href="/orders" 
               className={`transition-colors ${pathname === "/orders" ? "text-blue-500" : "hover:text-blue-500"}`}
             >
               My Orders
             </Link>
          )}
        </div>

        {/* Actions Area */}
        <div className="flex items-center gap-4">
          {/* Cart Icon */}
          <Link href="/cart" className="relative p-2 text-slate-400 hover:text-white transition-all">
            <FiShoppingCart size={22} />
            <span className="absolute top-0 right-0 bg-blue-600 text-[8px] text-white w-4 h-4 rounded-full flex items-center justify-center font-bold">0</span>
          </Link>

          {/* লগইন এরিয়া */}
          {!isLoggedIn ? (
            <Link href="/login" className="flex items-center gap-2 bg-blue-600 hover:bg-white hover:text-blue-900 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20">
              <FiUser size={16} /> Login
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              {/* ডাইনামিক ড্যাশবোর্ড লিঙ্ক */}
              <Link 
                href={
                  userRole === "admin" ? "/admin/dashboard" : 
                  userRole === "seller" ? "/seller/dashboard" : 
                  "/profile"
                }
                className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                <FiLayout size={16} className="text-blue-500" /> Dashboard
              </Link>

              {/* Logout Button */}
              <button 
                onClick={() => setIsLoggedIn(false)}
                className="p-2.5 text-slate-500 hover:text-red-500 bg-white/5 rounded-xl transition-all border border-white/5"
              >
                <FiLogOut size={18} />
              </button>
            </div>
          )}
        </div>

      </div>
    </nav>
  );
}