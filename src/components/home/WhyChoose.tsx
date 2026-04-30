"use client";
import { motion } from "framer-motion";
import { FiShield, FiTruck, FiDollarSign, FiClock } from "react-icons/fi";

export default function WhyChoose() {
  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0f172a] text-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-3 md:mb-4">কেন আমাদের <span className="text-emerald-400">বেছে নিবেন?</span></h2>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          {[
            { icon: <FiShield size={32} />, title: "100% Genuine", desc: "সকল ওষুধ অরিজিনাল এবং FDA অনুমোদিত", color: "from-blue-500 to-cyan-500" },
            { icon: <FiTruck size={32} />, title: "Fast Delivery", desc: "ঢাকার ভিতরে ২৪ ঘণ্টায় ডেলিভারি", color: "from-emerald-500 to-teal-500" },
            { icon: <FiDollarSign size={32} />, title: "Best Prices", desc: "মার্কেটের সবচেয়ে কম দামের গ্যারান্টি", color: "from-yellow-500 to-orange-500" },
            { icon: <FiClock size={32} />, title: "24/7 Support", desc: "যেকোনো সময় কাস্টমার সাপোর্ট", color: "from-purple-500 to-pink-500" }
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} whileHover={{ y: -10 }} className="bg-white/5 backdrop-blur-lg p-6 md:p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 group">
              <div className={`inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-gradient-to-br ${item.color} rounded-2xl mb-4 group-hover:scale-110 transition-transform`}>
                <div className="text-white">{item.icon}</div>
              </div>
              <h3 className="text-lg md:text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-slate-300 text-xs md:text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}