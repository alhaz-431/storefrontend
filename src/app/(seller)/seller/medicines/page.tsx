"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Trash2, Edit3, Search, X, Package, 
  Image as ImageIcon, Eye, Loader2, DollarSign, Database, AlertCircle
} from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast";

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

  const defaultFormData = {
    name: "",
    price: "",
    stock: "",
    manufacturer: "",
    categoryId: "9a539a21-2b99-422c-8aff-adb1ce801782", // নিশ্চিত করুন এই ID আপনার DB-তে আছে
    description: "",
    imageFile: null as File | null,
  };

  const [formData, setFormData] = useState(defaultFormData);

  // 1. VIEW/FETCH ALL MEDICINES
  const fetchMedicines = async () => {
    try {
      setFetching(true);
      const res = await api.medicines.getAll();
      const data = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : [];
      setMedicines(data);
    } catch (err: any) {
      toast.error("Failed to load inventory");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => { fetchMedicines(); }, []);

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMedicine(null);
    setPreviewImage(null);
    setFormData(defaultFormData);
  };

  // 2. OPEN EDIT MODAL
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

  // 3. ADD & EDIT LOGIC (SUBMIT)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading(editingMedicine ? "Updating..." : "Adding...");

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

      if (editingMedicine) {
        await api.medicines.update(editingMedicine.id, data);
        toast.success("Medicine updated!", { id: toastId });
      } else {
        await api.medicines.create(data);
        toast.success("Medicine added to vault!", { id: toastId });
      }

      closeModal();
      fetchMedicines();
    } catch (err: any) {
      toast.error("Something went wrong!", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  // 4. REMOVE/DELETE LOGIC
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this item permanently?")) return;
    const tId = toast.loading("Removing...");
    try {
      await api.medicines.delete(id);
      toast.success("Item removed!", { id: tId });
      fetchMedicines();
    } catch (err) {
      toast.error("Delete failed", { id: tId });
    }
  };

  const filtered = medicines.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="min-h-screen bg-[#030305] text-slate-200 p-4 md:p-10">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-white mb-2 uppercase italic">
              Medicine <span className="text-indigo-500">Inventory</span>
            </h1>
            <p className="text-slate-500 font-medium tracking-wide text-[10px] uppercase">Live Stock Status • {medicines.length} Items</p>
          </div>
          <button
            onClick={() => { setEditingMedicine(null); setFormData(defaultFormData); setIsModalOpen(true); }}
            className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-2xl shadow-indigo-600/20 active:scale-95"
          >
            <Plus size={18} /> Add New Medicine
          </button>
        </div>

        {/* SEARCH SECTION */}
        <div className="relative mb-10">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600" size={20} />
          <input
            type="text"
            placeholder="Quick search..."
            className="w-full bg-[#08080f] border border-white/5 rounded-[24px] py-5 pl-16 pr-6 outline-none focus:border-indigo-500/50 transition-all font-medium text-slate-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* DATA TABLE */}
        <div className="bg-[#08080f] border border-white/5 rounded-[32px] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white/5 border-b border-white/5 uppercase text-[9px] font-black tracking-[0.2em] text-slate-500">
                  <th className="px-8 py-6">Product</th>
                  <th className="px-8 py-6">Price</th>
                  <th className="px-8 py-6">Status</th>
                  <th className="px-8 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {fetching ? (
                  <tr><td colSpan={4} className="py-24 text-center"><Loader2 className="animate-spin inline-block text-indigo-500" size={32} /></td></tr>
                ) : filtered.length > 0 ? (
                  filtered.map((med) => (
                    <tr key={med.id} className="group hover:bg-white/[0.01] transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-[#030305] rounded-xl border border-white/5 overflow-hidden flex-shrink-0 group-hover:border-indigo-500/40 transition-all">
                            {med.image ? <img src={`${BASE_URL}/${med.image}`} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-slate-800"><Package size={20} /></div>}
                          </div>
                          <div>
                            <h4 className="text-white font-bold text-sm leading-tight">{med.name}</h4>
                            <p className="text-indigo-500 text-[9px] font-black uppercase tracking-widest mt-1">{med.manufacturer || "N/A"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 font-black text-emerald-400 italic">৳{med.price}</td>
                      <td className="px-8 py-6">
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${med.stock < 10 ? 'text-rose-500 border-rose-500/10 bg-rose-500/5' : 'text-indigo-500 border-indigo-500/10 bg-indigo-500/5'}`}>
                          {med.stock} LEFT
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => { setSelectedMedicine(med); setIsViewOpen(true); }} className="p-2.5 bg-white/5 rounded-xl text-slate-500 hover:text-white transition-all"><Eye size={18} /></button>
                          <button onClick={() => startEdit(med)} className="p-2.5 bg-white/5 rounded-xl text-indigo-400 hover:text-white hover:bg-indigo-600 transition-all"><Edit3 size={18} /></button>
                          <button onClick={() => handleDelete(med.id)} className="p-2.5 bg-white/5 rounded-xl text-rose-500 hover:text-white hover:bg-rose-600 transition-all"><Trash2 size={18} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={4} className="py-20 text-center text-slate-600 text-sm">No items found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* VIEW MODAL (DETAILS) */}
      <AnimatePresence>
        {isViewOpen && selectedMedicine && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="bg-[#08080f] border border-white/10 rounded-[32px] w-full max-w-md p-8 relative shadow-2xl">
              <button onClick={() => setIsViewOpen(false)} className="absolute top-6 right-6 text-slate-500 hover:text-white"><X size={24}/></button>
              <div className="h-48 w-full bg-[#030305] rounded-2xl mb-6 overflow-hidden flex items-center justify-center border border-white/5">
                {selectedMedicine.image ? <img src={`${BASE_URL}/${selectedMedicine.image}`} className="max-h-full" /> : <Package size={60} className="text-slate-800" />}
              </div>
              <h2 className="text-2xl font-black text-white italic uppercase mb-1">{selectedMedicine.name}</h2>
              <p className="text-indigo-500 font-bold uppercase text-[10px] tracking-[0.2em] mb-6">{selectedMedicine.manufacturer}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                 <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Price</p>
                    <p className="text-xl font-black text-emerald-400 italic">৳{selectedMedicine.price}</p>
                 </div>
                 <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                    <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Stock</p>
                    <p className="text-xl font-black text-indigo-400 italic">{selectedMedicine.stock} PCS</p>
                 </div>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed mb-8">{selectedMedicine.description || "No description provided."}</p>
              <button onClick={() => setIsViewOpen(false)} className="w-full bg-indigo-600 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest text-white transition-all shadow-lg shadow-indigo-600/20">Close Preview</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD/EDIT MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-[100] flex items-center justify-center p-6 overflow-y-auto">
            <motion.form 
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }}
              onSubmit={handleSubmit}
              className="bg-[#08080f] border border-white/5 p-10 rounded-[40px] w-full max-w-xl shadow-2xl relative my-10"
            >
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-xl font-black text-white uppercase italic tracking-tighter">
                  {editingMedicine ? 'Update' : 'Register'} <span className="text-indigo-500">Medicine</span>
                </h2>
                <button type="button" onClick={closeModal} className="text-slate-500 hover:text-white"><X size={24} /></button>
              </div>

              <div className="space-y-6">
                {/* IMAGE UPLOAD AREA */}
                <div className="relative group flex flex-col items-center justify-center p-6 bg-white/5 border border-dashed border-white/10 rounded-2xl hover:border-indigo-500/50 transition-all cursor-pointer overflow-hidden">
                  {previewImage ? (
                    <img src={previewImage} className="w-24 h-24 object-contain mb-3" />
                  ) : (
                    <ImageIcon size={32} className="text-slate-700 mb-3" />
                  )}
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Click to upload photo</p>
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if(file) {
                      setFormData({...formData, imageFile: file});
                      setPreviewImage(URL.createObjectURL(file));
                    }
                  }} />
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase mb-2 block ml-1 tracking-widest">Name</label>
                    <input required className="w-full bg-[#030305] border border-white/5 rounded-xl py-4 px-5 outline-none focus:border-indigo-500 transition-all font-bold text-white text-sm shadow-inner" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] font-black text-slate-500 uppercase mb-2 block ml-1 tracking-widest">Price (৳)</label>
                      <input required type="number" className="w-full bg-[#030305] border border-white/5 rounded-xl py-4 px-5 outline-none focus:border-indigo-500 transition-all font-bold text-white text-sm shadow-inner" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                    </div>
                    <div>
                      <label className="text-[9px] font-black text-slate-500 uppercase mb-2 block ml-1 tracking-widest">Stock</label>
                      <input required type="number" className="w-full bg-[#030305] border border-white/5 rounded-xl py-4 px-5 outline-none focus:border-indigo-500 transition-all font-bold text-white text-sm shadow-inner" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} />
                    </div>
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase mb-2 block ml-1 tracking-widest">Manufacturer</label>
                    <input className="w-full bg-[#030305] border border-white/5 rounded-xl py-4 px-5 outline-none focus:border-indigo-500 transition-all font-bold text-white text-sm shadow-inner" value={formData.manufacturer} onChange={e => setFormData({...formData, manufacturer: e.target.value})} />
                  </div>
                  <div>
                    <label className="text-[9px] font-black text-slate-500 uppercase mb-2 block ml-1 tracking-widest">Description</label>
                    <textarea rows={2} className="w-full bg-[#030305] border border-white/5 rounded-xl py-4 px-5 outline-none focus:border-indigo-500 transition-all font-bold text-white text-sm shadow-inner resize-none" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-10">
                <button type="button" onClick={closeModal} className="flex-1 bg-white/5 py-5 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all">Cancel</button>
                <button type="submit" disabled={loading} className="flex-[2] bg-indigo-600 hover:bg-indigo-500 py-5 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] text-white transition-all shadow-xl shadow-indigo-600/20 disabled:opacity-50">
                  {loading ? <Loader2 className="animate-spin inline-block" size={18} /> : (editingMedicine ? "Commit Updates" : "Save to Vault")}
                </button>
              </div>
            </motion.form>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}