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

  useEffect(() => {
    const savedCart = localStorage.getItem("medistore_cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  const updateLocalStorage = (updatedCart: any[]) => {
    setCart(updatedCart);
    localStorage.setItem("medistore_cart", JSON.stringify(updatedCart));
  };

  const incrementQty = (id: string) => {
    const updated = cart.map(item => 
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    updateLocalStorage(updated);
  };

  const decrementQty = (id: string) => {
    const updated = cart.map(item => 
      item.id === id && item.quantity > 1 
        ? { ...item, quantity: item.quantity - 1 } 
        : item
    );
    updateLocalStorage(updated);
  };

  const removeItem = (id: string) => {
    const updated = cart.filter(item => item.id !== id);
    updateLocalStorage(updated);
    toast.success("Item removed from cart");
  };

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#061a14] flex flex-col items-center justify-center p-4 text-center">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <ShoppingBag size={100} className="text-emerald-500/20 mb-6" />
          <h2 className="text-3xl font-bold text-white mb-2">Your cart is empty</h2>
          <p className="text-emerald-200/50 mb-8">Looks like you haven't added any medicines yet.</p>
          <button 
            onClick={() => router.push("/shop")}
            className="bg-emerald-500 text-[#061a14] px-8 py-3 rounded-xl font-bold hover:bg-emerald-400 transition-colors"
          >
            Start Shopping
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#061a14] text-slate-100 py-12">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <button onClick={() => router.back()} className="flex items-center gap-2 text-emerald-300/60 hover:text-emerald-400 transition-colors mb-2 text-sm">
              <ChevronLeft size={16} /> Continue Shopping
            </button>
            <h1 className="text-4xl font-black text-white">Shopping <span className="text-emerald-500">Cart</span></h1>
          </div>
          <div className="text-right">
            <p className="text-emerald-300/50 text-sm">Items in Cart</p>
            <p className="text-2xl font-bold text-emerald-500">{cart.length}</p>
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
                  className="bg-white/5 border border-white/10 hover:border-emerald-500/30 p-5 rounded-3xl flex items-center gap-5 transition-all group backdrop-blur-sm"
                >
                  {/* Image Container */}
                  <div className="w-24 h-24 bg-emerald-950/50 rounded-2xl flex-shrink-0 overflow-hidden border border-white/5">
                    <img 
                      src={`/img/${item.image}`} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/150?text=Medicine";
                      }}
                    />
                  </div>
                  
                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-white truncate">{item.name}</h3>
                    <p className="text-emerald-400 font-bold text-lg">৳{item.price}</p>
                  </div>

                  {/* Quantity Selector */}
                  <div className="flex items-center bg-[#0d2b23] rounded-2xl p-1.5 border border-white/5">
                    <button onClick={() => decrementQty(item.id)} className="p-2 hover:bg-emerald-500 hover:text-white rounded-xl transition-all">
                      <Minus size={16} />
                    </button>
                    <span className="w-10 text-center font-black text-white">{item.quantity}</span>
                    <button onClick={() => incrementQty(item.id)} className="p-2 hover:bg-emerald-500 hover:text-white rounded-xl transition-all">
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* Total per Item */}
                  <div className="text-right min-w-[90px]">
                    <p className="font-black text-white text-lg font-mono">৳{item.price * item.quantity}</p>
                  </div>

                  {/* Delete Button */}
                  <button 
                    onClick={() => removeItem(item.id)}
                    className="p-3 text-emerald-900 bg-red-500/10 hover:bg-red-500 hover:text-white rounded-2xl transition-all"
                  >
                    <Trash2 size={20} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#0a241d] border border-emerald-500/20 rounded-[40px] p-8 sticky top-6 shadow-2xl shadow-black/50">
              <h2 className="text-2xl font-black text-white mb-8 tracking-tight">Summary</h2>
              
              <div className="space-y-5 mb-10">
                <div className="flex justify-between text-emerald-100/60 font-medium">
                  <span>Subtotal</span>
                  <span className="text-white">৳{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-emerald-100/60 font-medium">
                  <span>Delivery Fee</span>
                  <span className="text-emerald-400">FREE</span>
                </div>
                <div className="h-px bg-emerald-500/10 w-full" />
                <div className="flex justify-between items-center pt-2">
                  <span className="text-white font-bold text-lg">Total</span>
                  <span className="text-4xl font-black text-emerald-500 drop-shadow-lg font-mono">৳{subtotal.toFixed(2)}</span>
                </div>
              </div>

              <button 
                onClick={() => router.push("/customer/checkout")}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-[#061a14] py-5 rounded-3xl font-black flex items-center justify-center gap-3 transition-all active:scale-[0.98] shadow-xl shadow-emerald-500/20 uppercase tracking-widest text-sm"
              >
                Checkout Now
                <ArrowRight size={20} />
              </button>

              <div className="mt-8 flex items-center justify-center gap-2 text-[10px] text-emerald-300/40 font-black uppercase tracking-[3px]">
                <ShieldCheck size={14} className="text-emerald-500" /> Secure Payment
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}