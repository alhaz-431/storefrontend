"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Edit3, X, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast";

interface Medicine {
  id: string;
  name: string;
  price: number;
  stock: number;
  manufacturer?: string;
  description?: string;
  image?: string;
}

export default function SellerMedicines() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [medicines, setMedicines] = useState<Medicine[]>([]);

  const defaultFormData = { name: "", price: "", stock: "", manufacturer: "", description: "", imageFile: null as File | null };
  const [formData, setFormData] = useState(defaultFormData);

  const fetchMedicines = async () => {
    try {
      setFetching(true);
      const res = await api.medicines.getAll();
      setMedicines(Array.isArray(res) ? res : (res?.data || []));
    } catch (err) {
      toast.error("Failed to load inventory");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => { fetchMedicines(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading(editingMedicine ? "Updating..." : "Adding...");
    
    try {
      const data = new FormData();
      Object.entries(formData).forEach(([k, v]) => { if (k !== "imageFile" && v) data.append(k, String(v)); });
      if (formData.imageFile) data.append("image", formData.imageFile);

      const token = localStorage.getItem("token")?.replace(/['"]+/g, '');
      const config = { headers: { 'Authorization': `Bearer ${token}` } };

      if (editingMedicine) {
        await api.medicines.update(editingMedicine.id, data, config);
        toast.success("Updated!", { id: toastId });
      } else {
        await api.medicines.create(data, config);
        toast.success("Added!", { id: toastId });
      }
      setIsModalOpen(false);
      setFormData(defaultFormData);
      fetchMedicines();
    } catch (err: any) {
      toast.error(err.message || "Operation failed", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this?")) return;
    const token = localStorage.getItem("token")?.replace(/['"]+/g, '');
    try {
      await api.medicines.delete(id, { headers: { 'Authorization': `Bearer ${token}` } });
      toast.success("Deleted!");
      fetchMedicines();
    } catch { toast.error("Delete failed"); }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl md:text-3xl font-black text-slate-900">Inventory</h1>
          <button onClick={() => { setEditingMedicine(null); setFormData(defaultFormData); setIsModalOpen(true); }} className="bg-green-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2">+ Add</button>
        </div>

        {fetching ? <div className="text-center py-20"><Loader2 className="animate-spin mx-auto text-green-600" size={40}/></div> : (
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden md:block">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-400 text-xs uppercase">
                  <tr><th className="px-6 py-4">Name</th><th className="px-6 py-4">Price</th><th className="px-6 py-4">Stock</th><th className="px-6 py-4">Actions</th></tr>
                </thead>
                <tbody className="divide-y">
                  {medicines.map((m) => (
                    <tr key={m.id}>
                      <td className="px-6 py-4 font-bold">{m.name}</td>
                      <td className="px-6 py-4">৳{m.price}</td>
                      <td className="px-6 py-4">{m.stock}</td>
                      <td className="px-6 py-4 flex gap-2">
                        <button onClick={() => { setEditingMedicine(m); setFormData({...m, price: String(m.price), stock: String(m.stock)} as any); setIsModalOpen(true); }} className="p-2 text-blue-600"><Edit3 size={18}/></button>
                        <button onClick={() => handleDelete(m.id)} className="p-2 text-red-600"><Trash2 size={18}/></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden p-4 space-y-4">
              {medicines.map((m) => (
                <div key={m.id} className="bg-slate-50 p-4 rounded-2xl flex justify-between items-center">
                  <div><p className="font-bold">{m.name}</p><p className="text-sm text-slate-500">৳{m.price} | Stock: {m.stock}</p></div>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingMedicine(m); setFormData({...m, price: String(m.price), stock: String(m.stock)} as any); setIsModalOpen(true); }} className="p-2 bg-blue-100 rounded-lg"><Edit3 size={16}/></button>
                    <button onClick={() => handleDelete(m.id)} className="p-2 bg-red-100 rounded-lg"><Trash2 size={16}/></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div initial={{y:20, opacity:0}} animate={{y:0, opacity:1}} className="bg-white p-6 rounded-3xl w-full max-w-sm relative">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4"><X size={20}/></button>
              <h2 className="text-xl font-bold mb-4">{editingMedicine ? "Edit" : "Add"} Medicine</h2>
              <form onSubmit={handleSubmit} className="space-y-3">
                <input required placeholder="Name" className="w-full p-3 bg-slate-50 rounded-xl" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                <input required type="number" placeholder="Price" className="w-full p-3 bg-slate-50 rounded-xl" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                <input required type="number" placeholder="Stock" className="w-full p-3 bg-slate-50 rounded-xl" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
                <input type="file" onChange={e => setFormData({...formData, imageFile: e.target.files?.[0] || null})} className="w-full" />
                <button disabled={loading} className="w-full bg-green-600 text-white py-3 rounded-xl font-bold">{loading ? "Saving..." : "Save"}</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}