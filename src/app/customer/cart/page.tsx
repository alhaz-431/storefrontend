"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, Trash2, Plus, Minus, 
  ArrowRight, ChevronLeft, ShieldCheck, Loader2
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any[]>([]);
  const [cartKey, setCartKey] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem("medistore_user");
    let storageKey = "medistore_cart"; 

    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user && user.role?.toUpperCase() === "SELLER") {
          router.replace("/seller/dashboard/cart"); 
          return;
        }
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    }

    setCartKey(storageKey);

    const savedCart = localStorage.getItem(storageKey);
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Error parsing cart data", e);
        setCart([]);
      }
    } else {
      setCart([]); 
    }
    setLoading(false);
  }, [router]);

  const updateLocalStorage = (updatedCart: any[]) => {
    setCart(updatedCart);
    if (cartKey) {
      localStorage.setItem(cartKey, JSON.stringify(updatedCart));
    }
    window.dispatchEvent(new Event("cartUpdated"));
  };

  const incrementQty = (id: string) => {
    const updated = cart.map(item => {
      const itemId = item.medicineId || item.id;
      if (itemId === id) {
        const currentQty = Number(item.quantity || 1);
        return { ...item, quantity: currentQty + 1 };
      }
      return item;
    });
    updateLocalStorage(updated);
  };

  const decrementQty = (id: string) => {
    const updated = cart.map(item => {
      const itemId = item.medicineId || item.id;
      if (itemId === id && item.quantity > 1) {
        const currentQty = Number(item.quantity || 1);
        return { ...item, quantity: currentQty - 1 };
      }
      return item;
    });
    updateLocalStorage(updated);
  };

  const removeItem = (id: string) => {
    const updated = cart.filter(item => item.id !== id && item.medicineId !== id);
    updateLocalStorage(updated);
    toast.success("Item removed from cart");
  };

  const subtotal = cart.reduce((acc, item) => {
    const price = Number(item.price || 0);
    const qty = Number(item.quantity || 0);
    return acc + (price * qty);
  }, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020d0a] flex items-center justify-center text-slate-200 font-black text-xs uppercase tracking-widest gap-2">
        <Loader2 className="animate-spin text-[#006643]" size={18} /> Syncing your cart...
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#020d0a] bg-[radial-gradient(circle_at_top_right,_#006643,_#020d0a)] flex flex-col items-center justify-center p-4 text-center">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white/[0.02] border border-white/5 p-8 sm:p-12 rounded-[32px] max-w-sm backdrop-blur-md">
          <ShoppingBag size={64} className="text-slate-500 mb-5 mx-auto" />
          <h2 className="text-2xl font-black text-slate-100 uppercase tracking-tight">Your cart is empty</h2>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2 mb-6">Looks like you haven't added any medicines yet.</p>
          
          <button 
            onClick={() => router.push("/shop")}
            className="w-full bg-[#006643] hover:bg-[#004d32] text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-[#006643]/20"
          >
            Start Shopping
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    /* 🎯 রেসপন্সিভ লেআউট এবং ডার্ক ডেটল গ্রিন থিম মিক্স */
    <div className="min-h-screen bg-[#020d0a] bg-[radial-gradient(circle_at_top_right,_#006643,_#020d0a)] text-slate-200 py-8 sm:py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header - রেসপন্সিভ রো বা কলাম লেআউট */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <button onClick={() => router.push("/shop")} className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors mb-2 text-[10px] font-black uppercase tracking-wider">
              <ChevronLeft size={14} /> Continue Shopping
            </button>
            <h1 className="text-3xl md:text-5xl font-black text-slate-100 uppercase tracking-tight">
              Shopping <span className="text-[#006643]">Cart</span>
            </h1>
          </div>
          <div className="sm:text-right self-start sm:self-auto bg-white/[0.02] border border-white/5 px-5 py-3 rounded-2xl backdrop-blur-md shadow-sm">
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-wider">Items in Cart</p>
            <p className="text-xl font-black text-[#006643]">{cart.length}</p>
          </div>
        </div>

        {/* Content Grid - মোবাইল ও ডেস্কটপ ব্রেকপয়েন্ট অপ্টিমাইজড */}
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            <AnimatePresence mode="popLayout">
              {cart.map((item, index) => {
                const itemId = item.medicineId || item.id;
                const itemPrice = Number(item.price || 0);
                const itemQty = Number(item.quantity || 1);
                const itemSubtotal = itemPrice * itemQty;

                return (
                  <motion.div 
                    key={itemId || index}
                    layout
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ x: -30, opacity: 0 }}
                    className="bg-white/[0.02] border border-white/5 p-4 sm:p-5 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:border-[#006643]/20 transition-all group backdrop-blur-sm"
                  >
                    {/* মেডিসিন ইনফো পার্ট */}
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-[#006643]/10 border border-[#006643]/20 rounded-xl flex-shrink-0 overflow-hidden flex items-center justify-center text-xl shadow-inner group-hover:scale-105 transition-transform">
                        💊
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-black text-slate-100 uppercase text-sm md:text-base truncate group-hover:text-[#006643] transition-colors">
                          {item.name || "Medicine"}
                        </h3>
                        <p className="text-[#006643] text-xs font-black mt-0.5">৳{itemPrice} / piece</p>
                      </div>
                    </div>

                    {/* কন্ট্রোলস এবং সাবটোটাল পার্ট (মোবাইলে নিচে ফুল-উইডথ হবে) */}
                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-none border-white/5">
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center bg-[#020d0a] border border-white/5 rounded-xl p-1 shadow-inner">
                        <button 
                          onClick={() => decrementQty(itemId)} 
                          className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-[#006643] hover:text-white rounded-lg text-slate-300 transition-all"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-10 text-center font-black text-sm text-slate-200">{itemQty}</span>
                        <button 
                          onClick={() => incrementQty(itemId)} 
                          className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-[#006643] hover:text-white rounded-lg text-slate-300 transition-all"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Item Total */}
                      <div className="text-right min-w-[80px]">
                        <p className="text-[9px] font-bold uppercase text-slate-500 tracking-wider">Subtotal</p>
                        <p className="font-black text-slate-100 text-sm md:text-base">৳{itemSubtotal}</p>
                      </div>

                      {/* Delete Button */}
                      <button 
                        onClick={() => removeItem(itemId)}
                        className="text-slate-500 hover:text-red-500 transition-colors p-2 self-center"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Order Summary Panel */}
          <div className="lg:col-span-4">
            <div className="bg-white/[0.02] border border-white/5 rounded-[32px] p-6 sm:p-8 sticky top-24 shadow-sm space-y-6 backdrop-blur-md">
              <h2 className="text-xl font-black text-slate-200 uppercase tracking-tight pb-3 border-b border-white/5">Bill Details</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider">Items Cost</span>
                  <span className="font-black text-slate-200">৳{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-slate-500 uppercase text-[10px] tracking-wider">Delivery Fee</span>
                  <span className="font-black text-[#006643] uppercase text-xs bg-[#006643]/10 border border-[#006643]/20 px-2.5 py-0.5 rounded-md">FREE</span>
                </div>
                <div className="h-[1px] bg-white/5 w-full" />
                <div className="flex justify-between items-end pt-2">
                  <span className="font-black text-[#006643] uppercase text-[10px] tracking-wider mb-0.5">Total Payable</span>
                  <span className="text-3xl font-black text-slate-100 tracking-tight">৳{subtotal.toFixed(2)}</span>
                </div>
              </div>

              {/* 🎯 ফিক্সড কাস্টমার রাউট এবং প্রিমিয়াম ডেটল গ্রিন বাটন */}
              <button 
                onClick={() => router.push("/customer/checkout")}
                className="w-full bg-[#006643] hover:bg-[#004d32] text-white py-4 sm:py-5 rounded-2xl font-black flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#006643]/10 uppercase tracking-widest text-xs group active:scale-95"
              >
                Checkout Now
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[9px] text-slate-500 font-bold uppercase tracking-wider pt-2">
                <ShieldCheck size={14} className="text-[#006643]" /> Secure 256-Bit SSL Connection
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}