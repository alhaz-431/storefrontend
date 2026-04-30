"use client";
import { motion } from "framer-motion";
import { FiStar } from "react-icons/fi";

export default function Testimonials() {
  return (
    <section className="py-12 md:py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-800 mb-3 md:mb-4">আমাদের <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">কাস্টমারদের মতামত</span></h2>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {[
            { name: "আহমেদ হাসান", review: "খুবই ভালো সার্ভিস। দ্রুত ডেলিভারি এবং অরিজিনাল প্রোডাক্ট। ১০০% রেকমেন্ডেড!", rating: 5, location: "ঢাকা", image: "1" },
            { name: "ফাতিমা রহমান", review: "দাম অনেক কম এবং কোয়ালিটি অসাধারণ। সবাইকে রেকমেন্ড করব।", rating: 5, location: "চট্টগ্রাম", image: "5" },
            { name: "করিম মিয়া", review: "২৪ ঘণ্টার মধ্যে পেয়েছি। কাস্টমার সার্ভিস খুবই হেল্পফুল।", rating: 5, location: "সিলেট", image: "8" }
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -5 }} className="bg-white p-5 md:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all">
              <div className="flex items-center gap-1 text-yellow-500 mb-3 md:mb-4">{[...Array(item.rating)].map((_, i) => <FiStar key={i} size={14} fill="currentColor" />)}</div>
              <p className="text-gray-700 mb-4 text-sm md:text-base italic leading-relaxed">"{item.review}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white font-bold flex-shrink-0"><img src={`https://i.pravatar.cc/100?img=${item.image}`} alt={item.name} className="w-full h-full object-cover" /></div>
                <div><p className="font-bold text-gray-800 text-sm md:text-base">{item.name}</p><p className="text-xs md:text-sm text-gray-500">{item.location}</p></div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}