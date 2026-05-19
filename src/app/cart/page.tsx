"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, ArrowRight, Truck, ShieldCheck, Loader2 } from "lucide-react";
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

export default function SellerCartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartKey, setCartKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  const freeShippingThreshold = 1000; 

  useEffect(() => {
    const sellerStr = localStorage.getItem("medistore_user");
    let storageKey = "medistore_seller_cart_guest";

    if (sellerStr) {
      try {
        const seller = JSON.parse(sellerStr);
        // শুধুমাত্র সেলারের আইডি দিয়েই ইউনিক কার্ট কী তৈরি হবে
        if (seller && (seller.id || seller._id)) {
          storageKey = `medistore_seller_cart_${seller.id || seller._id}`;
        }
      } catch (e) {
        console.error("Error parsing seller data", e);
      }
    }

    setCartKey(storageKey);

    const savedCart = localStorage.getItem(storageKey);
    if (savedCart) {
      setCart(JSON.parse(savedCart));
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
    if (cartKey) {
      localStorage.setItem(cartKey, JSON.stringify(newCart));
    }
  };

  const updateQuantity = (medicineId: string, delta: number) => {
    const newCart = cart.map((item) => {
      if (item.medicineId === medicineId || item.id === medicineId) {
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
    const newCart = cart.filter((item) => item.medicineId !== medicineId && item.id !== medicineId);
    updateCart(newCart);
    toast.success("Item removed from seller cart");
  };

  const clearCart = () => {
    if (confirm("Are you sure you want to clear this order cart?")) {
      updateCart([]);
      toast.success("Seller cart cleared");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020d0a] flex items-center justify-center text-emerald-500 font-black text-xs uppercase tracking-widest gap-2">
        <Loader2 className="animate-spin text-emerald-500" size={18} /> Syncing Seller Panel...
      </div>
    );
  }

  // 📦 সেলারের কার্ট খালি থাকলে যা দেখাবে
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#020d0a] bg-gradient-to-br from-[#020d0a] via-[#051a14] to-[#10b981]/5 flex items-center justify-center p-4">
        <div className="text-center">
          <motion.div 
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="text-9xl mb-8 opacity-10"
          >
            📦
          </motion.div>
          <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase mb-8 tracking-tighter">
            No Items <span className="text-emerald-500">Selected</span>
          </h2>
          <p className="text-emerald-500/50 text-xs font-bold uppercase tracking-widest mb-8">
            Add medicines to create an order for a customer.
          </p>
          
          <Link href="/seller/dashboard" className="bg-emerald-500 text-black px-12 py-5 rounded-2xl font-black uppercase italic text-xs hover:scale-110 transition-all inline-block shadow-2xl shadow-emerald-500/20">
            Go to Stock / Inventory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020d0a] bg-gradient-to-br from-[#020d0a] via-[#051a14] to-[#10b981]/10 text-white py-12 md:py-20 px-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Progress Bar */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-16 bg-white/[0.03] border border-white/5 p-8 rounded-[40px] backdrop-blur-3xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-black shadow-lg shadow-emerald-500/20">
                <Truck size={20} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500">Order Threshold</p>
                <h4 className="text-sm font-black italic uppercase">
                  {total >= freeShippingThreshold ? "Free Delivery Unlocked for Customer!" : `Add ৳${freeShippingThreshold - total} more for Free Shipping`}
                </h4>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black uppercase text-white/20 tracking-widest">Progress</p>
              <p className="text-xl font-black italic text-white">{Math.round(progress)}%</p>
            </div>
          </div>
          <div className="h-3 w-full bg-black/50 rounded-full border border-white/5 overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]" />
          </div>
        </motion.div>

        <div className="flex justify-between items-end mb-16">
          <div>
            <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter leading-none mb-4">
              ORDER <span className="text-emerald-500">ITEMS</span>
            </h1>
            <p className="text-emerald-500/30 font-black uppercase text-[10px] tracking-[0.4em] flex items-center gap-2">
               <ShieldCheck size={14} /> Seller Desk Control
            </p>
          </div>
          <button onClick={clearCart} className="text-red-500/40 hover:text-red-500 font-black uppercase text-[10px] tracking-widest transition-all pb-4 border-b border-transparent hover:border-red-500">
            Clear Order
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main List */}
          <div className="lg:col-span-2 space-y-8">
            <AnimatePresence mode="popLayout">
              {cart.map((item, index) => {
                const itemId = item.medicineId || item.id;
                return (
                  <motion.div
                    key={itemId || index}
                    layout
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    className="bg-white/[0.02] border border-white/5 rounded-[50px] p-8 md:p-10 flex flex-col md:flex-row gap-10 items-center backdrop-blur-3xl hover:bg-white/[0.05] transition-all group"
                  >
                    <div className="w-32 h-32 bg-emerald-500/5 rounded-[40px] border border-white/5 flex items-center justify-center text-5xl shadow-2xl group-hover:scale-110 transition-transform">
                      💊
                    </div>
                    
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="font-black italic uppercase text-3xl mb-2 tracking-tighter group-hover:text-emerald-500 transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-emerald-500 font-black text-2xl mb-8">৳{item.price}</p>
                      
                      <div className="flex items-center justify-center md:justify-start gap-8">
                        <div className="flex items-center gap-6 bg-black/60 rounded-[25px] p-2 border border-white/5 shadow-2xl">
                          <button onClick={() => updateQuantity(itemId, -1)} className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-2xl hover:bg-emerald-500 hover:text-black transition-all">
                            <Minus size={20} />
                          </button>
                          <span className="font-black italic text-2xl w-8 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(itemId, 1)} className="w-12 h-12 flex items-center justify-center bg-white/5 rounded-2xl hover:bg-emerald-500 hover:text-black transition-all">
                            <Plus size={20} />
                          </button>
                        </div>
                        <div className="text-[10px] font-black text-white/10 uppercase tracking-[0.2em]">
                          Current Stock: {item.stock}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto pt-8 md:pt-0 border-t md:border-none border-white/5">
                      <button onClick={() => removeItem(itemId)} className="text-white/10 hover:text-red-500 p-4 transition-all hover:scale-125">
                        <Trash2 size={28} />
                      </button>
                      <div className="text-right">
                        <p className="text-[11px] font-black text-white/20 uppercase mb-2 tracking-widest">Subtotal</p>
                        <p className="text-4xl font-black italic tracking-tighter leading-none">৳{item.price * item.quantity}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Sticky Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white/[0.03] border border-white/10 rounded-[60px] p-12 backdrop-blur-3xl sticky top-24 shadow-2xl overflow-hidden">
              <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-12 pb-6 border-b border-white/5">
                 Invoice <span className="text-emerald-500">Summary</span>
              </h2>
              
              <div className="space-y-6 mb-12">
                <div className="flex justify-between items-center text-white/40">
                   <span className="text-[10px] font-black uppercase tracking-[0.2em]">Subtotal</span>
                   <span className="text-xl font-black italic text-white">৳{total}</span>
                </div>
                <div className="flex justify-between items-center text-white/40">
                   <span className="text-[10px] font-black uppercase tracking-[0.2em]">Est. Delivery</span>
                   <span className={`text-xl font-black italic uppercase ${total >= freeShippingThreshold ? 'text-emerald-500' : 'text-white'}`}>
                      {total >= freeShippingThreshold ? "Free" : "৳60"}
                   </span>
                </div>
                <div className="h-[1px] w-full bg-white/5" />
                <div className="flex justify-between items-end pt-4">
                  <div>
                    <p className="text-[10px] font-black uppercase text-emerald-500 tracking-[0.2em] mb-1">Total Grand</p>
                    <p className="text-5xl font-black italic text-white tracking-tighter leading-none">
                      ৳{total >= freeShippingThreshold ? total : total + 60}
                    </p>
                  </div>
                </div>
              </div>

              {/* 🧾 পিওর সেলার ইনভয়েস চেকআউট রাউট */}
              <button
                onClick={() => router.push('/seller/dashboard/checkout')}
                className="w-full bg-emerald-500 text-black py-8 rounded-[30px] font-black uppercase italic text-sm tracking-[0.2em] transition-all flex items-center justify-center gap-4 shadow-2xl shadow-emerald-500/20 hover:bg-white hover:scale-[1.02] active:scale-95 group"
              >
                PROCEED TO INVOICE 
                <ArrowRight size={22} className="group-hover:translate-x-3 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#020d0a]/90 backdrop-blur-2xl border-t border-white/5 p-8 z-50 flex items-center justify-between">
        <div>
          <p className="text-[9px] font-black uppercase text-white/30 tracking-widest mb-1">Grand Total</p>
          <p className="text-3xl font-black italic text-emerald-500">৳{total >= freeShippingThreshold ? total : total + 60}</p>
        </div>
        <button 
          onClick={() => router.push('/seller/dashboard/checkout')} 
          className="bg-emerald-500 text-black px-10 py-5 rounded-2xl font-black uppercase italic text-xs tracking-widest shadow-xl shadow-emerald-500/20"
        >
          Invoice
        </button>
      </div>
    </div>
  );
}