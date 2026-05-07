"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Trash2, Edit3, Search, X, Package, 
  Image as ImageIcon, Eye, Loader2 
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
  // ================= STATES =================
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
    image: null as File | null,
  };

  const [formData, setFormData] = useState(defaultFormData);

  // ================= FETCH DATA =================
  const fetchMedicines = async () => {
    try {
      const res = await api.medicines.getAll();
      const data = Array.isArray(res?.data) ? res.data : res || [];
      setMedicines(data);
    } catch {
      toast.error("ডাটা লোড করতে সমস্যা হয়েছে");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  // ================= UTILS =================
  const scrollToItem = (id: string) => {
    setTimeout(() => {
      const el = itemRefs.current[id];
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("bg-emerald-500/20");
        setTimeout(() => el.classList.remove("bg-emerald-500/20"), 2000);
      }
    }, 400);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMedicine(null);
    setPreviewImage(null);
    setFormData(defaultFormData);
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // ================= ACTIONS =================
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
      manufacturer: med.manufacturer || "Beximco Pharma",
      categoryId: med.category?.id || defaultFormData.categoryId,
      description: med.description || "",
      image: null,
    });
    setPreviewImage(med.image || null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading(editingMedicine ? "Updating..." : "Adding...");

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) data.append(key, value as any);
      });

      let res;
      if (editingMedicine) {
        res = await api.medicines.update(editingMedicine.id, data);
        toast.success("সফলভাবে আপডেট হয়েছে", { id: toastId });
      } else {
        res = await api.medicines.create(data);
        toast.success("সফলভাবে যোগ হয়েছে", { id: toastId });
      }

      const targetId = res?.data?.id || editingMedicine?.id;
      closeModal();
      await fetchMedicines();
      if (targetId) scrollToItem(targetId);
    } catch {
      toast.error("কিছু একটা ভুল হয়েছে", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this medicine?")) return;
    const toastId = toast.loading("Deleting...");
    try {
      await api.medicines.delete(id);
      setMedicines(prev => prev.filter(m => m.id !== id));
      toast.success("ডিলিট সম্পন্ন হয়েছে", { id: toastId });
    } catch {
      toast.error("ডিলিট ব্যর্থ হয়েছে", { id: toastId });
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
          <h1 className="text-2xl font-bold">Inventory Management</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full md:w-auto bg-emerald-600 px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 font-semibold hover:bg-emerald-700 transition-all active:scale-95"
          >
            <Plus size={20} /> Add Medicine
          </button>
        </div>

        {/* SEARCH */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            className="w-full p-4 pl-12 bg-white/5 border border-white/10 rounded-2xl focus:outline-none focus:border-emerald-500/50 transition-all"
            placeholder="Search medicine..."
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {/* TABLE */}
        <div className="bg-white/5 rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white/5 text-gray-400 text-[11px] uppercase tracking-widest font-bold">
                <tr>
                  <th className="p-5">Medicine Info</th>
                  <th className="p-5">Price</th>
                  <th className="p-5">Stock</th>
                  <th className="p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {fetching ? (
                  <tr>
                    <td colSpan={4} className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-emerald-500" /></td>
                  </tr>
                ) : filtered.length > 0 ? (
                  filtered.map(med => (
                    <tr
                      key={med.id}
                      ref={(el) => { if (el) itemRefs.current[med.id] = el; }}
                      className="group hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="p-5">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 bg-white/10 rounded-lg flex items-center justify-center overflow-hidden">
                            {med.image ? <img src={med.image} className="h-full w-full object-cover" /> : <Package size={18} className="text-gray-500" />}
                          </div>
                          <div>
                            <p className="font-bold text-gray-200">{med.name}</p>
                            <p className="text-[10px] text-gray-500 uppercase">{med.manufacturer}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-5 font-mono text-emerald-400">৳{med.price}</td>
                      <td className="p-5">{med.stock} pcs</td>
                      <td className="p-5 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => openView(med)} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-all"><Eye size={18}/></button>
                          <button onClick={() => startEdit(med)} className="p-2 hover:bg-white/10 rounded-lg text-blue-400 hover:text-blue-300 transition-all"><Edit3 size={18}/></button>
                          <button onClick={() => handleDelete(med.id)} className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg transition-all"><Trash2 size={18}/></button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={4} className="p-10 text-center text-gray-500 font-medium">No medicine found!</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* VIEW MODAL (DETAILS) */}
      <AnimatePresence>
        {isViewOpen && selectedMedicine && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-[#0d111a] border border-white/10 p-6 rounded-3xl w-full max-w-md relative shadow-2xl">
              <button onClick={() => setIsViewOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white"><X /></button>
              <div className="h-48 w-full bg-white/5 rounded-2xl mb-4 flex items-center justify-center overflow-hidden">
                {selectedMedicine.image ? <img src={selectedMedicine.image} className="w-full h-full object-cover" /> : <Package size={48} className="text-white/10" />}
              </div>
              <h2 className="text-2xl font-bold mb-1">{selectedMedicine.name}</h2>
              <p className="text-emerald-500 text-sm font-semibold mb-4">{selectedMedicine.manufacturer}</p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Price</p>
                  <p className="text-lg font-mono text-emerald-400">৳{selectedMedicine.price}</p>
                </div>
                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                  <p className="text-[10px] text-gray-500 uppercase font-bold">Stock</p>
                  <p className="text-lg font-mono">{selectedMedicine.stock} PCS</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">{selectedMedicine.description || "No description provided."}</p>
              <button onClick={() => setIsViewOpen(false)} className="w-full bg-white/5 hover:bg-white/10 py-3 rounded-xl font-bold transition-all">Close</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD / EDIT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.form initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} onSubmit={handleSubmit} className="bg-[#0d111a] border border-white/10 p-6 rounded-3xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">{editingMedicine ? "Edit" : "Add"} Medicine</h2>
                <button type="button" onClick={closeModal} className="text-gray-500 hover:text-white"><X /></button>
              </div>

              <div className="space-y-4">
                {/* Image Upload */}
                <div onClick={() => document.getElementById('file-up')?.click()} className="h-32 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-all overflow-hidden">
                  {previewImage ? <img src={previewImage} className="h-full w-full object-cover" /> : <div className="text-center"><ImageIcon className="mx-auto text-gray-600 mb-1" /><p className="text-[10px] text-gray-500 font-bold uppercase">Upload Image</p></div>}
                  <input id="file-up" type="file" hidden onChange={handleImage} accept="image/*" />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Medicine Name</label>
                  <input required className="w-full p-3 bg-white/5 border border-white/10 rounded-xl focus:border-emerald-500 focus:outline-none transition-all" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Price (৳)</label>
                    <input required type="number" className="w-full p-3 bg-white/5 border border-white/10 rounded-xl focus:border-emerald-500 focus:outline-none transition-all" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Stock</label>
                    <input required type="number" className="w-full p-3 bg-white/5 border border-white/10 rounded-xl focus:border-emerald-500 focus:outline-none transition-all" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Description</label>
                  <textarea className="w-full p-3 bg-white/5 border border-white/10 rounded-xl focus:border-emerald-500 focus:outline-none h-24 resize-none transition-all" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button type="button" onClick={closeModal} className="flex-1 bg-white/5 hover:bg-white/10 py-3 rounded-xl font-bold text-sm transition-all">Cancel</button>
                <button disabled={loading} className="flex-1 bg-emerald-600 hover:bg-emerald-700 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center">
                  {loading ? <Loader2 className="animate-spin" size={20} /> : "Save Medicine"}
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}