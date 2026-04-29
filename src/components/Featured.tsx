"use client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import MedicineCard from "./MedicineCard";

export default function Featured() {
  // ✅ টাইপ এরর ফিক্স করতে image এবং category যোগ করা হয়েছে
  const dummyFeatured = [
    { 
      id: '1', 
      name: 'Napa Extend', 
      price: 20, 
      manufacturer: 'Beximco',
      image: '', // ফাঁকা স্ট্রিং বা কোনো ডামি ইমেজ ইউআরএল
      category: 'Tablet'
    },
    { 
      id: '2', 
      name: 'Sergel 20', 
      price: 70, 
      manufacturer: 'Healthcare',
      image: '',
      category: 'Capsule'
    },
    { 
      id: '3', 
      name: 'Fexo 120', 
      price: 90, 
      manufacturer: 'Square',
      image: '',
      category: 'Tablet'
    },
  ];

  return (
    <section className="py-20 bg-white/[0.01]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-black italic uppercase tracking-tighter">
              Featured <span className="text-emerald-500">Medicines</span>
            </h2>
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-[0.4em] mt-2">Best sellers this week</p>
          </div>
          <Link href="/shop" className="text-emerald-500 font-black uppercase text-[10px] tracking-widest flex items-center gap-2 hover:gap-4 transition-all">
            View All Shop <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {dummyFeatured.map((med) => (
            <MedicineCard key={med.id} medicine={med} />
          ))}
        </div>
      </div>
    </section>
  );
}