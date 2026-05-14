"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Pill, 
  ShoppingBag, 
  LogOut, 
  UserCircle,
  Activity,
  Menu,
  X,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: "Dashboard", href: "/seller/dashboard", icon: <LayoutDashboard size={20} /> },
    { label: "Medicines", href: "/seller/medicines", icon: <Pill size={20} /> },
    { label: "Orders", href: "/seller/orders", icon: <ShoppingBag size={20} /> },
    { label: "Profile", href: "/seller/profile", icon: <UserCircle size={20} /> },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Brand Logo */}
      <div className="flex items-center justify-between mb-10 px-2">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-600 p-2.5 rounded-2xl rotate-3 shadow-lg shadow-emerald-600/20">
            <Activity size={24} className="text-white" />
          </div>
          <span className="text-xl font-black italic tracking-tighter uppercase text-white">
            Medi<span className="text-emerald-500">Store</span>
          </span>
        </div>
        <button onClick={() => setIsOpen(false)} className="lg:hidden p-2 text-emerald-800 hover:text-white transition-colors">
          <X size={24} />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1.5">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
              <motion.div 
                whileHover={{ x: 5 }}
                className={`flex items-center justify-between px-5 py-4 rounded-2xl font-bold uppercase text-[10px] tracking-widest transition-all duration-300 ${
                isActive 
                ? "bg-emerald-600 text-white shadow-xl shadow-emerald-950/40 border border-emerald-400/20" 
                : "text-emerald-900 hover:bg-emerald-500/5 hover:text-emerald-400"
              }`}>
                <div className="flex items-center gap-4">
                  {item.icon}
                  {item.label}
                </div>
                {isActive && <ChevronRight size={14} className="text-emerald-200" />}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile/Logout */}
      <div className="mt-auto pt-6 border-t border-emerald-900/10">
        <button className="flex items-center gap-4 px-5 py-4 rounded-2xl font-bold uppercase text-[10px] tracking-widest text-rose-500 hover:bg-rose-500/10 transition-all w-full text-left group">
          <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" /> 
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-[#051a10] text-emerald-50">
      
      {/* --- DESKTOP SIDEBAR --- */}
      <aside className="w-80 border-r border-emerald-900/20 bg-[#0a2e1f] p-8 hidden lg:flex flex-col sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* --- MOBILE SIDEBAR DRAWER --- */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] lg:hidden"
            />
            <motion.aside 
              initial={{ x: "-100%", opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: "-100%", opacity: 0 }}
              transition={{ type: "spring", damping: 20, stiffness: 100 }}
              className="fixed top-0 left-0 bottom-0 w-[300px] bg-[#0a2e1f] p-8 z-[70] lg:hidden flex flex-col border-r border-emerald-500/10"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* HEADER */}
        <header className="h-16 md:h-20 border-b border-emerald-900/10 flex items-center justify-between px-6 md:px-10 bg-[#051a10]/80 backdrop-blur-2xl sticky top-0 z-50">
            <button 
              onClick={() => setIsOpen(true)}
              className="lg:hidden p-2.5 bg-emerald-600/10 rounded-xl text-emerald-500 border border-emerald-500/20 hover:bg-emerald-600/20 transition-all"
            >
              <Menu size={22} />
            </button>

            <div className="flex lg:hidden items-center gap-2 absolute left-1/2 -translate-x-1/2">
               <Activity size={20} className="text-emerald-500" />
               <span className="text-sm font-black italic tracking-tighter uppercase text-white">MediStore</span>
            </div>

            <div className="flex items-center gap-4 ml-auto">
               <div className="text-right hidden sm:block">
                 <p className="text-[9px] font-black uppercase text-emerald-500 tracking-widest leading-none mb-1">Authenticated Seller</p>
                 <p className="text-xs font-bold text-white uppercase tracking-tight">Alfaz Arbby</p>
               </div>
               <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 border border-emerald-400/20 flex items-center justify-center font-black text-white text-xs shadow-lg shadow-emerald-900/40">
                 AA
               </div>
            </div>
        </header>

        {/* PAGE CONTENT */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="p-6 md:p-10 flex-1 overflow-x-hidden" 
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}