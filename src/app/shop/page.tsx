"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, Eye, Pill, Activity, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast";

type Medicine = {
  id: string;
  name: string;
  price: number;
  manufacturer: string;
  image?: string | null;
  stock: number;
  description: string;
};

export default function ShopPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchMeds = async () => {
      try {
        const res = await api.medicines.getAll();
        setMedicines(res.data || res || []);
      } catch (error) {
        toast.error("Failed to load medicines!");
      } finally {
        setLoading(false);
      }
    };
    fetchMeds();
  }, []);

  const filteredMeds = medicines.filter((m) =>
    m.name?.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (med: Medicine) => {
    if (typeof window === "undefined") return;
    const cart: any[] = JSON.parse(localStorage.getItem("medistore_cart") || "[]");
    const existing = cart.find((item) => item.id === med.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id: med.id,
        medicineId: med.id,
        name: med.name,
        price: med.price,
        quantity: 1,
      });
    }

    localStorage.setItem("medistore_cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    
    toast.success(`${med.name} added!`, { 
      id: med.id,
      position: "bottom-right",
      style: { background: "#10b981", color: "#fff", fontWeight: "900", borderRadius: "15px" }
    });
  };

  return (
    <div className="pb-32 selection:bg-emerald-500/30">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        
        {/* HERO HEADER */}
        <header className="mb-24 text-center pt-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-6xl md:text-[8rem] font-black uppercase tracking-tighter text-white mb-8 leading-none italic">
              THE <span className="text-emerald-500">APOTHECARY</span>
            </h2>
            
            <div className="max-w-2xl mx-auto relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-[2.5rem] blur opacity-10 group-focus-within:opacity-30 transition duration-500"></div>
              <div className="relative flex items-center">
                <Search className="absolute left-8 text-emerald-500/50" size={24} />
                <input
                  type="text"
                  placeholder="Find your prescription..."
                  className="w-full bg-[#0d121f]/40 backdrop-blur-3xl border border-white/10 p-8 pl-20 rounded-[2.5rem] outline-none focus:border-emerald-500/50 text-white text-lg transition-all shadow-2xl placeholder:text-slate-600 font-bold"
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="mt-8 flex justify-center gap-8 text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500/40">
              <span className="flex items-center gap-2"><ShieldCheck size={14}/> 100% Genuine</span>
              <span className="flex items-center gap-2"><Zap size={14}/> Fast Delivery</span>
            </div>
          </motion.div>
        </header>

        {/* LOADING STATE */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-96 bg-white/5 animate-pulse rounded-[3.5rem] border border-white/5" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-10">
            <AnimatePresence mode="popLayout">
              {filteredMeds.map((med) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -15 }}
                  key={med.id}
                  className="group bg-[#0f172a]/20 backdrop-blur-3xl border border-white/5 p-6 md:p-8 rounded-[4rem] hover:border-emerald-500/30 transition-all duration-700 relative flex flex-col h-full overflow-hidden"
                >
                  {/* Stock Indicator Badge */}
                  <div className="absolute top-8 right-8 z-20 flex items-center gap-2">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${med.stock > 0 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}`}>
                        {med.stock > 0 ? 'Available' : 'Sold Out'}
                    </span>
                  </div>

                  {/* IMAGE AREA */}
                  <div className="relative h-56 w-full bg-gradient-to-br from-white/[0.03] to-transparent rounded-[3rem] mb-8 flex items-center justify-center overflow-hidden border border-white/5 group-hover:from-emerald-500/10 transition-all duration-700">
                    {med.image ? (
                      <img
                        src={`/img/${med.image}`} 
                        alt={med.name}
                        className="w-full h-full object-contain p-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-1000"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-3 opacity-20">
                         <Pill size={56} className="text-emerald-500" />
                         <span className="text-[10px] font-black uppercase tracking-widest">No Image</span>
                      </div>
                    )}
                    
                    {/* Hover Quick Actions */}
                    <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                        <Link href={`/shop/${med.id}`} className="bg-white text-black p-4 rounded-2xl hover:scale-110 transition-transform shadow-2xl">
                            <Eye size={20} />
                        </Link>
                    </div>
                  </div>

                  {/* INFO CONTENT */}
                  <div className="flex-1 px-2">
                    <h3 className="font-black text-2xl text-white mb-2 group-hover:text-emerald-400 transition-colors tracking-tight leading-none">
                      {med.name}
                    </h3>
                    <p className="text-[11px] text-white/30 uppercase font-black tracking-widest mb-6">
                      {med.manufacturer}
                    </p>
                  </div>

                  {/* PRICE & BUTTONS */}
                  <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-emerald-500/50 font-black uppercase tracking-widest mb-1">Price</span>
                      <span className="font-mono font-black text-3xl text-white tracking-tighter">৳{med.price}</span>
                    </div>

                    <button
                      onClick={() => addToCart(med)}
                      disabled={med.stock <= 0}
                      className="p-5 bg-emerald-500 text-[#020a08] rounded-3xl hover:bg-white hover:scale-110 transition-all shadow-2xl shadow-emerald-500/20 active:scale-90 disabled:opacity-10 disabled:grayscale group/btn"
                    >
                      <ShoppingCart size={22} fill="currentColor" className="group-hover/btn:rotate-12 transition-transform" />
                    </button>
                  </div>
                  
                  {/* Decorative Gradient Shine */}
                  <div className="absolute -inset-[100%] group-hover:inset-0 pointer-events-none bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -skew-x-12 transition-all duration-1000" />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && filteredMeds.length === 0 && (
          <div className="text-center py-40 bg-white/[0.02] rounded-[5rem] border border-dashed border-white/10 backdrop-blur-md">
            <Activity size={80} className="mx-auto text-emerald-500/10 mb-8 animate-pulse" />
            <h3 className="text-3xl font-black text-white/20 uppercase tracking-tighter">Search result empty</h3>
            <button 
              onClick={() => setSearch("")} 
              className="mt-8 px-10 py-4 bg-emerald-500 text-black rounded-2xl font-black uppercase italic tracking-widest hover:bg-white transition-all shadow-2xl shadow-emerald-500/20"
            >
                Reset Search
            </button>
          </div>
        )}
      </div>

      <style jsx global>{`
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-thumb { background: #10b981; border-radius: 10px; }
      `}</style>
    </div>
  );
}