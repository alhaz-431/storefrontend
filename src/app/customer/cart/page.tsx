"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShoppingCart } from "lucide-react";
import { toast } from "react-hot-toast";
import Link from "next/link";

interface CartItem {
  id: string;
  medicineId: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
  image?: string;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem("medistore_cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const updateCart = (newCart: CartItem[]) => {
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
    toast.success("আইটেমটি সরানো হয়েছে");
  };

  const clearCart = () => {
    if (confirm("পুরো কার্ট খালি করতে চান?")) {
      updateCart([]);
      toast.success("কার্ট খালি করা হয়েছে");
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                <ShoppingCart size={40} className="text-emerald-600" />
            </div>
            <h2 className="text-3xl font-black text-slate-800 mb-2 uppercase italic tracking-tighter">কার্ট <span className="text-emerald-600">খালি</span></h2>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-8">এখনও কোনো ঔষধ যোগ করা হয়নি</p>
            <Link href="/shop" className="bg-emerald-600 text-white px-10 py-4 rounded-xl font-black uppercase text-[11px] tracking-widest hover:bg-slate-900 transition-all shadow-lg shadow-emerald-600/20">
                কেনাকাটা শুরু করুন
            </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 md:py-20 px-6">
      <div className="max-w-6xl mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
          <div>
            <h1 className="text-5xl md:text-6xl font-black italic uppercase tracking-tighter text-slate-900">
              My <span className="text-emerald-600">Cart</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] mt-3">
              Review items before completing purchase
            </p>
          </div>
          <button onClick={clearCart} className="text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all">
            Clear Cart
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* ITEMS LIST */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence mode="popLayout">
              {cart.map((item) => (
                <motion.div
                  key={item.medicineId}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  className="bg-white border border-slate-100 rounded-[30px] p-6 flex flex-col md:flex-row gap-6 items-center shadow-sm hover:shadow-md transition-all group"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 bg-emerald-50 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    💊
                  </div>

                  {/* Details */}
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl font-black text-slate-800 uppercase italic leading-tight">{item.name}</h3>
                    <p className="text-emerald-600 font-bold text-lg">৳{item.price}</p>
                    
                    <div className="flex items-center justify-center md:justify-start gap-4 mt-4">
                      <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl p-1">
                        <button onClick={() => updateQuantity(item.medicineId, -1)} className="w-8 h-8 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-lg transition-all text-slate-600">
                          <Minus size={14} />
                        </button>
                        <span className="w-10 text-center font-black text-slate-800">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.medicineId, 1)} className="w-8 h-8 flex items-center justify-center hover:bg-white hover:shadow-sm rounded-lg transition-all text-slate-600">
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Stock: {item.stock}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-row md:flex-col items-center justify-between md:items-end w-full md:w-auto pt-4 md:pt-0 border-t md:border-0 border-slate-50">
                    <button onClick={() => removeItem(item.medicineId)} className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-all">
                      <Trash2 size={18} />
                    </button>
                    <div className="text-right mt-4">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Total</p>
                      <p className="text-2xl font-black text-slate-900 leading-none italic">৳{(item.price * item.quantity).toFixed(0)}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* SUMMARY SIDEBAR */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-slate-100 p-8 rounded-[40px] shadow-sm sticky top-10">
              <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] mb-8">Order Summary</h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Subtotal</span>
                  <span className="text-slate-800 font-black italic text-lg">৳{total.toFixed(0)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-bold uppercase text-[10px] tracking-widest">Shipping</span>
                  <span className="text-emerald-600 font-black text-xs italic tracking-widest">FREE</span>
                </div>
                <div className="border-t border-slate-50 pt-4 flex justify-between items-end">
                  <span className="text-slate-900 font-black uppercase text-xs tracking-widest">Grand Total</span>
                  <span className="text-5xl font-black text-emerald-600 tracking-tighter italic">৳{total.toFixed(0)}</span>
                </div>
              </div>

              <Link
                href="/customer/checkout"
                className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase italic text-xs tracking-[0.2em] hover:bg-emerald-600 transition-all shadow-xl shadow-slate-900/10 flex items-center justify-center gap-3 group"
              >
                Checkout Now
                <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
              </Link>

              <p className="text-center mt-6 text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                Secure SSL Encrypted Checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}