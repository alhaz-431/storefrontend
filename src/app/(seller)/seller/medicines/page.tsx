"use client";

import { useEffect, useState } from "react";
import { Trash2, Edit3, X, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast";

interface Medicine {
  id: string;
  name: string;
  price: number;
  stock: number;
  manufacturer?: string;
  image?: string;
}

export default function SellerMedicines() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const [formData, setFormData] = useState({ 
    name: "", price: "", stock: "", manufacturer: "", imageFile: null as File | null 
  });

  const fetchMedicines = async () => {
    setFetching(true);
    try {
      const res = await api.medicines.getAll();
      setMedicines(Array.isArray(res) ? res : (res?.data || []));
    } catch { toast.error("Error loading medicines"); }
    finally { setFetching(false); }
  };

  useEffect(() => { fetchMedicines(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("price", formData.price);
      data.append("stock", formData.stock);
      data.append("manufacturer", formData.manufacturer);
      if (formData.imageFile) data.append("image", formData.imageFile);

      const token = localStorage.getItem("token")?.replace(/['"]+/g, '');
      const config = { headers: { 'Authorization': `Bearer ${token}` } };

      if (editingMedicine) {
        await api.medicines.update(editingMedicine.id, data, config);
        toast.success("Updated successfully!");
      } else {
        await api.medicines.create(data, config);
        toast.success("Added successfully!");
      }
      
      setIsModalOpen(false);
      fetchMedicines();
      setFormData({ name: "", price: "", stock: "", manufacturer: "", imageFile: null });
    } catch (err: any) { toast.error(err.message || "Operation failed"); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    const token = localStorage.getItem("token")?.replace(/['"]+/g, '');
    try {
      await api.medicines.delete(id, { headers: { 'Authorization': `Bearer ${token}` } });
      toast.success("Deleted successfully!");
      fetchMedicines();
    } catch { toast.error("Delete failed"); }
  };

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto min-h-screen bg-slate-50">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black text-slate-900">Inventory <span className="text-green-600">Management</span></h1>
        <button onClick={() => { setEditingMedicine(null); setIsModalOpen(true); }} className="bg-green-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-green-700">+ Add Product</button>
      </div>

      {fetching ? <div className="text-center py-20"><Loader2 className="animate-spin mx-auto text-green-600" size={40}/></div> : (
        <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
          <div className="hidden md:block">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-400 text-xs uppercase font-bold">
                <tr><th className="px-8 py-5">Image</th><th className="px-8 py-5">Name</th><th className="px-8 py-5">Price</th><th className="px-8 py-5">Stock</th><th className="px-8 py-5 text-right">Actions</th></tr>
              </thead>
              <tbody className="divide-y">
                {medicines.map((m) => (
                  <tr key={m.id}>
                    <td className="px-8 py-4"><img src={m.image || "https://placehold.co/50x50"} className="w-12 h-12 rounded-xl object-cover" /></td>
                    <td className="px-8 py-4 font-bold">{m.name}</td>
                    <td className="px-8 py-4">৳{m.price}</td>
                    <td className="px-8 py-4">{m.stock} PCS</td>
                    <td className="px-8 py-4 text-right space-x-2">
                      <button onClick={() => { setEditingMedicine(m); setFormData({...m, price: String(m.price), stock: String(m.stock)} as any); setIsModalOpen(true); }} className="p-2 text-blue-600 bg-blue-50 rounded-lg"><Edit3 size={18}/></button>
                      <button onClick={() => handleDelete(m.id)} className="p-2 text-red-600 bg-red-50 rounded-lg"><Trash2 size={18}/></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden p-4 space-y-4">
            {medicines.map((m) => (
              <div key={m.id} className="bg-slate-50 p-4 rounded-2xl flex items-center gap-4 border">
                <img src={m.image || "https://placehold.co/50x50"} className="w-16 h-16 rounded-xl object-cover" />
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{m.name}</h3>
                  <p className="text-sm text-slate-500">৳{m.price} | {m.stock} PCS</p>
                </div>
                <div className="flex flex-col gap-2">
                  <button onClick={() => { setEditingMedicine(m); setFormData({...m, price: String(m.price), stock: String(m.stock)} as any); setIsModalOpen(true); }} className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Edit3 size={18}/></button>
                  <button onClick={() => handleDelete(m.id)} className="p-2 bg-red-100 text-red-600 rounded-lg"><Trash2 size={18}/></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-3xl w-full max-w-lg shadow-2xl relative">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 p-2 bg-slate-100 rounded-full"><X size={20}/></button>
            <h2 className="text-2xl font-black mb-6">{editingMedicine ? "Edit Product" : "Add New Product"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input required placeholder="Medicine Name" className="w-full p-4 bg-slate-50 border rounded-2xl" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input required type="number" placeholder="Price" className="w-full p-4 bg-slate-50 border rounded-2xl" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                <input required type="number" placeholder="Stock" className="w-full p-4 bg-slate-50 border rounded-2xl" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
              </div>
              <input placeholder="Manufacturer" className="w-full p-4 bg-slate-50 border rounded-2xl" value={formData.manufacturer} onChange={e => setFormData({...formData, manufacturer: e.target.value})} />
              <input type="file" className="w-full p-4 bg-slate-50 border rounded-2xl" onChange={e => setFormData({...formData, imageFile: e.target.files?.[0] || null})} />
              <button disabled={loading} className="w-full bg-green-600 text-white py-4 rounded-2xl font-bold text-lg">{loading ? "Saving..." : "Save Product"}</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}