"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast";
import { Edit3, Trash2, X } from "lucide-react";

export default function SellerMedicines() {
  const [medicines, setMedicines] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", price: "", stock: "", manufacturer: "" });
  const [file, setFile] = useState<File | null>(null);

  const fetchMedicines = async () => {
    try {
      const res = await api.medicines.getAll();
      setMedicines(res.data || []);
    } catch { toast.error("ডাটা লোড হয়নি"); }
  };

  useEffect(() => { fetchMedicines(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price.toString());
    data.append("stock", formData.stock.toString());
    data.append("manufacturer", formData.manufacturer);
    if (file) data.append("image", file);

    const token = localStorage.getItem("token")?.replace(/['"]+/g, '');
    const config = { headers: { 'Authorization': `Bearer ${token}` } };

    try {
      if (editingId) {
        await api.medicines.update(editingId, data, config);
        toast.success("আপডেট সফল!");
      } else {
        await api.medicines.create(data, config);
        toast.success("সফলভাবে যোগ হয়েছে!");
      }
      setIsModalOpen(false);
      fetchMedicines();
      setFormData({ name: "", price: "", stock: "", manufacturer: "" });
      setEditingId(null);
    } catch (err: any) {
      toast.error("সেভ করতে সমস্যা হয়েছে!");
    }
  };

  return (
    <div className="p-4 md:p-10 w-full max-w-7xl mx-auto">
      <button onClick={() => { setEditingId(null); setIsModalOpen(true); }} className="bg-green-600 text-white px-6 py-3 rounded-xl font-bold">+ Add Product</button>
      
      {/* রেসপন্সিভ টেবিল */}
      <div className="mt-6 overflow-x-auto w-full bg-white shadow-sm rounded-xl border">
        <table className="w-full min-w-[500px] text-left">
          <thead className="bg-gray-50">
            <tr><th className="p-4">Name</th><th className="p-4">Price</th><th className="p-4">Actions</th></tr>
          </thead>
          <tbody>
            {medicines.map((m) => (
              <tr key={m.id} className="border-t">
                <td className="p-4 font-semibold">{m.name}</td>
                <td className="p-4">{m.price}৳</td>
                <td className="p-4 flex gap-3">
                  <button onClick={() => { setEditingId(m.id); setFormData({name: m.name, price: m.price.toString(), stock: m.stock.toString(), manufacturer: m.manufacturer || ""}); setIsModalOpen(true); }} className="text-blue-500"><Edit3 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-xl">{editingId ? "Edit Product" : "Add Product"}</h2>
              <button onClick={() => setIsModalOpen(false)} type="button"><X /></button>
            </div>
            <input placeholder="Name" className="border w-full p-3 mb-3 rounded-lg" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
            <input placeholder="Price" className="border w-full p-3 mb-3 rounded-lg" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
            <input placeholder="Stock" className="border w-full p-3 mb-3 rounded-lg" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
            <input type="file" className="w-full mb-4" onChange={e => setFile(e.target.files?.[0] || null)} />
            <button className="bg-blue-600 text-white p-3 w-full rounded-lg font-bold">Save Changes</button>
          </form>
        </div>
      )}
    </div>
  );
}