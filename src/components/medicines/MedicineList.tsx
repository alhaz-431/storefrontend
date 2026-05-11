"use client";
import MedicineCard from "./MedicineCard";

// ১. মেডিসিনের ডাটার স্ট্রাকচার (ইন্টারফেস)
export interface Medicine {
  id: string;
  name: string;
  price: number;
  image: string;
  category: any; // ক্যাটাগরি অবজেক্ট হতে পারে, তাই any নিরাপদ
  stock: number;
}

// ২. প্রপস এর টাইপ ডিফাইন করা
interface MedicineListProps {
  medicines: Medicine[];
}

// ৩. ফাংশনের ভেতর প্রপস গ্রহণ করা (এটাই মেইন ফিক্স)
export default function MedicineList({ medicines }: MedicineListProps) {
  
  // কোনো ডেটা না থাকলে
  if (!medicines || medicines.length === 0) {
    return (
      <div className="w-full text-center py-10">
        <p className="text-gray-500 text-lg">No medicines found</p>
      </div>
    );
  }

  // ৪. ডাটা থাকলে ম্যাপ করা
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {medicines.map((item) => (
        <MedicineCard key={item.id} medicine={item} />
      ))}
    </div>
  );
}