"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Edit3, Search, X, Package, AlertCircle } from "lucide-react";
import { api } from "@/lib/api"; 
import { toast } from "react-hot-toast";

interface Medicine {
  id: string;
  name: string;
  category: { name: string; id: string } | any;
  price: number;
  stock: number;
  manufacturer?: string;
  description?: string;
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
    categoryId: "9a539a21-2b99-422c-8aff-adb1ce801782",
    description: "High quality pharma grade medicine.",
  });

  const fetchMedicines = async () => {
    setLoading(true);
    try {
      const response = await api.medicines.getAll();
      const finalData = Array.isArray(response?.data) ? response.data : response || [];
      setMedicines(finalData);
    } catch (error: any) {
      toast.error("ওষুধের তালিকা লোড করা যায়নি।");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading(editingMedicine ? "আপডেট হচ্ছে..." : "যোগ করা হচ্ছে...");

    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
      };

      if (editingMedicine) {
        await api.medicines.update(editingMedicine.id, payload);
        toast.success("সফলভাবে আপডেট হয়েছে!", { id: toastId });
      } else {
        await api.medicines.create(payload);
        toast.success("সফলভাবে যোগ হয়েছে!", { id: toastId });
      }

      handleCloseModal();
      fetchMedicines(); 
    } catch (error: any) {
      toast.error(error.message || "কাজটি সম্পন্ন করা যায়নি", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এটি ডিলিট করতে চান?")) return;
    const toastId = toast.loading("ডিলিট হচ্ছে...");
    try {
      await api.medicines.delete(id);
      toast.success("ডিলিট সম্পন্ন হয়েছে", { id: toastId });
      fetchMedicines();
    } catch (error: any) {
      toast.error(error.message || "ডিলিট করা যায়নি", { id: toastId });
    }
  };

  const startEdit = (med: Medicine) => {
    setEditingMedicine(med);
    setFormData({
      name: med.name,
      price: med.price.toString(),
      stock: med.stock.toString(),
      manufacturer: med.manufacturer || "Beximco Pharma",
      categoryId: typeof med.category === "string" ? med.category : med.category?.id || formData.categoryId,
      description: med.description || "High quality pharma grade medicine.",
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMedicine(null);
    setFormData({
      name: "", price: "", stock: "", manufacturer: "Beximco Pharma",
      categoryId: "9a539a21-2b99-422c-8aff-adb1ce801782",
      description: "High quality pharma grade medicine.",
    });
  };

  const filteredMeds = (medicines || []).filter((med) =>
    med?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 lg:p-10 min-h-screen bg-[#02040a] text-white">
      {/* Header - Mobile friendly flex */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter">
            Inventory <span className="text-emerald-500">Manager</span>
          </h1>
          <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Manage Stock & Pricing</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 transition-all px-6 py-3 rounded-xl font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-2"
        >
          <Plus size={16} /> Add Medicine
        </button>
      </div>

      {/* Search - Adjusted padding */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
        <input
          type="text"
          placeholder="সার্চ করুন..."
          className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl outline-none focus:border-emerald-500 text-sm"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table Section - Improved Overflow */}
      <div className="bg-white/[0.02] border border-white/10 rounded-2xl md:rounded-[32px] overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left min-w-[600px]"> {/* min-w ensures it doesn't squish too much */}
            <thead className="bg-white/5 text-[10px] uppercase tracking-widest text-slate-400 font-black">
              <tr>
                <th className="p-4 md:p-6">Medicine Name</th>
                <th className="p-4 md:p-6">Price</th>
                <th className="p-4 md:p-6">Stock Status</th>
                <th className="p-4 md:p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan={4} className="p-10 text-center text-slate-500 animate-pulse font-bold">লোড হচ্ছে...</td></tr>
              ) : filteredMeds.length > 0 ? (
                filteredMeds.map((med) => (
                  <tr key={med.id} className="hover:bg-white/[0.03] group transition-all">
                    <td className="p-4 md:p-6">
                      <div className="font-bold text-white text-sm md:text-base">{med.name}</div>
                      <div className="text-[9px] text-slate-600 uppercase font-black">{med.manufacturer || "General"}</div>
                    </td>
                    <td className="p-4 md:p-6 font-mono text-emerald-500 font-bold text-sm">৳{med.price}</td>
                    <td className="p-4 md:p-6">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[9px] md:text-[10px] font-bold ${med.stock < 10 ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                        {med.stock < 10 && <AlertCircle size={10} />}
                        {med.stock} PCS
                      </div>
                    </td>
                    <td className="p-4 md:p-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => startEdit(med)} className="p-2 bg-blue-500/10 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-all"><Edit3 size={14} /></button>
                        <button onClick={() => handleDelete(med.id)} className="p-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={4} className="p-10 text-center text-slate-600 font-bold uppercase text-[10px]">কোনো ডাটা পাওয়া যায়নি</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form - Fully Responsive */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="bg-[#0d111c] p-6 md:p-8 rounded-[24px] md:rounded-[40px] w-full max-w-md border border-white/10 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg md:text-xl font-black italic uppercase">
                  {editingMedicine ? "Edit" : "Add"} <span className="text-emerald-500">Medicine</span>
                </h2>
                <button onClick={handleCloseModal} className="text-slate-500 hover:text-white"><X size={24} /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Medicine Name</label>
                  <input
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 p-3 md:p-4 rounded-xl outline-none focus:border-emerald-500 mt-1 text-sm"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Price (৳)</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={e => setFormData({ ...formData, price: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 p-3 md:p-4 rounded-xl outline-none text-sm"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Stock Level</label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={e => setFormData({ ...formData, stock: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 p-3 md:p-4 rounded-xl outline-none text-sm"
                      required
                    />
                  </div>
                </div>

                <button
                  disabled={loading}
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 py-3 md:py-4 rounded-xl font-black uppercase text-[10px] md:text-[11px] tracking-widest transition-all disabled:opacity-50 mt-4"
                >
                  {loading ? "প্রসেস হচ্ছে..." : editingMedicine ? "পরিবর্তন সেভ করুন" : "ইনভেন্টরিতে যোগ করুন"}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}