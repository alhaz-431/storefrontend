"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, Phone, User, ShoppingBag, ArrowRight, CreditCard } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast";

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // ফর্ম স্টেট
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingName, setShippingName] = useState("");
  const [shippingPhone, setShippingPhone] = useState("");

  useEffect(() => {
    const savedCart = localStorage.getItem("medistore_cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
    
    // ইউজার ডাটা থেকে অটো-ফিল করার চেষ্টা
    const userStr = localStorage.getItem("medistore_user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setShippingName(user.name || "");
      setShippingPhone(user.phone || "");
    }
  }, []);

  const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handlePlaceOrder = async () => {
    // ১. ভ্যালিডেশন
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
      // ২. আপনার ব্যাকএন্ড কন্ট্রোলারের রিকোয়ারমেন্ট অনুযায়ী ডাটা স্ট্রাকচার
      const orderData = {
        items: cart.map((item) => ({
          medicineId: item.id || item.medicineId,
          quantity: Number(item.quantity),
          price: Number(item.price) // Prisma-র জন্য এটি জরুরি
        })),
        shippingAddress,
        shippingName,
        shippingPhone
      };

      const res = await api.orders.create(orderData);

      if (res) {
        // ৩. সাকসেস অ্যাকশন
        localStorage.removeItem("medistore_cart");
        toast.success("অর্ডার সফল হয়েছে! 🎉", { id: toastId });

        // ৪. রিডাইরেক্ট (১৫০০ মিলি-সেকেন্ড পর যাতে টোস্ট দেখা যায়)
        setTimeout(() => {
          window.location.href = "/customer/orders";
        }, 1500);
      }
    } catch (error: any) {
      console.error("Order error:", error);
      const message = error.response?.data?.message || "অর্ডার প্লেস করতে সমস্যা হয়েছে";
      toast.error(message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020d0a] text-white p-6 lg:p-12">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
        
        {/* শিপিং ইনফরমেশন সেকশন */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <h1 className="text-4xl font-black italic uppercase tracking-tighter flex items-center gap-3">
            Checkout <CreditCard className="text-emerald-500" />
          </h1>

          <div className="bg-white/[0.03] border border-white/10 p-8 rounded-[35px] space-y-6">
            <div className="flex items-center gap-3 text-emerald-500 mb-2">
              <MapPin size={20} />
              <h2 className="font-black uppercase text-xs tracking-widest">Shipping Address</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 ml-2">Receiver Name</label>
                <input 
                  type="text"
                  value={shippingName}
                  onChange={(e) => setShippingName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:border-emerald-500 outline-none transition-all"
                  placeholder="আপনার নাম..."
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-slate-500 ml-2">Phone Number</label>
                <input 
                  type="text"
                  value={shippingPhone}
                  onChange={(e) => setShippingPhone(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 focus:border-emerald-500 outline-none transition-all"
                  placeholder="ফোন নম্বর..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 ml-2">Full Address</label>
              <textarea 
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 focus:border-emerald-500 outline-none transition-all min-h-[120px]"
                placeholder="আপনার পূর্ণ ঠিকানা লিখুন..."
              />
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl flex items-center gap-3">
              <CreditCard className="text-emerald-500" size={20} />
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Cash on Delivery (COD)</span>
            </div>
          </div>
        </motion.div>

        {/* সামারি সেকশন */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="bg-white/[0.03] border border-white/10 rounded-[40px] p-8">
            <h2 className="text-xl font-black italic uppercase mb-8 flex items-center gap-3">
               Summary
            </h2>

            <div className="space-y-4 mb-8">
               <div className="flex justify-between items-center text-slate-400">
                  <span className="text-xs font-bold uppercase">Total Amount</span>
                  <span className="text-3xl font-black text-emerald-500 italic">৳{totalAmount}</span>
               </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className={`w-full py-5 rounded-[20px] font-black uppercase tracking-[0.2em] text-sm transition-all ${
                loading 
                  ? "bg-slate-800 text-slate-600" 
                  : "bg-emerald-500 hover:bg-emerald-400 text-[#020d0a] shadow-lg shadow-emerald-500/20"
              }`}
            >
              {loading ? "Processing..." : "Place Order Now"}
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  );
}