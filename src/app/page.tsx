"use client";
import { motion } from "framer-motion";
import { 
  FiSearch, FiShoppingCart, FiTruck, FiShield, 
  FiDollarSign, FiClock, FiPhone, FiMail,
  FiArrowRight, FiStar, FiCheckCircle, FiPackage,
  FiHeart, FiAward, FiUsers, FiTrendingUp
} from "react-icons/fi";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  const [stats, setStats] = useState({ users: 0, medicines: 0, orders: 0, rating: 0 });
  const [searchQuery, setSearchQuery] = useState("");

  // Animated counter effect
  useEffect(() => {
    const timer = setInterval(() => {
      setStats(prev => ({
        users: prev.users < 15000 ? prev.users + 150 : 15000,
        medicines: prev.medicines < 5000 ? prev.medicines + 50 : 5000,
        orders: prev.orders < 25000 ? prev.orders + 250 : 25000,
        rating: prev.rating < 4.9 ? +(prev.rating + 0.1).toFixed(1) : 4.9,
      }));
    }, 30);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gradient-to-b from-slate-50 to-white">
      
      {/* ========== HERO SECTION ========== */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0f172a]">
        {/* Animated Background Elements */}
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-80 h-80 bg-emerald-600/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[30%] left-[40%] w-60 h-60 bg-purple-600/10 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '2s' }} />
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6 md:space-y-8"
            >
              {/* Badge */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-lg px-4 py-2 rounded-full border border-white/10"
              >
                <FiShield className="text-emerald-400" />
                <span className="text-[10px] md:text-xs font-black uppercase tracking-wider text-blue-400">
                  Trusted Pharmacy in Bangladesh 🇧🇩
                </span>
              </motion.div>

              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-white italic uppercase tracking-tighter leading-[0.95]">
                Your Health <br />
                <span className="bg-gradient-to-r from-blue-500 via-emerald-500 to-cyan-500 bg-clip-text text-transparent">
                  Our Priority.
                </span>
              </h1>

              {/* Description */}
              <p className="max-w-lg text-slate-300 text-sm md:text-base leading-relaxed">
                মেডিসিন এখন আপনার হাতের মুঠোয়। জেনুইন ওষুধ কিনুন সবচেয়ে দ্রুততম সময়ে এবং সেরা দামে। 
                <span className="text-emerald-400 font-semibold"> ১০০% অরিজিনাল ওষুধের নিশ্চয়তা।</span>
              </p>

              {/* Search Box */}
              <div className="relative max-w-2xl group">
                <input
                  type="text"
                  placeholder="Search medicines, vitamins, supplements..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 backdrop-blur-lg border border-white/10 px-6 py-4 md:py-5 rounded-2xl text-white outline-none focus:border-blue-500 focus:bg-white/10 transition-all placeholder:text-slate-500 placeholder:text-xs md:placeholder:text-sm"
                />
                <Link href={`/shop?search=${searchQuery}`}>
                  <button className="absolute right-2 top-2 md:right-3 md:top-2.5 bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl transition-all shadow-lg flex items-center gap-2 font-semibold text-sm">
                    <FiSearch size={18} />
                    <span className="hidden sm:inline">Search</span>
                  </button>
                </Link>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3 md:gap-4">
                <Link 
                  href="/shop" 
                  className="bg-white text-black px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[9px] md:text-[10px] flex items-center gap-2 hover:bg-gradient-to-r hover:from-blue-600 hover:to-emerald-600 hover:text-white transition-all shadow-xl"
                >
                  <FiShoppingCart size={16} />
                  Shop Now 
                  <FiArrowRight />
                </Link>
                <Link 
                  href="/register" 
                  className="bg-white/10 backdrop-blur-lg border border-white/20 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-black uppercase text-[9px] md:text-[10px] hover:bg-white hover:text-black transition-all"
                >
                  Register as Seller
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-wrap items-center gap-4 md:gap-6 pt-2 md:pt-4">
                <div className="flex -space-x-3">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 md:border-4 border-[#0a0e27] bg-slate-800 overflow-hidden ring-2 ring-white/10">
                      <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="customer" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1 text-yellow-400 mb-1">
                    {[1,2,3,4,5].map(i => (
                      <FiStar key={i} size={12} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    15K+ Happy Customers
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Right Image Section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="relative hidden lg:block"
            >
              <div className="relative">
                {/* Main Image Container */}
                <div className="relative z-10 w-full h-[500px] bg-gradient-to-br from-blue-600/20 to-transparent rounded-[60px] border border-white/10 overflow-hidden backdrop-blur-sm flex items-center justify-center group">
                  <img
                    src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=2030&auto=format&fit=crop"
                    alt="Medicine"
                    className="w-[70%] h-auto drop-shadow-2xl rotate-12 group-hover:rotate-0 group-hover:scale-110 transition-all duration-700"
                  />
                </div>

                {/* Floating Cards */}
                <motion.div
                  animate={{ y: [0, -20, 0] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="absolute top-10 -left-10 bg-white/10 backdrop-blur-xl p-4 md:p-6 rounded-[32px] border border-white/20 shadow-2xl"
                >
                  <p className="text-blue-400 font-black text-[10px] uppercase mb-1">Flash Sale 🔥</p>
                  <h4 className="text-white font-bold text-sm">20% Off Vitamins</h4>
                </motion.div>

                <motion.div
                  animate={{ y: [0, 20, 0] }}
                  transition={{ repeat: Infinity, duration: 3, delay: 1 }}
                  className="absolute bottom-10 -right-10 bg-emerald-600/90 backdrop-blur-xl p-4 md:p-6 rounded-[32px] shadow-2xl"
                >
                  <div className="flex items-center gap-3">
                    <FiTruck className="text-white" size={24} />
                    <div>
                      <p className="text-white/80 text-xs font-semibold">Free Delivery</p>
                      <p className="text-white font-bold">Orders 500৳+</p>
                    </div>
                  </div>
                </motion.div>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ========== STATS SECTION ========== */}
      <section className="py-8 md:py-12 bg-white border-y border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {[
              { value: stats.users.toLocaleString() + '+', label: 'Happy Customers', icon: <FiUsers /> },
              { value: stats.medicines.toLocaleString() + '+', label: 'Medicines', icon: <FiPackage /> },
              { value: stats.orders.toLocaleString() + '+', label: 'Orders Delivered', icon: <FiCheckCircle /> },
              { value: stats.rating + '/5', label: 'Customer Rating', icon: <FiStar /> }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-blue-100 to-emerald-100 rounded-2xl mb-2 md:mb-3 text-emerald-600">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl lg:text-5xl font-black bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent mb-1">
                  {stat.value}
                </div>
                <p className="text-gray-600 font-semibold text-xs md:text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CATEGORIES SECTION ========== */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 md:mb-12"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-800 mb-3 md:mb-4">
              Browse by <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">Category</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base px-4">
              আমাদের বিস্তৃত ক্যাটাগরি থেকে আপনার প্রয়োজনীয় ওষুধ খুঁজে নিন
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-6">
            {[
              { name: "Pain Relief", icon: "💊", color: "from-red-500 to-pink-500", slug: "painkillers" },
              { name: "Antibiotics", icon: "💉", color: "from-blue-500 to-cyan-500", slug: "antibiotics" },
              { name: "Vitamins", icon: "🍊", color: "from-yellow-500 to-orange-500", slug: "vitamins" },
              { name: "Cold & Flu", icon: "🤧", color: "from-green-500 to-teal-500", slug: "cold-cough" },
              { name: "First Aid", icon: "🩹", color: "from-purple-500 to-pink-500", slug: "first-aid" },
              { name: "Baby Care", icon: "👶", color: "from-pink-500 to-rose-500", slug: "baby-care" },
            ].map((cat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group cursor-pointer"
              >
                <Link href={`/shop?category=${cat.slug}`}>
                  <div className={`bg-gradient-to-br ${cat.color} p-4 md:p-6 rounded-xl md:rounded-2xl text-center shadow-lg hover:shadow-2xl transition-all duration-300`}>
                    <div className="text-3xl md:text-5xl mb-2 md:mb-3 transform group-hover:scale-110 transition-transform">
                      {cat.icon}
                    </div>
                    <h3 className="font-bold text-white text-xs md:text-sm lg:text-base">{cat.name}</h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== WHY CHOOSE US ========== */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-[#0a0e27] via-[#1a1f3a] to-[#0f172a] text-white relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-600/10 rounded-full blur-[100px]" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 md:mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-3 md:mb-4">
              কেন আমাদের <span className="text-emerald-400">বেছে নিবেন?</span>
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base">
              আমরা প্রদান করি সেরা সেবা এবং নিশ্চয়তা
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {[
              {
                icon: <FiShield size={32} />,
                title: "100% Genuine",
                desc: "সকল ওষুধ অরিজিনাল এবং FDA অনুমোদিত",
                color: "from-blue-500 to-cyan-500"
              },
              {
                icon: <FiTruck size={32} />,
                title: "Fast Delivery",
                desc: "ঢাকার ভিতরে ২৪ ঘণ্টায় ডেলিভারি",
                color: "from-emerald-500 to-teal-500"
              },
              {
                icon: <FiDollarSign size={32} />,
                title: "Best Prices",
                desc: "মার্কেটের সবচেয়ে কম দামের গ্যারান্টি",
                color: "from-yellow-500 to-orange-500"
              },
              {
                icon: <FiClock size={32} />,
                title: "24/7 Support",
                desc: "যেকোনো সময় কাস্টমার সাপোর্ট",
                color: "from-purple-500 to-pink-500"
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white/5 backdrop-blur-lg p-6 md:p-8 rounded-2xl border border-white/10 hover:bg-white/10 transition-all duration-300 group"
              >
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

      {/* ========== HOW IT WORKS ========== */}
      <section className="py-12 md:py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 md:mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-800 mb-3 md:mb-4">
              কিভাবে <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">কাজ করে?</span>
            </h2>
            <p className="text-gray-600 text-sm md:text-base">মাত্র ৩টি সহজ ধাপে অর্ডার করুন</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8">
            {[
              { 
                step: "01", 
                title: "Search Medicine", 
                desc: "আপনার প্রয়োজনীয় ওষুধ খুঁজুন", 
                icon: <FiSearch size={32} />,
                color: "from-blue-500 to-cyan-500"
              },
              { 
                step: "02", 
                title: "Add to Cart", 
                desc: "কার্টে যুক্ত করুন এবং চেকআউট করুন", 
                icon: <FiShoppingCart size={32} />,
                color: "from-emerald-500 to-teal-500"
              },
              { 
                step: "03", 
                title: "Get Delivered", 
                desc: "দ্রুততম সময়ে ডেলিভারি পান", 
                icon: <FiPackage size={32} />,
                color: "from-purple-500 to-pink-500"
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative group"
              >
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 md:p-8 rounded-2xl text-center hover:shadow-xl transition-all duration-300 border-2 border-transparent group-hover:border-emerald-200">
                  <div className="absolute -top-4 md:-top-6 left-1/2 -translate-x-1/2 bg-gradient-to-br from-blue-600 to-emerald-600 text-white w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center font-black text-lg md:text-xl shadow-lg">
                    {item.step}
                  </div>
                  <div className={`inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br ${item.color} rounded-2xl mb-4 mt-4 md:mt-6 text-white group-hover:scale-110 transition-transform`}>
                    {item.icon}
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-xs md:text-sm">{item.desc}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-emerald-300">
                    <FiArrowRight size={24} />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== FEATURED BENEFITS ========== */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Image Side */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&auto=format&fit=crop"
                  alt="Pharmacy"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-2xl">
                <div className="text-center">
                  <div className="text-4xl font-black text-emerald-600">100%</div>
                  <p className="text-xs font-semibold text-gray-600">Authentic</p>
                </div>
              </div>
            </motion.div>

            {/* Content Side */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-800">
                আপনার বিশ্বস্ত <span className="text-emerald-600">অনলাইন ফার্মেসি</span>
              </h2>
              <p className="text-gray-600 text-sm md:text-base leading-relaxed">
                MediStore বাংলাদেশের সবচেয়ে বিশ্বস্ত অনলাইন মেডিসিন শপ। আমরা প্রদান করি ১০০% অরিজিনাল ওষুধ, 
                দ্রুততম ডেলিভারি এবং সেরা কাস্টমার সার্ভিস।
              </p>
              <div className="space-y-4">
                {[
                  "Licensed Pharmacists",
                  "Quality Assured Products",
                  "Easy Returns & Refunds",
                  "Secure Online Payment"
                ].map((benefit, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <FiCheckCircle className="text-emerald-600" size={14} />
                    </div>
                    <span className="text-gray-700 font-semibold text-sm md:text-base">{benefit}</span>
                  </div>
                ))}
              </div>
              <Link href="/shop" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold hover:shadow-xl transition-all">
                Start Shopping
                <FiArrowRight />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ========== TESTIMONIALS ========== */}
      <section className="py-12 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 md:mb-16"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-800 mb-3 md:mb-4">
              আমাদের <span className="bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">কাস্টমারদের মতামত</span>
            </h2>
            <p className="text-gray-600 text-sm md:text-base">হাজারো সন্তুষ্ট গ্রাহকদের রিভিউ</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {[
              { 
                name: "আহমেদ হাসান", 
                review: "খুবই ভালো সার্ভিস। দ্রুত ডেলিভারি এবং অরিজিনাল প্রোডাক্ট। ১০০% রেকমেন্ডেড!", 
                rating: 5, 
                location: "ঢাকা",
                image: "1"
              },
              { 
                name: "ফাতিমা রহমান", 
                review: "দাম অনেক কম এবং কোয়ালিটি অসাধারণ। সবাইকে রেকমেন্ড করব।", 
                rating: 5, 
                location: "চট্টগ্রাম",
                image: "5"
              },
              { 
                name: "করিম মিয়া", 
                review: "২৪ ঘণ্টার মধ্যে পেয়েছি। কাস্টমার সার্ভিস খুবই হেল্পফুল।", 
                rating: 5, 
                location: "সিলেট",
                image: "8"
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white p-5 md:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex items-center gap-1 text-yellow-500 mb-3 md:mb-4">
                  {[...Array(item.rating)].map((_, i) => (
                    <FiStar key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 text-sm md:text-base italic leading-relaxed">"{item.review}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                    <img src={`https://i.pravatar.cc/100?img=${item.image}`} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-sm md:text-base">{item.name}</p>
                    <p className="text-xs md:text-sm text-gray-500">{item.location}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== CTA SECTION ========== */}
      <section className="py-12 md:py-20 bg-gradient-to-br from-blue-600 via-emerald-600 to-teal-600 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black mb-4 md:mb-6">
              এখনই শুরু করুন! 🚀
            </h2>
            <p className="text-blue-50 text-base md:text-lg mb-6 md:mb-8 max-w-2xl mx-auto px-4">
              আপনার স্বাস্থ্য আমাদের অগ্রাধিকার। এখনই অর্ডার করুন এবং পান বিশেষ ছাড়।
            </p>
            <div className="flex flex-wrap gap-3 md:gap-4 justify-center">
              <Link href="/shop" className="bg-white text-emerald-600 px-6 md:px-10 py-3 md:py-5 rounded-xl font-bold hover:bg-yellow-300 transition shadow-2xl text-sm md:text-lg flex items-center gap-2">
                <FiShoppingCart />
                Start Shopping
                <FiArrowRight />
              </Link>
              <Link href="/register?role=seller" className="bg-white/10 backdrop-blur-lg border-2 border-white px-6 md:px-10 py-3 md:py-5 rounded-xl font-bold hover:bg-white hover:text-emerald-600 transition text-sm md:text-lg flex items-center gap-2">
                <FiTrendingUp />
                Become a Seller
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ========== CONTACT INFO BAR ========== */}
      <section className="py-6 md:py-8 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <FiPhone size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-400">Call Us</p>
                <p className="font-bold text-sm md:text-base">+880 1700-000000</p>
              </div>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-3">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <FiMail size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-400">Email</p>
                <p className="font-bold text-sm md:text-base">support@medistore.com</p>
              </div>
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-3 sm:col-span-2 lg:col-span-1">
              <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <FiClock size={18} />
              </div>
              <div>
                <p className="text-xs text-gray-400">Working Hours</p>
                <p className="font-bold text-sm md:text-base">24/7 Available</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}