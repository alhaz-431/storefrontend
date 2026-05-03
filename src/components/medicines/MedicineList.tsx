"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import MedicineCard from "@/components/medicines/MedicineCard";

export default function MedicineList() {
  const [medicines, setMedicines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://your-backend.onrender.com/api/medicines") // 🔥 তোমার backend URL বসাও
      .then((res) => {
        console.log("API RESPONSE:", res.data); // DEBUG

        // 🔥 backend যদি { data: [...] } দেয়
        setMedicines(res.data.data || []);

        setLoading(false);
      })
      .catch((err) => {
        console.log("ERROR:", err);
        setLoading(false);
      });
  }, []);

  // 🔥 loading state
  if (loading) {
    return <p className="text-center py-10">Loading medicines...</p>;
  }

  // 🔥 empty data check
  if (!medicines.length) {
    return <p className="text-center py-10">No medicines found</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {medicines.map((item: any) => (
        <MedicineCard key={item.id} medicine={item} />
      ))}
    </div>
  );
}