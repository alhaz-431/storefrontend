"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  MapPin, Phone, User, CreditCard, Package, 
  ShoppingBag, CheckCircle, Truck, Shield,
  Clock, Award, ArrowRight, Sparkles, Star, Zap
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
      const parsedCart = JSON.parse(savedCart);
      setCart(parsedCart);
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
    if (!shippingName.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (!shippingPhone.trim()) {
      toast.error("Please enter your phone number");
      return;
    }

    if (!shippingAddress.trim()) {
      toast.error("Please enter your shipping address");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty");
      router.push("/shop");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Placing your order...");

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

      await api.orders.create(orderData);
      
      localStorage.removeItem("medistore_cart");
      
      toast.success("Order placed successfully! 🎉", { id: toastId });

      setTimeout(() => {
        router.push("/orders");
      }, 1000);

    } catch (error: any) {
      const errorMessage = 
        error.response?.data?.error || 
        error.response?.data?.message || 
        "Failed to place order";
      
      toast.error(errorMessage, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <ShoppingBag size={80} className="text-emerald-500 mx-auto mb-4 opacity-20" />
          <h2 className="text-2xl font-bold text-white">Cart is Empty</h2>
          <button onClick={() => router.push("/shop")} className="mt-4 text-emerald-400 font-bold underline">Browse Shop</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-slate-200 py-10">
      {/* Background Glow */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-600/10 blur-[100px] rounded-full" />
      </div>

      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        <div className="flex items-center gap-2 mb-8">
            <div className="h-1 w-12 bg-emerald-500 rounded-full"></div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Finalizing <span className="text-emerald-500">Order</span></h1>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left: Forms */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Featured Promo Banner */}
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-gradient-to-r from-emerald-600/20 to-blue-600/20 border border-emerald-500/30 p-4 rounded-2xl flex items-center gap-4"
            >
              <div className="bg-emerald-500 p-2 rounded-lg shadow-lg shadow-emerald-500/40">
                <Zap size={20} className="text-white fill-current" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Express Delivery Active!</p>
                <p className="text-xs text-emerald-300/80">Get your medicines within 12 hours in city areas.</p>
              </div>
            </motion.div>

            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-8">
                <MapPin className="text-emerald-500" />
                <h2 className="text-xl font-bold text-white">Shipping Information</h2>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">Full Name</label>
                  <input 
                    value={shippingName} 
                    onChange={(e) => setShippingName(e.target.value)}
                    className="w-full bg-slate-900/50 border border-white/5 rounded-xl px-4 py-3 focus:border-emerald-500/50 outline-none transition-all"
                    placeholder="Receiver's name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">Phone</label>
                  <input 
                    value={shippingPhone} 
                    onChange={(e) => setShippingPhone(e.target.value)}
                    className="w-full bg-slate-900/50 border border-white/5 rounded-xl px-4 py-3 focus:border-emerald-500/50 outline-none transition-all"
                    placeholder="017xxxxxxxx"
                  />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">Delivery Address</label>
                  <textarea 
                    value={shippingAddress} 
                    onChange={(e) => setShippingAddress(e.target.value)}
                    rows={3}
                    className="w-full bg-slate-900/50 border border-white/5 rounded-xl px-4 py-3 focus:border-emerald-500/50 outline-none transition-all resize-none"
                    placeholder="Full address (House, Road, Area...)"
                  />
                </div>
              </div>
            </div>

            {/* Featured: Order Benefits */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    {icon: Shield, text: "Verified", color: "text-blue-400"},
                    {icon: Award, text: "Original", color: "text-emerald-400"},
                    {icon: Truck, text: "Fast Ship", color: "text-purple-400"},
                    {icon: Star, text: "Premium", color: "text-yellow-400"}
                ].map((item, i) => (
                    <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/5 flex flex-col items-center gap-2">
                        <item.icon className={item.color} size={20} />
                        <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400">{item.text}</span>
                    </div>
                ))}
            </div>
          </div>

          {/* Right: Summary */}
          <div className="lg:col-span-5">
            <div className="bg-[#161b2c] border border-white/10 rounded-[32px] p-6 sticky top-6 shadow-2xl">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center justify-between">
                Review Items
                <span className="bg-emerald-500/10 text-emerald-400 text-xs px-3 py-1 rounded-full border border-emerald-500/20">{cart.length} Products</span>
              </h2>

              <div className="space-y-3 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scroll">
                {cart.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 bg-white/5 p-3 rounded-2xl border border-white/5">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 font-bold">
                        {item.quantity}x
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white text-sm truncate">{item.name}</p>
                      <p className="text-xs text-slate-400">৳{item.price} per unit</p>
                    </div>
                    <p className="font-bold text-emerald-400">৳{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 border-t border-white/10 pt-6 mb-6">
                <div className="flex justify-between text-slate-400 text-sm">
                  <span>Subtotal</span>
                  <span className="text-white">৳{totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400 text-sm">
                  <span>Delivery Charge</span>
                  <span className="text-emerald-400 font-bold">FREE</span>
                </div>
                <div className="flex justify-between items-end pt-2">
                  <span className="text-white font-bold">Payable Amount</span>
                  <span className="text-3xl font-black text-white">৳{totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <button 
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-[#0b0f1a] py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all group active:scale-95"
              >
                {loading ? "PROCESSING..." : (
                    <>
                        PLACE ORDER NOW
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                )}
              </button>

              <div className="mt-4 flex items-center justify-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                <Shield size={12} /> SSL Secure Payment Method
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #10b98150; border-radius: 10px; }
      `}</style>
    </div>
  );
}