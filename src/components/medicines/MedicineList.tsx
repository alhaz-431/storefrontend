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
  

  if (!medicines || medicines.length === 0) {
    return (
      <div className="w-full text-center py-10">
        <p className="text-gray-500 text-lg">No medicines found</p>
      </div>
    );
  }


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {medicines.map((item) => (
        <MedicineCard key={item.id} medicine={item} />
      ))}
    </div>
  );
}


