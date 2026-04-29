"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { 
  FiShoppingCart, FiActivity, FiMenu, FiX, FiLayout, FiHome, FiShoppingBag, FiGrid, FiUserPlus, FiLogIn 
} from "react-icons/fi";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  // ব্রাউজারে ইউজার চেক করা
  useEffect(() => {
    const checkUser = () => {
      const storedUser = localStorage.getItem("medistore_user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null);
      }
    };
    
    checkUser();
    // লোকাল স্টোরেজ চেঞ্জ হলে যেন আপডেট হয়
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, [pathname]);

  // ড্যাশবোর্ড ইউআরএল লজিক
  const dashboardPath = user?.role === "admin" ? "/admin/dashboard" : 
                        user?.role === "seller" ? "/seller/dashboard" : "/dashboard";

  return (
    <nav className="w-full h-20 bg-[#040610] border-b border-white/5 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between">
        
        {/* লোগো */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <FiActivity className="text-emerald-500 text-2xl" />
          <span className="text-xl font-black italic uppercase tracking-tighter text-white">
            Medi<span className="text-emerald-500">Store</span>
          </span>
        </Link>

        {/* ডেক্সটপ মেনু */}
        <div className="hidden md:flex items-center gap-8 text-[11px] font-black uppercase tracking-widest text-slate-400">
          <Link href="/" className={`hover:text-emerald-500 transition-colors ${pathname === "/" ? "text-emerald-500" : ""}`}>Home</Link>
          <Link href="/shop" className={`hover:text-emerald-500 transition-colors ${pathname === "/shop" ? "text-emerald-500" : ""}`}>Shop</Link>
          <Link href="/categories" className={`hover:text-emerald-500 transition-colors ${pathname === "/categories" ? "text-emerald-500" : ""}`}>Categories</Link>
          
          {user ? (
            <Link href={dashboardPath} className="flex items-center gap-2 bg-white/5 border border-white/10 px-5 py-2.5 rounded-xl text-white hover:bg-white/10 transition-all">
              <FiLayout className="text-emerald-500" /> Dashboard
            </Link>
          ) : (
            <div className="flex items-center gap-4 border-l border-white/10 pl-6">
              <Link href="/login" className="hover:text-white transition-colors">Login</Link>
              <Link href="/register" className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl hover:bg-emerald-500 shadow-lg shadow-emerald-600/20 transition-all">
                Join Now
              </Link>
            </div>
          )}
        </div>

        {/* মোবাইল অ্যাকশন বাটন */}
        <div className="flex items-center gap-3">
          <Link href="/cart" className="relative p-2 text-slate-400 hover:text-white">
            <FiShoppingCart size={22} />
            <span className="absolute top-1 right-1 bg-emerald-500 text-[8px] text-white w-4 h-4 rounded-full flex items-center justify-center font-bold">
              0
            </span>
          </Link>

          <button 
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-white bg-white/5 rounded-lg border border-white/10"
          >
            {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* মোবাইল ড্রয়ার */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-[#040610] border-b border-emerald-500/20 p-6 flex flex-col gap-5 z-40 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Navigation</p>
          
          <Link onClick={() => setIsOpen(false)} href="/" className="flex items-center gap-4 text-white text-lg font-bold">
            <FiHome className="text-emerald-500" /> Home
          </Link>
          <Link onClick={() => setIsOpen(false)} href="/shop" className="flex items-center gap-4 text-white text-lg font-bold">
            <FiShoppingBag className="text-emerald-500" /> Shop
          </Link>
          <Link onClick={() => setIsOpen(false)} href="/categories" className="flex items-center gap-4 text-white text-lg font-bold">
            <FiGrid className="text-emerald-500" /> Categories
          </Link>
          
          <div className="h-[1px] bg-white/5 my-2" />
          
          {user ? (
            <Link 
              onClick={() => setIsOpen(false)} 
              href={dashboardPath}
              className="w-full bg-emerald-600 text-white py-4 rounded-2xl flex items-center justify-center gap-3 font-black uppercase text-xs tracking-widest shadow-lg shadow-emerald-600/20"
            >
              <FiLayout /> Dashboard
            </Link>
          ) : (
            <div className="flex flex-col gap-3">
              <Link 
                onClick={() => setIsOpen(false)} 
                href="/login"
                className="w-full bg-white/5 text-white py-4 rounded-2xl flex items-center justify-center gap-3 font-black uppercase text-xs tracking-widest border border-white/10"
              >
                <FiLogIn /> Login
              </Link>
              <Link 
                onClick={() => setIsOpen(false)} 
                href="/register"
                className="w-full bg-emerald-600 text-white py-4 rounded-2xl flex items-center justify-center gap-3 font-black uppercase text-xs tracking-widest"
              >
                <FiUserPlus /> Create Account
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}