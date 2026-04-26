"use client";
import { useState } from "react";
import MedicineCard from "./MedicineCard";
import { FiSearch, FiLayers } from "react-icons/fi";

export default function MedicineList({ initialMedicines }: { initialMedicines: any[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Fever", "Gastric", "Pain Relief", "Allergy", "Vitamins"];

  // ফিল্টার লজিক
  const filtered = initialMedicines.filter((med) => {
    const matchesSearch = med.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || med.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section className="max-w-7xl mx-auto px-6 mt-20">
      {/* সার্চ এবং ক্যাটাগরি বার */}
      <div className="bg-[#0d111c] border border-white/5 p-6 rounded-[32px] mb-12 flex flex-col md:flex-row gap-6 items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                activeCategory === cat ? "bg-blue-600 text-white" : "bg-white/5 text-slate-500 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 font-bold" />
          <input
            type="text"
            placeholder="Search Medicine..."
            className="w-full bg-white/5 border border-white/5 pl-12 pr-6 py-4 rounded-2xl text-white outline-none focus:border-blue-600/50 transition-all text-xs font-bold"
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex justify-between items-end mb-12">
        <div>
          <span className="text-blue-500 text-[10px] font-black uppercase tracking-[0.4em]">Pharmacy</span>
          <h2 className="text-5xl font-black italic text-white uppercase tracking-tighter">
            {activeCategory} <span className="text-blue-600">Collection</span>
          </h2>
        </div>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{filtered.length} Medicines</p>
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filtered.map((med: any) => (
            <MedicineCard key={med._id || med.id} medicine={med} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white/5 rounded-[40px] border border-dashed border-white/10">
          <FiLayers size={40} className="mx-auto text-slate-700 mb-4" />
          <p className="text-slate-500 font-black uppercase tracking-widest text-[10px]">No Medicines Found</p>
        </div>
      )}
    </section>
  );
}