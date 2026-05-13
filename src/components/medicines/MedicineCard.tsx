"use client";
import { motion } from "framer-motion";
import { FiShoppingCart, FiInfo } from "react-icons/fi";
import Link from "next/link";
import toast from "react-hot-toast";

interface MedicineProps {
  id: string;
  name: any; 
  price: number;
  image: string;
  category: any; 
  stock: number;
}

export default function MedicineCard({ medicine }: { medicine: MedicineProps }) {
  // ১. ক্যাটাগরি এবং নাম বের করার লজিক (অবজেক্ট বা স্ট্রিং যাই আসুক হ্যান্ডেল করবে)
  const categoryName = typeof medicine.category === 'object' 
    ? medicine.category?.name 
    : (medicine.category || "General");

  const medicineName = typeof medicine.name === 'object' 
    ? medicine.name?.name 
    : medicine.name;

  // ২. কার্টে অ্যাড করার ফাংশন
  const handleAddToCart = () => {
    try {
      const cart = JSON.parse(localStorage.getItem("medistore_cart") || "[]");
      const existing = cart.find((item: any) => item.id === medicine.id);

      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({ 
          ...medicine, 
          medicineId: medicine.id, 
          quantity: 1,
          // কার্ট পেজের জন্য সঠিক ইমেজ পাথ সেট করা
          image: medicine.image.startsWith('/') ? medicine.image : `/img/${medicine.image}`
        });
      }

      localStorage.setItem("medistore_cart", JSON.stringify(cart));
      window.dispatchEvent(new Event("cartUpdated"));
      toast.success(`${medicineName} added to cart!`);
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden group"
    >
      
      {/* ইমেজ সেকশন - এখানে আপনার ডাইনামিক ইমেজ লজিক ঠিক করে দেওয়া হয়েছে */}
      <div className="relative h-48 w-full overflow-hidden bg-gray-50">
        {medicine.image ? (
          <img 
            // যদি ডাটাবেসে থাকে med2.jpg, তবে এটি হবে /img/med2.jpg
            src={medicine.image.startsWith('/') ? medicine.image : `/img/${medicine.image}`} 
            alt={medicineName} 
            className="w-full h-full object-contain p-4 group-hover:scale-110 transition-transform duration-500" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 font-medium italic">
            No Image Found
          </div>
        )}
        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-[10px] font-bold text-gray-700 shadow-sm border border-gray-100">
          {medicine.stock > 0 ? "In Stock" : "Out of Stock"}
        </div>
      </div>

      <div className="p-4">
        <p className="text-[10px] uppercase tracking-wider text-emerald-600 font-bold mb-1">
          {categoryName}
        </p>
        
        <h3 className="font-bold text-gray-800 mb-1 truncate">
          {medicineName}
        </h3>
        
        <p className="text-lg font-black text-gray-900 mb-4">{medicine.price}৳</p>

        <div className="flex gap-2">
          {/* Details Link */}
          <Link 
            href={`/shop/${medicine.id}`}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all"
          >
            <FiInfo className="text-sm" /> Details
          </Link>

          {/* Add Button */}
          <button 
            onClick={handleAddToCart}
            disabled={medicine.stock <= 0}
            className={`flex-[2] py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg 
              ${medicine.stock > 0 
                ? "bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white shadow-blue-500/20" 
                : "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"}`}
          >
            <FiShoppingCart className="text-sm" /> Add
          </button>
        </div>
      </div>
    </motion.div>
  );
}