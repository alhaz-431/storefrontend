"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { 
  FiShoppingCart, FiActivity, FiMenu, FiX, FiLayout, FiHome, FiShoppingBag, FiGrid 
} from "react-icons/fi";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false); // মোবাইল মেনু ওপেন/ক্লোজ স্টেট
  const [isLoggedIn] = useState(true); 
  const [userRole] = useState("seller");

  // ড্যাশবোর্ড ইউআরএল
  const dashboardPath = userRole === "admin" ? "/admin/dashboard" : 
                       userRole === "seller" ? "/seller/dashboard" : "/profile";

  return (
    <nav className="w-full h-20 bg-[#040610] border-b border-white/5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between">
        
        {/* লোগো - সবসময় দেখা যাবে */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <FiActivity className="text-blue-500 text-2xl" />
          <span className="text-xl font-black italic uppercase tracking-tighter text-white">
            Medi<span className="text-blue-500">Store</span>
          </span>
        </Link>

        {/* ডেক্সটপ মেনু - বড় স্ক্রিনে দেখাবে, মোবাইলে হাইড থাকবে */}
        <div className="hidden md:flex items-center gap-8 text-[11px] font-black uppercase tracking-widest text-slate-400">
          <Link href="/" className={`hover:text-blue-500 ${pathname === "/" ? "text-blue-500" : ""}`}>Home</Link>
          <Link href="/shop" className={`hover:text-blue-500 ${pathname === "/shop" ? "text-blue-500" : ""}`}>Shop</Link>
          <Link href="/categories" className={`hover:text-blue-500 ${pathname === "/categories" ? "text-blue-500" : ""}`}>Categories</Link>
          {isLoggedIn && (
            <Link href={dashboardPath} className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-white">
              <FiLayout className="text-blue-500" /> Dashboard
            </Link>
          )}
        </div>

        {/* মোবাইল অ্যাকশন বাটন - কার্ট এবং ৩-দাগের মেনু আইকন */}
        <div className="flex items-center gap-3">
          {/* কার্ট আইকন - মোবাইলেও দেখা যাবে */}
          <Link href="/cart" className="relative p-2 text-slate-400">
            <FiShoppingCart size={22} />
            <span className="absolute top-0 right-0 bg-blue-600 text-[8px] text-white w-4 h-4 rounded-full flex items-center justify-center font-bold">
              0
            </span>
          </Link>

          {/* ৩-দাগের মেনু বাটন - শুধুমাত্র মোবাইলে দেখাবে */}
          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-white bg-white/5 rounded-lg border border-white/10"
          >
            {isOpen ? <FiX size={26} /> : <FiMenu size={26} />}
          </button>
        </div>
      </div>

      {/* মোবাইল ড্রয়ার - ৩-দাগে ক্লিক করলে আসবে */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-[#040610] border-b border-blue-500/20 p-6 flex flex-col gap-5 z-40 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Menu</p>
          
          <Link onClick={() => setIsOpen(false)} href="/" className="flex items-center gap-4 text-white text-lg font-bold">
            <FiHome className="text-blue-500" /> Home
          </Link>
          <Link onClick={() => setIsOpen(false)} href="/shop" className="flex items-center gap-4 text-white text-lg font-bold">
            <FiShoppingBag className="text-blue-500" /> Shop
          </Link>
          <Link onClick={() => setIsOpen(false)} href="/categories" className="flex items-center gap-4 text-white text-lg font-bold">
            <FiGrid className="text-blue-500" /> Categories
          </Link>
          
          <div className="h-[1px] bg-white/5 my-2" />
          
          {/* মোবাইল মেনুর ভেতর ড্যাশবোর্ড */}
          {isLoggedIn && (
            <Link 
              onClick={() => setIsOpen(false)} 
              href={dashboardPath}
              className="w-full bg-blue-600 text-white py-4 rounded-2xl flex items-center justify-center gap-3 font-black uppercase text-xs tracking-widest"
            >
              <FiLayout /> Dashboard
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}