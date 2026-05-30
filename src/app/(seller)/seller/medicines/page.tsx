"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Edit3, Search, X, Loader2 } from "lucide-react";
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
    const token = localStorage.getItem("token");
    const toastId = toast.loading("Deleting...");
    try {
      await api.medicines.delete(id, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Deleted successfully!", { id: toastId });
      fetchMedicines();
    } catch (err: any) {
      toast.error("Failed to delete", { id: toastId });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading(editingMedicine ? "Updating..." : "Adding...");
    const token = localStorage.getItem("token");

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "imageFile" && value !== null && value !== undefined && value !== "") {
          data.append(key, String(value));
        }
      });
      
      if (formData.imageFile instanceof File) {
        data.append("image", formData.imageFile);
      }

      const config = {
        headers: {
          'Authorization': `Bearer ${token}`
          // Content-Type সরিয়ে ফেলা হয়েছে, axios এটি অটোমেটিক হ্যান্ডেল করবে
        }
      };

      if (editingMedicine) {
        await api.medicines.update(editingMedicine.id, data, config);
        toast.success("Updated successfully!", { id: toastId });
      } else {
        await api.medicines.create(data, config);
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
        {/* Responsive Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-2xl md:text-3xl font-black text-slate-900">
            Inventory <span className="text-[#008249]">Management</span>
          </h1>
          <button 
            onClick={() => { setEditingMedicine(null); setFormData(defaultFormData); setIsModalOpen(true); }} 
            className="w-full md:w-auto bg-[#008249] hover:bg-[#006633] text-white px-6 py-3 rounded-xl font-bold transition-all shadow-md"
          >
            + Add Product
          </button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search medicines..." 
            className="w-full p-4 pl-12 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-[#008249]/20 outline-none transition-all"
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Responsive Table */}
        <div className="bg-white border border-slate-100 rounded-[2rem] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#E6F4ED] text-[#008249] uppercase text-[10px] md:text-xs font-black tracking-wider">
                  <th className="px-4 md:px-8 py-4">Product</th>
                  <th className="px-4 md:px-8 py-4">Price</th>
                  <th className="px-4 md:px-8 py-4">Stock</th>
                  <th className="px-4 md:px-8 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {fetching ? (
                  <tr><td colSpan={4} className="py-20 text-center"><Loader2 className="animate-spin inline text-[#008249]" size={28} /></td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={4} className="py-20 text-center text-slate-400">No medicines found.</td></tr>
                ) : (
                  filtered.map((med) => (
                    <tr key={med.id} className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 md:px-8 py-4 font-bold text-slate-900 flex items-center gap-3">
                         <img src={med.image || "https://placehold.co/50x50?text=No+Image"} alt={med.name} className="w-10 h-10 object-cover rounded-lg bg-slate-100" />
                         <div><p>{med.name}</p><p className="text-[10px] text-slate-400 uppercase font-normal">{med.manufacturer}</p></div>
                      </td>
                      <td className="px-4 md:px-8 py-4 text-slate-600">৳{med.price}</td>
                      <td className="px-4 md:px-8 py-4 text-slate-600">{med.stock}</td>
                      <td className="px-4 md:px-8 py-4 text-right space-x-3">
                        <button onClick={() => handleEditClick(med)} className="text-blue-600"><Edit3 size={18} /></button>
                        <button onClick={() => handleDeleteClick(med.id)} className="text-red-600"><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Modal remains the same but ensure its structure is responsive */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
            <motion.form 
              onSubmit={handleSubmit} 
              className="bg-white p-6 md:p-8 rounded-[2rem] w-full max-w-lg space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button type="button" onClick={closeModal} className="absolute right-6 top-6 text-slate-400 hover:text-slate-600"><X size={20} /></button>
              <h2 className="text-xl font-black text-slate-900">{editingMedicine ? 'Edit Product' : 'Add New Product'}</h2>
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Medicine Name *</label>
                <input required className="w-full p-3 bg-slate-50 border rounded-xl" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase">Price *</label><input required type="number" step="0.01" className="w-full p-3 bg-slate-50 border rounded-xl" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} /></div>
                 <div className="space-y-1"><label className="text-[10px] font-bold text-slate-500 uppercase">Stock *</label><input required type="number" className="w-full p-3 bg-slate-50 border rounded-xl" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} /></div>
              </div>

              <button type="submit" disabled={loading} className="w-full py-4 bg-[#008249] text-white rounded-xl font-bold mt-4">
                {loading ? "Processing..." : (editingMedicine ? 'Update Product' : 'Save Product')}
              </button>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}