"use client";
import { Pill, Activity, FlaskConical, Thermometer, ShieldPlus } from "lucide-react";
import Link from "next/link";

const cats = [
  { name: "Tablets", icon: Pill, color: "text-blue-500" },
  { name: "Syrups", icon: FlaskConical, color: "text-emerald-500" },
  { name: "Health", icon: Activity, color: "text-red-500" },
  { name: "Vitamins", icon: ShieldPlus, color: "text-amber-500" },
];

export default function Categories() {
  return (
    <section className="py-20 max-w-7xl mx-auto px-6">
      <h2 className="text-2xl font-black italic uppercase mb-10 tracking-tighter">
        Browse by <span className="text-emerald-500">Category</span>
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {cats.map((cat) => (
          <Link key={cat.name} href={`/shop?category=${cat.name.toLowerCase()}`}>
            <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[32px] flex flex-col items-center justify-center group hover:border-emerald-500/40 transition-all cursor-pointer">
              <cat.icon size={40} className={`${cat.color} mb-4 group-hover:scale-110 transition-transform`} />
              <span className="text-xs font-black uppercase tracking-widest">{cat.name}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}