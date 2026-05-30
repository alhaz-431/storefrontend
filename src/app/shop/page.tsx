"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, Eye } from "lucide-react";
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
    toast.success(`${med.name} added to cart!`);
  };

  return (
    <div className="pb-32 bg-gradient-to-b from-[#f8fafc] via-[#ffffff] to-[#f1f5f9] min-h-screen text-slate-800 pt-8 selection:bg-emerald-500/20">
      <div className="container mx-auto px-4 lg:px-0 max-w-7xl">
        <header className="mb-12 text-center">
          <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="relative overflow-hidden bg-gradient-to-br from-white via-slate-50 to-slate-100 border border-slate-200 rounded-[2.5rem] py-16 px-4 mb-10 shadow-sm backdrop-blur-md">
              <h2 className="text-4xl md:text-7xl font-black uppercase tracking-[0.1em] text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500 mb-6 font-serif">
                APOTHECARY
              </h2>
              <div className="max-w-xl mx-auto relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Search curated medicines..."
                  className="w-full bg-white border border-slate-200 p-4 pl-14 rounded-full outline-none focus:border-emerald-500 transition-all text-sm shadow-inner"
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </motion.div>
        </header>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => <div key={i} className="h-[420px] bg-slate-100 animate-pulse rounded-[2.5rem]" />)}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredMeds.length > 0 ? (
                filteredMeds.map((med) => (
                  <motion.div layout key={med.id} className="group bg-white border border-slate-200 rounded-[2.5rem] relative flex flex-col overflow-hidden shadow-sm hover:shadow-lg transition-all">
                    
                    <div className="relative h-52 w-full bg-slate-50 overflow-hidden border-b border-slate-100 flex items-center justify-center p-6">
                      {/* 🎯 আপডেট করা ইমেজ ট্যাগ */}
                      <img
                        src={med.image || "/img/placeholder.jpg"}
                        alt={med.name}
                        onError={(e) => { e.currentTarget.src = "/img/placeholder.jpg"; }}
                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <p className="text-[9px] text-emerald-600 font-bold uppercase mb-1">{med.manufacturer || "GLOBAL PHARMA"}</p>
                      <h3 className="font-bold text-base text-slate-800 line-clamp-1">{med.name}</h3>
                      <div className="flex flex-col mb-4 mt-2">
                        <span className="font-extrabold text-lg text-slate-900">৳{med.price}</span>
                      </div>
                      
                      <div className="mt-auto pt-4 border-t border-slate-100 flex gap-2">
                        <button onClick={() => addToCart(med)} disabled={med.stock <= 0} className="flex-1 py-3 bg-emerald-500 text-white rounded-xl font-bold text-[11px] uppercase flex items-center justify-center gap-1.5 hover:bg-emerald-600 transition-all">
                          <ShoppingCart size={13} /> Add to Cart
                        </button>
                        <Link href={`/shop/${med.id}`} className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-bold text-[11px] uppercase flex items-center justify-center gap-1.5 hover:bg-slate-200 transition-all">
                          <Eye size={13} /> View
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-20"><p>No Medicines found.</p></div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}