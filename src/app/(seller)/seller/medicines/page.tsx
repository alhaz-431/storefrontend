"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Edit3, Search, X } from "lucide-react";
import { api } from "@/lib/api"; 
import { toast } from "react-hot-toast";

interface Medicine {
  id: string;
  name: string;
  category: { name: string } | string; // এপিআই রেসপন্সে অবজেক্ট হিসেবে আসছে
  price: number;
  stock: number;
}

export default function SellerMedicines() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [medicines, setMedicines] = useState<Medicine[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    manufacturer: "Beximco Pharma",
    categoryId: "9a539a21-2b99-422c-8aff-adb1ce80f782", 
    sellerId: "1a06f77b-b71f-4cf8-9f15-f14badc61128", // আপনার আসল সেলার আইডি আপডেট করা হয়েছে
  });

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const response = await api.medicines.getAll();
      // আপনার এপিআই রেসপন্স ফরম্যাট অনুযায়ী response.data ব্যবহার করা হয়েছে
      const finalData = Array.isArray(response.data) ? response.data : [];
      setMedicines(finalData);
    } catch (error: any) {
      console.error("Fetch Error:", error);
      setMedicines([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("token") || "" : ""; 
      
      await api.medicines.create({
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        description: "Standard medicine description"
      }, token);
      
      toast.success("Medicine Added Successfully!");
      setIsModalOpen(false);
      fetchMedicines(); 
      setFormData({ ...formData, name: "", price: "", stock: "" });
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const filteredMeds = (medicines || []).filter(med => 
    med?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-10 min-h-screen bg-[#02040a]">
       {/* এখানে আপনার টেবিল এবং ডিজাইন কোড আগের মতোই থাকবে */}
       {/* টেবিল রো এর ভেতরে category দেখানোর সময় med.category.name ব্যবহার করুন */}
    </div>
  );
}