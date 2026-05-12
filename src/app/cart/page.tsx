"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, Phone, User, CreditCard, Package, 
  ShoppingBag, CheckCircle, Truck, Shield,
  Clock, Award, ArrowRight, Sparkles
} from "lucide-react";
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
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first");
      router.push("/login");
      return;
    }

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
  }, [router]);

  const totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const handlePlaceOrder = async () => {
    // Validation
    if (!shippingName.trim() || !shippingPhone.trim() || !shippingAddress.trim()) {
      toast.error("সবগুলো ঘর পূরণ করুন");
      return;
    }

    if (cart.length === 0) {
      toast.error("কার্ট খালি");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("অর্ডার প্রসেস হচ্ছে...");

    try {
      const orderData = {
        items: cart.map((item) => ({
          medicineId: item.medicineId || item.id,
          quantity: Number(item.quantity),
        })),
        shippingAddress: shippingAddress.trim(),
        shippingName: shippingName.trim(),
        shippingPhone: shippingPhone.trim(),
      };

      // API Call
      const response = await api.orders.create(orderData);
      
      // ✅ সাকসেস হলে কার্ট ক্লিয়ার এবং রিডাইরেক্ট
      localStorage.removeItem("medistore_cart");
      toast.success("Order placed successfully! 🎉", { id: toastId });

      // ১ সেকেন্ড অপেক্ষা করে রিডাইরেক্ট
      setTimeout(() => {
        router.push("/customer/orders"); // আপনার রাউট যদি /customer/orders হয় তবে এটি ব্যবহার করুন
      }, 1000);

    } catch (error: any) {
      console.error("Order error:", error);
      const errorMessage = 
        error.response?.data?.message || 
        error.message || 
        "অর্ডার দিতে সমস্যা হয়েছে";
      
      toast.error(errorMessage, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#061626] bg-[radial-gradient(circle_at_top_right,_#0a2e26,_#061626)] py-8 md:py-20 px-4 relative overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter text-white">
            Secure <span className="text-emerald-500">Checkout</span>
          </h1>
          <p className="text-emerald-500/40 text-[10px] font-black uppercase tracking-[0.4em] mt-3">Finalize your medicine order</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          
          {/* Left: Form Details */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[40px] p-8"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-black">
                  <MapPin size={24} />
                </div>
                <h2 className="text-2xl font-black italic uppercase text-white tracking-tight">Shipping Info</h2>
              </div>

              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-emerald-500/60 tracking-widest ml-1">Full Name</label>
                    <input 
                      value={shippingName}
                      onChange={(e) => setShippingName(e.target.value)}
                      className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-emerald-500/50 transition-all font-bold"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-emerald-500/60 tracking-widest ml-1">Phone Number</label>
                    <input 
                      value={shippingPhone}
                      onChange={(e) => setShippingPhone(e.target.value)}
                      className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-emerald-500/50 transition-all font-bold"
                      placeholder="017XXXXXXXX"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-emerald-500/60 tracking-widest ml-1">Delivery Address</label>
                  <textarea 
                    value={shippingAddress}
                    onChange={(e) => setShippingAddress(e.target.value)}
                    rows={3}
                    className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white outline-none focus:border-emerald-500/50 transition-all font-bold resize-none"
                    placeholder="House, Road, Area, City..."
                  />
                </div>
              </div>
            </motion.div>

            {/* Payment (COD) */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.1 }}
               className="bg-emerald-500 rounded-[40px] p-8 text-black flex items-center justify-between"
            >
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-black rounded-3xl flex items-center justify-center text-emerald-500">
                  <CreditCard size={30} />
                </div>
                <div>
                  <h3 className="text-xl font-black italic uppercase leading-none mb-1">Cash On Delivery</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Pay when you get the parcel</p>
                </div>
              </div>
              <CheckCircle size={32} className="opacity-40" />
            </motion.div>
          </div>

          {/* Right: Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-white/5 backdrop-blur-2xl p-8 rounded-[45px] sticky top-10">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-emerald-500 mb-8 pb-4 border-b border-white/5">Order Summary</h2>

              <div className="space-y-4 mb-10 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center group">
                    <div className="flex gap-4 items-center">
                       <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-sm">💊</div>
                       <div>
                         <p className="text-white font-bold text-sm truncate w-32 uppercase">{item.name}</p>
                         <p className="text-[10px] text-white/40 font-black">{item.quantity} units</p>
                       </div>
                    </div>
                    <span className="text-white font-black italic">৳{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 mb-8 pt-6 border-t border-white/5">
                <div className="flex justify-between items-center text-white/60">
                  <span className="uppercase text-[9px] font-black tracking-widest">Subtotal</span>
                  <span className="font-bold italic text-white">৳{totalAmount}</span>
                </div>
                <div className="flex justify-between items-center text-white/60">
                  <span className="uppercase text-[9px] font-black tracking-widest">Delivery</span>
                  <span className="text-emerald-500 font-black text-[9px] italic tracking-widest">FREE</span>
                </div>
                <div className="flex justify-between items-end pt-4">
                   <span className="uppercase font-black text-xs tracking-widest text-white">Total</span>
                   <span className="text-5xl font-black italic tracking-tighter text-emerald-500">৳{totalAmount}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full bg-emerald-500 text-black py-6 rounded-3xl font-black uppercase italic text-xs tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-emerald-500/10 flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? "Processing..." : "Place Order Now"}
                {!loading && <ArrowRight size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .text-outline {
          -webkit-text-stroke: 1px #10b981;
          color: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(16, 185, 129, 0.2);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}