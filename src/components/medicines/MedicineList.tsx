"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import MedicineCard from "./MedicineCard";

// ১. মেডিসিনের ডাটার স্ট্রাকচার (ইন্টারফেস)
interface Medicine {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  stock: number;
}

export default function MedicineList() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);

  // লজিক: API থেকে ডেটা আনা
  useEffect(() => {
    axios
      .get("https://storemedistore.onrender.com/api/v1/medicines")
      .then((res) => {
        setMedicines(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("ERROR:", err);
        setLoading(false);
      });
  }, []);

  // লোডিং স্টেট
  if (loading) {
    return <p className="text-center py-10">Loading medicines...</p>;
  }

  // কোনো ডেটা না থাকলে
  if (!medicines || medicines.length === 0) {
    return (
      <div className="w-full text-center py-10">
        <p className="text-gray-500 text-lg">No medicines found</p>
      </div>
    );
  }

  // ডেটা থাকলে ম্যাপ করা
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {medicines.map((item) => (
        <MedicineCard key={item.id} medicine={item} />
      ))}
    </div>
  );
}