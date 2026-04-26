"use client";
import { FiArrowRight, FiSearch, FiPlusCircle } from "react-icons/fi";
import { motion } from "framer-motion"; // এনিমেশনের জন্য

export default function Hero() {
  return (
    <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#040610]">
      {/* ব্যাকগ্রাউন্ড ডেকোরেশন (Blur Effects) */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-900/10 rounded-full blur-[100px]" />

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        
        {/* বাম পাশ: টেক্সট এবং সার্চ */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
            <FiPlusCircle className="text-blue-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-400">Trusted Pharmacy in Bangladesh</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black text-white italic uppercase tracking-tighter leading-[0.9]">
            Your Health <br /> 
            <span className="text-blue-600">Our Priority.</span>
          </h1>

          <p className="max-w-md text-slate-400 text-sm font-medium leading-relaxed">
            মেডিসিন এখন আপনার হাতের মুঠোয়। জেনুইন ওষুধ কিনুন সবচেয়ে দ্রুততম সময়ে এবং সেরা দামে। আমরা দিচ্ছি ১০০% অরিজিনাল ওষুধের নিশ্চয়তা।
          </p>

          {/* সার্চ বক্স */}
          <div className="relative max-w-lg group">
            <input 
              type="text" 
              placeholder="Search for medicines, vitamins..."
              className="w-full bg-white/5 border border-white/10 px-6 py-5 rounded-2xl text-white outline-none focus:border-blue-600 transition-all placeholder:text-slate-600 placeholder:uppercase placeholder:text-[10px] placeholder:font-black"
            />
            <button className="absolute right-3 top-3 bg-blue-600 hover:bg-blue-500 text-white p-3 rounded-xl transition-all">
              <FiSearch size={20} />
            </button>
          </div>

          <div className="flex items-center gap-6 pt-4">
             <button className="bg-white text-black px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2 hover:bg-blue-600 hover:text-white transition-all shadow-xl shadow-white/5">
                Shop Now <FiArrowRight />
             </button>
             <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[#040610] bg-slate-800 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-[#040610] bg-blue-600 flex items-center justify-center text-[8px] font-bold text-white">10K+</div>
             </div>
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Happy <br/> Customers</p>
          </div>
        </motion.div>

        {/* ডান পাশ: ইমেজ বা গ্রাফিক */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="relative hidden lg:block"
        >
          {/* এখানে আপনি একটি ওষুধের বোতল বা কোনো প্রফেশনাল ইমেজ বসাতে পারেন */}
          <div className="relative z-10 w-full h-[500px] bg-gradient-to-br from-blue-600/20 to-transparent rounded-[60px] border border-white/5 overflow-hidden flex items-center justify-center">
             <img 
               src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=2030&auto=format&fit=crop" 
               alt="Medicine Box" 
               className="w-[80%] h-auto drop-shadow-2xl rotate-12 group-hover:rotate-0 transition-all duration-700"
             />
          </div>
          {/* Floating Card */}
          <div className="absolute top-10 left-[-20px] bg-white/10 backdrop-blur-xl p-6 rounded-[32px] border border-white/10 shadow-2xl animate-bounce duration-[3000ms]">
              <p className="text-blue-500 font-black text-[10px] uppercase">Flash Sale</p>
              <h4 className="text-white font-bold">20% Off All Vitamins</h4>
          </div>
        </motion.div>

      </div>
    </section>
  );
}