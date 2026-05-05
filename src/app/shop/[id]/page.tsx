"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ShoppingCart, ArrowLeft, ShieldCheck, Truck } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast";

export default function MedicineDetails() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [medicine, setMedicine] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await api.medicines.getAll();
        
        // API রেসপন্স Array হলে সেটিই, নতুবা res.data
        const medicinesList = Array.isArray(res) ? res : (res?.data || []);
        
        // আইডি ম্যাচিং (String কনভার্ট করে চেক করা হয়েছে যাতে কোনো এরর না হয়)
        const found = medicinesList.find((m: any) => String(m.id) === String(id));
        
        setMedicine(found);
      } catch (error) {
        console.error("Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetail();
  }, [id]);

  const handleAdd = () => {
    if (!medicine) return;
    const cart = JSON.parse(localStorage.getItem("medistore_cart") || "[]");
    const existing = cart.find((item: any) => item.id === medicine.id);
    
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...medicine, quantity: 1 });
    }
    
    localStorage.setItem("medistore_cart", JSON.stringify(cart));
    toast.success(`${medicine.name} added to cart!`);
  };

  if (loading) return <div className="h-screen flex items-center justify-center text-white italic font-black uppercase">Loading Details...</div>;
  if (!medicine) return <div className="h-screen flex items-center justify-center text-white font-black uppercase">Product Not Found</div>;

  return (
    <div className="p-6 lg:p-20 max-w-6xl mx-auto text-white">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-500 hover:text-emerald-500 mb-10 font-bold uppercase text-[10px] tracking-widest transition-all">
        <ArrowLeft size={16} /> Back to Shop
      </button>

      <div className="grid lg:grid-cols-2 gap-16">
        <div className="aspect-square bg-white/[0.03] border border-white/10 rounded-[48px] flex items-center justify-center">
           <div className="text-emerald-500/20 font-black text-6xl italic uppercase select-none">MediStore</div>
        </div>

        <div className="flex flex-col justify-center">
          <p className="text-emerald-500 font-black uppercase text-[10px] tracking-[0.4em] mb-4">In Stock - Ready to Ship</p>
          <h1 className="text-5xl font-black italic uppercase tracking-tighter mb-4">{medicine.name}</h1>
          <p className="text-slate-400 mb-8 italic">{medicine.description}</p>

          <div className="flex items-center gap-10 mb-10">
            <div className="text-4xl font-mono font-black text-emerald-500">৳{medicine.price}</div>
            <div className="space-y-1">
              <p className="text-[10px] text-slate-500 font-bold uppercase">Stock Level</p>
              <p className="font-bold">{medicine.stock} PCS</p>
            </div>
          </div>

          <button 
            onClick={handleAdd}
            className="w-full bg-emerald-600 hover:bg-emerald-500 py-6 rounded-[24px] font-black uppercase text-sm tracking-widest transition-all shadow-2xl shadow-emerald-900/30 flex items-center justify-center gap-4"
          >
            Add to Shopping Cart <ShoppingCart size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}