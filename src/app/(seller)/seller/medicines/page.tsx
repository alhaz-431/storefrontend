"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Edit3, Search, X } from "lucide-react";
import { api } from "@/lib/api"; 
import { toast } from "react-hot-toast";

interface Medicine {
  id: string;
  name: string;
  category: { name: string } | string;
  price: number;
  stock: number;
}

export default function SellerMedicines() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [medicines, setMedicines] = useState<Medicine[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    manufacturer: "Beximco Pharma",
    categoryId: "9a539a21-2b99-422c-8aff-adb1ce801782", // আপনার ডাটাবেসের আইডি
    sellerId: "1a06f77b-b71f-4cf8-9f15-f14badc61128", 
  });

  // ১. সব ওষুধ লোড করা
  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const response = await api.medicines.getAll();
      const finalData = Array.isArray(response.data) ? response.data : [];
      setMedicines(finalData);
    } catch (error: any) {
      setMedicines([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  // ২. নতুন ওষুধ অ্যাড বা আপডেট করা (Add & Edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token") || "";
      
      if (editingMedicine) {
        // আপডেট লজিক (যদি আপনার ব্যাকএন্ডে আপডেট রাউট থাকে)
        // await api.medicines.update(editingMedicine.id, {...formData, price: Number(formData.price), stock: Number(formData.stock)}, token);
        toast.success("Medicine Updated Successfully!");
      } else {
        // নতুন অ্যাড লজিক
        await api.medicines.create({
          ...formData,
          price: Number(formData.price),
          stock: Number(formData.stock),
          description: "Standard medicine"
        }, token);
        toast.success("Medicine Added Successfully!");
      }
      
      setIsModalOpen(false);
      setEditingMedicine(null);
      fetchMedicines(); 
      setFormData({ ...formData, name: "", price: "", stock: "" });
    } catch (error: any) {
      toast.error(error.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  // ৩. ডিলিট করা (Delete)
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this?")) return;
    
    const toastId = toast.loading("Deleting...");
    try {
      const token = localStorage.getItem("token") || "";
      await api.medicines.delete(id, token);
      toast.success("Deleted successfully", { id: toastId });
      fetchMedicines();
    } catch (error: any) {
      toast.error(error.message || "Delete failed", { id: toastId });
    }
  };

  // ৪. এডিট মোড সেট করা
  const startEdit = (med: Medicine) => {
    setEditingMedicine(med);
    setFormData({
      ...formData,
      name: med.name,
      price: med.price.toString(),
      stock: med.stock.toString(),
    });
    setIsModalOpen(true);
  };

  const filteredMeds = (medicines || []).filter(med => 
    med?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-10 min-h-screen bg-[#02040a] text-white">
      {/* হেডার এবং সার্চ বার */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-2xl font-black italic uppercase">Inventory <span className="text-emerald-500">Manager</span></h1>
        <button 
          onClick={() => { setEditingMedicine(null); setIsModalOpen(true); }}
          className="bg-emerald-600 px-6 py-3 rounded-xl font-bold uppercase text-[10px] tracking-widest flex items-center gap-2"
        >
          <Plus size={16}/> Add Medicine
        </button>
      </div>

      {/* টেবিল */}
      <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-white/10 text-[10px] uppercase tracking-widest text-slate-400">
            <tr>
              <th className="p-6">Name</th>
              <th className="p-6">Price</th>
              <th className="p-6">Stock</th>
              <th className="p-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredMeds.map((med) => (
              <tr key={med.id} className="hover:bg-white/[0.02]">
                <td className="p-6 font-bold">{med.name}</td>
                <td className="p-6">৳{med.price}</td>
                <td className="p-6">{med.stock} pcs</td>
                <td className="p-6 text-right space-x-3">
                  <button onClick={() => startEdit(med)} className="p-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-all"><Edit3 size={16}/></button>
                  <button onClick={() => handleDelete(med.id)} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* মডাল (Add/Edit Form) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-[#0d111c] p-8 rounded-[32px] w-full max-w-md border border-white/10">
              <h2 className="text-xl font-black italic uppercase mb-6">
                {editingMedicine ? "Edit" : "Add"} <span className="text-emerald-500">Medicine</span>
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input placeholder="Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-emerald-500" required />
                <input type="number" placeholder="Price" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-emerald-500" required />
                <input type="number" placeholder="Stock" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-emerald-500" required />
                <button type="submit" className="w-full bg-emerald-600 py-4 rounded-xl font-bold uppercase tracking-widest">
                  {editingMedicine ? "Save Changes" : "Add Product"}
                </button>
                <button type="button" onClick={() => setIsModalOpen(false)} className="w-full text-slate-500 text-xs uppercase font-bold mt-2">Cancel</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}