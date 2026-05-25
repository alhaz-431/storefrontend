"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Edit3, Search, X, Package, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast";

const BASE_URL = "https://storemedistore.onrender.com";

interface Medicine {
  id: string;
  name: string;
  category: { name: string; id: string } | any;
  price: number;
  stock: number;
  image?: string;
}

export default function SellerMedicines() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [medicines, setMedicines] = useState<Medicine[]>([]);

  const defaultFormData = {
    name: "",
    price: "",
    stock: "",
    manufacturer: "",
    categoryId: "084c61a7-730d-427c-8011-0675cdfd8434",
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

  useEffect(() => { fetchMedicines(); }, []);

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMedicine(null);
    setFormData(defaultFormData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Saving...");
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'imageFile' && value) data.append(key, value as string);
      });
      if (formData.imageFile) data.append("image", formData.imageFile);

      if (editingMedicine) {
        await api.seller.updateMedicine(editingMedicine.id, data);
        toast.success("Updated successfully!", { id: toastId });
      } else {
        await api.seller.addMedicine(data);
        toast.success("Added successfully!", { id: toastId });
      }
      closeModal();
      fetchMedicines();
    } catch (err: any) {
      toast.error(err.message || "Operation failed", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const filtered = medicines.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 p-4 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black text-slate-900">Inventory <span className="text-[#008249]">Management</span></h1>
          <button 
            onClick={() => { setEditingMedicine(null); setIsModalOpen(true); }} 
            className="bg-[#008249] hover:bg-[#006633] text-white px-6 py-3 rounded-xl font-bold transition-all"
          >
            + Add Product
          </button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" placeholder="Search medicines..." 
            className="w-full p-4 pl-12 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#008249]/20 focus:border-[#008249] outline-none"
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="bg-white border border-slate-100 rounded-[2rem] shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#E6F4ED] text-[#008249] uppercase text-[10px] font-black">
                <th className="px-8 py-4">Product</th>
                <th className="px-8 py-4">Price</th>
                <th className="px-8 py-4">Stock</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {fetching ? <tr><td colSpan={4} className="py-20 text-center text-[#008249]"><Loader2 className="animate-spin inline" /></td></tr> :
               filtered.map((med) => (
                <tr key={med.id} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="px-8 py-4 flex items-center gap-3 font-bold">{med.name}</td>
                  <td className="px-8 py-4 text-slate-600">৳{med.price}</td>
                  <td className="px-8 py-4 text-slate-600">{med.stock}</td>
                  <td className="px-8 py-4 text-right space-x-2">
                    <button onClick={() => { setEditingMedicine(med); setIsModalOpen(true); }} className="text-blue-600 hover:text-blue-800"><Edit3 size={18} /></button>
                    <button onClick={() => api.seller.deleteMedicine(med.id).then(fetchMedicines)} className="text-red-600 hover:text-red-800"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.form onSubmit={handleSubmit} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white p-8 rounded-[2rem] w-full max-w-lg space-y-4 shadow-2xl">
              <h2 className="text-xl font-black text-slate-900">{editingMedicine ? 'Edit Product' : 'Add New Product'}</h2>
              <input required className="w-full p-4 bg-slate-50 border border-slate-100 rounded-xl" placeholder="Medicine Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input required type="number" className="p-4 bg-slate-50 border border-slate-100 rounded-xl" placeholder="Price" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                <input required type="number" className="p-4 bg-slate-50 border border-slate-100 rounded-xl" placeholder="Stock" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
              </div>
              <input type="file" className="w-full p-2 border rounded-xl" onChange={e => setFormData({...formData, imageFile: e.target.files?.[0] || null})} />
              <div className="flex gap-3 mt-4">
                <button type="button" onClick={closeModal} className="w-full py-3 bg-slate-100 rounded-xl font-bold">Cancel</button>
                <button type="submit" className="w-full py-3 bg-[#008249] text-white rounded-xl font-bold">Save Product</button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}