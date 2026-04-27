"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LayoutGrid, Plus, Trash2, Tag, X, Save } from "lucide-react";

export default function CategoryPage() {
  const [categories, setCategories] = useState([
    { id: 1, name: "SYRUP", count: 120 },
    { id: 2, name: "TABLET", count: 250 },
    { id: 3, name: "CAPSULE", count: 85 },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false); // ফরম ওপেন করার জন্য
  const [newCatName, setNewCatName] = useState("");

  // ১. নতুন ক্যাটাগরি তৈরি করার লজিক
  const handleCreateCategory = () => {
    if (!newCatName.trim()) return;
    
    const newEntry = {
      id: Date.now(),
      name: newCatName.toUpperCase(),
      count: 0
    };

    setCategories([newEntry, ...categories]);
    setNewCatName("");
    setIsModalOpen(false); // ফরম বন্ধ করে দেওয়া
  };

  return (
    <div className="p-6 lg:p-10 relative">
      {/* হেডার */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white">
            Category <span className="text-blue-600">Hub</span>
          </h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">
            Organize medicines by types and groups
          </p>
        </div>

        {/* প্লাস বাটন - যা ফরম ওপেন করবে */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all shadow-xl shadow-blue-600/20 active:scale-95"
        >
          <Plus size={18} /> Create New Category
        </button>
      </div>

      {/* ক্যাটাগরি লিস্ট */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatePresence>
          {categories.map((cat) => (
            <motion.div
              key={cat.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white/[0.03] border border-white/10 p-8 rounded-[40px] group hover:border-blue-600/40 transition-all relative overflow-hidden"
            >
              <Tag className="absolute -right-4 -bottom-4 text-white/[0.03] group-hover:text-blue-600/10" size={100} />
              <div className="flex justify-between items-start relative z-10">
                <div className="bg-blue-600/10 text-blue-500 p-3 rounded-2xl"><LayoutGrid size={20} /></div>
                <button onClick={() => setCategories(categories.filter(c => c.id !== cat.id))} className="p-2 text-red-500/40 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="mt-8 relative z-10">
                <h3 className="text-xl font-black uppercase italic text-white">{cat.name}</h3>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">{cat.count} Medicines Linked</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* --- ২. CREATE CATEGORY MODAL FORM --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* ব্যাকগ্রাউন্ড ব্লার */}
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md" 
            />
            
            {/* ফরম বডি */}
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-[#0a0c14] border border-white/10 p-10 rounded-[48px] w-full max-w-md relative z-10 shadow-2xl"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors">
                <X size={24}/>
              </button>
              
              <h2 className="text-2xl font-black italic uppercase text-white mb-2">Add New <span className="text-blue-600">Category</span></h2>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-8">Fill up the information below</p>
              
              <div className="space-y-6">
                <div>
                  <label className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] block mb-3 ml-1">Category Name</label>
                  <input 
                    autoFocus
                    type="text" 
                    placeholder="E.G. SYRUP, TABLET..."
                    className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl text-white outline-none focus:border-blue-600 transition-all uppercase font-bold"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleCreateCategory()}
                  />
                </div>

                <button 
                  onClick={handleCreateCategory}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-3 transition-all shadow-lg shadow-blue-600/20 mt-4"
                >
                  <Save size={18} /> Save Category
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}