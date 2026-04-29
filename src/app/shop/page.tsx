"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, ShoppingCart, Eye } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast";

export default function ShopPage() {
  const [medicines, setMedicines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchMeds = async () => {
      try {
        const res = await api.medicines.getAll();
        setMedicines(res.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchMeds();
  }, []);

  const addToCart = (med: any) => {
    const cart = JSON.parse(localStorage.getItem("medistore_cart") || "[]");
    const existing = cart.find((item: any) => item.id === med.id);
    
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...med, quantity: 1 });
    }
    
    localStorage.setItem("medistore_cart", JSON.stringify(cart));
    toast.success(`${med.name} added to cart!`);
  };

  const filteredMeds = medicines.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-6 lg:p-20 max-w-7xl mx-auto">
      <header className="mb-12 text-center">
        <h2 className="text-5xl font-black italic uppercase tracking-tighter mb-4">
          Premium <span className="text-emerald-500">Pharmacy</span>
        </h2>
        <div className="max-w-md mx-auto relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search for medicines..."
            className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl outline-none focus:border-emerald-500 transition-all"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-64 bg-white/5 animate-pulse rounded-[32px]" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredMeds.map((med) => (
            <motion.div 
              whileHover={{ y: -10 }}
              key={med.id} 
              className="bg-white/[0.03] border border-white/10 p-6 rounded-[32px] group hover:border-emerald-500/50 transition-all"
            >
              <div className="h-40 bg-emerald-500/10 rounded-2xl mb-6 flex items-center justify-center">
                <span className="text-[10px] font-black uppercase text-emerald-500/50 tracking-[0.5em]">No Image</span>
              </div>
              <h3 className="font-bold text-lg mb-1">{med.name}</h3>
              <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-4 italic">{med.manufacturer || "General Pharma"}</p>
              
              <div className="flex justify-between items-center mt-auto">
                <span className="font-mono font-black text-emerald-500 text-xl">৳{med.price}</span>
                <div className="flex gap-2">
                  <Link href={`/shop/${med.id}`} className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
                    <Eye size={16} />
                  </Link>
                  <button 
                    onClick={() => addToCart(med)}
                    className="p-3 bg-emerald-600 rounded-xl hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-900/20"
                  >
                    <ShoppingCart size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}