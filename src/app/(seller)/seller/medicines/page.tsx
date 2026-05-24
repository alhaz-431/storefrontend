"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Edit3, Search, X, Package, Image as ImageIcon, Loader2 } from "lucide-react";
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
  manufacturer?: string;
  description?: string;
}

export default function SellerMedicines() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

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
    setPreviewImage(null);
    setFormData(defaultFormData);
  };

  const startEdit = (med: Medicine) => {
    setEditingMedicine(med);
    setFormData({
      name: med.name,
      price: String(med.price),
      stock: String(med.stock),
      manufacturer: med.manufacturer || "",
      categoryId: med.category?.id || defaultFormData.categoryId,
      description: med.description || "",
      imageFile: null,
    });
    setPreviewImage(med.image ? `${BASE_URL}/${med.image}` : null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading(editingMedicine ? "Updating..." : "Adding...");

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

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await api.seller.deleteMedicine(id);
      toast.success("Deleted!");
      fetchMedicines();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const filtered = medicines.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900">Inventory Management</h1>
          <button onClick={() => { setEditingMedicine(null); setIsModalOpen(true); }} className="bg-emerald-600 text-white px-6 py-3 rounded-xl font-bold">Add Product</button>
        </div>

        <input 
          type="text" placeholder="Search medicines..." className="w-full p-3 mb-6 border rounded-xl"
          value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="bg-white border rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left">
            <thead><tr className="bg-slate-50 border-b uppercase text-xs text-slate-500 font-bold"><th className="px-6 py-4">Product</th><th className="px-6 py-4">Price</th><th className="px-6 py-4">Stock</th><th className="px-6 py-4 text-right">Actions</th></tr></thead>
            <tbody>
              {fetching ? <tr><td colSpan={4} className="py-20 text-center"><Loader2 className="animate-spin inline" /></td></tr> :
               filtered.map((med) => (
                <tr key={med.id} className="border-b">
                  <td className="px-6 py-4 flex items-center gap-3"><div className="w-10 h-10 bg-slate-100 rounded-lg overflow-hidden">{med.image ? <img src={`${BASE_URL}/${med.image}`} className="w-full h-full object-cover" /> : <Package />}</div>{med.name}</td>
                  <td className="px-6 py-4">৳{med.price}</td>
                  <td className="px-6 py-4">{med.stock}</td>
                  <td className="px-6 py-4 text-right"><button onClick={() => startEdit(med)} className="p-2 text-blue-600"><Edit3 size={18} /></button><button onClick={() => handleDelete(med.id)} className="p-2 text-red-600"><Trash2 size={18} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl w-full max-w-lg space-y-4">
              <h2 className="text-xl font-bold">{editingMedicine ? 'Edit Medicine' : 'Add Medicine'}</h2>
              <input required className="w-full p-3 border rounded-lg" placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input required type="number" className="w-full p-3 border rounded-lg" placeholder="Price" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
              <input required type="number" className="w-full p-3 border rounded-lg" placeholder="Stock" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
              <input type="file" className="w-full" onChange={e => setFormData({...formData, imageFile: e.target.files?.[0] || null})} />
              <div className="flex gap-2">
                <button type="button" onClick={closeModal} className="w-full p-3 bg-gray-200 rounded-lg">Cancel</button>
                <button type="submit" className="w-full p-3 bg-emerald-600 text-white rounded-lg">Save</button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}