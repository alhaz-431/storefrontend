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
      style: { background: "#10b981", color: "#ffffff", fontWeight: "600", borderRadius: "12px" }
    });
  };

  return (
    // 🎯 ডার্টি গ্রিন কালার বদলে সম্পূর্ণ প্রিমিয়াম মেটালিক ডার্ক ব্যাকগ্রাউন্ড সেট করা হলো
    <div className="pb-32 bg-[#0b0f19] selection:bg-emerald-500/30 min-h-screen text-slate-200 pt-8">
      <div className="container mx-auto px-4 lg:px-0 max-w-7xl">
        
        {/* 🏛️ HERO HEADER (APOTHECARY BANNER - CLEAN MODERN DARK LOOK) */}
        <header className="mb-12 text-center">
          <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            {/* ডুপ্লিকেট বারের মতো লাগা কালারগুলো রিমুভ করে আল্ট্রা-মডার্ন গ্লাসি গ্রেডিয়েন্ট আনা হয়েছে */}
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-[#0d1527] to-slate-950 border border-slate-800 rounded-[2.5rem] py-16 px-4 mb-10 shadow-2xl backdrop-blur-md">
              
              {/* মডার্ন ফাইন গ্রিড ওভারলে */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:3rem_3rem]" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/10 blur-[100px] pointer-events-none" />
              
              <h2 className="text-4xl md:text-7xl font-black uppercase tracking-[0.1em] text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200 mb-6 font-serif relative z-10">
                APOTHECARY
              </h2>
              
              {/* মডার্ন গ্লাসি সার্চ বার */}
              <div className="max-w-xl mx-auto relative group z-10 px-4 md:px-0">
                <Search className="absolute left-6 md:left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-400 transition-colors" size={16} />
                <input
                  type="text"
                  placeholder="Search curated medicines..."
                  className="w-full bg-slate-950/80 border border-slate-800 p-4 pl-14 rounded-full outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/10 text-white placeholder-slate-600 transition-all text-sm shadow-inner"
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </motion.div>
        </header>

        {/* 📦 MEDICINE GRID SECTION */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-[400px] bg-slate-900/40 border border-slate-800/50 animate-pulse rounded-[2rem]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
                    className="group bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-[2rem] hover:border-emerald-500/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] hover:-translate-y-1 transition-all duration-300 relative flex flex-col overflow-hidden shadow-lg"
                  >
                    {/* মডার্ন স্টক ব্যাজ */}
                    <div className="absolute top-4 right-4 z-20">
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border backdrop-blur-md ${med.stock > 0 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                        {med.stock > 0 ? 'In Stock' : 'Out Of Stock'}
                      </span>
                    </div>

                    {/* 🖼️ MEDICINE IMAGE LAYER */}
                    <div className="relative h-56 w-full bg-slate-950/60 overflow-hidden border-b border-slate-800/60 flex items-center justify-center p-6">
                      {med.image ? (
                        <img
                          src={med.image.startsWith('http') ? med.image : `/img/${med.image}`}
                          alt={med.name}
                          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900/20">
                          <Pill size={36} className="text-slate-700 mb-2" />
                          <span className="text-[9px] font-bold text-slate-600 tracking-widest uppercase">MediStore</span>
                        </div>
                      )}
                      
                      {/* স্মুথ ডিটেইলস ওভারলে */}
                      <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                        <Link 
                          href={`/shop/${med.id}`} 
                          className="bg-white text-slate-950 px-4 py-2.5 rounded-xl font-bold text-[11px] tracking-wider flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-xl hover:bg-emerald-400 hover:text-slate-950"
                        >
                          <Eye size={14} /> VIEW DETAILS
                        </Link>
                      </div>
                    </div>

                    {/* 📝 CARD BODY */}
                    <div className="p-5 flex flex-col flex-1 bg-gradient-to-b from-transparent to-slate-950/20">
                      <div className="mb-4">
                        <p className="text-[9px] text-emerald-400 font-bold tracking-wider uppercase mb-1">
                          {med.manufacturer || "GLOBAL PHARMA"}
                        </p>
                        <h3 className="font-bold text-base text-slate-100 group-hover:text-emerald-400 transition-colors tracking-wide line-clamp-1">
                          {med.name}
                        </h3>
                      </div>

                      {/* প্রাইস এবং মডার্ন কার্ট বাটন */}
                      <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-800/40">
                        <div className="flex flex-col">
                          <span className="text-[9px] text-slate-500 font-medium uppercase tracking-wider">Price</span>
                          <span className="font-extrabold text-lg text-white">৳{med.price}</span>
                        </div>

                        <button
                          onClick={() => addToCart(med)}
                          disabled={med.stock <= 0}
                          className="p-3 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 text-slate-950 disabled:text-slate-600 rounded-xl transition-all duration-200 shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group/btn"
                        >
                          <ShoppingCart size={15} className="transition-transform group-hover/btn:scale-110" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                /* Empty Product Screen */
                <div className="col-span-full text-center py-20 bg-slate-900/20 rounded-[2rem] border border-slate-800 backdrop-blur-md">
                  <Pill className="mx-auto mb-4 text-slate-700 animate-pulse" size={36} />
                  <p className="text-slate-500 font-medium tracking-wide text-sm">No Medicines found matching your search.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}