"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Trash2, Edit3, Search, X, Package, 
  Image as ImageIcon, Eye, Loader2, AlertCircle
} from "lucide-react";
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
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [selectedMedicine, setSelectedMedicine] = useState<Medicine | null>(null);

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
      const data = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
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

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await api.medicines.delete(id);
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
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Inventory <span className="text-emerald-600">Management</span>
            </h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">Manage your pharmacy stock and products</p>
          </div>
          <button
            onClick={() => { setEditingMedicine(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-emerald-200"
          >
            <Plus size={18} /> Add Product
          </button>
        </div>

        {/* SEARCH & STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="md:col-span-3 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Search medicines..."
              className="w-full bg-white border border-slate-200 rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex items-center justify-between shadow-sm">
             <span className="text-slate-500 text-xs font-bold uppercase">Total Items</span>
             <span className="text-emerald-600 font-black text-xl">{medicines.length}</span>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Stock</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {fetching ? (
                  <tr><td colSpan={4} className="py-20 text-center"><Loader2 className="animate-spin inline-block text-emerald-500" size={28} /></td></tr>
                ) : filtered.length > 0 ? (
                  filtered.map((med) => (
                    <tr key={med.id} className="hover:bg-slate-50/80 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0 border border-slate-200 flex items-center justify-center">
                            {med.image ? (
                              <img src={`${BASE_URL}/${med.image}`} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <Package size={20} className="text-slate-400" />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{med.name}</p>
                            <p className="text-slate-400 text-[10px] uppercase font-bold tracking-tight">{med.manufacturer}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-slate-700">৳{med.price}</td>
                      <td className="px-6 py-4">
                         <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${med.stock < 10 ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                           {med.stock} in stock
                         </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-1">
                          <button onClick={() => { setSelectedMedicine(med); setIsViewOpen(true); }} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"><Eye size={18}/></button>
                          <button onClick={() => startEdit(med)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Edit3 size={18}/></button>
                          <button onClick={() => handleDelete(med.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"><Trash2 size={18}/></button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={4} className="py-20 text-center text-slate-400 text-sm">No products found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL (ADD/EDIT) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <motion.form 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              onSubmit={handleSubmit}
              className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden"
            >
              <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                <h2 className="text-xl font-bold text-slate-800">{editingMedicine ? 'Edit' : 'Add New'} Medicine</h2>
                <button type="button" onClick={closeModal} className="text-slate-400 hover:text-slate-600"><X size={20}/></button>
              </div>

              <div className="p-8 space-y-5">
                <div className="flex flex-col items-center p-6 border-2 border-dashed border-slate-200 rounded-2xl hover:bg-slate-50 transition-all cursor-pointer relative">
                   {previewImage ? <img src={previewImage} className="h-24 w-24 object-contain mb-2" /> : <ImageIcon size={32} className="text-slate-300 mb-2"/>}
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Upload Product Image</p>
                   <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => {
                     const file = e.target.files?.[0];
                     if(file) { setFormData({...formData, imageFile: file}); setPreviewImage(URL.createObjectURL(file)); }
                   }} />
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Medicine Name</label>
                    <input required className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:border-emerald-500 transition-all font-medium" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Price (৳)</label>
                      <input required type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:border-emerald-500 transition-all font-medium" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Stock Quantity</label>
                      <input required type="number" className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:border-emerald-500 transition-all font-medium" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Manufacturer</label>
                    <input className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3 px-4 outline-none focus:border-emerald-500 transition-all font-medium" value={formData.manufacturer} onChange={e => setFormData({...formData, manufacturer: e.target.value})} />
                  </div>
                </div>
              </div>

              <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex gap-3">
                <button type="button" onClick={closeModal} className="flex-1 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-200 transition-all">Cancel</button>
                <button type="submit" disabled={loading} className="flex-[2] bg-emerald-600 hover:bg-emerald-700 py-3 rounded-xl font-bold text-white shadow-lg shadow-emerald-100 flex items-center justify-center gap-2">
                  {loading && <Loader2 size={16} className="animate-spin"/>} {editingMedicine ? 'Update Product' : 'Save Product'}
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

