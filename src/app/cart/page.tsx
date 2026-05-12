"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck, ShieldCheck, Clock, Zap, Award } from "lucide-react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const [cart, setCart] = useState<any[]>([]);
  const router = useRouter();
  const freeShippingThreshold = 1000;

  useEffect(() => {
    const savedCart = localStorage.getItem("medistore_cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const progress = Math.min((total / freeShippingThreshold) * 100, 100);

  const updateCart = (newCart: any[]) => {
    setCart(newCart);
    localStorage.setItem("medistore_cart", JSON.stringify(newCart));
  };

  const updateQuantity = (medicineId: string, delta: number) => {
    const newCart = cart.map((item) => {
      if (item.medicineId === medicineId) {
        const newQty = Math.max(1, Math.min(item.stock, item.quantity + delta));
        return { ...item, quantity: newQty };
      }
      return item;
    });
    updateCart(newCart);
  };

  const removeItem = (medicineId: string) => {
    const newCart = cart.filter((item) => item.medicineId !== medicineId);
    updateCart(newCart);
    toast.success("Item removed");
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#020d0a] bg-gradient-to-br from-[#020d0a] via-[#051a14] to-[#10b981]/5 flex items-center justify-center">
        <div className="text-center">
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 4 }} className="text-9xl mb-8 opacity-10">🛒</motion.div>
          <h2 className="text-7xl font-black text-white italic uppercase tracking-tighter mb-8">Cart is <span className="text-emerald-500">Empty</span></h2>
          <Link href="/shop" className="bg-emerald-500 text-black px-12 py-5 rounded-2xl font-black uppercase italic hover:bg-white transition-all inline-block shadow-2xl shadow-emerald-500/20">Browse Shop</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020d0a] bg-gradient-to-br from-[#020d0a] via-[#051a14] to-[#10b981]/10 text-white py-12 md:py-20 px-6 relative">
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* FEATURE 1: Premium Progress & Delivery Info */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white/[0.03] border border-white/5 p-8 rounded-[40px] backdrop-blur-3xl">
             <div className="flex justify-between mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500 flex items-center gap-2"><Truck size={14}/> Shipping Progress</span>
                <span className="text-xs font-black italic">{Math.round(progress)}%</span>
             </div>
             <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden mb-4">
                <motion.div animate={{ width: `${progress}%` }} className="h-full bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]" />
             </div>
             <p className="text-[10px] font-black uppercase text-white/30 italic">
               {total >= freeShippingThreshold ? "Congrats! Free shipping applied." : `Add ৳${freeShippingThreshold - total} more for free delivery`}
             </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white/[0.03] border border-white/5 p-8 rounded-[40px] backdrop-blur-3xl flex items-center justify-between">
             <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-emerald-500"><Clock size={28}/></div>
                <div>
                   <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Est. Delivery</p>
                   <h4 className="text-xl font-black italic uppercase">24 - 48 Hours</h4>
                </div>
             </div>
             <div className="hidden md:block h-10 w-[1px] bg-white/5" />
             <div className="text-right">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Items</p>
                <h4 className="text-xl font-black italic uppercase text-emerald-500">{totalItems} Units</h4>
             </div>
          </motion.div>
        </div>

        {/* Main Title */}
        <div className="mb-20">
          <h1 className="text-7xl md:text-[10rem] font-black italic uppercase tracking-tighter leading-none text-white">
            MY <span className="text-emerald-500">CART</span>
          </h1>
        </div>

        <div className="grid lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-8">
            <AnimatePresence mode="popLayout">
              {cart.map((item) => (
                <motion.div key={item.medicineId} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="bg-white/[0.02] border border-white/5 rounded-[50px] p-8 md:p-10 flex flex-col md:flex-row gap-10 items-center backdrop-blur-3xl hover:bg-white/[0.05] transition-all group relative overflow-hidden">
                  {/* FEATURE 2: Savings Badge */}
                  <div className="absolute top-0 right-0 bg-emerald-500 text-black px-6 py-2 rounded-bl-3xl font-black italic text-[10px] uppercase">Original Product</div>
                  
                  <div className="w-32 h-32 bg-emerald-500/5 rounded-[40px] flex items-center justify-center text-5xl shadow-2xl group-hover:scale-110 transition-transform">💊</div>
                  
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="font-black italic uppercase text-3xl mb-2 tracking-tighter group-hover:text-emerald-500 transition-colors">{item.name}</h3>
                    <p className="text-emerald-500 font-black text-2xl mb-8">৳{item.price}</p>
                    <div className="flex items-center justify-center md:justify-start gap-6">
                      <div className="flex items-center gap-6 bg-black/60 rounded-[25px] p-2 border border-white/5">
                        <button onClick={() => updateQuantity(item.medicineId, -1)} className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-2xl hover:bg-emerald-500 hover:text-black transition-all"><Minus size={20} /></button>
                        <span className="font-black italic text-2xl w-8 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.medicineId, 1)} className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-2xl hover:bg-emerald-500 hover:text-black transition-all"><Plus size={20} /></button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto">
                    <button onClick={() => removeItem(item.medicineId)} className="text-white/10 hover:text-red-500 p-4 transition-all"><Trash2 size={28} /></button>
                    <div className="text-right">
                      <p className="text-[11px] font-black text-white/20 uppercase mb-2">Subtotal</p>
                      <p className="text-4xl font-black italic tracking-tighter leading-none">৳{item.price * item.quantity}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Sticky Summary with FEATURE 3: Trust Badges */}
          <div className="lg:col-span-1">
            <div className="bg-white/[0.03] border border-white/10 rounded-[60px] p-12 backdrop-blur-3xl sticky top-24 shadow-2xl">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-10 pb-6 border-b border-white/5">Summary</h2>
              
              <div className="space-y-6 mb-12">
                <div className="flex justify-between text-white/40 font-black uppercase text-[10px] tracking-widest"><span>Subtotal</span><span className="text-white">৳{total}</span></div>
                <div className="flex justify-between text-white/40 font-black uppercase text-[10px] tracking-widest"><span>Shipping</span><span className="text-emerald-500">{total >= freeShippingThreshold ? "FREE" : "৳60"}</span></div>
                <div className="pt-6 mt-6 border-t border-white/5">
                   <p className="text-[10px] font-black uppercase text-emerald-500 mb-2">Total Amount</p>
                   <p className="text-7xl font-black italic text-white tracking-tighter leading-none">৳{total >= freeShippingThreshold ? total : total + 60}</p>
                </div>
              </div>

              <button onClick={() => router.push('/customer/checkout')} className="w-full bg-emerald-500 text-black py-8 rounded-[30px] font-black uppercase italic text-sm tracking-[0.2em] shadow-2xl shadow-emerald-500/20 hover:bg-white hover:scale-[1.02] transition-all flex items-center justify-center gap-4 group mb-10">
                CHECKOUT NOW <ArrowRight size={22} className="group-hover:translate-x-3 transition-transform" />
              </button>

              {/* Trust Section */}
              <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-8">
                 <div className="flex flex-col items-center text-center">
                    <ShieldCheck size={20} className="text-emerald-500 mb-2" />
                    <p className="text-[8px] font-black uppercase text-white/40 tracking-widest leading-tight">Secure <br/> Payment</p>
                 </div>
                 <div className="flex flex-col items-center text-center">
                    <Award size={20} className="text-emerald-500 mb-2" />
                    <p className="text-[8px] font-black uppercase text-white/40 tracking-widest leading-tight">100% <br/> Genuine</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}