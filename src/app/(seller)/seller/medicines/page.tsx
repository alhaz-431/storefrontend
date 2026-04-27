"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Package, Trash2, Edit3, 
  Search, X, Upload, DollarSign, 
  Layers, ChevronRight 
} from "lucide-react";

export default function SellerMedicines() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // ডামি ডাটা (পরে ডাটাবেস থেকে আসবে)
  const [medicines, setMedicines] = useState([
    { id: 1, name: "Napa Extra", category: "Tablet", price: 25, stock: 500, status: "In Stock" },
    { id: 2, name: "Sergel 20mg", category: "Capsule", price: 70, stock: 120, status: "Low Stock" },
  ]);

  return (
    <div className="p-6 lg:p-10 min-h-screen bg-[#02040a]">
      {/* হেডার সেকশন */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white">
            Inventory <span className="text-emerald-500">Manager</span>
          </h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">
            Manage your stock and pricing effectively
          </p>
        </div>

        <div className="flex items-center gap-4">
           <div className="relative group hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="Search meds..."
                className="bg-white/5 border border-white/10 pl-12 pr-6 py-3 rounded-2xl text-sm outline-none focus:border-emerald-500 text-white transition-all w-64"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <button 
             onClick={() => setIsModalOpen(true)}
             className="flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all shadow-xl shadow-emerald-600/20"
           >
             <Plus size={18} /> Add New Medicine
           </button>
        </div>
      </div>

      {/* মেডিসিন টেবিল */}
      <div className="bg-white/[0.02] border border-white/5 rounded-[40px] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 italic">
            <tr>
              <th className="px-10 py-6">Medicine Info</th>
              <th className="px-10 py-6">Category</th>
              <th className="px-10 py-6">Price</th>
              <th className="px-10 py-6">Stock</th>
              <th className="px-10 py-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {medicines.map((med) => (
              <tr key={med.id} className="hover:bg-white/[0.03] transition-all group">
                <td className="px-10 py-6 flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500 font-black italic border border-emerald-500/20">
                    {med.name[0]}
                  </div>
                  <div>
                    <p className="text-white font-black uppercase italic tracking-tight">{med.name}</p>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">UID: MED-{med.id}442</p>
                  </div>
                </td>
                <td className="px-10 py-6 font-bold text-slate-400 text-xs italic uppercase">{med.category}</td>
                <td className="px-10 py-6 font-black text-white italic">৳{med.price}</td>
                <td className="px-10 py-6">
                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase border ${med.stock > 150 ? 'text-emerald-500 border-emerald-500/20 bg-emerald-500/10' : 'text-orange-500 border-orange-500/20 bg-orange-500/10'}`}>
                    {med.stock} in stock
                  </span>
                </td>
                <td className="px-10 py-6 text-right space-x-2">
                   <button className="p-3 bg-white/5 text-slate-400 hover:text-white rounded-xl transition-colors"><Edit3 size={16}/></button>
                   <button className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* --- ADD MEDICINE MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/90 backdrop-blur-md" />
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 30 }}
              className="bg-[#0a0c14] border border-white/10 p-10 rounded-[48px] w-full max-w-2xl relative z-10 shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <button onClick={() => setIsModalOpen(false)} className="absolute top-8 right-8 text-slate-500 hover:text-white transition-colors"><X size={24}/></button>
              
              <h2 className="text-2xl font-black italic uppercase text-white mb-2">Register New <span className="text-emerald-500">Medicine</span></h2>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-10 border-b border-white/5 pb-4">Product Inventory Details</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* মেডিসিন নাম */}
                <div className="col-span-2">
                  <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] block mb-3">Product Name</label>
                  <input type="text" placeholder="E.G. NAPA EXTRA 500MG" className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl text-white outline-none focus:border-emerald-500 transition-all uppercase font-bold text-sm" />
                </div>

                {/* ক্যাটাগরি (সিলেক্ট বক্স) */}
                <div>
                  <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] block mb-3">Select Category</label>
                  <div className="relative">
                    <select className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl text-white outline-none focus:border-emerald-500 transition-all appearance-none font-bold text-xs uppercase cursor-pointer">
                      <option className="bg-[#0a0c14]">Syrup</option>
                      <option className="bg-[#0a0c14]">Tablet</option>
                      <option className="bg-[#0a0c14]">Capsule</option>
                      <option className="bg-[#0a0c14]">Injection</option>
                    </select>
                    <Layers className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={16} />
                  </div>
                </div>

                {/* দাম */}
                <div>
                  <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] block mb-3">Price (Per Unit)</label>
                  <div className="relative">
                    <input type="number" placeholder="0.00" className="w-full bg-white/5 border border-white/10 pl-12 pr-6 py-4 rounded-2xl text-white outline-none focus:border-emerald-500 transition-all font-bold" />
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 font-black text-emerald-500 text-sm">৳</span>
                  </div>
                </div>

                {/* স্টক কোয়ান্টিটি */}
                <div>
                  <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] block mb-3">Stock Quantity</label>
                  <div className="relative">
                    <input type="number" placeholder="500" className="w-full bg-white/5 border border-white/10 pl-12 pr-6 py-4 rounded-2xl text-white outline-none focus:border-emerald-500 transition-all font-bold" />
                    <Package className="absolute left-6 top-1/2 -translate-y-1/2 text-emerald-500" size={16} />
                  </div>
                </div>

                {/* ছবি আপলোড */}
                <div>
                  <label className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] block mb-3">Product Image</label>
                  <div className="border-2 border-dashed border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center gap-2 hover:border-emerald-500/50 transition-all cursor-pointer bg-white/[0.02]">
                    <Upload className="text-slate-500" size={20} />
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Select Image</span>
                  </div>
                </div>

                <button className="col-span-2 bg-emerald-600 hover:bg-emerald-500 text-white py-5 rounded-[24px] font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-3 transition-all shadow-xl shadow-emerald-600/20 mt-4 group">
                  Confirm & Upload Product <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}