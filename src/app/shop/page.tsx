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
    // 🎯 সম্পূর্ণ প্রিমিয়াম মেটালিক হোয়াইট গ্রেডিয়েন্ট ব্যাকগ্রাউন্ড
    <div className="pb-32 bg-gradient-to-b from-[#f8fafc] via-[#ffffff] to-[#f1f5f9] min-h-screen text-slate-800 pt-8 selection:bg-emerald-500/20">
      <div className="container mx-auto px-4 lg:px-0 max-w-7xl">
        
        {/* 🏛️ HERO HEADER (লাক্সারি লাইট থিম ব্যানার) */}
        <header className="mb-12 text-center">
          <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="relative overflow-hidden bg-gradient-to-br from-white via-slate-50 to-slate-100 border border-slate-200 rounded-[2.5rem] py-16 px-4 mb-10 shadow-sm backdrop-blur-md">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.01)_1px,transparent_1px)] bg-[size:3rem_3rem]" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-emerald-500/5 blur-[100px] pointer-events-none" />
              
              <h2 className="text-4xl md:text-7xl font-black uppercase tracking-[0.1em] text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 mb-6 font-serif relative z-10">
                APOTHECARY
              </h2>
              
              <div className="max-w-xl mx-auto relative group z-10 px-4 md:px-0">
                <Search className="absolute left-6 md:left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" size={16} />
                <input
                  type="text"
                  placeholder="Search curated medicines..."
                  className="w-full bg-white border border-slate-200 p-4 pl-14 rounded-full outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-slate-900 placeholder-slate-400 transition-all text-sm shadow-inner"
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
              <div key={i} className="h-[420px] bg-slate-100 border border-slate-200 animate-pulse rounded-[2.5rem]" />
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
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="group bg-white border border-slate-200/80 rounded-[2.5rem] hover:border-emerald-500/40 hover:shadow-[0_20px_40px_rgba(0,0,0,0.06),0_0_30px_rgba(16,185,129,0.05)] hover:-translate-y-1.5 transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] relative flex flex-col overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.02)]"
                  >
                    {/* স্টক ব্যাজ */}
                    <div className="absolute top-4 right-4 z-20">
                      <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border backdrop-blur-md ${med.stock > 0 ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-rose-50 text-rose-600 border-rose-200'}`}>
                        {med.stock > 0 ? 'In Stock' : 'Out Of Stock'}
                      </span>
                    </div>

                    {/* 🖼️ MEDICINE IMAGE LAYER (হোভার ওভারলে বাটন রিমুভ করা হয়েছে) */}
                    <div className="relative h-52 w-full bg-slate-50/50 overflow-hidden border-b border-slate-100 flex items-center justify-center p-6">
                      {med.image ? (
                        <img
                          src={med.image.startsWith('http') ? med.image : `/img/${med.image}`}
                          alt={med.name}
                          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-102"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center bg-slate-100/30">
                          <Pill size={32} className="text-slate-300 mb-2" />
                          <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase">MediStore</span>
                        </div>
                      )}
                    </div>

                    {/* 📝 CARD BODY */}
                    <div className="p-5 flex flex-col flex-1">
                      <div className="mb-4">
                        <p className="text-[9px] text-emerald-600 font-bold tracking-wider uppercase mb-1">
                          {med.manufacturer || "GLOBAL PHARMA"}
                        </p>
                        <h3 className="font-bold text-base text-slate-800 transition-colors tracking-wide line-clamp-1">
                          {med.name}
                        </h3>
                      </div>

                      {/* প্রাইস সেকশন */}
                      <div className="flex flex-col mb-4">
                        <span className="text-[9px] text-slate-400 font-medium uppercase tracking-wider">Price</span>
                        <span className="font-extrabold text-lg text-slate-900">৳{med.price}</span>
                      </div>

                      {/* 🛠️ বাটন প্যানেল: Add to Cart এবং View Details পাশাপাশি সেট করা হলো */}
                      <div className="mt-auto pt-4 border-t border-slate-100 flex gap-2">
                        {/* Add to Cart Button */}
                        <button
                          onClick={() => addToCart(med)}
                          disabled={med.stock <= 0}
                          className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-100 text-white disabled:text-slate-400 rounded-xl font-bold text-[11px] tracking-wider uppercase transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 group/btn shadow-sm"
                        >
                          <ShoppingCart size={13} className="transition-transform group-hover/btn:scale-110" /> Add to Cart
                        </button>

                        {/* View Details Button */}
                        <Link 
                          href={`/shop/${med.id}`} 
                          className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-[11px] tracking-wider uppercase transition-all duration-200 active:scale-95 flex items-center justify-center gap-1.5 shadow-sm border border-slate-200/60"
                        >
                          <Eye size={13} /> View Details
                        </Link>
                      </div>

                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-20 bg-slate-50 rounded-[2.5rem] border border-slate-200">
                  <Pill className="mx-auto mb-4 text-slate-300 animate-pulse" size={36} />
                  <p className="text-slate-400 font-medium tracking-wide text-sm">No Medicines found matching your search.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}