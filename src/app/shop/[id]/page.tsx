"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ShoppingCart, ArrowLeft, ShieldCheck, Truck } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast";

export default function MedicineDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [medicine, setMedicine] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const res = await api.medicines.getAll();
        const found = res.data.find((m: any) => m.id === id);
        setMedicine(found);
      } catch (error) { console.error(error); }
      finally { setLoading(false); }
    };
    fetchDetail();
  }, [id]);

  const handleAdd = () => {
    const cart = JSON.parse(localStorage.getItem("medistore_cart") || "[]");
    const existing = cart.find((item: any) => item.id === medicine.id);
    if (existing) existing.quantity += 1;
    else cart.push({ ...medicine, quantity: 1 });
    localStorage.setItem("medistore_cart", JSON.stringify(cart));
    toast.success("Added to cart!");
  };

  if (loading) return <div className="h-screen flex items-center justify-center text-white italic font-black uppercase tracking-widest">Loading Details...</div>;
  if (!medicine) return <div className="h-screen flex items-center justify-center text-white font-black uppercase">Not Found</div>;

  return (
    <div className="p-6 lg:p-20 max-w-6xl mx-auto">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-emerald-500 mb-10 font-bold uppercase text-[10px] tracking-widest">
        <ArrowLeft size={16} /> Back to Shop
      </button>

      <div className="grid lg:grid-cols-2 gap-16">
        <div className="aspect-square bg-white/[0.03] border border-white/10 rounded-[48px] flex items-center justify-center overflow-hidden">
           <div className="text-emerald-500/20 font-black text-6xl italic uppercase -rotate-12 select-none">MediStore</div>
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-emerald-500 font-black uppercase text-[10px] tracking-[0.4em] mb-4">In Stock - Ready to Ship</p>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter mb-4 leading-tight">{medicine.name}</h1>
          <p className="text-slate-400 mb-8 leading-relaxed italic">{medicine.description || "This is a high-quality pharmaceutical product certified by national health standards."}</p>

          <div className="flex items-center gap-10 mb-10">
            <div className="text-4xl font-mono font-black text-emerald-500">৳{medicine.price}</div>
            <div className="h-10 w-px bg-white/10" />
            <div className="space-y-1">
              <p className="text-[10px] text-slate-500 font-bold uppercase">Stock Level</p>
              <p className="font-bold">{medicine.stock} PCS AVAILABLE</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-10">
            <div className="bg-white/5 p-4 rounded-2xl flex items-center gap-3">
              <ShieldCheck className="text-emerald-500" size={20} />
              <span className="text-[9px] font-black uppercase tracking-widest">100% Genuine</span>
            </div>
            <div className="bg-white/5 p-4 rounded-2xl flex items-center gap-3">
              <Truck className="text-emerald-500" size={20} />
              <span className="text-[9px] font-black uppercase tracking-widest">Fast Delivery</span>
            </div>
          </div>

          <button 
            onClick={handleAdd}
            className="w-full bg-emerald-600 hover:bg-emerald-500 py-6 rounded-[24px] font-black uppercase text-sm tracking-widest transition-all shadow-2xl shadow-emerald-900/30 flex items-center justify-center gap-4 group"
          >
            Add to Shopping Cart <ShoppingCart size={20} className="group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}