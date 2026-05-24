"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, Eye, Pill } from "lucide-react";
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
        console.log("🎒 Backend Response in Shop:", res);

        if (Array.isArray(res)) {
          setMedicines(res);
        } else if (res && Array.isArray(res.data)) {
          setMedicines(res.data);
        } else if (res && Array.isArray(res.medicines)) {
          setMedicines(res.medicines);
        } else {
          setMedicines([]);
        }
      } catch (error: any) {
        console.error("🔥 Error Loading Medicines:", error);
        toast.error(error.message || "Failed to load medicines!");
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
    const existing = cart.find((item) => item.id === med.id || item.medicineId === med.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id: med.id,
        medicineId: med.id,
        name: med.name,
        price: Number(med.price),
        image: med.image || null,
        quantity: 1,
      });
    }

    localStorage.setItem("medistore_cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    
    toast.success(`${med.name} added to cart!`, { 
      id: med.id,
      position: "bottom-right",
      style: { background: "#c5a880", color: "#021e17", fontWeight: "900", borderRadius: "15px" }
    });
  };

  return (
    <div className="pb-32 selection:bg-[#c5a880]/30 min-h-screen text-slate-200">
      <div className="container mx-auto px-4 lg:px-0 max-w-7xl">
        
        {/* 🏛️ HERO HEADER (APOTHECARY BANNER WITH DRAWING LINE ART BACKGROUND STYLE) */}
        <header className="mb-16 text-center pt-8">
          <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="relative overflow-hidden bg-gradient-to-b from-[#022c22]/60 to-[#011a14]/40 border border-[#c5a880]/15 rounded-[2.5rem] py-14 px-4 mb-10 shadow-[0_15px_50px_rgba(0,0,0,0.5)] backdrop-blur-md">
              
              {/* Background Luxury Subtle Grid Overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(197,168,128,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(197,168,128,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
              
              <h2 className="text-5xl md:text-8xl font-black uppercase tracking-[0.05em] text-white mb-6 font-serif relative z-10 shadow-sm">
                APOTHECARY
              </h2>
              
              {/* Luxury Search Bar Wrapped inside Banner */}
              <div className="max-w-2xl mx-auto relative group z-10 px-4 md:px-0">
                <Search className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 text-[#c5a880]/60 group-focus-within:text-[#c5a880] transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="Search curated medicines..."
                  className="w-full bg-[#01140f]/90 border border-[#c5a880]/20 p-5 pl-16 rounded-full outline-none focus:border-[#c5a880] focus:ring-1 focus:ring-[#c5a880]/30 text-white placeholder-slate-500 transition-all shadow-inner text-sm"
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </motion.div>
        </header>

        {/* 📦 MEDICINE GRID SECTION */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-[430px] bg-[#022c22]/20 border border-[#c5a880]/5 animate-pulse rounded-[2.5rem]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <AnimatePresence>
              {filteredMeds.length > 0 ? (
                filteredMeds.map((med) => (
                  <motion.div
                    layout
                    key={med.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="group bg-[#02231b]/40 backdrop-blur-xl border border-[#c5a880]/10 rounded-[2.5rem] hover:border-[#c5a880]/40 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] transition-all duration-500 relative flex flex-col overflow-hidden shadow-xl"
                  >
                    {/* Live Stock Badge Counter */}
                    <div className="absolute top-5 right-5 z-20">
                      <span className={`text-[8px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full border backdrop-blur-md ${med.stock > 0 ? 'bg-[#022c22]/80 text-emerald-400 border-emerald-500/20' : 'bg-red-950/80 text-red-400 border-red-500/20'}`}>
                        {med.stock > 0 ? 'In Stock' : 'Out Of Stock'}
                      </span>
                    </div>

                    {/* 🖼️ BRANDED MEDICINE IMAGE LAYER */}
                    <div className="relative h-60 w-full bg-[#01140f]/60 overflow-hidden border-b border-[#c5a880]/10 flex items-center justify-center p-4">
                      {med.image ? (
                        <img
                          src={med.image.startsWith('http') ? med.image : `/img/${med.image}`}
                          alt={med.name}
                          className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-[#022c22]/10">
                          <Pill size={44} className="text-[#c5a880]/20 mb-2" />
                          <span className="text-[9px] font-bold text-[#c5a880]/30 tracking-widest uppercase font-serif">MediStore</span>
                        </div>
                      )}
                      
                      {/* Luxury Pop-up Action (View Details Overlay) */}
                      <div className="absolute inset-0 bg-[#01140f]/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                        <Link 
                          href={`/shop/${med.id}`} 
                          className="bg-gradient-to-br from-[#c5a880] to-[#8a7355] text-[#021e17] px-5 py-3 rounded-xl font-black text-[10px] tracking-widest flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-xl"
                        >
                          <Eye size={14} /> VIEW DETAILS
                        </Link>
                      </div>
                    </div>

                    {/* 📝 METADATA & DATA DETAILS CARD BODY */}
                    <div className="p-6 flex flex-col flex-1 bg-gradient-to-b from-transparent to-[#01140f]/30">
                      <div className="mb-6">
                        <p className="text-[9px] text-[#c5a880] font-black uppercase tracking-[0.2em] mb-1.5">
                          {med.manufacturer || "GLOBAL PHARMA"}
                        </p>
                        <h3 className="font-black text-lg text-white group-hover:text-[#c5a880] transition-colors uppercase font-serif tracking-wide line-clamp-1">
                          {med.name}
                        </h3>
                      </div>

                      {/* Pricing and Direct Shopping Integration */}
                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-[#c5a880]/5">
                        <div className="flex flex-col">
                          <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Price per unit</span>
                          <span className="font-black text-xl text-white tracking-tight">৳{med.price}</span>
                        </div>

                        <button
                          onClick={() => addToCart(med)}
                          disabled={med.stock <= 0}
                          className="p-3.5 bg-gradient-to-br from-[#c5a880] to-[#8a7355] hover:from-white hover:to-slate-100 text-[#021e17] rounded-xl transition-all duration-300 shadow-md active:scale-90 disabled:opacity-10 disabled:cursor-not-allowed group/btn"
                        >
                          <ShoppingCart size={16} fill="#021e17" className="group-hover/btn:scale-110 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                /* Empty Product Error State Screen */
                <div className="col-span-full text-center py-24 bg-[#02231b]/20 rounded-[2.5rem] border border-[#c5a880]/10 backdrop-blur-md">
                  <Pill className="mx-auto mb-4 text-[#c5a880]/40 animate-pulse" size={40} />
                  <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No Medicines found matching your search.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}