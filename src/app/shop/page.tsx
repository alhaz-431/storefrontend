"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, Eye, Pill, Activity } from "lucide-react";
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
    
    // লেআউটের কাউন্টার আপডেট করার জন্য কাস্টম ইভেন্ট
    window.dispatchEvent(new Event("cartUpdated"));
    
    toast.success(`${med.name} added!`, { 
      id: med.id,
      position: "bottom-right",
      style: { background: "#10b981", color: "#fff", fontWeight: "bold" }
    });
  };

  return (
    <div className="pb-20">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        
        {/* HEADER */}
        <header className="mb-16 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white mb-6">
              THE <span className="text-emerald-500">APOTHECARY</span>
            </h2>
            
            <div className="max-w-2xl mx-auto relative group">
              <div className="absolute -inset-1 bg-emerald-500 rounded-3xl blur opacity-10 group-hover:opacity-25 transition duration-500"></div>
              <div className="relative flex items-center">
                <Search className="absolute left-6 text-emerald-500/50" size={20} />
                <input
                  type="text"
                  placeholder="Search your medicine..."
                  className="w-full bg-[#0d121f]/50 backdrop-blur-md border border-white/10 p-6 pl-16 rounded-[2rem] outline-none focus:border-emerald-500/50 text-white transition-all shadow-2xl"
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </motion.div>
        </header>

        {/* LOADING */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-80 bg-white/5 animate-pulse rounded-[2.5rem] border border-white/5" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            <AnimatePresence>
              {filteredMeds.map((med) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -10 }}
                  key={med.id}
                  className="group bg-[#0f172a]/30 backdrop-blur-xl border border-white/5 p-5 md:p-7 rounded-[3rem] hover:border-emerald-500/30 transition-all duration-500 relative flex flex-col h-full overflow-hidden"
                >
                  {/* Stock Badge */}
                  <div className="absolute top-6 right-6 z-20">
                    <div className={`h-2 w-2 rounded-full animate-ping absolute ${med.stock > 0 ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    <div className={`h-2 w-2 rounded-full relative ${med.stock > 0 ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  </div>

                  {/* IMAGE */}
                  <div className="relative h-48 w-full bg-gradient-to-br from-emerald-500/5 to-transparent rounded-[2rem] mb-6 flex items-center justify-center group-hover:from-emerald-500/10 transition-colors">
                    {med.image ? (
                      <img
                        src={med.image}
                        alt={med.name}
                        className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <Pill size={48} className="text-emerald-500/20" />
                    )}
                  </div>

                  {/* CONTENT */}
                  <div className="flex-1">
                    <h3 className="font-black text-xl text-white mb-1 group-hover:text-emerald-400 transition-colors">{med.name}</h3>
                    <p className="text-[10px] text-emerald-500/60 uppercase font-black tracking-[0.2em] mb-4">{med.manufacturer}</p>
                  </div>

                  {/* FOOTER */}
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex flex-col">
                      <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Price</span>
                      <span className="font-mono font-black text-2xl text-white">৳{med.price}</span>
                    </div>

                    <div className="flex gap-2">
                      <Link
                        href={`/shop/${med.id}`}
                        className="p-3 bg-white/5 text-slate-400 rounded-2xl hover:bg-white/10 hover:text-white transition-all border border-white/5"
                      >
                        <Eye size={18} />
                      </Link>

                      <button
                        onClick={() => addToCart(med)}
                        disabled={med.stock <= 0}
                        className="p-3 bg-emerald-500 text-[#020a08] rounded-2xl hover:bg-emerald-400 transition-all shadow-xl shadow-emerald-500/10 active:scale-90 disabled:opacity-20"
                      >
                        <ShoppingCart size={18} fill="currentColor" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredMeds.length === 0 && (
          <div className="text-center py-40 bg-white/5 rounded-[4rem] border border-dashed border-white/10">
            <Activity size={60} className="mx-auto text-emerald-500/20 mb-6 animate-pulse" />
            <h3 className="text-2xl font-black text-slate-500 uppercase tracking-tighter">No Medicines Found</h3>
            <button onClick={() => setSearch("")} className="mt-6 px-8 py-3 bg-emerald-500/10 text-emerald-500 rounded-full font-bold hover:bg-emerald-500 hover:text-black transition-all">Clear Filters</button>
          </div>
        )}
      </div>
    </div>
  );
}