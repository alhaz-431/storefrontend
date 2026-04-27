"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { 
  LayoutDashboard, Users, ShoppingBag, 
  Layers, LogOut, Menu, X, ShieldCheck 
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "User Management", path: "/admin/users", icon: <Users size={20} /> },
    { name: "Categories", path: "/admin/categories", icon: <Layers size={20} /> },
    { name: "All Orders", path: "/admin/orders", icon: <ShoppingBag size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-[#02040a] text-slate-300">
      
      {/* --- SIDEBAR --- */}
      <aside className={`fixed inset-y-0 left-0 z-50 bg-white/[0.02] backdrop-blur-xl border-r border-white/5 transition-all duration-300 ${isOpen ? "w-72" : "w-20"} lg:relative`}>
        <div className="flex flex-col h-full py-8">
          
          {/* Logo Section */}
          <div className="px-6 mb-12 flex items-center justify-between">
            {isOpen && (
              <h1 className="text-xl font-black italic text-blue-600 tracking-tighter">
                MEDISTORE <span className="text-[10px] block not-italic font-bold text-white opacity-40 uppercase tracking-widest">Admin Control</span>
              </h1>
            )}
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 hover:bg-white/5 rounded-xl transition-colors text-blue-500">
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link key={item.path} href={item.path}>
                  <div className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all relative group cursor-pointer ${isActive ? "text-white" : "text-slate-500 hover:text-slate-300"}`}>
                    {isActive && (
                      <motion.div layoutId="navActive" className="absolute inset-0 bg-blue-600 rounded-2xl shadow-lg shadow-blue-600/20" />
                    )}
                    <span className="relative z-10">{item.icon}</span>
                    {isOpen && (
                      <span className="relative z-10 text-[11px] font-black uppercase tracking-widest leading-none">
                        {item.name}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="px-4">
            <button className="w-full flex items-center gap-4 px-4 py-4 text-red-500/60 hover:text-red-500 hover:bg-red-500/10 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest">
              <LogOut size={20} />
              {isOpen && "Logout System"}
            </button>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 h-screen overflow-y-auto">
        {/* উপরের ছোট নেভিগেশন বার (Optional) */}
        <header className="px-10 py-6 border-b border-white/5 flex justify-end">
           <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-full border border-white/5">
              <ShieldCheck size={16} className="text-blue-500" />
              <span className="text-[10px] font-black uppercase tracking-widest">Admin Mode</span>
           </div>
        </header>

        {/* এখানে আমাদের সব পেজ লোড হবে */}
        <div className="max-w-7xl mx-auto">
            {children}
        </div>
      </main>
    </div>
  );
}