"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Pill, 
  ShoppingBag, 
  LogOut, 
  UserCircle,
  Activity,
  Menu
} from "lucide-react";
import { motion } from "framer-motion";

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menuItems = [
    { label: "Dashboard", href: "/seller/dashboard", icon: <LayoutDashboard size={20} /> },
    { label: "Medicines", href: "/seller/medicines", icon: <Pill size={20} /> },
    { label: "Orders", href: "/seller/orders", icon: <ShoppingBag size={20} /> },
    { label: "Profile", href: "/seller/profile", icon: <UserCircle size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-[#02040a] text-white">
      
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="w-72 border-r border-white/5 bg-[#05070f] p-8 hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="bg-emerald-600 p-2 rounded-xl">
            <Activity size={24} className="text-white" />
          </div>
          <span className="text-xl font-black italic tracking-tighter uppercase">
            Medi<span className="text-emerald-500">Store</span>
          </span>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <div className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all ${
                  isActive 
                  ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20" 
                  : "text-slate-500 hover:bg-white/5 hover:text-white"
                }`}>
                  {item.icon}
                  {item.label}
                </div>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-8 border-t border-white/5">
          <button className="flex items-center gap-4 px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest text-red-500 hover:bg-red-500/10 transition-all w-full text-left">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* HEADER (Sticky & Responsive) */}
        <header className="h-16 md:h-20 border-b border-white/5 flex items-center justify-between lg:justify-end px-4 md:px-10 bg-[#02040a]/50 backdrop-blur-xl sticky top-0 z-50">
           {/* Mobile Logo Only */}
           <div className="flex lg:hidden items-center gap-2">
              <Activity size={20} className="text-emerald-500" />
              <span className="text-sm font-black italic tracking-tighter uppercase">MediStore</span>
           </div>

           <div className="flex items-center gap-3 md:gap-4">
              <div className="text-right">
                <p className="text-[8px] md:text-[10px] font-black uppercase text-emerald-500 tracking-widest leading-none">Seller Mode</p>
                <p className="text-xs md:text-sm font-bold italic text-white uppercase truncate max-w-[100px] md:max-w-none">Alfaz ARbby</p>
              </div>
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-emerald-600/20 border border-emerald-600/30 flex items-center justify-center font-black text-emerald-500 text-xs italic shrink-0">
                A
              </div>
           </div>
        </header>

        {/* PAGE CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-1 flex-1 pb-24 lg:pb-8" 
        >
          {children}
        </motion.div>

        {/* --- MOBILE BOTTOM NAVIGATION --- */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#05070f]/80 backdrop-blur-2xl border-t border-white/5 px-4 pb-6 pt-3 flex justify-between items-center z-50">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className="flex-1">
                <div className={`flex flex-col items-center gap-1 transition-all ${
                  isActive ? "text-emerald-500" : "text-slate-500"
                }`}>
                  <div className={`p-2 rounded-xl transition-all ${isActive ? "bg-emerald-500/10" : ""}`}>
                    {item.icon}
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-tighter">{item.label}</span>
                  {isActive && (
                    <motion.div layoutId="bubble" className="w-1 h-1 bg-emerald-500 rounded-full mt-0.5" />
                  )}
                </div>
              </Link>
            );
          })}
          {/* Logout for mobile */}
          <button className="flex-1 flex flex-col items-center gap-1 text-red-500/70">
             <div className="p-2">
                <LogOut size={20} />
             </div>
             <span className="text-[8px] font-black uppercase tracking-tighter">Exit</span>
          </button>
        </nav>

      </main>
    </div>
  );
}