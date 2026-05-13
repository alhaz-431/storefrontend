"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, Trash2, Plus, Minus, 
  ArrowRight, ChevronLeft, ShieldCheck 
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any[]>([]);

  // লডিকাল স্টোরেজ থেকে কার্ট ডেটা লোড করা
  useEffect(() => {
    const savedCart = localStorage.getItem("medistore_cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // কার্ট আপডেট করার হেল্পার ফাংশন
  const updateLocalStorage = (updatedCart: any[]) => {
    setCart(updatedCart);
    localStorage.setItem("medistore_cart", JSON.stringify(updatedCart));
  };

  // পরিমাণ বাড়ানো
  const incrementQty = (id: string) => {
    const updated = cart.map(item => 
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateLocalStorage(updated);
  };

  // পরিমাণ কমানো
  const decrementQty = (id: string) => {
    const updated = cart.map(item => 
      item.id === id && item.quantity > 1 
        ? { ...item, quantity: item.quantity - 1 } 
        : item
    );
    updateLocalStorage(updated);
  };

  // আইটেম রিমুভ করা
  const removeItem = (id: string) => {
    const updated = cart.filter(item => item.id !== id);
    updateLocalStorage(updated);
    toast.success("Item removed from cart");
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#0b0f1a] flex flex-col items-center justify-center p-4 text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <ShoppingBag size={100} className="text-emerald-500/20 mb-6" />
          <h2 className="text-3xl font-bold text-white mb-2">Your cart is empty</h2>
          <p className="text-slate-400 mb-8">Looks like you haven't added any medicines yet.</p>
          <button 
            onClick={() => router.push("/shop")}
            className="bg-emerald-500 text-slate-900 px-8 py-3 rounded-xl font-bold hover:bg-emerald-400 transition-colors"
          >
            Start Shopping
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-slate-200 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors mb-2 text-sm">
              <ChevronLeft size={16} /> Continue Shopping
            </button>
            <h1 className="text-4xl font-black text-white">Shopping <span className="text-emerald-500">Cart</span></h1>
          </div>
          <div className="text-right">
            <p className="text-slate-400 text-sm">Items in Cart</p>
            <p className="text-2xl font-bold text-white">{cart.length}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {cart.map((item) => (
                <motion.div 
                  key={item.id}
                  layout
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: 20, opacity: 0 }}
                  className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-4 group"
                >
                  <div className="w-20 h-20 bg-slate-800 rounded-xl flex-shrink-0 overflow-hidden">
                    <img src={item.image || "/placeholder-med.png"} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-white truncate">{item.name}</h3>
                    <p className="text-emerald-500 font-bold">৳{item.price}</p>
                  </div>

                  {/* Quantity Selector */}
                  <div className="flex items-center bg-slate-900 rounded-lg p-1 border border-white/5">
                    <button onClick={() => decrementQty(item.id)} className="p-1 hover:text-emerald-500 transition-colors">
                      <Minus size={18} />
                    </button>
                    <span className="w-8 text-center font-bold text-white">{item.quantity}</span>
                    <button onClick={() => incrementQty(item.id)} className="p-1 hover:text-emerald-500 transition-colors">
                      <Plus size={18} />
                    </button>
                  </div>

                  <div className="text-right min-w-[80px]">
                    <p className="font-black text-white">৳{item.price * item.quantity}</p>
                  </div>

                  <button 
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-slate-500 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#161b2c] border border-white/10 rounded-[32px] p-6 sticky top-6">
              <h2 className="text-xl font-bold text-white mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span className="text-white font-bold">৳{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Delivery</span>
                  <span className="text-emerald-400 font-bold">FREE</span>
                </div>
                <div className="h-px bg-white/10 w-full" />
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold">Total</span>
                  <span className="text-3xl font-black text-emerald-500">৳{subtotal.toFixed(2)}</span>
                </div>
              </div>

              <button 
              onClick={() => router.push("/customer/checkout")}
              
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-emerald-500/20"
              >
                PROCEED TO CHECKOUT
                <ArrowRight size={20} />
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                <ShieldCheck size={14} className="text-emerald-500" /> 100% Secure Checkout
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}