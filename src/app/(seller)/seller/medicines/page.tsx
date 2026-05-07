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
    }, 500);
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
    // ইমেজ যদি ব্যাকএন্ড থেকে আসে তবে প্রিভিউ দেখান
    setPreviewImage(med.image ? `http://localhost:5000/${med.image}` : null);
    setIsModalOpen(true);
  };

  // ✅ Handle Submit (ADD or EDIT)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    const toastId = toast.loading(editingMedicine ? "Updating medicine..." : "Adding medicine...");

    try {
      // ব্যাকএন্ডে ফাইল পাঠানোর জন্য FormData ব্যবহার করতে হবে
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

      let response;
      let targetId;

      if (editingMedicine) {
        response = await api.medicines.update(editingMedicine.id, data);
        targetId = editingMedicine.id;
        toast.success(`${formData.name} updated successfully!`, { id: toastId });
      } else {
        response = await api.medicines.create(data);
        // ব্যাকএন্ড থেকে আসা নতুন ID বের করা
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
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Medicine Inventory</h1>
            <p className="text-sm text-gray-400">Manage your stock and pricing</p>
          </div>
          <button
            onClick={() => { setEditingMedicine(null); setFormData(defaultFormData); setIsModalOpen(true); }}
            className="bg-emerald-600 px-6 py-3 rounded-xl flex items-center gap-2 font-semibold hover:bg-emerald-700 transition-all"
          >
            <Plus size={20} /> Add Medicine
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            className="w-full p-4 pl-12 bg-white/5 border border-white/10 rounded-2xl focus:border-emerald-500 transition outline-none"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Table Container */}
        <div className="bg-white/5 rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5 text-gray-400 text-[11px] uppercase tracking-widest font-bold">
                <tr>
                  <th className="p-5">Medicine Info</th>
                  <th className="p-5">Price</th>
                  <th className="p-5">Stock Status</th>
                  <th className="p-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {fetching ? (
                  <tr><td colSpan={4} className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-emerald-500" size={32} /></td></tr>
                ) : filtered.map(med => (
                  <tr key={med.id} ref={(el) => { itemRefs.current[med.id] = el; }} className="group transition-all duration-300">
                    <td className="p-5">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 bg-white/10 rounded-lg overflow-hidden border border-white/5">
                          {med.image ? (
                            <img src={`http://localhost:5000/${med.image}`} className="h-full w-full object-cover" alt="" />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center"><Package size={18} className="text-gray-600" /></div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold">{med.name}</p>
                          <p className="text-[10px] text-gray-500 uppercase">{med.manufacturer}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-5 font-mono text-emerald-400 font-bold">৳{med.price}</td>
                    <td className="p-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${med.stock < 10 ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                        {med.stock} IN STOCK
                      </span>
                    </td>
                    <td className="p-5 text-right">
                      <div className="flex justify-end gap-1">
                        <button onClick={() => openView(med)} className="p-2 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition"><Eye size={18}/></button>
                        <button onClick={() => startEdit(med)} className="p-2 hover:bg-emerald-500/10 rounded-lg text-emerald-400 hover:text-emerald-300 transition"><Edit3 size={18}/></button>
                        <button onClick={() => handleDelete(med.id)} className="p-2 hover:bg-red-500/10 text-red-400 rounded-lg hover:text-red-300 transition"><Trash2 size={18}/></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* VIEW DETAILS MODAL */}
      <AnimatePresence>
        {isViewOpen && selectedMedicine && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-[#0d111a] border border-white/10 p-6 rounded-[32px] w-full max-w-md shadow-2xl">
              <div className="h-48 w-full bg-white/5 rounded-2xl mb-6 overflow-hidden">
                {selectedMedicine.image ? (
                  <img src={`http://localhost:5000/${selectedMedicine.image}`} className="w-full h-full object-cover" alt="" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><Package size={48} className="text-white/10" /></div>
                )}
              </div>
              <h2 className="text-2xl font-bold mb-1">{selectedMedicine.name}</h2>
              <p className="text-emerald-500 font-medium mb-4">{selectedMedicine.manufacturer}</p>
              <div className="space-y-4">
                <div className="flex justify-between p-4 bg-white/5 rounded-xl">
                  <span className="text-gray-400">Price</span>
                  <span className="font-bold text-emerald-400">৳{selectedMedicine.price}</span>
                </div>
                <div className="flex justify-between p-4 bg-white/5 rounded-xl">
                  <span className="text-gray-400">Available Stock</span>
                  <span className="font-bold">{selectedMedicine.stock} PCS</span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed italic">"{selectedMedicine.description || "No description provided."}"</p>
                <button onClick={() => setIsViewOpen(false)} className="w-full bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-500 py-3 rounded-xl font-bold transition mt-4">Close Details</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD/EDIT FORM MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto">
            <motion.form initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} onSubmit={handleSubmit} className="bg-[#0d111a] border border-white/10 p-8 rounded-[32px] w-full max-w-lg shadow-2xl">
              <h2 className="text-2xl font-bold mb-6">{editingMedicine ? "Update" : "Add New"} Medicine</h2>
              
              <div className="space-y-5">
                {/* Image Upload Preview */}
                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-dashed border-white/10">
                  <div className="h-20 w-20 bg-black rounded-lg overflow-hidden flex items-center justify-center border border-white/5">
                    {previewImage ? <img src={previewImage} className="h-full w-full object-cover" alt="" /> : <ImageIcon className="text-gray-700" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-tighter">Product Image</p>
                    <input type="file" accept="image/*" onChange={(e) => {
                      const file = e.target.files?.[0];
                      if(file) {
                        setFormData({...formData, imageFile: file});
                        setPreviewImage(URL.createObjectURL(file));
                      }
                    }} className="text-xs text-emerald-500 file:hidden cursor-pointer" />
                  </div>
                </div>

                <div className="grid gap-4">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Medicine Name</label>
                    <input required className="w-full p-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-emerald-500" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Price (৳)</label>
                      <input required type="number" step="0.01" className="w-full p-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-emerald-500" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Stock Amount</label>
                      <input required type="number" className="w-full p-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-emerald-500" value={formData.stock} onChange={e => setFormData({ ...formData, stock: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-500 block mb-1">Description</label>
                    <textarea className="w-full p-3 bg-white/5 border border-white/10 rounded-xl outline-none focus:border-emerald-500 h-24 resize-none" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button type="button" onClick={closeModal} className="flex-1 bg-white/5 hover:bg-white/10 py-4 rounded-2xl font-bold transition">Cancel</button>
                <button type="submit" disabled={loading} className="flex-1 bg-emerald-600 hover:bg-emerald-700 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition disabled:opacity-50">
                  {loading ? <Loader2 className="animate-spin" size={20} /> : (editingMedicine ? "Save Changes" : "Confirm Add")}
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}