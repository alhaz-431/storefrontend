"use client";
import MedicineCard from "./MedicineCard";

export interface Medicine {
  id: string;
  name: string;
  price: number;
  image: string;
  category: any; 
  stock: number;
}

interface MedicineListProps {
  medicines: Medicine[];
}

export default function MedicineList({ medicines }: MedicineListProps) {
  
  // 🎯 জাদুকরী ডিফেন্সিভ লজিক: ডাটা যেভাবে বা যে ফরম্যাটেই আসুক, সেটিকে সেফলি অ্যারে-তে রূপান্তর করবে
  let safeMedicines: Medicine[] = [];

  if (Array.isArray(medicines)) {
    safeMedicines = medicines;
  } else if (medicines && typeof medicines === "object") {
    // যদি ব্যাকএন্ড থেকে পুরো অবজেক্ট পাস করা হয়, তবে তার ভেতর থেকে অ্যারে খুঁজে বের করবে
    const anyObj = medicines as any;
    if (Array.isArray(anyObj.data)) {
      safeMedicines = anyObj.data;
    } else if (Array.isArray(anyObj.medicines)) {
      safeMedicines = anyObj.medicines;
    } else if (Array.isArray(anyObj.result)) {
      safeMedicines = anyObj.result;
    }
  }

  // 🔍 যদি সব চেক করার পরেও কোনো ডাটা না পাওয়া যায়
  if (!safeMedicines || safeMedicines.length === 0) {
    return (
      <div className="w-full text-center py-10">
        <p className="text-gray-500 text-lg font-medium">No medicines found at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {safeMedicines.map((item) => (
        <MedicineCard key={item.id} medicine={item} />
      ))}
    </div>
  );
}