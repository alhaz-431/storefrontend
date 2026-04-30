"use client";
import { motion } from "framer-motion";
import { FiSearch, FiShoppingCart, FiPackage, FiArrowRight } from "react-icons/fi";

export default function HowItWorks() {
  return (
    <section className="py-12 md:py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-800 mb-3 md:mb-4">কিভাবে <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">কাজ করে?</span></h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {[
            { step: "01", title: "Search Medicine", desc: "আপনার প্রয়োজনীয় ওষুধ খুঁজুন", icon: <FiSearch size={32} />, color: "from-blue-500 to-cyan-500" },
            { step: "02", title: "Add to Cart", desc: "কার্টে যুক্ত করুন এবং চেকআউট করুন", icon: <FiShoppingCart size={32} />, color: "from-emerald-500 to-teal-500" },
            { step: "03", title: "Get Delivered", desc: "দ্রুততম সময়ে ডেলিভারি পান", icon: <FiPackage size={32} />, color: "from-purple-500 to-pink-500" }
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2 }} className="relative group">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 md:p-8 rounded-2xl text-center hover:shadow-xl transition-all duration-300 border-2 border-transparent group-hover:border-emerald-200">
                <div className="absolute -top-4 md:-top-6 left-1/2 -translate-x-1/2 bg-gradient-to-br from-blue-600 to-emerald-600 text-white w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-black text-lg md:text-xl shadow-lg">{item.step}</div>
                <div className={`inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br ${item.color} rounded-2xl mb-4 mt-4 md:mt-6 text-white group-hover:scale-110 transition-transform`}>{item.icon}</div>
                <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-xs md:text-sm">{item.desc}</p>
              </div>
              {i < 2 && <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-emerald-300"><FiArrowRight size={24} /></div>}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}