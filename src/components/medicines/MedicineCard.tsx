"use client";
import { motion } from "framer-motion";
import { FiShoppingCart, FiInfo } from "react-icons/fi";
import Link from "next/link";
import Image from "next/image";

// এটা হলো আপনার ওষুধের ডাটার টাইপ (TypeScript Interface)
interface MedicineProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

export default function MedicineCard({ medicine }: { medicine: MedicineProps }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group"
    >
      {/* ইমেজ সেকশন */}
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={medicine.image}
          alt={medicine.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold text-gray-700">
          {medicine.stock > 0 ? "In Stock" : "Out of Stock"}
        </div>
      </div>

      {/* কন্টেন্ট সেকশন */}
      <div className="p-4">
        <p className="text-[10px] uppercase tracking-wider text-emerald-600 font-bold mb-1">
          {medicine.category}
        </p>
        <h3 className="font-bold text-gray-800 mb-1 truncate">{medicine.name}</h3>
        <p className="text-lg font-black text-gray-900 mb-4">{medicine.price}৳</p>

        {/* বাটন সেকশন */}
        <div className="flex gap-2">
          <Link 
            href={`/shop/${medicine.id}`}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all"
          >
            <FiInfo /> Details
          </Link>
          <button 
            className="flex-[2] bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20"
          >
            <FiShoppingCart /> Add
          </button>
        </div>
      </div>
    </motion.div>
  );
}