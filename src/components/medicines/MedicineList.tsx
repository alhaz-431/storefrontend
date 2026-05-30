"use client";
import MedicineCard from "./MedicineCard";

export interface Medicine {
  id: string;
  name: string;
  price: number;
  image: string; // এখানে ক্লাউডিনারি থেকে আসা URL থাকবে
  category: any; 
  stock: number;
}

interface MedicineListProps {
  medicines: any; // কারণ ব্যাকএন্ড থেকে অনেক সময় অবজেক্ট ফরম্যাটে ডাটা আসতে পারে
}

export default function MedicineList({ medicines }: MedicineListProps) {
  
  // ডাটা ফিল্টার ও সেফলি অ্যারে তৈরি করার লজিক
  const safeMedicines: Medicine[] = Array.isArray(medicines) 
    ? medicines 
    : (medicines?.data || medicines?.medicines || medicines?.result || []);

  if (safeMedicines.length === 0) {
    return (
      <div className="w-full text-center py-10">
        <p className="text-gray-500 text-lg font-medium">No medicines found at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {safeMedicines.map((item) => (
        // MedicineCard অলরেডি আপডেট করা আছে, তাই এটি এখন ক্লাউডিনারি ইমেজ লোড করবে
        <MedicineCard key={item.id} medicine={item} />
      ))}
    </div>
  );
}