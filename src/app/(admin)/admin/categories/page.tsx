"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { LayoutGrid, Plus, Edit2, Trash2, Tag } from "lucide-react";

export default function CategoryPage() {
  // স্ট্যাটিক ক্যাটাগরি লিস্ট (পরে ডাটাবেস থেকে আসবে)
  const [categories, setCategories] = useState([
    { id: 1, name: "Syrup", count: 120 },
    { id: 2, name: "Tablet", count: 250 },
    { id: 3, name: "Capsule", count: 85 },
    { id: 4, name: "Injection", count: 40 },
  ]);

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

        {/* Add New Category Button/Input */}
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 p-2 rounded-2xl focus-within:border-blue-600 transition-all">
          <input 
            type="text" 
            placeholder="New category name..."
            className="bg-transparent pl-4 pr-2 py-2 text-sm outline-none w-48 md:w-64"
          />
          <button className="bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-xl transition-all shadow-lg shadow-blue-600/20">
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* ক্যাটাগরি কার্ড গ্রিড */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map((cat, i) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white/[0.03] border border-white/10 p-8 rounded-[40px] group hover:border-blue-600/40 hover:bg-blue-600/[0.02] transition-all relative overflow-hidden"
          >
            {/* ব্যাকগ্রাউন্ড আইকন ডিজাইন */}
            <Tag className="absolute -right-4 -bottom-4 text-white/[0.03] group-hover:text-blue-600/10 transition-colors" size={100} />

            <div className="flex justify-between items-start relative z-10">
              <div className="bg-blue-600/10 text-blue-500 p-3 rounded-2xl">
                <LayoutGrid size={20} />
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 text-slate-400 hover:text-white transition-colors"><Edit2 size={16} /></button>
                <button className="p-2 text-red-500/60 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
              </div>
            </div>

            <div className="mt-8 relative z-10">
              <h3 className="text-xl font-black uppercase italic text-white tracking-tight">{cat.name}</h3>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">
                {cat.count} Medicines Linked
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}