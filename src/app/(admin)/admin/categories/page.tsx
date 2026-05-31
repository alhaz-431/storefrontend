"use client";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, Plus, Trash2, Tag, X, Save, Loader2 } from "lucide-react";

export default function CategoryPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await api.categories.getAll();
      setCategories(Array.isArray(res) ? res : res.data || []);
    } catch {
      toast.error("ক্যাটাগরি লোড করতে ব্যর্থ!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleCreateCategory = async () => {
    if (!newCatName.trim()) return;
    try {
      // এখানে আপনার ব্যাকএন্ডের API কল হবে
      await api.categories.create({ name: newCatName.toUpperCase() });
      toast.success("ক্যাটাগরি যুক্ত হয়েছে!");
      setNewCatName("");
      setIsModalOpen(false);
      fetchCategories();
    } catch {
      toast.error("তৈরি করতে সমস্যা হয়েছে!");
    }
  };

  return (
    <div className="p-6 lg:p-10 min-h-screen bg-gray-50">
      {/* হেডার */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">Category Hub</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all your medicine categories</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition shadow-lg"
        >
          <Plus size={20} /> Add Category
        </button>
      </div>

      {/* ক্যাটাগরি লিস্ট (রেসপন্সিভ গ্রিড) */}
      {isLoading ? (
        <div className="flex justify-center p-20"><Loader2 className="animate-spin text-blue-600" size={40} /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence>
            {categories.map((cat) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all relative"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-blue-50 text-blue-600 p-3 rounded-xl"><LayoutGrid size={22} /></div>
                  <button className="text-gray-300 hover:text-red-500 transition">
                    <Trash2 size={18} />
                  </button>
                </div>
                <h3 className="text-lg font-bold text-gray-800">{cat.name}</h3>
                <p className="text-gray-400 text-xs mt-1">Total Medicines: {cat.count || 0}</p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* মডাল */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">New Category</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400"><X /></button>
            </div>
            <input 
              autoFocus
              className="w-full border border-gray-200 p-3 rounded-xl mb-4 outline-none focus:border-blue-500"
              placeholder="Category Name (e.g. SYRUP)"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
            />
            <button 
              onClick={handleCreateCategory}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}