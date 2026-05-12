"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
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
  const [cart, setCart] = useState<CartItem[]>([]);
  const router = useRouter();

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
    toast.success("Item removed from cart");
  };

  const clearCart = () => {
    if (confirm("Are you sure you want to clear the cart?")) {
      updateCart([]);
      toast.success("Cart cleared");
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#020d0a] flex items-center justify-center p-4">
        <div className="text-center">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            className="text-9xl mb-8 opacity-5"
          >
            🛒
          </motion.div>
          <h2 className="text-4xl font-black text-white italic uppercase mb-8 tracking-tighter">
            Your cart is <span className="text-emerald-500">Empty</span>
          </h2>
          <Link href="/shop" className="bg-emerald-500 text-black px-10 py-4 rounded-2xl font-black uppercase italic text-xs hover:scale-110 transition-all inline-block shadow-xl shadow-emerald-500/20">
            Browse Medicines
          </Link>
        </div>
      </div>
    );
  }

  return (
    // এখানে ব্যাকগ্রাউন্ড আরও ডার্ক গ্রিন (#020d0a) করা হয়েছে
    <div className="min-h-screen bg-[#020d0a] bg-gradient-to-br from-[#020d0a] via-[#051a14] to-[#020d0a] text-white py-12 md:py-20 px-6">
      <div className="max-w-6xl mx-auto">
        
        <div className="flex justify-between items-end mb-16">
          <div>
            <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none mb-4">
              MY <span className="text-emerald-500">CART</span>
            </h1>
            <p className="text-emerald-500/40 font-black uppercase text-[10px] tracking-[0.4em]">
              Review your items before checkout
            </p>
          </div>
          <button onClick={clearCart} className="text-red-500/50 hover:text-red-500 font-black uppercase text-[10px] tracking-widest transition-all pb-2">
            Clear All
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="popLayout">
              {cart.map((item) => (
                <motion.div
                  key={item.medicineId}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white/[0.03] border border-white/5 rounded-[40px] p-8 flex flex-col md:flex-row gap-8 items-center backdrop-blur-xl hover:bg-white/[0.07] transition-all group"
                >
                  <div className="w-24 h-24 bg-emerald-500/10 rounded-3xl flex items-center justify-center text-4xl shadow-inner">
                    💊
                  </div>
                  
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="font-black italic uppercase text-2xl mb-1 tracking-tight group-hover:text-emerald-400 transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-emerald-500 font-black text-lg mb-5">৳{item.price}</p>
                    
                    <div className="flex items-center justify-center md:justify-start gap-6">
                      <div className="flex items-center gap-5 bg-black/40 rounded-2xl p-1.5 border border-white/5 shadow-xl">
                        <button onClick={() => updateQuantity(item.medicineId, -1)} className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl hover:bg-emerald-500 hover:text-black transition-all">
                          <Minus size={16} />
                        </button>
                        <span className="font-black italic text-xl w-6 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.medicineId, 1)} className="w-10 h-10 flex items-center justify-center bg-white/5 rounded-xl hover:bg-emerald-500 hover:text-black transition-all">
                          <Plus size={16} />
                        </button>
                      </div>
                      <span className="text-[10px] font-black text-white/10 uppercase tracking-widest">
                        Stock: {item.stock}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto pt-6 md:pt-0 border-t md:border-none border-white/5">
                    <button onClick={() => removeItem(item.medicineId)} className="text-white/20 hover:text-red-500 p-3 transition-all">
                      <Trash2 size={24} />
                    </button>
                    <div className="text-right">
                      <p className="text-[10px] font-black text-white/20 uppercase mb-1">Subtotal</p>
                      <p className="text-3xl font-black italic tracking-tighter">৳{item.price * item.quantity}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white/[0.03] border border-white/10 rounded-[50px] p-10 backdrop-blur-3xl sticky top-24 shadow-2xl overflow-hidden">
              <div className="absolute top-[-20%] right-[-20%] w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl" />
              
              <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500 mb-10 pb-4 border-b border-white/5">
                Summary
              </h2>
              
              <div className="space-y-5 mb-12">
                <div className="flex justify-between text-[11px] font-black text-white/30 uppercase tracking-widest">
                  <span>Cart Total</span>
                  <span className="text-white">৳{total}</span>
                </div>
                <div className="flex justify-between text-[11px] font-black text-white/30 uppercase tracking-widest">
                  <span>Shipping</span>
                  <span className="text-emerald-500">Free</span>
                </div>
              </div>

              <div className="mb-12">
                <p className="text-[10px] font-black uppercase text-white/20 mb-2 tracking-[0.2em]">Total Payable</p>
                <p className="text-6xl font-black italic text-white tracking-tighter leading-none">
                  ৳{total}
                </p>
              </div>

              {/* রাউটিং পাথ নিশ্চিত করুন আপনার ফোল্ডার স্ট্রাকচার অনুযায়ী */}
              <button
                onClick={() => router.push('/customer/checkout')}
                className="w-full bg-emerald-500 text-black py-6 rounded-3xl font-black uppercase italic text-sm tracking-widest hover:scale-[1.03] active:scale-95 transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-500/20 group"
              >
                Checkout Now 
                <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </button>
              
              <Link href="/shop" className="block text-center mt-8 text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-emerald-500 transition-colors">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}