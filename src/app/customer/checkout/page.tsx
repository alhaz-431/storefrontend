"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, Phone, User, ArrowRight, CreditCard, ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { api } from "@/lib/api"; 

interface CartItem {
  id: string;         
  medicineId?: string; 
  name: string;
  price: number;
  quantity: number;
  stock: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingName, setShippingName] = useState("");
  const [shippingPhone, setShippingPhone] = useState("");

  useEffect(() => {
    const savedCart = localStorage.getItem("medistore_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Error parsing cart data:", e);
      }
    }
    
    const userStr = localStorage.getItem("medistore_user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setShippingName(user.name || "");
        setShippingPhone(user.phone || "");
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    }
  }, []);

  const totalAmount = cart.reduce((acc, item) => {
    const price = Number(item.price || 0);
    const qty = Number(item.quantity || 0);
    return acc + (isNaN(price * qty) ? 0 : price * qty);
  }, 0);

  const handlePlaceOrder = async () => {
    const currentToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!currentToken) {
      toast.error("আপনার লগইন সেশন পাওয়া যায়নি! দয়া করে আবার লগইন করুন।");
      router.push("/login");
      return;
    }

    if (!shippingAddress.trim() || !shippingName.trim() || !shippingPhone.trim()) {
      toast.error("নাম, ফোন এবং ঠিকানা সবগুলোই দিতে হবে!");
      return;
    }

    if (cart.length === 0) {
      toast.error("আপনার কার্টে কোনো পণ্য নেই");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("অর্ডার প্রসেস হচ্ছে...");

    try {
      const orderData = {
        items: cart.map((item) => {
          const actualMedicineId = item.medicineId || item.id;
          return {
            medicineId: actualMedicineId, 
            quantity: Math.max(1, Number(item.quantity || 1)),
            price: Number(item.price || 0) 
          };
        }),
        totalAmount: Number(totalAmount), 
        shippingAddress: shippingAddress.trim(),
        shippingName: shippingName.trim(),
        shippingPhone: shippingPhone.trim()
      };

      const resData = await api.orders.create(orderData);

      if (resData) {
        localStorage.removeItem("medistore_cart");
        window.dispatchEvent(new Event("cartUpdated"));
        toast.success("Checkout Successful! 🎉", { id: toastId });

        setTimeout(() => {
          router.refresh();
          router.push("/customer/orders");
          if (typeof window !== "undefined") {
            window.scrollTo({ top: 0, behavior: "smooth" });
          }
        }, 10);
      } else {
        throw new Error("অর্ডার প্রসেস করা সম্ভব হয়নি");
      }
    } catch (error: any) {
      const message = error.message || "অর্ডার প্লেস করতে সমস্যা হয়েছে";
      toast.error(message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020d0a] bg-[radial-gradient(circle_at_top_right,_#006643,_#020d0a)] text-slate-200 py-8 sm:py-12 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 relative z-10">
        
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-100 uppercase tracking-tight">
              CHECK<span className="text-[#006643]">OUT</span>
            </h1>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
               <ShieldCheck size={14} className="text-[#006643]" /> Finalize Your Secure Order
            </p>
          </div>

          <div className="bg-white/[0.02] border border-white/5 p-6 md:p-10 rounded-[32px] shadow-lg backdrop-blur-md space-y-8">
            <div className="flex items-center gap-3 text-slate-100">
              <MapPin size={22} className="text-[#006643] animate-pulse" />
              <h2 className="font-black uppercase text-lg tracking-tight">Delivery Details</h2>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Receiver Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                    <input 
                      type="text"
                      value={shippingName}
                      onChange={(e) => setShippingName(e.target.value)}
                      className="w-full bg-[#020d0a]/60 border border-white/5 rounded-xl py-3.5 pl-12 pr-4 text-sm font-bold text-slate-200 outline-none focus:border-[#006643] transition-all shadow-inner"
                      placeholder="Enter name..."
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                    <input 
                      type="text"
                      value={shippingPhone}
                      onChange={(e) => setShippingPhone(e.target.value)}
                      className="w-full bg-[#020d0a]/60 border border-white/5 rounded-xl py-3.5 pl-12 pr-4 text-sm font-bold text-slate-200 outline-none focus:border-[#006643] transition-all shadow-inner"
                      placeholder="Phone number..."
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">Full Delivery Address</label>
                <textarea 
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full bg-[#020d0a]/60 border border-white/5 rounded-2xl py-4 px-5 text-sm font-bold text-slate-200 outline-none focus:border-[#006643] transition-all min-h-[120px] shadow-inner"
                  placeholder="Street name, House, Area, City..."
                />
              </div>

              <div className="bg-[#006643]/10 border border-[#006643]/20 p-5 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#006643] rounded-xl flex items-center justify-center text-white shadow-md">
                    <CreditCard size={18} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-wider text-[#006643]">Payment Method</p>
                    <p className="text-xs font-bold text-slate-300 uppercase">Cash on Delivery</p>
                  </div>
                </div>
                <div className="w-2 h-2 bg-[#006643] rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="lg:mt-16">
          <div className="bg-white/[0.02] border border-white/5 rounded-[32px] p-6 md:p-10 shadow-lg backdrop-blur-md sticky top-24">
            <h2 className="text-2xl font-black text-slate-200 uppercase tracking-tight mb-8 pb-4 border-b border-white/5">
                Order <span className="text-[#006643]">Summary</span>
            </h2>

            <div className="space-y-5 mb-8">
               <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Subtotal Amount</span>
                  <span className="text-lg font-bold text-slate-200">৳{Number(totalAmount).toFixed(2)}</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Shipping Fee</span>
                  <span className="text-xs font-black text-[#006643] uppercase bg-[#006643]/10 px-2.5 py-1 rounded-md border border-[#006643]/20">Free</span>
               </div>
               <div className="h-[1px] w-full bg-white/5" />
               <div className="flex justify-between items-end pt-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#006643] mb-1">Grand Total</span>
                  <span className="text-4xl md:text-5xl font-black text-slate-100 tracking-tight truncate block max-w-[200px]">
                    ৳{Number(totalAmount).toFixed(2)}
                  </span>
               </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 shadow-lg group active:scale-95 ${
                loading 
                  ? "bg-white/[0.02] text-slate-600 border border-white/5 cursor-not-allowed shadow-none" 
                  : "bg-[#006643] text-white hover:bg-[#004d32] shadow-[#006643]/10"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={16} /> PROCESSING...
                </>
              ) : (
                <>CONFIRM ORDER <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
            
            <p className="text-center mt-6 text-[9px] font-bold uppercase tracking-wider text-slate-600">
                By placing this order you agree to our terms of service
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}