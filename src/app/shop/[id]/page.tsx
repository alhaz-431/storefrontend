"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ShoppingCart, ArrowLeft, Pill } from "lucide-react";
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

export default function MedicineDetails() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();

  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await api.medicines.getById(id);
        console.log("🎒 Single Medicine Response:", res);

        const foundData = res?.data || res;
        
        if (foundData && (foundData.id || foundData._id)) {
          setMedicine(foundData);
        } else {
          setMedicine(null);
        }
      } catch (error: any) {
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
    const existing = cart.find((item: any) => item.id === medicine.id || item.medicineId === medicine.id);
    
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id: medicine.id,
        medicineId: medicine.id,
        name: medicine.name,
        price: Number(medicine.price),
        image: medicine.image || null,
        quantity: 1,
      });
    }
    
    localStorage.setItem("medistore_cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cartUpdated"));
    
    // 🎯 টোস্ট মেসেজের ওল্ড থিম কালার চেঞ্জ করে মডার্ন ইমারল্ড করা হলো
    toast.success(`${medicine.name} added to cart!`, {
      position: "bottom-right",
      style: { background: "#10b981", color: "#ffffff", fontWeight: "600", borderRadius: "12px" }
    });
  };

  // 🎯 লোডিং ও নট ফাউন্ড স্ক্রিনের ওল্ড কালার আপডেট করা হলো
  if (loading) return <div className="h-[70vh] flex items-center justify-center text-emerald-400 italic font-serif text-2xl font-black uppercase tracking-widest animate-pulse">Loading Details...</div>;
  if (!medicine) return <div className="h-[70vh] flex items-center justify-center text-rose-500 font-serif text-2xl font-black uppercase tracking-widest">Product Not Found</div>;

  return (
    <div className="pb-24 selection:bg-emerald-500/30 text-slate-200">
      <div className="max-w-6xl mx-auto pt-4">
        
        {/* 🏛️ LUXURY BACK BUTTON (হভার কালার মডার্ন ইমারল্ড গ্রিন করা হলো) */}
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-slate-400 hover:text-emerald-400 mb-10 font-black uppercase text-[10px] tracking-[0.2em] transition-all group px-4 lg:px-0"
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" /> Back to Apothecary
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center px-4 lg:px-0">
          
          {/* 🖼️ LEFT SIDE: PREMIUM IMAGE CONTAINER (ওল্ড ডার্টি গ্রিন টু মেটালিক ডার্ক গ্লাস কনভার্ট) */}
          <div className="aspect-square bg-gradient-to-b from-slate-900/60 to-slate-950/80 border border-slate-800/60 rounded-[3rem] flex items-center justify-center overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.6)] relative group p-8">
            {/* Fine Futuristic Mesh Overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:3rem_3rem]" />

            {medicine.image ? (
              <img
                src={medicine.image.startsWith('http') ? medicine.image : `/img/${medicine.image}`}
                alt={medicine.name}
                className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-105 relative z-10"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center relative z-10">
                <Pill size={70} className="text-slate-800 mb-4 animate-bounce" />
                <div className="text-slate-800 font-black text-3xl font-serif italic uppercase tracking-wider">MediStore</div>
              </div>
            )}
            
            {/* Live Stock Status Indicator */}
            <div className="absolute top-6 right-6 z-20">
              <span className={`text-[8px] font-black uppercase tracking-widest px-4 py-2 rounded-full border backdrop-blur-md ${medicine.stock > 0 ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                {medicine.stock > 0 ? 'In Stock' : 'Out Of Stock'}
              </span>
            </div>
          </div>

          {/* 📝 RIGHT SIDE: LUXURY PRODUCT SPECIFICATIONS */}
          <div className="flex flex-col justify-center">
            <p className="text-emerald-400 font-bold uppercase text-[10px] tracking-[0.25em] mb-3">
              {medicine.manufacturer || "GLOBAL PHARMA"}
            </p>
            <h1 className="text-4xl md:text-5xl font-black uppercase font-serif tracking-wide mb-6 text-white leading-tight">
              {medicine.name}
            </h1>
            <p className="text-slate-400 mb-10 text-sm leading-relaxed font-medium bg-slate-900/30 p-6 rounded-2xl border border-slate-800/40">
              {medicine.description || "No specific formulation description available for this curative token. Please consult a registered practitioner before final administration."}
            </p>

            {/* Architectural Price & Stock Grid Info (ওল্ড গ্রিন ব্যাকগ্রাউন্ড ফিক্সড) */}
            <div className="grid grid-cols-2 gap-6 mb-10 bg-gradient-to-r from-slate-900/60 to-slate-950/40 border border-slate-800/60 p-6 rounded-3xl backdrop-blur-md">
              <div className="flex flex-col">
                <span className="text-[8px] text-emerald-400 font-bold uppercase tracking-widest mb-1">Price Per Unit</span>
                <span className="text-3xl font-black text-white tracking-tight">৳{medicine.price}</span>
              </div>
              
              <div className="border-l border-slate-800/80 pl-6 flex flex-col justify-center">
                <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest mb-1">Available Reserve</span>
                <p className="font-black text-xl text-slate-200">
                  {medicine.stock} <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Units</span>
                </p>
              </div>
            </div>

            {/* Add To Cart Premium Action Button */}
            <button 
              onClick={handleAdd}
              disabled={medicine.stock <= 0}
              className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-800 text-slate-950 disabled:text-slate-600 rounded-2xl font-black uppercase text-xs tracking-widest transition-all duration-300 shadow-[0_15px_40px_rgba(16,185,129,0.15)] active:scale-[0.98] flex items-center justify-center gap-3 group py-4.5"
            >
              Add to Shopping Cart <ShoppingCart size={15} className="group-hover:scale-110 transition-transform" />
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}