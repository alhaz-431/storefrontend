"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, ArrowRight, Truck, ShieldCheck, Loader2, ShoppingBag } from "lucide-react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface CartItem {
  id: string;
  medicineId: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
}

export default function CartPage() {
  // 🛒 গ্লোবাল কার্ট স্টেট (কাস্টমার ও পাবলিক সবার জন্য)
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  const freeShippingThreshold = 1000; 

  useEffect(() => {
    // 🎯 মেইন জেনারেল কার্ট কী থেকে ডেটা রিড করা হচ্ছে
    const savedCart = localStorage.getItem("medistore_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Cart parsing error", e);
      }
    }
    setLoading(false);
  }, []);

  const total = cart.reduce((sum, item) => {
    const price = Number(item.price || 0);
    const qty = Number(item.quantity || 0);
    return sum + (price * qty);
  }, 0);

  const progress = Math.min((total / freeShippingThreshold) * 100, 100);

  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("medistore_cart", JSON.stringify(newCart));
    // ন্যাভবারকে ইনস্ট্যান্ট কাউন্ট আপডেট করার জন্য ইভেন্ট ফায়ার করা
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const updateQuantity = (medicineId: string, delta: number) => {
    const newCart = cart.map((item) => {
      const itemId = item.medicineId || item.id;
      if (itemId === medicineId) {
        const currentQty = Number(item.quantity || 1);
        const stockLimit = Number(item.stock || 999);
        const newQty = Math.max(1, Math.min(stockLimit, currentQty + delta));
        return { ...item, quantity: newQty };
      }
      return item;
    });
    updateCart(newCart);
  };

  const removeItem = (medicineId: string) => {
    const newCart = cart.filter((item) => (item.medicineId || item.id) !== medicineId);
    updateCart(newCart);
    toast.success("Item removed from cart");
  };

  const clearCart = () => {
    if (confirm("Are you sure you want to clear your cart?")) {
      updateCart([]);
      toast.success("Cart cleared");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-800 font-black text-xs uppercase tracking-widest gap-2">
        <Loader2 className="animate-spin text-emerald-600" size={18} /> Loading Secure Cart...
      </div>
    );
  }

  // 📦 ১. কার্ট খালি থাকলে যা দেখাবে (সেলার ড্যাশবোর্ডের বদলে শপ পেজে পাঠাবে)
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center max-w-sm">
          <motion.div 
            animate={{ y: [0, -12, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-[28px] flex items-center justify-center mx-auto mb-6 shadow-sm"
          >
            <ShoppingBag size={36} />
          </motion.div>
          <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tight mb-2">
            No Items <span className="text-emerald-600">Selected</span>
          </h2>
          <p className="text-slate-400 text-xs font-semibold tracking-wide mb-8">
            Your shopping cart is currently empty. Explore our online pharmacy shop to add medicines.
          </p>
          
          <Link href="/shop" className="bg-emerald-600 hover:bg-slate-900 text-white px-10 py-4 rounded-2xl font-black uppercase text-xs tracking-widest transition-all inline-block shadow-lg shadow-emerald-600/10 active:scale-95">
            Go to Shop Page
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12 md:py-16 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Progress Bar (হোয়াইট থিম সামঞ্জস্য) */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-12 bg-white border border-slate-200 p-6 rounded-[32px] shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shadow-sm">
                <Truck size={20} />
              </div>
              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">Delivery Status</p>
                <h4 className="text-sm font-black text-slate-900 uppercase">
                  {total >= freeShippingThreshold ? "🎉 Free Shipping Unlocked!" : 
                  `Add ৳${freeShippingThreshold - total} more for Free Shipping`}
                </h4>
              </div>
            </div>
            <div className="sm:text-right">
              <p className="text-[9px] font-bold uppercase text-slate-400 tracking-widest">Progress</p>
              <p className="text-lg font-black text-slate-900">{Math.round(progress)}%</p>
            </div>
          </div>
          <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-emerald-500 rounded-full shadow-sm" />
          </div>
        </motion.div>

        {/* Title */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tight">
              Shopping <span className="text-emerald-600">Cart</span>
            </h1>
            <p className="text-slate-400 font-bold uppercase text-[9px] tracking-widest mt-1">
              Review items before placing your order
            </p>
          </div>
          <button onClick={clearCart} className="text-slate-400 hover:text-red-500 font-bold uppercase text-[10px] tracking-widest transition-all pb-1 border-b border-transparent hover:border-red-500">
            Clear Cart
          </button>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main List */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode="popLayout">
              {cart.map((item, index) => {
                const itemId = item.medicineId || item.id;
                return (
                  <motion.div
                    key={itemId || index}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white border border-slate-200 rounded-[32px] p-5 sm:p-6 flex flex-col sm:flex-row gap-6 items-center shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-2xl border border-emerald-100 flex items-center justify-center text-3xl shadow-inner group-hover:scale-105 transition-transform">
                      💊
                    </div>
                    
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="font-black text-slate-900 text-xl tracking-tight group-hover:text-emerald-600 transition-colors uppercase">
                        {item.name}
                      </h3>
                      <p className="text-emerald-600 font-extrabold text-base mt-0.5">৳{item.price}</p>
                      
                      <div className="flex items-center justify-center sm:justify-start gap-6 mt-4">
                        <div className="flex items-center gap-4 bg-slate-50 rounded-xl p-1 border border-slate-200">
                          <button onClick={() => updateQuantity(itemId, -1)} className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
                            <Minus size={14} />
                          </button>
                          <span className="font-black text-slate-900 text-sm w-5 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(itemId, 1)} className="w-8 h-8 flex items-center justify-center bg-white border border-slate-200 text-slate-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all shadow-sm">
                            <Plus size={14} />
                          </button>
                        </div>
                        <div className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                          Stock: {item.stock}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-none border-slate-100">
                      <button onClick={() => removeItem(itemId)} className="text-slate-300 hover:text-red-500 p-2 transition-colors">
                        <Trash2 size={20} />
                      </button>
                      <div className="text-right sm:mt-4">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Subtotal</p>
                        <p className="text-xl font-black text-slate-900">৳{item.price * item.quantity}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Checkout Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-slate-200 rounded-[40px] p-8 shadow-sm sticky top-24">
              <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-8 pb-4 border-b border-slate-100">
                Order <span className="text-emerald-600">Summary</span>
              </h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Items Subtotal</span>
                  <span className="text-base font-black text-slate-900">৳{total}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Delivery Charge</span>
                  <span className={`text-base font-black uppercase ${total >= freeShippingThreshold ? 'text-emerald-600' : 'text-slate-900'}`}>
                    {total >= freeShippingThreshold ? "Free" : "৳60"}
                  </span>
                </div>
                <div className="h-[1px] w-full bg-slate-100" />
                <div className="flex justify-between items-end pt-2">
                  <div>
                    <p className="text-[9px] font-bold uppercase text-emerald-600 tracking-widest mb-0.5">Grand Total</p>
                    <p className="text-3xl font-black text-slate-900 tracking-tight">
                      ৳{total >= freeShippingThreshold ? total : total + 60}
                    </p>
                  </div>
                </div>
              </div>

              {/* 🧾 কাস্টমারদের অর্ডার বা চেকআউট পেজ রাউট */}
              <button
                onClick={() => router.push('/customer/checkout')} // অথবা আপনার চেকআউট রাউট পাথ
                className="w-full bg-emerald-600 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-600/10 hover:bg-slate-900 active:scale-95 group"
              >
                PROCEED TO CHECKOUT 
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}