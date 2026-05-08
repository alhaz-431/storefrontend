"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, Phone, User, ShoppingBag, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast";

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingName, setShippingName] = useState("");
  const [shippingPhone, setShippingPhone] = useState("");

  useEffect(() => {
    const savedCart = localStorage.getItem("medistore_cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    
    // ইউজার ডাটা থেকে নাম ও ফোন অটো-ফিল করা
    const userStr = localStorage.getItem("medistore_user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setShippingName(user.name || "");
      setShippingPhone(user.phone || "");
    }
  }, []);

  const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handlePlaceOrder = async () => {
    // ভ্যালিডেশন
    if (!shippingAddress || !shippingName || !shippingPhone) {
      toast.error("সবগুলো তথ্য সঠিকভাবে পূরণ করুন");
      return;
    }

    if (cart.length === 0) {
      toast.error("আপনার কার্ট খালি");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("অর্ডার প্রসেস হচ্ছে, দয়া করে অপেক্ষা করুন...");

    try {
      // ✅ আপনার ব্যাকএন্ড কন্ট্রোলার অনুযায়ী ডাটা স্ট্রাকচার
      const orderData = {
        items: cart.map((item) => ({
          medicineId: item.id || item.medicineId,
          quantity: item.quantity,
          price: item.price // ব্যাকএন্ডে Prisma-র জন্য এটি জরুরি
        })),
        shippingAddress,
        shippingName,
        shippingPhone
      };

      const res = await api.orders.create(orderData);

      if (res) {
        // ১. কার্ট ক্লিয়ার
        localStorage.removeItem("medistore_cart");
        setCart([]);

        // ২. সাকসেস মেসেজ
        toast.success("অর্ডার সফলভাবে সম্পন্ন হয়েছে! 🎉", { id: toastId });

        // ৩. সরাসরি রিডাইরেক্ট (১৫০০ মিলি-সেকেন্ড পর)
        setTimeout(() => {
          window.location.href = "/customer/orders";
        }, 1500);
      }
    } catch (error: any) {
      console.error("Order Error:", error);
      const message = error.response?.data?.message || "অর্ডার প্লেস করতে সমস্যা হয়েছে";
      toast.error(message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020d0a] text-white p-6 lg:p-12">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
        
        {/* বাম পাশ: শিপিং ফর্ম */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-8"
        >
          <div>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter">
              Checkout <span className="text-emerald-500">Details</span>
            </h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">
              Please provide your delivery information
            </p>
          </div>

          <div className="space-y-4 bg-white/[0.02] border border-white/5 p-8 rounded-[35px]">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-emerald-500/50 ml-2">Receiver Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
                <input 
                  type="text"
                  value={shippingName}
                  onChange={(e) => setShippingName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-emerald-500 outline-none transition-all"
                  placeholder="Enter receiver name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-emerald-500/50 ml-2">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" size={18} />
                <input 
                  type="text"
                  value={shippingPhone}
                  onChange={(e) => setShippingPhone(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-emerald-500 outline-none transition-all"
                  placeholder="Enter phone number"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-emerald-500/50 ml-2">Delivery Address</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 text-emerald-500" size={18} />
                <textarea 
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-emerald-500 outline-none transition-all min-h-[120px]"
                  placeholder="Full address (House, Road, Area...)"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* ডান পাশ: অর্ডার সামারি */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[40px] p-8 h-fit lg:sticky lg:top-10"
        >
          <h2 className="text-xl font-black italic uppercase mb-6 flex items-center gap-3">
            <ShoppingBag className="text-emerald-500" /> Order Summary
          </h2>

          <div className="max-h-[300px] overflow-y-auto space-y-4 mb-8 pr-2">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center bg-white/5 p-4 rounded-2xl">
                <div>
                  <p className="font-bold text-sm">{item.name}</p>
                  <p className="text-[10px] font-black text-slate-500 uppercase">Qty: {item.quantity} x ৳{item.price}</p>
                </div>
                <p className="font-black text-emerald-500 italic">৳{item.price * item.quantity}</p>
              </div>
            ))}
          </div>

          <div className="border-t border-white/10 pt-6 space-y-3">
            <div className="flex justify-between text-slate-400 font-bold text-sm">
              <span>Subtotal</span>
              <span>৳{totalAmount}</span>
            </div>
            <div className="flex justify-between text-slate-400 font-bold text-sm">
              <span>Delivery Fee</span>
              <span className="text-emerald-500 uppercase text-[10px]">Free</span>
            </div>
            <div className="flex justify-between items-end pt-4">
              <span className="text-xs font-black uppercase tracking-widest">Total Amount</span>
              <span className="text-4xl font-black text-emerald-500 italic">৳{totalAmount}</span>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className={`w-full mt-10 py-5 rounded-[25px] font-black uppercase tracking-[0.2em] text-sm flex items-center justify-center gap-3 transition-all ${
              loading 
                ? "bg-slate-800 text-slate-500 cursor-not-allowed" 
                : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-600/20 active:scale-95"
            }`}
          >
            {loading ? "Processing..." : "Place Order Now"} <ArrowRight size={20} />
          </button>
        </motion.div>

      </div>
    </div>
  );
}