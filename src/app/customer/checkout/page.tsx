"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, Phone, User, ArrowRight, CreditCard, ShieldCheck, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { api } from "@/lib/api"; // 👑 ভুল env বা ইউআরএল এড়াতে আপনার গ্লোবাল api.ts ইমপোর্ট করা হলো

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
    // 🛒 কাস্টমার কার্ট থেকে ডেটা লোড করা হচ্ছে
    const savedCart = localStorage.getItem("medistore_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error("Error parsing cart data:", e);
      }
    }
    
    // 👤 লগইন থাকা ইউজারের ডেটা থেকে নাম ও ফোন অটো-ফিল করা
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

  // 💰 Safe Total Calculation
  const totalAmount = cart.reduce((acc, item) => {
    const price = Number(item.price || 0);
    const qty = Number(item.quantity || 0);
    return acc + (isNaN(price * qty) ? 0 : price * qty);
  }, 0);

  // 🚀 অর্ডার সাবমিট করার মেইন হ্যান্ডলার ফাংশন
  const handlePlaceOrder = async () => {
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
      // 🛡️ ব্যাকএন্ডের রিকোয়ারমেন্ট অনুযায়ী নিখুঁত অবজেক্ট ম্যাপিং
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

      console.log("Sending clean payload to backend:", orderData);

      // ✅ হার্ডকোডেড /api/v1/orders এর বদলে সরাসরি আপনার api.ts এর মেথডে ডেটা পাঠানো হলো
      const resData = await api.orders.create(orderData);
      console.log("Backend Response Actual Data:", resData);

      // 💡 সাকসেস রেসপন্স আসলে ক্লিয়ারেন্স ও রিডাইরেকশন শুরু হবে
      if (resData) {
        // ১. কার্ট লোকাল স্টোরেজ থেকে সাকসেসফুলি ক্লিয়ার করা
        localStorage.removeItem("medistore_cart");
        
        // ২. গ্লোবাল ন্যাভবারের কার্ট কাউন্ট রিসেট করার জন্য কাস্টম ইভেন্ট ফায়ার
        window.dispatchEvent(new Event("cartUpdated"));
        
        // ৩. সাকসেস টোস্ট নোটিফিকেশন
        toast.success("Checkout Successful! 🎉", { id: toastId });

        // 🎯 ৪. আপনার রিকোয়ারমেন্ট অনুযায়ী ঠিক ১০০ms ডিলের পর অটোমেটিক /customer/orders পেজে চলে যাবে
        setTimeout(() => {
          router.push("/customer/orders");
          window.scrollTo({ top: 0, behavior: "smooth" }); // নতুন পেজে গিয়ে স্মুথলি ওপরে স্ক্রোল হবে
        }, 100);
        
      } else {
        throw new Error("অর্ডার প্রসেস করা সম্ভব হয়নি");
      }
    } catch (error: any) {
      console.error("Detailed Checkout Error Object:", error);
      const message = error.message || "অর্ডার প্লেস করতে সমস্যা হয়েছে";
      toast.error(message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 p-4 sm:p-6 lg:p-12 font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 relative z-10">
        
        {/* 📦 বাম পাশ: Delivery Details Form */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tight">
              CHECK<span className="text-emerald-600">OUT</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
               <ShieldCheck size={14} className="text-emerald-600" /> Finalize Your Secure Order
            </p>
          </div>

          <div className="bg-white border border-slate-200 p-6 md:p-10 rounded-[32px] shadow-sm space-y-8">
            <div className="flex items-center gap-3 text-slate-900">
              <MapPin size={22} className="text-emerald-600 animate-pulse" />
              <h2 className="font-black uppercase text-lg tracking-tight">Delivery Details</h2>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* রিসিভার নেম ইনপুট */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Receiver Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input 
                      type="text"
                      value={shippingName}
                      onChange={(e) => setShippingName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-sm font-bold text-slate-800 outline-none focus:border-emerald-500 focus:bg-white transition-all shadow-inner"
                      placeholder="Enter name..."
                    />
                  </div>
                </div>
                
                {/* ফোন নাম্বার ইনপুট */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Phone Number</label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
                    <input 
                      type="text"
                      value={shippingPhone}
                      onChange={(e) => setShippingPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-12 pr-4 text-sm font-bold text-slate-800 outline-none focus:border-emerald-500 focus:bg-white transition-all shadow-inner"
                      placeholder="Phone number..."
                    />
                  </div>
                </div>
              </div>

              {/* ফুল অ্যাড্রেস টেক্সট-এরিয়া */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Full Delivery Address</label>
                <textarea 
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-5 text-sm font-bold text-slate-800 outline-none focus:border-emerald-500 focus:bg-white transition-all min-h-[120px] shadow-inner"
                  placeholder="Street name, House, Area, City..."
                />
              </div>

              {/* পেমেন্ট মেথড ইনফো */}
              <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-2xl flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-md">
                    <CreditCard size={18} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-wider text-emerald-700">Payment Method</p>
                    <p className="text-xs font-bold text-slate-800 uppercase">Cash on Delivery</p>
                  </div>
                </div>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* 💰 ডান পাশ: Order Summary Panel */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <div className="bg-white border border-slate-200 rounded-[32px] p-6 md:p-10 shadow-sm sticky top-6">
            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-8 pb-4 border-b border-slate-100">
               Order <span className="text-emerald-600">Summary</span>
            </h2>

            <div className="space-y-5 mb-8">
               <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Subtotal Amount</span>
                  <span className="text-lg font-bold text-slate-800">৳{totalAmount}</span>
               </div>
               <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Shipping Fee</span>
                  <span className="text-sm font-black text-emerald-600 uppercase bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">Free</span>
               </div>
               <div className="h-[1px] w-full bg-slate-100" />
               <div className="flex justify-between items-end pt-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">Grand Total</span>
                  <span className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">৳{totalAmount}</span>
               </div>
            </div>

            {/* সাবমিট কনফার্ম বাটন */}
            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3 shadow-lg ${
                loading 
                  ? "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none" 
                  : "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-100 active:scale-95"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={16} /> PROCESSING...
                </>
              ) : (
                <>CONFIRM ORDER <ArrowRight size={16} /></>
              )}
            </button>
            
            <p className="text-center mt-6 text-[9px] font-bold uppercase tracking-wider text-slate-400">
               By placing this order you agree to our terms of service
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}