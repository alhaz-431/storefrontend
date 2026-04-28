"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Edit3, Search, X } from "lucide-react";
import { api } from "@/lib/api"; 
import { toast } from "react-hot-toast";

interface Medicine {
  id: string;
  name: string;
  category: string;
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
    manufacturer: "Beximco Pharma", // ব্যাকএন্ডে এটা লাগে
    categoryId: "9a539a21-2b99-422c-8aff-adb1ce801782", // আপনার ডাটাবেসের ক্যাটাগরি আইডি
    sellerId: "5aba1f9a-ca7f-4a87-b300-5331d8860940", // আপনার ADMIN/Seller আইডি
  });

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const response = await api.medicines.getAll();
      const finalData = Array.isArray(response) ? response : (response?.data || []);
      setMedicines(finalData);
    } catch (error: any) {
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
      
      // ব্যাকএন্ডের চাহিদা অনুযায়ী ডাটা পাঠানো
      await api.medicines.create({
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        description: "Standard medicine description" // ব্যাকএন্ডে লাগলে এটাও যাবে
      }, token);
      
      toast.success("Medicine Added Successfully!");
      setIsModalOpen(false);
      fetchMedicines(); 
      setFormData({ ...formData, name: "", price: "", stock: "" });
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const filteredMeds = (medicines || []).filter(med => 
    med?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    // ... আপনার বাকি ডিজাইন (Return পার্ট) একদম ঠিক আছে, ওটা বদলানোর দরকার নেই
    <div className="p-6 lg:p-10 min-h-screen bg-[#02040a]">
       {/* আপনার ডিজাইন কোড এখানে থাকবে */}
    </div>
  );
}