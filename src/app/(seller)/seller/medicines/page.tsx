"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast";
import { Edit3, Trash2, X, Plus } from "lucide-react";

export default function SellerMedicines() {
  const [medicines, setMedicines] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ 
    name: "", 
    price: "", 
    stock: "", 
    manufacturer: "" 
  });
  const [file, setFile] = useState<File | null>(null);

  const fetchMedicines = async () => {
    try {
      const res = await api.medicines.getAll();
      setMedicines(Array.isArray(res) ? res : res.data || []);
    } catch {
      toast.error("মেডিসিন তালিকা লোড করতে ব্যর্থ");
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append("name", formData.name);
    data.append("price", formData.price);
    data.append("stock", formData.stock);
    data.append("manufacturer", formData.manufacturer);
    
    if (file) {
      data.append("image", file);
    }

    try {
      if (editingId) {
        await api.medicines.update(editingId, data);
        toast.success("আপডেট সফল!");
      } else {
        await api.medicines.create(data);
        toast.success("নতুন মেডিসিন যুক্ত হয়েছে!");
      }

      setIsModalOpen(false);
      setEditingId(null);
      setFormData({ name: "", price: "", stock: "", manufacturer: "" });
      setFile(null);
      fetchMedicines();
    } catch (err: any) {
      console.error(err);
      toast.error("সেভ করতে সমস্যা হয়েছে!");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("আপনি কি নিশ্চিত এটি ডিলিট করতে চান?")) return;
    try {
      await api.medicines.delete(id);
      fetchMedicines();
      toast.success("ডিলিট সফল!");
    } catch {
      toast.error("ডিলিট করতে সমস্যা হয়েছে!");
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-800">Inventory Management</h1>
        <button
          onClick={() => { 
            setEditingId(null); 
            setFormData({ name: "", price: "", stock: "", manufacturer: "" }); 
            setIsModalOpen(true); 
          }}
          className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-bold flex items-center gap-2 hover:bg-green-700 transition"
        >
          <Plus size={20} /> Add Product
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="p-4">Image</th>
              <th className="p-4">Name</th>
              <th className="p-4">Manufacturer</th>
              <th className="p-4">Price</th>
              <th className="p-4">Stock</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {medicines.map((m) => (
              <tr key={m.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-4"><img src={m.image || "/placeholder.png"} className="w-12 h-12 rounded object-cover" /></td>
                <td className="p-4 font-medium">{m.name}</td>
                <td className="p-4">{m.manufacturer}</td>
                <td className="p-4">{m.price}৳</td>
                <td className="p-4">{m.stock}</td>
                <td className="p-4 text-right flex justify-end gap-3">
                  <button onClick={() => { 
                    setEditingId(m.id); 
                    setFormData({name: m.name, price: m.price.toString(), stock: m.stock.toString(), manufacturer: m.manufacturer}); 
                    setIsModalOpen(true); 
                  }} className="text-blue-500"><Edit3 size={18} /></button>
                  <button onClick={() => handleDelete(m.id)} className="text-red-500"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{editingId ? "Edit Product" : "Add New Product"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400"><X /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input required placeholder="Name" className="w-full p-2.5 border rounded-lg" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              <input required placeholder="Manufacturer" className="w-full p-2.5 border rounded-lg" value={formData.manufacturer} onChange={e => setFormData({...formData, manufacturer: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input required type="number" placeholder="Price" className="w-full p-2.5 border rounded-lg" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                <input required type="number" placeholder="Stock" className="w-full p-2.5 border rounded-lg" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
              </div>
              <input type="file" className="w-full p-2 border rounded-lg" onChange={e => setFile(e.target.files?.[0] || null)} />
              <button type="submit" className="w-full bg-blue-600 text-white p-2.5 rounded-lg font-bold hover:bg-blue-700">Save Changes</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}