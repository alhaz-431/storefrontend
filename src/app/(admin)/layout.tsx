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
      
      {/* --- SIDEBAR --- */}
      <aside className={`fixed inset-y-0 left-0 z-50 bg-gray-300 border-r border-gray-100 shadow-sm transition-all duration-300 ${isOpen ? "w-72" : "w-20"} lg:relative`}>
        <div className="flex flex-col h-full py-8">
          
          {/* Logo Section */}
          <div className="px-6 mb-12 flex items-center justify-between">
            {isOpen && (
              <h1 className="text-xl font-black italic text-blue-600 tracking-tighter">
                MEDISTORE <span className="text-[10px] block not-italic font-bold text-gray-400 uppercase tracking-widest">Admin Control</span>
              </h1>
            )}
            <button onClick={() => setIsOpen(!isOpen)} className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-blue-600">
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-4 space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.path;
              return (
                <Link key={item.path} href={item.path}>
                  <div className={`flex items-center gap-4 px-4 py-4 rounded-2xl transition-all relative group cursor-pointer ${isActive ? "text-white shadow-md shadow-blue-500/30" : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"}`}>
                    {isActive && (
                      <motion.div layoutId="navActive" className="absolute inset-0 bg-blue-600 rounded-2xl" />
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
        {/* Header */}
        <header className="px-10 py-6 bg-white border-b border-gray-100 flex justify-end sticky top-0 z-40">
           <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
              <ShieldCheck size={16} className="text-blue-600" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-900">Admin Mode</span>
           </div>
        </header>

        {/* Content */}
        <div className="p-6 md:p-10 max-w-7xl mx-auto">
            {children}
        </div>
      </main>
    </div>
  );
}