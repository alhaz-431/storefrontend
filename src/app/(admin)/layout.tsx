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
    <div className="flex min-h-screen bg-gray-50 text-gray-700">
      
      {/* মোবাইল ওভারলে */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/20 z-40 lg:hidden" onClick={() => setIsOpen(false)} />
      )}

      {/* --- SIDEBAR --- */}
      <aside className={`fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-100 shadow-xl transition-all duration-300 lg:relative ${isOpen ? "w-72 translate-x-0" : "w-20 -translate-x-full lg:translate-x-0"}`}>
        <div className="flex flex-col h-full py-8">
          
          {/* Logo Section */}
          <div className="px-6 mb-12 flex items-center justify-between">
            {isOpen && (
              <h1 className="text-xl font-black italic text-emerald-600 tracking-tighter">
                MEDISTORE <span className="text-[10px] block not-italic font-bold text-gray-400 uppercase tracking-widest">Admin Control</span>
              </h1>
            )}
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 hover:bg-emerald-50 rounded-xl transition-colors text-emerald-600">
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link key={item.path} href={item.path} onClick={() => window.innerWidth < 1024 && setIsOpen(false)}>
                  <div className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all relative cursor-pointer ${isActive ? "text-white" : "text-gray-500 hover:text-emerald-700 hover:bg-emerald-50"}`}>
                    {isActive && (
                      <motion.div layoutId="navActive" className="absolute inset-0 bg-emerald-600 rounded-2xl" />
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
            <button className="w-full flex items-center gap-4 px-4 py-4 text-red-500 hover:bg-red-50 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest">
              <LogOut size={20} />
              {isOpen && "Logout System"}
            </button>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 h-screen overflow-y-auto">
        <header className="px-6 md:px-10 py-6 bg-white border-b border-gray-100 flex items-center justify-between sticky top-0 z-30">
           {/* মোবাইল মেনু টগল বাটন */}
           {!isOpen && (
             <button onClick={() => setIsOpen(true)} className="lg:hidden p-2 text-emerald-600">
               <Menu size={24} />
             </button>
           )}
           <div className="ml-auto flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
              <ShieldCheck size={16} className="text-emerald-600" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">Admin Mode</span>
           </div>
        </header>

        <div className="p-6 md:p-10 max-w-7xl mx-auto">
            {children}
        </div>
      </main>
    </div>
  );
}