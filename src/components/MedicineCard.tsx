"use client";
import { useCart } from "@/context/CartContext";
import { FiEye, FiPlus } from "react-icons/fi";
import Link from "next/link";

interface MedicineProps {
  medicine: {
    _id?: string; // ব্যাকএন্ড থেকে আসা ID
    id?: string;
    name: string;
    price: number;
    image: string;
    category: string;
    description?: string; // যদি ব্যাকএন্ডে থাকে
  };
}

export default function MedicineCard({ medicine }: MedicineProps) {
  const { addToCart } = useCart();
  
  // আইডি হ্যান্ডেল করা (ব্যাকএন্ডে _id বা id যেকোনো একটা থাকতে পারে)
  const medicineId = medicine._id || medicine.id;

  return (
    <div className="bg-[#0d111c] border border-white/5 p-5 rounded-[2rem] hover:border-blue-600/40 hover:shadow-2xl hover:shadow-blue-600/10 transition-all duration-500 group">
      
      {/* ইমেজ সেকশন */}
      <div className="relative h-44 w-full mb-5 overflow-hidden rounded-2xl bg-[#161b2a] flex items-center justify-center p-4">
        <img 
          src={medicine.image || "/placeholder-medicine.png"} 
          alt={medicine.name}
          className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute top-3 left-3 bg-blue-600/10 backdrop-blur-md border border-blue-600/20 text-blue-400 text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
          {medicine.category}
        </div>
      </div>

      {/* টেক্সট সেকশন */}
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-white truncate group-hover:text-blue-500 transition-colors">
          {medicine.name}
        </h3>
        <div className="flex items-baseline gap-1 mb-6">
          <span className="text-2xl font-black text-white italic">৳{medicine.price}</span>
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">per unit</span>
        </div>
      </div>

      {/* বাটন সেকশন */}
      <div className="flex gap-3">
        {/* View Details */}
        <Link 
          href={`/shop/${medicineId}`}
          className="flex-1 flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/5"
        >
          <FiEye size={16} /> Details
        </Link>
        
        {/* Add to Cart */}
        <button 
          onClick={() => addToCart({ ...medicine, id: medicineId as string, quantity: 1 })}
          className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-600/20 active:scale-95"
        >
          <FiPlus size={16} /> Add
        </button>
      </div>
    </div>
  );
}