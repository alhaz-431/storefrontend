"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ShoppingCart, Eye, Pill, Loader2 } from "lucide-react";
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
        // ব্যাকএন্ডের রেসপন্স অ্যারে বা res.data ফরমেট হ্যান্ডলিং করা হলো
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
    
    // কার্টে ডুপ্লিকেট চেক করার জন্য নিরাপদ আইডি ফাইন্ড লজিক
    const existing = cart.find((item) => item.id === med.id || item.medicineId === med.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id: med.id,
        medicineId: med.id, // ব্যাকএন্ডের অর্ডার কন্ট্রোলারের জন্য রিকোয়ার্ড ফিল্ড
        name: med.name,
        price: Number(med.price),
        image: med.image || null,
        quantity: 1,
      });
    }

    localStorage.setItem("medistore_cart", JSON.stringify(cart));
    
    // গ্লোবাল ন্যাভবারের কার্ট কাউন্ট ডাইনামিকালি আপডেট করার কাস্টম ইভেন্ট
    window.dispatchEvent(new Event("cartUpdated"));
    
    toast.success(`${med.name} added to cart!`, { 
      id: med.id,
      position: "bottom-right",
      style: { background: "#10b981", color: "#fff", fontWeight: "900", borderRadius: "15px" }
    });
  };

  
  return (
    <div className="pb-32 selection:bg-emerald-500/30 min-h-screen bg-white text-green-900">
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        
        {/* HERO HEADER */}
        <header className="mb-20 text-center pt-10">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-white mb-6 italic">
              THE <span className="text-emerald-500">APOTHECARY</span>
            </h2>
            
            <div className="max-w-2xl mx-auto relative group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-500/50" size={20} />
              <input
                type="text"
                placeholder="Search medicine..."
                className="w-full bg-[#111827]/40 border border-white/10 p-6 pl-16 rounded-full outline-none focus:border-emerald-500/50 text-white transition-all shadow-2xl"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </motion.div>
        </header>

        {/* MEDICINE GRID */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-[420px] bg-white/5 animate-pulse rounded-[3rem]" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            <AnimatePresence>
              {filteredMeds.length > 0 ? (
                filteredMeds.map((med) => (
                  <motion.div
                    layout
                    key={med.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="group bg-[#111827]/60 backdrop-blur-xl border border-white/5 rounded-[3rem] hover:border-emerald-500/30 transition-all duration-500 relative flex flex-col overflow-hidden shadow-2xl"
                  >
                    {/* Stock Status Badge */}
                    <div className="absolute top-5 right-5 z-20">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${med.stock > 0 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20' : 'bg-red-500/20 text-red-400 border-red-500/20'}`}>
                        {med.stock > 0 ? 'Available' : 'Sold Out'}
                      </span>
                    </div>

                    {/* IMAGE AREA */}
                    <div className="relative h-64 w-full bg-black/20 overflow-hidden border-b border-white/5">
                      {med.image ? (
                        <img
                          src={med.image.startsWith('http') ? med.image : `/img/${med.image}`}
                          alt={med.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-emerald-950/10">
                          <Pill size={40} className="text-emerald-500/20" />
                        </div>
                      )}
                      
                      {/* View Details Button */}
                      <Link 
                        href={`/shop/${med.id}`} 
                        className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md text-white p-3 rounded-2xl opacity-0 group-hover:opacity-100 transition-all hover:bg-emerald-500 hover:text-black flex items-center gap-2 text-[10px] font-bold tracking-wider"
                      >
                        <Eye size={16} /> VIEW DETAILS
                      </Link>
                    </div>

                    {/* CONTENT BODY */}
                    <div className="p-7 flex flex-col flex-1">
                      <div className="mb-6">
                        <h3 className="font-black text-xl text-white group-hover:text-emerald-400 transition-colors uppercase italic tracking-tight line-clamp-1">
                          {med.name}
                        </h3>
                        <p className="text-[10px] text-slate-500 font-bold tracking-widest mt-1">
                          {med.manufacturer}
                        </p>
                      </div>

                      <div className="mt-auto flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-[9px] text-emerald-500 font-black uppercase tracking-widest">Price</span>
                          <span className="font-black text-2xl text-white">৳{med.price}</span>
                        </div>

                        <button
                          onClick={() => addToCart(med)}
                          disabled={med.stock <= 0}
                          className="p-4 bg-emerald-500 text-black rounded-2xl hover:bg-white hover:scale-110 transition-all shadow-lg active:scale-90 disabled:opacity-20 disabled:cursor-not-allowed"
                        >
                          <ShoppingCart size={20} fill="black" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full text-center py-20 bg-[#111827]/20 rounded-[3rem] border border-white/5">
                  <Pill className="mx-auto mb-4 text-slate-600 animate-bounce" size={48} />
                  <p className="text-slate-400 font-bold uppercase tracking-wider text-sm">No Medicines found matching your search.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}