"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ShoppingCart, ArrowLeft, Pill } from "lucide-react";
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
        
        // আইডি ম্যাচিং (String কনভার্ট করে চেক করা হয়েছে যাতে কোনো এরর না হয়)
        const found = medicinesList.find((m: any) => String(m.id) === String(id));
        
        setMedicine(found);
      } catch (error) {
        console.error("Fetch Error:", error);
        toast.error("Failed to load medicine details");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetail();
  }, [id]);

  const handleAdd = () => {
    if (!medicine) return;
    if (typeof window === "undefined") return;

    const cart = JSON.parse(localStorage.getItem("medistore_cart") || "[]");
    
    // কার্টে আগে থেকেই এই প্রোডাক্ট আছে কিনা চেক করা (নিরাপদ আইডি ম্যাচিং)
    const existing = cart.find((item: any) => item.id === medicine.id || item.medicineId === medicine.id);
    
    if (existing) {
      existing.quantity += 1;
    } else {
      // 🎯 চেকআউট পেজ এবং ব্যাকএন্ডের রিকোয়ারমেন্ট অনুযায়ী ক্লিন অবজেক্ট ম্যাপিং
      cart.push({
        id: medicine.id,
        medicineId: medicine.id, // ব্যাকএন্ড অর্ডার কন্ট্রোলারের জন্য মোস্ট ইম্পর্ট্যান্ট
        name: medicine.name,
        price: Number(medicine.price),
        image: medicine.image || null,
        quantity: 1,
      });
    }
    
    localStorage.setItem("medistore_cart", JSON.stringify(cart));
    
    // 🔔 গ্লোবাল ন্যাভবারের কার্ট কাউন্ট ইনস্ট্যান্টলি আপডেট করার কাস্টম ইভেন্ট
    window.dispatchEvent(new Event("cartUpdated"));
    
    toast.success(`${medicine.name} added to cart!`, {
      position: "bottom-right",
      style: { background: "#10b981", color: "#fff", fontWeight: "900", borderRadius: "15px" }
    });
  };

  if (loading) return <div className="h-screen flex items-center justify-center bg-[#050a0a] text-white italic font-black uppercase tracking-widest">Loading Details...</div>;
  if (!medicine) return <div className="h-screen flex items-center justify-center bg-[#050a0a] text-white font-black uppercase tracking-widest">Product Not Found</div>;

  return (
    <div className="min-h-screen bg-[#050a0a] pb-20 selection:bg-emerald-500/30">
      <div className="p-6 lg:p-20 max-w-6xl mx-auto text-white">
        
        {/* BACK BUTTON */}
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-slate-500 hover:text-emerald-500 mb-10 font-black uppercase text-[10px] tracking-widest transition-all group"
        >
          <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" /> Back to Shop
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* 🖼️ LEFT SIDE: DYNAMIC IMAGE AREA */}
          <div className="aspect-square bg-[#111827]/40 border border-white/5 rounded-[48px] flex items-center justify-center overflow-hidden shadow-2xl relative group">
            {medicine.image ? (
              <img
                src={medicine.image.startsWith('http') ? medicine.image : `/img/${medicine.image}`}
                alt={medicine.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-emerald-950/5">
                <Pill size={80} className="text-emerald-500/10 mb-4 animate-pulse" />
                <div className="text-emerald-500/20 font-black text-4xl italic uppercase select-none tracking-wider">MediStore</div>
              </div>
            )}
            
            {/* Stock Status Inside Image Corner */}
            <div className="absolute top-6 right-6">
              <span className={`text-[9px] font-black uppercase tracking-widest px-4 py-1.5 rounded-full border ${medicine.stock > 0 ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20' : 'bg-red-500/20 text-red-400 border-red-500/20'}`}>
                {medicine.stock > 0 ? 'In Stock' : 'Out Of Stock'}
              </span>
            </div>
          </div>

          {/* 📝 RIGHT SIDE: CONTENT INFOS */}
          <div className="flex flex-col justify-center">
            <p className="text-emerald-500 font-black uppercase text-[10px] tracking-[0.4em] mb-4">
              {medicine.manufacturer || "GLOBAL PHARMA"}
            </p>
            <h1 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter mb-6 text-white group-hover:text-emerald-400 transition-colors">
              {medicine.name}
            </h1>
            <p className="text-slate-400 mb-10 text-sm leading-relaxed font-medium">
              {medicine.description || "No specific description available for this medicine. Please consult a registered doctor before use."}
            </p>

            {/* PRICE & STOCK COUNTER */}
            <div className="flex items-center gap-12 mb-10 bg-[#111827]/30 border border-white/5 p-6 rounded-3xl backdrop-blur-xl">
              <div className="flex flex-col">
                <span className="text-[9px] text-emerald-500 font-black uppercase tracking-widest mb-1">Price Per Unit</span>
                <span className="text-4xl font-black text-white tracking-tight">৳{medicine.price}</span>
              </div>
              <div className="h-10 w-[1px] bg-white/10" />
              <div className="space-y-1">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Available Stock</p>
                <p className="font-black text-xl text-slate-200">{medicine.stock} <span className="text-xs font-bold text-slate-500">PCS</span></p>
              </div>
            </div>

            {/* ADD TO CART BUTTON */}
            <button 
              onClick={handleAdd}
              disabled={medicine.stock <= 0}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-20 disabled:cursor-not-allowed py-6 rounded-[24px] font-black uppercase text-xs tracking-widest transition-all shadow-2xl active:scale-98 flex items-center justify-center gap-4 text-black bg-emerald-500 hover:bg-white"
            >
              Add to Shopping Cart <ShoppingCart size={18} fill="black" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}