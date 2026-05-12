"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { MapPin, Phone, User, ArrowRight, CreditCard, ShieldCheck } from "lucide-react";
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
    
    const userStr = localStorage.getItem("medistore_user");
    if (userStr) {
      const user = JSON.parse(userStr);
      setShippingName(user.name || "");
      setShippingPhone(user.phone || "");
    }
  }, []);

  const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

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
      const orderData = {
        items: cart.map((item) => ({
          medicineId: item.id || item.medicineId,
          quantity: Number(item.quantity),
          price: Number(item.price) 
        })),
        shippingAddress,
        shippingName,
        shippingPhone
      };

      const res = await api.orders.create(orderData);

      if (res) {
        localStorage.removeItem("medistore_cart");
        toast.success("অর্ডার সফল হয়েছে! 🎉", { id: toastId });

        // ১৫০০ মিলি-সেকেন্ড পর রিডাইরেক্ট
        setTimeout(() => {
          router.push("/customer/orders"); 
        }, 500);
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "অর্ডার প্লেস করতে সমস্যা হয়েছে";
      toast.error(message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020d0a] bg-gradient-to-br from-[#020d0a] via-[#051a14] to-[#10b981]/5 text-white p-6 lg:p-12 relative overflow-hidden">
      
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 relative z-10">
        
        {/* শিপিং ইনফরমেশন */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
          <div className="mb-10">
            <h1 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
              CHECK<span className="text-emerald-500">OUT</span>
            </h1>
            <p className="text-emerald-500/30 text-[10px] font-black uppercase tracking-[0.4em] mt-4 flex items-center gap-2">
               <ShieldCheck size={14} /> Finalize Your Secure Order
            </p>
          </div>

          <div className="bg-white/[0.02] border border-white/5 p-10 rounded-[50px] backdrop-blur-3xl space-y-8">
            <div className="flex items-center gap-3 text-emerald-500">
              <MapPin size={22} className="animate-bounce" />
              <h2 className="font-black italic uppercase text-lg tracking-tighter">Delivery Details</h2>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-white/20 ml-4 tracking-widest">Receiver Name</label>
                  <input 
                    type="text"
                    value={shippingName}
                    onChange={(e) => setShippingName(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 focus:border-emerald-500 outline-none transition-all font-bold italic"
                    placeholder="Enter name..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-white/20 ml-4 tracking-widest">Phone Number</label>
                  <input 
                    type="text"
                    value={shippingPhone}
                    onChange={(e) => setShippingPhone(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-2xl py-4 px-6 focus:border-emerald-500 outline-none transition-all font-bold italic"
                    placeholder="Phone number..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase text-white/20 ml-4 tracking-widest">Full Delivery Address</label>
                <textarea 
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full bg-black/40 border border-white/5 rounded-3xl py-5 px-6 focus:border-emerald-500 outline-none transition-all min-h-[140px] font-bold italic"
                  placeholder="Street name, House, Area..."
                />
              </div>

              <div className="bg-emerald-500/5 border border-emerald-500/20 p-6 rounded-2xl flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-black">
                    <CreditCard size={18} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500">Payment Method</p>
                    <p className="text-xs font-black italic uppercase">Cash on Delivery</p>
                  </div>
                </div>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* সামারি */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
          <div className="bg-white/[0.02] border border-white/5 rounded-[50px] p-10 backdrop-blur-3xl sticky top-12">
            <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-10 pb-4 border-b border-white/5 flex items-center justify-between">
               Order <span className="text-emerald-500">Summary</span>
            </h2>

            <div className="space-y-6 mb-12">
               <div className="flex justify-between items-center text-white/40">
                  <span className="text-[10px] font-black uppercase tracking-widest">Subtotal Amount</span>
                  <span className="text-xl font-black italic text-white">৳{totalAmount}</span>
               </div>
               <div className="flex justify-between items-center text-white/40">
                  <span className="text-[10px] font-black uppercase tracking-widest">Shipping Fee</span>
                  <span className="text-xl font-black italic text-emerald-500 uppercase">Free</span>
               </div>
               <div className="h-[1px] w-full bg-white/5" />
               <div className="flex justify-between items-end">
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Grand Total</span>
                  <span className="text-6xl font-black text-white italic tracking-tighter leading-none">৳{totalAmount}</span>
               </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className={`w-full py-7 rounded-[25px] font-black uppercase tracking-[0.3em] text-xs transition-all flex items-center justify-center gap-4 ${
                loading 
                  ? "bg-white/5 text-white/20 cursor-not-allowed" 
                  : "bg-emerald-500 hover:bg-white text-black shadow-2xl shadow-emerald-500/20 hover:scale-[1.02]"
              }`}
            >
              {loading ? "PROCESSING..." : (
                <>CONFIRM ORDER <ArrowRight size={18} /></>
              )}
            </button>
            
            <p className="text-center mt-8 text-[9px] font-black uppercase tracking-[0.2em] text-white/10">
               By placing this order you agree to our terms of service
            </p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}