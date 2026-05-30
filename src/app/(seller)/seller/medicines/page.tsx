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
      data.append("price", formData.price || "0");
      data.append("stock", formData.stock || "0");
      data.append("manufacturer", formData.manufacturer || "Generic");
      data.append("categoryId", "cm9n6x4h10000abc123def");
      if (formData.imageFile) data.append("image", formData.imageFile);

      const token = localStorage.getItem("token")?.replace(/['"]+/g, '');
      const config = { headers: { 'Authorization': `Bearer ${token}` } };

      if (editingMedicine) {
        await api.medicines.update(editingMedicine.id, data, config);
      } else {
        await api.medicines.create(data, config);
      }
      
      setIsModalOpen(false);
      fetchMedicines();
      setFormData({ name: "", price: "", stock: "", manufacturer: "", imageFile: null });
      toast.success("সফল হয়েছে!");
    } catch (err: any) { toast.error("ব্যর্থ হয়েছে, কনসোল চেক করো"); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    const token = localStorage.getItem("token")?.replace(/['"]+/g, '');
    try {
      await api.medicines.delete(id, { headers: { 'Authorization': `Bearer ${token}` } });
      toast.success("Deleted!");
      fetchMedicines();
    } catch { toast.error("Delete failed"); }
  };

  return (
    <div className="p-4 md:p-10 max-w-7xl mx-auto min-h-screen bg-slate-50">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-black">Inventory Management</h1>
        <button onClick={() => { setEditingMedicine(null); setIsModalOpen(true); }} className="bg-green-600 text-white px-6 py-3 rounded-2xl font-bold">+ Add Product</button>
      </div>
      {fetching ? <Loader2 className="animate-spin mx-auto" /> : (
        <div className="bg-white rounded-2xl shadow border overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr><th className="px-8 py-4">Image</th><th className="px-8 py-4">Name</th><th className="px-8 py-4">Price</th><th className="px-8 py-4">Stock</th><th className="px-8 py-4 text-right">Actions</th></tr>
            </thead>
            <tbody>
              {medicines.map((m) => (
                <tr key={m.id} className="border-t">
                  <td className="px-8 py-4"><img src={m.image || ""} className="w-12 h-12 object-cover rounded" /></td>
                  <td className="px-8 py-4 font-bold">{m.name}</td>
                  <td className="px-8 py-4">{m.price}৳</td>
                  <td className="px-8 py-4">{m.stock}</td>
                  <td className="px-8 py-4 text-right">
                    <button onClick={() => handleDelete(m.id)} className="text-red-500">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}