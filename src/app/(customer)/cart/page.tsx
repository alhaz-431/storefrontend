"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // কার্ট ডাটা লোড করা (Local Storage থেকে)
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("medistore_cart") || "[]");
    setCartItems(savedCart);
    setLoading(false);
  }, []);

  const updateQuantity = (id: string, delta: number) => {
    const updatedCart = cartItems.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    });
    setCartItems(updatedCart);
    localStorage.setItem("medistore_cart", JSON.stringify(updatedCart));
  };

  const removeItem = (id: string) => {
    const updatedCart = cartItems.filter(item => item.id !== id);
    setCartItems(updatedCart);
    localStorage.setItem("medistore_cart", JSON.stringify(updatedCart));
    toast.success("Item removed from cart");
  };

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (loading) return <div className="min-h-screen bg-[#02040a] flex items-center justify-center text-white italic uppercase font-black tracking-widest">Loading Cart...</div>;

  return (
    <div className="min-h-screen bg-[#02040a] text-white p-6 lg:p-20">
      <div className="max-w-6xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">
            Shopping <span className="text-emerald-500">Cart</span>
          </h1>
          <p className="text-[10px] text-slate-500 uppercase tracking-[0.4em] font-bold mt-2">Check your selected medicines</p>
        </header>

        {cartItems.length > 0 ? (
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence>
                {cartItems.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-white/[0.03] border border-white/10 p-6 rounded-[32px] flex items-center justify-between group hover:border-emerald-500/50 transition-all"
                  >
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-500">
                        <ShoppingBag size={24} />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{item.name}</h3>
                        <p className="text-xs text-slate-500 uppercase font-black tracking-widest">৳{item.price} per unit</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="flex items-center gap-3 bg-black/40 p-2 rounded-xl border border-white/5">
                        <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:text-emerald-500"><Minus size={16}/></button>
                        <span className="font-mono font-bold w-6 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:text-emerald-500"><Plus size={16}/></button>
                      </div>
                      <div className="text-right w-24">
                        <p className="font-mono font-black text-emerald-500">৳{item.price * item.quantity}</p>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-slate-600 hover:text-red-500 transition-colors">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white/[0.02] border border-white/10 p-8 rounded-[40px] sticky top-10 backdrop-blur-md">
                <h2 className="text-xl font-black italic uppercase mb-6">Summary</h2>
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-slate-400 uppercase text-[10px] font-bold tracking-widest">
                    <span>Subtotal</span>
                    <span>৳{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 uppercase text-[10px] font-bold tracking-widest">
                    <span>Delivery Fee</span>
                    <span>৳60</span>
                  </div>
                  <div className="h-px bg-white/10 my-4" />
                  <div className="flex justify-between text-white font-black text-xl uppercase italic">
                    <span>Total</span>
                    <span className="text-emerald-500">৳{subtotal + 60}</span>
                  </div>
                </div>
                <Link href="/checkout">
                  <button className="w-full bg-emerald-600 hover:bg-emerald-500 py-5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-2 group shadow-xl shadow-emerald-900/20">
                    Proceed to Checkout <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-20 bg-white/[0.02] border border-dashed border-white/10 rounded-[40px]">
            <ShoppingBag size={64} className="mx-auto text-slate-800 mb-6" />
            <h2 className="text-2xl font-bold text-slate-500 uppercase tracking-tighter italic">Your cart is empty</h2>
            <Link href="/medicines" className="inline-block mt-6 text-emerald-500 font-bold uppercase text-[10px] tracking-[0.3em] hover:tracking-[0.4em] transition-all">Start Shopping →</Link>
          </div>
        )}
      </div>
    </div>
  );
}