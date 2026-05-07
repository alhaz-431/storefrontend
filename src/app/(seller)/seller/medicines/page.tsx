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
      toast.error("ডাটা লোড করতে সমস্যা হয়েছে");
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
        toast.success("সফলভাবে আপডেট হয়েছে", { id: toastId });
      } else {
        res = await api.medicines.create(data);
        toast.success("সফলভাবে যোগ হয়েছে", { id: toastId });
      }

      const targetId = res?.data?.id || editingMedicine?.id;
      closeModal();
      await fetchMedicines();
      if (targetId) scrollToItem(targetId);
    } catch {
      toast.error("কিছু একটা ভুল হয়েছে", { id: toastId });
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
      toast.success("ডিলিট সম্পন্ন হয়েছে", { id: toastId });
    } catch {
      toast.error("ডিলিট ব্যর্থ হয়েছে", { id: toastId });
    }
  };

  const filtered = medicines.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 min-h-screen bg-[#02040a] text-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <h1 className="text-2xl font-bold">Inventory Management</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full md:w-auto bg-emerald-600 px-6 py-2.5 rounded-xl flex items-center justify-center gap-2 font-semibold"
          >
            <Plus size={20} /> Add Medicine
          </button>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input
            className="w-full p-4 pl-12 bg-white/5 border border-white/10 rounded-2xl focus:outline-none"
            placeholder="Search..."
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="bg-white/5 rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5 text-gray-400 text-xs uppercase font-bold">
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
                ) : (
                  filtered.map(med => (
                    <tr
                      key={med.id}
                      ref={(el) => { if (el) itemRefs.current[med.id] = el; }}
                      className="group hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="p-5">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 bg-white/10 rounded flex items-center justify-center">
                            {med.image ? <img src={med.image} className="h-full w-full object-cover rounded" /> : <Package size={18}/>}
                          </div>
                          <p className="font-bold">{med.name}</p>
                        </div>
                      </td>
                      <td className="p-5">৳{med.price}</td>
                      <td className="p-5">{med.stock} pcs</td>
                      <td className="p-5 text-right flex justify-end gap-2">
                        <button onClick={() => openView(med)} className="p-2 hover:bg-white/10 rounded"><Eye size={18}/></button>
                        <button onClick={() => startEdit(med)} className="p-2 hover:bg-white/10 rounded"><Edit3 size={18}/></button>
                        <button onClick={() => handleDelete(med.id)} className="p-2 hover:bg-red-500/10 text-red-400 rounded"><Trash2 size={18}/></button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODALS (View, Add/Edit) - Logic remains same, only fixed TypeScript for Ref */}
      {/* ... Add your Modals JSX here (same as previous response) ... */}
    </div>
  );
}