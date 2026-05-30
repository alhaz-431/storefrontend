"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Edit3, Search, X, Package, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast";

interface Medicine {
  id: string;
  name: string;
  category?: { name: string; id: string } | any;
  price: number;
  stock: number;
  manufacturer?: string;
  description?: string;
  image?: string;
}

export default function SellerMedicines() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [medicines, setMedicines] = useState<Medicine[]>([]);

  const DEFAULT_CATEGORY_ID = "084c61a7-730d-427c-8011-0675cdfd8434";

  const defaultFormData = {
    name: "",
    price: "",
    stock: "",
    manufacturer: "",
    categoryId: DEFAULT_CATEGORY_ID,
    description: "",
    imageFile: null as File | null,
  };

  const [formData, setFormData] = useState(defaultFormData);

  const fetchMedicines = async () => {
    try {
      setFetching(true);
      const res = await api.medicines.getAll();
      const data = Array.isArray(res) ? res : (res?.data || []);
      setMedicines(data);
    } catch (err: any) {
      toast.error("Failed to load inventory");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMedicine(null);
    setFormData(defaultFormData);
  };

  const handleEditClick = (med: Medicine) => {
    setEditingMedicine(med);
    setFormData({
      name: med.name,
      price: String(med.price),
      stock: String(med.stock),
      manufacturer: med.manufacturer || "",
      categoryId: med.category?.id || DEFAULT_CATEGORY_ID,
      description: med.description || "",
      imageFile: null,
    });
    setIsModalOpen(true);
  };

  const handleDeleteClick = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    const toastId = toast.loading("Deleting...");
    try {
      await api.medicines.delete(id);
      toast.success("Deleted successfully!", { id: toastId });
      fetchMedicines();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete", { id: toastId });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading(editingMedicine ? "Updating..." : "Adding...");
    
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "imageFile" && value !== null && value !== undefined && value !== "") {
          data.append(key, String(value));
        }
      });
      
      if (!formData.categoryId) {
        data.append("categoryId", DEFAULT_CATEGORY_ID);
      }

      if (formData.imageFile instanceof File) {
        data.append("image", formData.imageFile);
      }

      if (editingMedicine) {
        await api.medicines.update(editingMedicine.id, data);
        toast.success("Updated successfully!", { id: toastId });
      } else {
        await api.medicines.create(data);
        toast.success("Added successfully!", { id: toastId });
      }
      closeModal();
      fetchMedicines();
    } catch (err: any) {
      toast.error("Operation failed", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const filtered = medicines.filter((m) =>
    m.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 p-4 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black text-slate-900">Inventory <span className="text-[#008249]">Management</span></h1>
          <button onClick={() => { setEditingMedicine(null); setFormData(defaultFormData); setIsModalOpen(true); }} className="bg-[#008249] hover:bg-[#006633] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md">+ Add Product</button>
        </div>

        <div className="bg-white border border-slate-100 rounded-[2rem] shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#E6F4ED] text-[#008249] uppercase text-[10px] font-black tracking-wider">
                <th className="px-8 py-4">Product Image & Name</th>
                <th className="px-8 py-4">Price</th>
                <th className="px-8 py-4">Stock</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((med) => (
                <tr key={med.id} className="border-b border-slate-50">
                  <td className="px-8 py-4 font-bold text-slate-900 flex items-center gap-3">
                    {/* 🖼️ ক্লাউডিনারি ইমেজ রেন্ডারিং */}
                    <img 
                      src={med.image || "https://placehold.co/50x50?text=No+Image"} 
                      alt={med.name}
                      className="w-10 h-10 object-cover rounded-lg bg-slate-100"
                      onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/50x50?text=No+Image"; }}
                    />
                    <div>
                      <p>{med.name}</p>
                      {med.manufacturer && <p className="text-[10px] text-slate-400">{med.manufacturer}</p>}
                    </div>
                  </td>
                  <td className="px-8 py-4">৳{med.price}</td>
                  <td className="px-8 py-4">{med.stock} PCS</td>
                  <td className="px-8 py-4 text-right">
                    <button onClick={() => handleEditClick(med)} className="text-blue-600 mr-3"><Edit3 size={18} /></button>
                    <button onClick={() => handleDeleteClick(med.id)} className="text-red-600"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* (Modal code here remains same as provided previously) */}
    </div>
  );
}