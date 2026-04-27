"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Pill, 
  ShoppingBag, 
  LogOut, 
  UserCircle,
  Activity
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
      {/* SIDEBAR */}
      <aside className="w-72 border-r border-white/5 bg-[#05070f] p-8 hidden lg:flex flex-col">
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
          <button className="flex items-center gap-4 px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest text-red-500 hover:bg-red-500/10 transition-all w-full">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 relative overflow-y-auto">
        {/* উপরের বার (Mobile Toggle বা User Info এর জন্য) */}
        <header className="h-20 border-b border-white/5 flex items-center justify-end px-10 bg-[#02040a]/50 backdrop-blur-xl sticky top-0 z-50">
           <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-[10px] font-black uppercase text-emerald-500 tracking-widest leading-none">Seller Mode</p>
                <p className="text-sm font-bold italic text-white uppercase">Alfaz ARbby</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-emerald-600/20 border border-emerald-600/30 flex items-center justify-center font-black text-emerald-500 text-xs italic">
                A
              </div>
           </div>
        </header>

        {/* পেজের কন্টেন্ট এখানে লোড হবে */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="pb-20"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}