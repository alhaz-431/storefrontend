"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, CreditCard, ShoppingBag, Loader2, ArrowRight } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

export default function CheckoutPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [shippingAddress, setShippingAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("medistore_cart");
    if (saved) {
      setCart(JSON.parse(saved));
    }
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePlaceOrder = async () => {
    // ১. ইউজার চেক
    const userStr = localStorage.getItem("medistore_user");
    if (!userStr) {
      toast.error("অনুগ্রহ করে আগে লগইন করুন");
      router.push("/login");
      return;
    }
    const user = JSON.parse(userStr);

    // ২. অ্যাড্রেস ভ্যালিডেশন
    if (!shippingAddress.trim()) {
      toast.error("আপনার ডেলিভারি ঠিকানাটি লিখুন");
      return;
    }

    // ৩. কার্ট চেক
    if (cart.length === 0) {
      toast.error("আপনার কার্টটি খালি!");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("অর্ডার প্রসেস হচ্ছে...");

    try {
      const items = cart.map((i) => ({
        medicineId: i.id, // আপনার API অনুযায়ী id বা medicineId নিশ্চিত করুন
        quantity: i.quantity 
      }));

      await api.orders.create({ 
        userId: user.id, 
        items, 
        shippingAddress 
      });

      // ✅ সফল হলে কার্ট ক্লিয়ার করা
      localStorage.removeItem("medistore_cart");
      
      toast.success("অর্ডারটি সফলভাবে সম্পন্ন হয়েছে! 🎉", { id: toastId });

      // ✅ ১.৫ সেকেন্ড পর অর্ডার পেজে পাঠানো
      setTimeout(() => {
        router.push("/customer/orders");
      }, 1500);

    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "অর্ডার করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    // Deep Navy Green Gradient Background
    <div className="min-h-screen bg-[#020d0a] bg-[radial-gradient(circle_at_top_right,_#062d24,_#020d0a)] text-white p-6 lg:p-12">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <header className="mb-10">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-black mb-2 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-200"
          >
            Final Checkout 💳
          </motion.h1>
          <p className="text-emerald-500/60 font-medium">আপনার অর্ডারটি শেষ করতে নিচের তথ্যগুলো নিশ্চিত করুন</p>
        </header>

        <div className="grid lg:grid-cols-3 gap-10">
          
          {/* Main Info Side */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Shipping Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 rounded-[32px] shadow-2xl"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500">
                  <MapPin size={24} />
                </div>
                <h2 className="font-bold text-xl">Shipping Address</h2>
              </div>
              
              <textarea
                className="w-full p-5 bg-black/40 border border-white/5 rounded-2xl focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all h-40 resize-none text-gray-200"
                placeholder="আপনার পূর্ণাঙ্গ ঠিকানা লিখুন (বাসা নং, রোড, এলাকা...)"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
              />
            </motion.div>

            {/* Payment Method Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/[0.03] backdrop-blur-xl border border-white/10 p-8 rounded-[32px] flex items-center justify-between group cursor-default"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400">
                  <CreditCard size={24} />
                </div>
                <div>
                  <p className="font-bold text-lg">Cash on Delivery (COD)</p>
                  <p className="text-sm text-gray-500">পণ্য হাতে পেয়ে টাকা পরিশোধ করুন</p>
                </div>
              </div>
              <div className="h-6 w-6 rounded-full border-2 border-emerald-500 flex items-center justify-center p-1">
                <div className="h-full w-full bg-emerald-500 rounded-full"></div>
              </div>
            </motion.div>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:sticky lg:top-10 h-fit">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-b from-white/[0.08] to-transparent backdrop-blur-2xl border border-white/10 p-8 rounded-[40px] shadow-3xl"
            >
              <h2 className="font-bold mb-8 text-2xl flex items-center gap-3">
                <ShoppingBag className="text-emerald-500" size={24} /> Summary
              </h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-gray-200">৳{total}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Delivery Fee</span>
                  <span className="text-emerald-500 font-bold uppercase text-[10px] tracking-widest bg-emerald-500/10 px-2 py-1 rounded">Free</span>
                </div>
                <div className="h-[1px] bg-white/10 my-4"></div>
                <div className="flex justify-between items-end">
                  <span className="text-gray-100 font-medium">Total Payable</span>
                  <span className="text-3xl font-black text-emerald-400">৳{total}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full bg-emerald-600 hover:bg-emerald-500 py-5 rounded-[20px] font-black text-white shadow-[0_10px_40px_-10px_rgba(16,185,129,0.3)] transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    Confirm Order <ArrowRight size={20} />
                  </>
                )}
              </button>
              
              <p className="text-[10px] text-center text-gray-500 mt-6 uppercase tracking-widest">
                Secure 128-bit SSL Encrypted Payment
              </p>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}