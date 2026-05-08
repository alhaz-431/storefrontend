"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Trash2, Edit3, Search, X, Package, 
  Image as ImageIcon, Eye, Loader2 
} from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast";

// API URL থেকে মেইন ডোমেইন বের করা (ইমেজ দেখানোর জন্য)
const API_RAW = process.env.NEXT_PUBLIC_API_URL || "https://storemedistore.onrender.com/api/v1";
const BASE_URL = API_RAW.split('/api')[0]; 

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

  const itemRefs = useRef<{ [key: string]: HTMLTableRowElement | null }>({});

  const defaultFormData = {
    name: "",
    price: "",
    stock: "",
    manufacturer: "Beximco Pharma",
    categoryId: "9a539a21-2b99-422c-8aff-adb1ce801782",
    description: "",
    imageFile: null as File | null,
  };

  const [formData, setFormData] = useState(defaultFormData);

  // ✅ Fetch Medicines
  const fetchMedicines = async () => {
    try {
      const res = await api.medicines.getAll();
      const data = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      setMedicines(data);
      return data;
    } catch (err: any) {
      toast.error("Failed to load medicines");
      return [];
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  // ✅ Scroll to Item & Highlight
  const scrollToItem = (id: string) => {
    setTimeout(() => {
      const el = itemRefs.current[id];
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("bg-emerald-500/20", "ring-1", "ring-emerald-500");
        setTimeout(() => {
          el.classList.remove("bg-emerald-500/20", "ring-1", "ring-emerald-500");
        }, 3000);
      }
    }, 600);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMedicine(null);
    setPreviewImage(null);
    setFormData(defaultFormData);
  };

  const openView = (med: Medicine) => {
    setSelectedMedicine(med);
    setIsViewOpen(true);
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

  // ✅ Handle Submit (ADD or EDIT)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    const toastId = toast.loading(editingMedicine ? `Updating ${formData.name}...` : `Adding ${formData.name}...`);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("price", formData.price);
      data.append("stock", formData.stock);
      data.append("manufacturer", formData.manufacturer);
      data.append("categoryId", formData.categoryId);
      data.append("description", formData.description);
      
      if (formData.imageFile) {
        data.append("image", formData.imageFile);
      }

      let targetId;

      if (editingMedicine) {
        await api.medicines.update(editingMedicine.id, data);
        targetId = editingMedicine.id;
        toast.success(`${formData.name} updated successfully!`, { id: toastId });
      } else {
        const response = await api.medicines.create(data);
        targetId = response?.data?.data?.id || response?.data?.id;
        toast.success(`${formData.name} added to inventory!`, { id: toastId });
      }

      closeModal();
      await fetchMedicines();
      
      if (targetId) {
        scrollToItem(targetId);
      }

    } catch (err: any) {
      console.error("❌ Submit Error:", err);
      toast.error(err?.response?.data?.error || "Operation failed", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    const toastId = toast.loading("Deleting...");
    try {
      await api.medicines.delete(id);
      setMedicines(prev => prev.filter(m => m.id !== id));
      toast.success("Medicine removed!", { id: toastId });
    } catch (err: any) {
      toast.error("Delete failed", { id: toastId });
    }
  };

  const filtered = medicines.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 min-h-screen bg-[#02040a] text-white">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1 tracking-tight">Medicine Inventory</h1>
            <p className="text-sm text-gray-400">Manage products, stock and live pricing</p>
          </div>
          <button
            onClick={() => { setEditingMedicine(null); setFormData(defaultFormData); setIsModalOpen(true); }}
            className="bg-emerald-600 px-6 py-3 rounded-xl flex items-center gap-2 font-semibold hover:bg-emerald-700 transition-all active:scale-95 shadow-lg shadow-emerald-900/20"
          >
            <Plus size={20} /> Add Medicine
          </button>
        </div>

        {/* SEARCH BAR */}
        <div className="relative mb-6 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
          <input
            className="w-full p-4 pl-12 bg-white/5 border border-white/10 rounded-2xl focus:border-emerald-500/50 transition outline-none"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {/* INVENTORY TABLE */}
        <div className="bg-white/5 rounded-3xl border border-white/10 overflow-hidden shadow-2xl backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5 text-gray-400 text-[11px] uppercase tracking-[0.2em] font-bold">
                <tr>
                  <th className="p-6">Product Details</th>
                  <th className="p-6">Price</th>
                  <th className="p-6">Stock Status</th>
                  <th className="p-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {fetching ? (
                  <tr><td colSpan={4} className="p-24 text-center"><Loader2 className="animate-spin mx-auto text-emerald-500" size={32} /></td></tr>
                ) : filtered.length > 0 ? (
                  filtered.map(med => (
                    <tr key={med.id} ref={(el) => { itemRefs.current[med.id] = el; }} className="group transition-all duration-300 hover:bg-white/[0.02]">
                      <td className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-14 bg-white/10 rounded-xl overflow-hidden border border-white/5 flex-shrink-0">
                            {med.image ? (
                              <img src={`${BASE_URL}/${med.image}`} className="h-full w-full object-cover" alt={med.name} />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center bg-emerald-500/5"><Package size={22} className="text-emerald-500/30" /></div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-gray-100">{med.name}</p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-wider">{med.manufacturer}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-6 font-mono text-emerald-400 font-bold text-lg">৳{med.price}</td>
                      <td className="p-6">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-black tracking-tighter ${med.stock < 10 ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'}`}>
                          {med.stock} ITEMS LEFT
                        </span>
                      </td>
                      <td className="p-6 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => openView(med)} className="p-2.5 bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition"><Eye size={18}/></button>
                          <button onClick={() => startEdit(med)} className="p-2.5 bg-blue-500/5 hover:bg-blue-500/10 rounded-xl text-blue-400 hover:text-blue-300 transition"><Edit3 size={18}/></button>
                          <button onClick={() => handleDelete(med.id)} className="p-2.5 bg-red-500/5 hover:bg-red-500/10 text-red-400 rounded-xl hover:text-red-300 transition"><Trash2 size={18}/></button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={4} className="p-20 text-center text-gray-500 font-medium">No results found for "{searchTerm}"</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* 🟢 VIEW DETAILS MODAL */}
      <AnimatePresence>
        {isViewOpen && selectedMedicine && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-[#0d111a] border border-white/10 p-8 rounded-[32px] w-full max-w-md shadow-2xl relative">
              <button onClick={() => setIsViewOpen(false)} className="absolute top-6 right-6 p-2 bg-white/5 rounded-full hover:bg-white/10"><X size={20}/></button>
              <div className="h-56 w-full bg-white/5 rounded-2xl mb-6 overflow-hidden border border-white/10">
                {selectedMedicine.image ? (
                  <img src={`${BASE_URL}/${selectedMedicine.image}`} className="w-full h-full object-cover" alt="" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><Package size={56} className="text-white/5" /></div>
                )}
              </div>
              <h2 className="text-2xl font-bold mb-1">{selectedMedicine.name}</h2>
              <p className="text-emerald-500 font-semibold mb-6 tracking-wide uppercase text-xs">{selectedMedicine.manufacturer}</p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <span className="text-gray-500 text-[10px] uppercase block mb-1">Price</span>
                  <span className="font-bold text-xl text-emerald-400">৳{selectedMedicine.price}</span>
                </div>
                <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                  <span className="text-gray-500 text-[10px] uppercase block mb-1">Stock</span>
                  <span className="font-bold text-xl">{selectedMedicine.stock} PCS</span>
                </div>
              </div>
              <div className="mb-8">
                <span className="text-gray-500 text-[10px] uppercase block mb-2">Description</span>
                <p className="text-gray-400 text-sm leading-relaxed">{selectedMedicine.description || "No specific details provided for this medicine."}</p>
              </div>
              <button onClick={() => setIsViewOpen(false)} className="w-full bg-white/10 hover:bg-white/20 py-4 rounded-2xl font-bold transition">Dismiss Details</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🟢 ADD/EDIT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto">
            <motion.form initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} onSubmit={handleSubmit} className="bg-[#0d111a] border border-white/10 p-8 rounded-[32px] w-full max-w-lg shadow-2xl my-8">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold">{editingMedicine ? "Edit Product" : "New Medicine"}</h2>
                <button type="button" onClick={closeModal} className="text-gray-500 hover:text-white"><X /></button>
              </div>
              
              <div className="space-y-6">
                {/* Upload Section */}
                <div className="flex items-center gap-5 p-5 bg-white/5 rounded-2xl border border-dashed border-white/10 hover:border-emerald-500/50 transition-colors">
                  <div className="h-24 w-24 bg-black rounded-xl overflow-hidden flex items-center justify-center border border-white/10 shadow-inner">
                    {previewImage ? <img src={previewImage} className="h-full w-full object-cover" alt="" /> : <ImageIcon size={28} className="text-gray-800" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-gray-500 mb-2 uppercase">Product Photo</p>
                    <label className="inline-block bg-emerald-600/10 text-emerald-500 px-4 py-2 rounded-lg text-xs font-bold cursor-pointer hover:bg-emerald-600/20 transition">
                      Choose Image
                      <input type="file" accept="image/*" hidden onChange={(e) => {
                        const file = e.target.files?.[0];
                        if(file) {
                          setFormData({...formData, imageFile: file});
                          setPreviewImage(URL.createObjectURL(file));
                        }
                      }} />
                    </label>
                  </div>
                </div>

                <div className="grid gap-5">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2 ml-1">Medicine Name *</label>
                    <input required className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-emerald-500 transition shadow-inner" placeholder="Enter name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2 ml-1">Price (৳)</label>
                      <input required type="number" step="0.01" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-emerald-500 transition shadow-inner" placeholder="0.00" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2 ml-1">Stock Count</label>
                      <input required type="number" className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-emerald-500 transition shadow-inner" placeholder="0" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2 ml-1">Manufacturer</label>
                    <input className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-emerald-500 transition shadow-inner" placeholder="e.g. Beximco" value={formData.manufacturer} onChange={e => setFormData({ ...formData, manufacturer: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-500 block mb-2 ml-1">Product Description</label>
                    <textarea className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:border-emerald-500 h-28 resize-none transition shadow-inner" placeholder="Details about this product..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-10">
                <button type="button" onClick={closeModal} className="flex-1 bg-white/5 hover:bg-white/10 py-4 rounded-2xl font-bold transition tracking-tight">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 bg-emerald-600 hover:bg-emerald-700 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition disabled:opacity-50 shadow-lg shadow-emerald-900/40">
                  {loading ? <Loader2 className="animate-spin" size={20} /> : (editingMedicine ? "Update Inventory" : "Add to Stock")}
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}