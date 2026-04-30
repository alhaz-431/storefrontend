"use client";
import { motion } from "framer-motion";
import { FiShoppingCart, FiArrowRight, FiTrendingUp } from "react-icons/fi";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-blue-600 via-emerald-600 to-teal-600 text-white relative overflow-hidden">
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 md:mb-6">এখনই শুরু করুন!</h2>
          <p className="text-blue-50 text-base md:text-lg mb-6 md:mb-8 max-w-2xl mx-auto px-4">আপনার স্বাস্থ্য আমাদের অগ্রাধিকার। এখনই অর্ডার করুন এবং পান বিশেষ ছাড়।</p>
          <div className="flex flex-wrap gap-3 md:gap-4 justify-center">
            <Link href="/shop" className="bg-white text-emerald-600 px-6 md:px-10 py-3 md:py-5 rounded-xl font-bold hover:bg-yellow-300 transition shadow-2xl text-sm md:text-lg flex items-center gap-2"><FiShoppingCart /> Start Shopping <FiArrowRight /></Link>
            <Link href="/register?role=seller" className="bg-white/10 backdrop-blur-lg border-2 border-white px-6 md:px-10 py-3 md:py-5 rounded-xl font-bold hover:bg-white hover:text-emerald-600 transition text-sm md:text-lg flex items-center gap-2"><FiTrendingUp /> Become a Seller</Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}