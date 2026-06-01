"use client";
import { motion } from "framer-motion";
import { FiShoppingCart, FiArrowRight, FiTrendingUp } from "react-icons/fi";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="py-12 md:py-20 bg-gradient-to-br from-blue-600 via-emerald-600 to-teal-600 text-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        
        {/* এখানে flex-col-reverse দেওয়া হয়েছে যাতে মোবাইলে ভিডিও আগে এবং টেক্সট নিচে থাকে */}
        <div className="flex flex-col-reverse md:grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          
          {/* বাম পাশে: টেক্সট এবং বাটন (মোবাইলে সেন্টার হবে) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            className="text-center md:text-left"
          >
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-black mb-4 leading-tight">
              এখনই শুরু করুন!
            </h2>
            <p className="text-blue-50 text-sm md:text-lg mb-6 md:mb-8 max-w-lg mx-auto md:mx-0">
              আপনার স্বাস্থ্য আমাদের অগ্রাধিকার। এখনই অর্ডার করুন এবং পান বিশেষ ছাড়। 
              সঠিক নিয়মে ওষুধ সেবন করুন এবং সুস্থ থাকুন।
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <Link 
                href="/shop" 
                className="bg-white text-emerald-600 px-6 py-3 md:px-8 md:py-4 rounded-xl font-bold hover:bg-yellow-300 transition shadow-xl text-sm md:text-lg flex items-center justify-center gap-2"
              >
                <FiShoppingCart /> Start Shopping <FiArrowRight />
              </Link>
              <Link 
                href="/register?role=seller" 
                className="bg-white/10 backdrop-blur-lg border-2 border-white px-6 py-3 md:px-8 md:py-4 rounded-xl font-bold hover:bg-white hover:text-emerald-600 transition text-sm md:text-lg flex items-center justify-center gap-2"
              >
                <FiTrendingUp /> Become a Seller
              </Link>
            </div>
          </motion.div>

          {/* ডান পাশে: ভিডিও */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} 
            whileInView={{ opacity: 1, scale: 1 }} 
            viewport={{ once: true }}
            className="w-full max-w-sm md:max-w-full mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20"
          >
            <video 
              className="w-full h-auto" 
              autoPlay 
              loop 
              muted 
              playsInline
            >
              <source src="/video.mp4" type="video/mp4" />
              আপনার ব্রাউজার ভিডিওটি সাপোর্ট করছে না।
            </video>
          </motion.div>

        </div>
      </div>
    </section>
  );
}