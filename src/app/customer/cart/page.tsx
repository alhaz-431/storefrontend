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
    // ১. লগইন থাকা ইউজারের ইনফো নেওয়া হচ্ছে
    const userStr = localStorage.getItem("medistore_user");
    let storageKey = "medistore_cart_guest"; 

    if (userStr) {
      try {
        const user = JSON.parse(userStr);

        // 🛡️ ডিফেন্সিভ গার্ড: যদি কোনোভাবে কোনো সেলার এই পেজে চলে আসে, তাকে সেলার কার্টেই পুশ করে দেবে
        if (user && user.role === "Seller") {
          router.replace("/seller/dashboard/cart"); // আপনার সেলার কার্ট রাউট অনুসারে চেঞ্জ করতে পারেন
          return;
        }

        if (user && (user.id || user._id)) {
          // কাস্টমারের ইউনিক আইডি দিয়ে আলাদা কার্ট কী (Key)
          storageKey = `medistore_cart_${user.id || user._id}`;
        }
      } catch (e) {
        console.error("Error parsing user data", e);
      }
    }

    setCartKey(storageKey);

    // ২. শুধু এই কাস্টমারের জন্য সংরক্ষিত কার্ট লোড হবে
    const savedCart = localStorage.getItem(storageKey);
    if (savedCart) {
      setCart(JSON.parse(savedCart));
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
  };

  const incrementQty = (id: string) => {
    const updated = cart.map(item => {
      if (item.id === id || item.medicineId === id) {
        const currentQty = Number(item.quantity || 1);
        return { ...item, quantity: isNaN(currentQty) ? 1 : currentQty + 1 };
      }
      return item;
    });
    updateLocalStorage(updated);
  };

  const decrementQty = (id: string) => {
    const updated = cart.map(item => {
      if ((item.id === id || item.medicineId === id) && item.quantity > 1) {
        const currentQty = Number(item.quantity);
        return { ...item, quantity: isNaN(currentQty) ? 1 : currentQty - 1 };
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
    return acc + (isNaN(price * qty) ? 0 : price * qty);
  }, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-800 font-black text-xs uppercase tracking-widest gap-2">
        <Loader2 className="animate-spin text-emerald-600" size={18} /> Syncing your cart...
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center font-sans">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <ShoppingBag size={72} className="text-slate-300 mb-5 mx-auto animate-bounce" />
          <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Your cart is empty</h2>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1 mb-6">Looks like you haven't added any medicines yet.</p>
          <button 
            onClick={() => router.push("/customer/shop")}
            className="bg-emerald-600 text-white px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-md shadow-emerald-100"
          >
            Start Shopping
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-8 sm:py-12 font-sans">
      <div className="container mx-auto px-4 max-w-5xl">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <button onClick={() => router.back()} className="flex items-center gap-1.5 text-slate-400 hover:text-slate-900 transition-colors mb-2 text-[10px] font-black uppercase tracking-wider">
              <ChevronLeft size={14} /> Continue Shopping
            </button>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tight">Shopping <span className="text-emerald-600">Cart</span></h1>
          </div>
          <div className="sm:text-right self-start sm:self-auto bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider">Items in Cart</p>
            <p className="text-xl font-black text-emerald-600">{cart.length}</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            <AnimatePresence mode="popLayout">
              {cart.map((item, index) => {
                const itemPrice = Number(item.price || 0);
                const itemQty = Number(item.quantity || 1);
                const itemSubtotal = itemPrice * itemQty;

                return (
                  <motion.div 
                    key={item.id || item.medicineId || index}
                    layout
                    initial={{ y: 15, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ x: -30, opacity: 0 }}
                    className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-xl flex-shrink-0 overflow-hidden flex items-center justify-center text-xl shadow-inner">
                        💊
                      </div>
                      
                      <div className="min-w-0">
                        <h3 className="font-black text-slate-900 uppercase text-sm md:text-base truncate">{item.name || "Medicine"}</h3>
                        <p className="text-slate-400 text-xs font-bold mt-0.5">৳{itemPrice} / piece</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-5 w-full sm:w-auto">
                      {/* Quantity Controls */}
                      <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl p-1 shadow-inner">
                        <button 
                          onClick={() => decrementQty(item.id || item.medicineId)} 
                          className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg text-slate-500 transition-colors"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-10 text-center font-black text-sm text-slate-800">{itemQty}</span>
                        <button 
                          onClick={() => incrementQty(item.id || item.medicineId)} 
                          className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg text-slate-500 transition-colors"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Line Total */}
                      <div className="text-right min-w-[70px]">
                        <p className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Subtotal</p>
                        <p className="font-black text-slate-900 text-sm md:text-base">৳{isNaN(itemSubtotal) ? 0 : itemSubtotal}</p>
                      </div>

                      {/* Delete */}
                      <button 
                        onClick={() => removeItem(item.id || item.medicineId)}
                        className="text-slate-300 hover:text-rose-500 transition-colors p-2"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Order Summary Panel */}
          <div className="lg:col-span-4">
            <div className="bg-white border border-slate-200 rounded-[24px] p-6 sticky top-6 shadow-sm space-y-6">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight pb-3 border-b border-slate-100">Bill Details</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">Items Cost</span>
                  <span className="font-black text-slate-800">৳{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">Delivery Fee</span>
                  <span className="font-black text-emerald-600 uppercase text-xs bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">FREE</span>
                </div>
                <div className="h-[1px] bg-slate-100 w-full" />
                <div className="flex justify-between items-end pt-2">
                  <span className="font-black text-emerald-600 uppercase text-[10px] tracking-wider mb-0.5">Total Payable</span>
                  <span className="text-3xl font-black text-slate-900 tracking-tight">৳{subtotal.toFixed(2)}</span>
                </div>
              </div>

              <button 
                onClick={() => router.push("/customer/checkout")}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-xl font-black flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-50 uppercase tracking-widest text-xs"
              >
                Checkout Now
                <ArrowRight size={14} />
              </button>

              <div className="flex items-center justify-center gap-2 text-[9px] text-slate-400 font-black uppercase tracking-wider pt-2">
                <ShieldCheck size={14} className="text-emerald-600" /> Secure 256-Bit SSL Connection
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}