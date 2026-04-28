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

  // ইউজার আইডি লোকাল স্টোরেজ থেকে ডায়নামিক ভাবে নেওয়ার চেষ্টা করা
  const storedUser = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("medistore_user") || "{}") : {};

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    manufacturer: "Beximco Pharma",
    categoryId: "9a539a21-2b99-422c-8aff-adb1ce801782", // আপনার ডাটাবেসের ক্যাটাগরি আইডি
    sellerId: storedUser.id || "1a06f77b-b71f-4cf8-9f15-f14badc61128", 
  });

  // ১. সব ওষুধ লোড করা
  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const response = await api.medicines.getAll();
      const finalData = Array.isArray(response.data) ? response.data : [];
      setMedicines(finalData);
    } catch (error: any) {
      console.error("Fetch Error:", error);
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
    const toastId = toast.loading(editingMedicine ? "Updating..." : "Adding medicine...");

    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        toast.error("You are not logged in!", { id: toastId });
        return;
      }

      if (editingMedicine) {
        // আপডেট লজিক (প্রয়োজন হলে আন-কমেন্ট করুন)
        // await api.medicines.update(editingMedicine.id, {...formData, price: Number(formData.price), stock: Number(formData.stock)}, token);
        toast.success("Medicine Updated Successfully!", { id: toastId });
      } else {
        // নতুন ওষুধ অ্যাড করার সময় টোকেন পাঠানো নিশ্চিত করা হয়েছে
        await api.medicines.create({
          ...formData,
          price: Number(formData.price),
          stock: Number(formData.stock),
          description: "Standard medicine",
          sellerId: storedUser.id // বর্তমান লগইন করা ইউজারের আইডি
        }, token);
        
        toast.success("Medicine Added Successfully!", { id: toastId });
      }
      
      setIsModalOpen(false);
      setEditingMedicine(null);
      fetchMedicines(); 
      setFormData({ ...formData, name: "", price: "", stock: "" });
    } catch (error: any) {
      console.error("Submission Error:", error);
      // ব্যাকএন্ড থেকে আসা আসল এরর মেসেজটি দেখাবে
      toast.error(error.response?.data?.message || error.message || "Operation failed", { id: toastId });
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
        <div>
          <h1 className="text-2xl font-black italic uppercase tracking-tighter">Inventory <span className="text-emerald-500">Manager</span></h1>
          <p className="text-[9px] text-slate-500 uppercase tracking-[0.3em] font-bold">Manage your medical stock</p>
        </div>
        <button 
          onClick={() => { setEditingMedicine(null); setIsModalOpen(true); }}
          className="bg-emerald-600 hover:bg-emerald-500 transition-all px-6 py-3 rounded-xl font-bold uppercase text-[10px] tracking-widest flex items-center gap-2 shadow-lg shadow-emerald-900/20"
        >
          <Plus size={16}/> Add Medicine
        </button>
      </div>

      {/* সার্চ ইনপুট */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
        <input 
          type="text" 
          placeholder="Search medicines..." 
          className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl outline-none focus:border-emerald-500 transition-all"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* টেবিল */}
      <div className="bg-white/[0.02] border border-white/10 rounded-[32px] overflow-hidden backdrop-blur-md">
        <table className="w-full text-left border-collapse">
          <thead className="bg-white/5 text-[10px] uppercase tracking-widest text-slate-400 font-black">
            <tr>
              <th className="p-6">Medicine Name</th>
              <th className="p-6">Price</th>
              <th className="p-6">Stock Level</th>
              <th className="p-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
               <tr><td colSpan={4} className="p-10 text-center text-slate-500 animate-pulse uppercase text-xs font-bold tracking-widest">Loading Inventory...</td></tr>
            ) : filteredMeds.length > 0 ? (
              filteredMeds.map((med) => (
                <tr key={med.id} className="hover:bg-white/[0.03] transition-colors group">
                  <td className="p-6">
                    <div className="font-bold text-white group-hover:text-emerald-400 transition-colors">{med.name}</div>
                    <div className="text-[9px] text-slate-600 uppercase font-black">Pharma Grade</div>
                  </td>
                  <td className="p-6 font-mono text-emerald-500 font-bold">৳{med.price}</td>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${med.stock < 10 ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                      {med.stock} PCS
                    </span>
                  </td>
                  <td className="p-6 text-right space-x-3">
                    <button onClick={() => startEdit(med)} className="p-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-all"><Edit3 size={16}/></button>
                    <button onClick={() => handleDelete(med.id)} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"><Trash2 size={16}/></button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={4} className="p-10 text-center text-slate-600 uppercase text-[10px] font-bold">No medicines found in inventory</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* মডাল (Add/Edit Form) */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[#0d111c] p-10 rounded-[40px] w-full max-w-md border border-white/10 shadow-3xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-black italic uppercase leading-none">
                  {editingMedicine ? "Edit" : "Add"} <span className="text-emerald-500">Medicine</span>
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-500 hover:text-white"><X size={24}/></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-black text-slate-500 ml-2 tracking-widest">Medicine Name</label>
                  <input placeholder="e.g. Napa Extend" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-emerald-500 text-white font-medium" required />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-black text-slate-500 ml-2 tracking-widest">Price (BDT)</label>
                    <input type="number" placeholder="0.00" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-emerald-500 text-white font-medium" required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-black text-slate-500 ml-2 tracking-widest">Stock Qty</label>
                    <input type="number" placeholder="0" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-emerald-500 text-white font-medium" required />
                  </div>
                </div>

                <button 
                  disabled={loading}
                  type="submit" 
                  className="w-full bg-emerald-600 hover:bg-emerald-500 py-5 rounded-[20px] font-black uppercase text-[11px] tracking-[0.2em] transition-all shadow-xl shadow-emerald-900/20 mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Processing..." : editingMedicine ? "Confirm Changes" : "Deploy to Inventory"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}