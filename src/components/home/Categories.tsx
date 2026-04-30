"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Categories() {
  const categories = [
    { name: "Pain Relief", color: "from-red-500 to-pink-500", slug: "painkillers" },
    { name: "Antibiotics", color: "from-blue-500 to-cyan-500", slug: "antibiotics" },
    { name: "Vitamins", color: "from-yellow-500 to-orange-500", slug: "vitamins" },
    { name: "Cold & Flu", color: "from-green-500 to-teal-500", slug: "cold-cough" },
    { name: "First Aid", color: "from-purple-500 to-pink-500", slug: "first-aid" },
    { name: "Baby Care", color: "from-pink-500 to-rose-500", slug: "baby-care" },
  ];

  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-800 mb-3 md:mb-4">
            Browse by <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">Category</span>
          </h2>
        </motion.div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-6">
          {categories.map((cat, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ scale: 1.05, y: -5 }} className="group cursor-pointer">
              <Link href={`/shop?category=${cat.slug}`}>
                <div className={`bg-gradient-to-br ${cat.color} p-4 md:p-6 rounded-xl md:rounded-2xl text-center shadow-lg hover:shadow-2xl transition-all duration-300`}>
                  <h3 className="font-bold text-white text-xs md:text-sm lg:text-base">{cat.name}</h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}