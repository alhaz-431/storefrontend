"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Trash2, Edit3, Search, X, Package, 
  AlertCircle, Image as ImageIcon, Eye, ShoppingCart 
} from "lucide-react";
import { api } from "@/lib/api"; 
import { toast } from "react-hot-toast";

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
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  // স্ক্রলিং এর জন্য রেফারেন্স
  const itemRefs = useRef<{ [key: string]: HTMLTableRowElement | null }>({});

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    manufacturer: "Beximco Pharma",
    categoryId: "9a539a21-2b99-422c-8aff-adb1ce801782",
    description: "High quality pharma grade medicine.",
    image: null as File | null,
  });

  const fetchMedicines = async (scrollId?: string) => {
    setLoading(true);
    try {
      const response = await api.medicines.getAll();
      const finalData = Array.isArray(response?.data) ? response.data : response || [];
      setMedicines(finalData);

      // যদি নতুন যোগ বা এডিট হয়, তবে সেখানে স্ক্রল করবে
      if (scrollId) {
        setTimeout(() => {
          itemRefs.current[scrollId]?.scrollIntoView({ behavior: "smooth", block: "center" });
          itemRefs.current[scrollId]?.classList.add("bg-emerald-500/20");
          setTimeout(() => itemRefs.current[scrollId]?.classList.remove("bg-emerald-500/20"), 2000);
        }, 500);
      }
    } catch (error: any) {
      toast.error("ওষুধের তালিকা লোড করা যায়নি।");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading(editingMedicine ? "আপডেট হচ্ছে..." : "যোগ করা হচ্ছে...");

    try {
      // ইমেজসহ ডেটা পাঠানোর জন্য FormData
      const data = new FormData();
      data.append("name", formData.name);
      data.append("price", formData.price);
      data.append("stock", formData.stock);
      data.append("description", formData.description);
      if (formData.image) data.append("image", formData.image);

      let response;
      if (editingMedicine) {
        response = await api.medicines.update(editingMedicine.id, data);
        toast.success("মেডিসিন কার্ডটি সফলভাবে আপডেট হয়েছে!", { id: toastId });
      } else {
        response = await api.medicines.create(data);
        const position = medicines.length + 1;
        toast.success(`ওষুধটি ${position} নম্বর হিসেবে সফলভাবে যোগ হয়েছে!`, { id: toastId });
      }

      const updatedId = response?.data?.id || editingMedicine?.id;
      handleCloseModal();
      fetchMedicines(updatedId); 
    } catch (error: any) {
      toast.error(error.message || "কাজটি সম্পন্ন করা যায়নি", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("আপনি কি নিশ্চিতভাবে এই মেডিসিন কার্ডটি ডিলিট করতে চান?")) return;
    const toastId = toast.loading("ডিলিট হচ্ছে...");
    try {
      await api.medicines.delete(id);
      toast.success("মেডিসিন কার্ডটি ডিলিট করা হয়েছে", { id: toastId });
      setMedicines(prev => prev.filter(m => m.id !== id));
    } catch (error: any) {
      toast.error("ডিলিট করা যায়নি", { id: toastId });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingMedicine(null);
    setPreviewImage(null);
    setFormData({
      name: "", price: "", stock: "", manufacturer: "Beximco Pharma",
      categoryId: "9a539a21-2b99-422c-8aff-adb1ce801782",
      description: "High quality pharma grade medicine.",
      image: null,
    });
  };

  const filteredMeds = (medicines || []).filter((med) =>
    med?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 lg:p-10 min-h-screen bg-[#02040a] text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter">
            Inventory <span className="text-emerald-500">Manager</span>
          </h1>
          <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold">Total Items: {medicines.length}</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 px-6 py-3 rounded-xl font-bold uppercase text-[10px] tracking-widest flex items-center justify-center gap-2"
        >
          <Plus size={16} /> Add Medicine
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
        <input
          type="text"
          placeholder="সার্চ করুন..."
          className="w-full bg-white/5 border border-white/10 p-4 pl-12 rounded-2xl outline-none focus:border-emerald-500 text-sm"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table Section */}
      <div className="bg-white/[0.02] border border-white/10 rounded-[32px] overflow-hidden backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[700px]">
            <thead className="bg-white/5 text-[10px] uppercase tracking-widest text-slate-400 font-black">
              <tr>
                <th className="p-6">Medicine Info</th>
                <th className="p-6">Price</th>
                <th className="p-6">Stock</th>
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading && medicines.length === 0 ? (
                <tr><td colSpan={4} className="p-10 text-center text-slate-500 animate-pulse font-bold uppercase text-xs">Loading...</td></tr>
              ) : filteredMeds.map((med, index) => (
                <tr 
                  key={med.id} 
                  ref={el => { itemRefs.current[med.id] = el; }}
                  className="hover:bg-white/[0.03] group transition-all"
                >
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/5 rounded-xl overflow-hidden border border-white/10 flex items-center justify-center">
                        {med.image ? <img src={med.image} alt="" className="w-full h-full object-cover" /> : <Package size={20} className="text-slate-600" />}
                      </div>
                      <div>
                        <div className="font-bold text-white text-sm">#{index + 1}. {med.name}</div>
                        <div className="text-[9px] text-slate-600 uppercase font-black">{med.manufacturer}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-6 font-mono text-emerald-500 font-bold text-sm">৳{med.price}</td>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${med.stock < 10 ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                      {med.stock} PCS
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 bg-white/5 text-slate-400 rounded-lg hover:text-emerald-500"><Eye size={14} /></button>
                      <button onClick={() => { setEditingMedicine(med); setIsModalOpen(true); }} className="p-2 bg-blue-500/10 text-blue-500 rounded-lg"><Edit3 size={14} /></button>
                      <button onClick={() => handleDelete(med.id)} className="p-2 bg-red-500/10 text-red-500 rounded-lg"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#0d111c] p-8 rounded-[40px] w-full max-w-md border border-white/10 shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-black italic uppercase">
                  {editingMedicine ? "Edit" : "Add"} <span className="text-emerald-500">Medicine</span>
                </h2>
                <button onClick={handleCloseModal} className="text-slate-500 hover:text-white"><X size={24} /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Image Upload Preview */}
                <div 
                  onClick={() => document.getElementById('imageInput')?.click()}
                  className="w-full h-32 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-emerald-500/50 transition-all overflow-hidden bg-white/5"
                >
                  {previewImage ? (
                    <img src={previewImage} className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <ImageIcon className="text-slate-500 mb-2" />
                      <span className="text-[10px] font-black uppercase text-slate-500">Upload Medicine Image</span>
                    </>
                  )}
                  <input type="file" id="imageInput" hidden accept="image/*" onChange={handleImageChange} />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Medicine Name</label>
                  <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none focus:border-emerald-500 mt-1 text-sm" required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Price (৳)</label>
                    <input type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none text-sm" required />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-slate-500 ml-1">Stock Level</label>
                    <input type="number" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} className="w-full bg-white/5 border border-white/10 p-4 rounded-xl outline-none text-sm" required />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-500 py-4 rounded-xl font-black uppercase text-[11px] tracking-widest transition-all shadow-lg shadow-emerald-900/20">
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