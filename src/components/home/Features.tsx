"use client";
import { motion } from "framer-motion";
import { FiCheckCircle, FiArrowRight } from "react-icons/fi";
import Link from "next/link";

export default function Features() {
  return (
    <section className="py-12 md:py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl">
              <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop" alt="Pharmacy" className="w-full h-auto" />
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-6">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-800">আপনার বিশ্বস্ত <span className="text-emerald-600">অনলাইন ফার্মেসি</span></h2>
            <p className="text-gray-600 text-sm md:text-base leading-relaxed">MediStore বাংলাদেশের সবচেয়ে বিশ্বস্ত অনলাইন মেডিসিন শপ। আমরা প্রদান করি ১০০% অরিজিনাল ওষুধ, দ্রুততম ডেলিভারি এবং সেরা কাস্টমার সার্ভিস।</p>
            <div className="space-y-4">
              {["Licensed Pharmacists", "Quality Assured Products", "Easy Returns & Refunds", "Secure Online Payment"].map((benefit, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0"><FiCheckCircle className="text-emerald-600" size={14} /></div>
                  <span className="text-gray-700 font-semibold text-sm md:text-base">{benefit}</span>
                </div>
              ))}
            </div>
            <Link href="/shop" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold hover:shadow-xl transition-all">Start Shopping <FiArrowRight /></Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}