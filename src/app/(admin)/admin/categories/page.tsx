"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, Plus, Trash2, Tag } from "lucide-react";

export default function CategoryPage() {
  // ১. স্টেট ডিক্লেয়ার করা (এখানে ক্যাটাগরি লিস্ট থাকবে)
  const [categories, setCategories] = useState([
    { id: 1, name: "SYRUP", count: 120 },
    { id: 2, name: "TABLET", count: 250 },
    { id: 3, name: "CAPSULE", count: 85 },
  ]);

  // নতুন ক্যাটাগরির নামের জন্য স্টেট
  const [newCategory, setNewCategory] = useState("");

  // ২. নতুন ক্যাটাগরি অ্যাড করার ফাংশন
  const handleAddCategory = () => {
    if (newCategory.trim() === "") return; // খালি থাকলে অ্যাড হবে না

    const categoryObj = {
      id: Date.now(), // ইউনিক আইডি
      name: newCategory.toUpperCase(), // সব বড় হাতের অক্ষরে হবে
      count: 0,
    };

    setCategories([...categories, categoryObj]); // লিস্টে নতুনটা যোগ করা
    setNewCategory(""); // ইনপুট বক্স খালি করা
  };

  // ৩. ডিলিট করার ফাংশন
  const deleteCategory = (id: number) => {
    setCategories(categories.filter((cat) => cat.id !== id));
  };

  return (
    <div className="p-6 lg:p-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white">
            Category <span className="text-blue-600">Hub</span>
          </h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">
            Organize medicines by types and groups
          </p>
        </div>

        {/* ইনপুট ফিল্ড এবং অ্যাড বাটন */}
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-2 rounded-2xl focus-within:border-blue-600 transition-all">
          <input 
            type="text" 
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category name..."
            className="bg-transparent pl-4 pr-2 py-2 text-sm outline-none w-48 md:w-64 text-white uppercase"
            onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()} // এন্টার দিলে অ্যাড হবে
          />
          <button 
            onClick={handleAddCategory}
            className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-xl transition-all shadow-lg shadow-blue-600/20"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* ক্যাটাগরি লিস্ট */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatePresence>
          {categories.map((cat) => (
            <motion.div
              key={cat.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="bg-white/[0.03] border border-white/10 p-8 rounded-[40px] group hover:border-blue-600/40 transition-all relative overflow-hidden"
            >
              <Tag className="absolute -right-4 -bottom-4 text-white/[0.03] group-hover:text-blue-600/10" size={100} />

              <div className="flex justify-between items-start relative z-10">
                <div className="bg-blue-600/10 text-blue-500 p-3 rounded-2xl">
                  <LayoutGrid size={20} />
                </div>
                <button 
                  onClick={() => deleteCategory(cat.id)}
                  className="p-2 text-red-500/40 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              <div className="mt-8 relative z-10">
                <h3 className="text-xl font-black uppercase italic text-white tracking-tight">{cat.name}</h3>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">
                  {cat.count} Medicines Linked
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}