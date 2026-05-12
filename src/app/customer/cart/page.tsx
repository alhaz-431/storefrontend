"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center">
            <ShoppingBag size={64} className="text-white" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Cart is Empty</h2>
          <p className="text-blue-200 mb-8 text-lg">Add some medicines to checkout</p>
          <button
            onClick={() => router.push("/shop")}
            className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 py-4 rounded-2xl font-bold hover:shadow-2xl hover:shadow-emerald-500/50 transition-all transform hover:scale-105"
          >
            Browse Medicines
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-8 md:py-12">
      {/* Decorative Background Elements */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-80 h-80 bg-blue-500/10 rounded-full blur-[100px]" />
        <div className="absolute top-[40%] right-[30%] w-60 h-60 bg-purple-500/10 rounded-full blur-[80px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 md:mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-lg px-4 py-2 rounded-full border border-white/10 mb-4">
            <Sparkles className="text-emerald-400" size={16} />
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Secure Checkout
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white mb-3">
            Complete Your <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">Order</span>
          </h1>
          <p className="text-blue-200 text-sm md:text-base">Just a few steps away from your medicines</p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          {/* Left Column - Forms */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Shipping Information Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center">
                  <MapPin className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-white">Shipping Details</h2>
                  <p className="text-xs text-blue-200">Where should we deliver?</p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="relative group">
                  <label className="block text-xs font-bold text-blue-200 mb-2 uppercase tracking-wider">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-400 transition" size={18} />
                    <input
                      type="text"
                      value={shippingName}
                      onChange={(e) => setShippingName(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:border-emerald-500/50 focus:bg-white/10 outline-none transition-all"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                </div>

                <div className="relative group">
                  <label className="block text-xs font-bold text-blue-200 mb-2 uppercase tracking-wider">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-400 transition" size={18} />
                    <input
                      type="tel"
                      value={shippingPhone}
                      onChange={(e) => setShippingPhone(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:border-emerald-500/50 focus:bg-white/10 outline-none transition-all"
                      placeholder="01XXXXXXXXX"
                      required
                    />
                  </div>
                </div>

                <div className="relative group">
                  <label className="block text-xs font-bold text-blue-200 mb-2 uppercase tracking-wider">
                    Complete Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 text-gray-400 group-focus-within:text-emerald-400 transition" size={18} />
                    <textarea
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-gray-500 focus:border-emerald-500/50 focus:bg-white/10 outline-none transition-all resize-none"
                      rows={4}
                      placeholder="House/Flat No, Road, Area, City..."
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-3 mt-6">
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                  <Truck className="text-emerald-400 mx-auto mb-2" size={20} />
                  <p className="text-[10px] font-bold text-white uppercase">Fast Delivery</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                  <Shield className="text-blue-400 mx-auto mb-2" size={20} />
                  <p className="text-[10px] font-bold text-white uppercase">100% Secure</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                  <Award className="text-purple-400 mx-auto mb-2" size={20} />
                  <p className="text-[10px] font-bold text-white uppercase">Genuine</p>
                </div>
              </div>
            </motion.div>

            {/* Payment Method Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl flex items-center justify-center">
                  <CreditCard className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-white">Payment Method</h2>
                  <p className="text-xs text-blue-200">How would you like to pay?</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-2 border-yellow-500/30 rounded-2xl p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-yellow-500/20 rounded-2xl flex items-center justify-center border-2 border-yellow-500/40">
                    <CreditCard className="text-yellow-400" size={28} />
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-black text-white mb-1">Cash on Delivery</p>
                    <p className="text-sm text-yellow-200">Pay when you receive your order</p>
                  </div>
                  <CheckCircle className="text-yellow-400" size={28} />
                </div>
              </div>
            </motion.div>

            {/* Order Items Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                  <Package className="text-white" size={24} />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-black text-white">Your Items ({cart.length})</h2>
                  <p className="text-xs text-blue-200">Review your order</p>
                </div>
              </div>

              <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
                {cart.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl flex items-center justify-center border border-emerald-500/20">
                        <Package className="text-emerald-400" size={24} />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-white mb-1">{item.name}</p>
                        <p className="text-sm text-blue-200">
                          ৳{item.price} × {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-blue-200 mb-1">Subtotal</p>
                        <p className="text-xl font-black text-emerald-400">
                          ৳{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-6 md:p-8 shadow-2xl sticky top-4"
            >
              <h2 className="text-2xl font-black text-white mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center text-blue-200">
                  <span className="text-sm">Subtotal ({cart.length} items)</span>
                  <span className="font-bold text-white">৳{totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-blue-200">
                  <span className="text-sm">Delivery Fee</span>
                  <span className="font-bold text-emerald-400">Free</span>
                </div>
                <div className="flex justify-between items-center text-blue-200">
                  <span className="text-sm">Tax</span>
                  <span className="font-bold text-white">৳0.00</span>
                </div>
                
                <div className="border-t border-white/20 pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-white">Total Amount</span>
                    <div className="text-right">
                      <p className="text-3xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                        ৳{totalAmount.toFixed(2)}
                      </p>
                      <p className="text-xs text-blue-200 mt-1">Including all charges</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-wider hover:shadow-2xl hover:shadow-emerald-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 group transform hover:scale-105 disabled:transform-none"
              >
                {loading ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} />
                    Place Order Now
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              {/* Security Badge */}
              <div className="mt-6 bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <Shield className="text-blue-400" size={24} />
                  <div>
                    <p className="text-sm font-bold text-white mb-1">Secure Checkout</p>
                    <p className="text-xs text-blue-200">Your information is protected</p>
                  </div>
                </div>
              </div>

              {/* Delivery Info */}
              <div className="mt-4 bg-purple-500/10 border border-purple-500/20 rounded-2xl p-4">
                <div className="flex items-center gap-3">
                  <Clock className="text-purple-400" size={24} />
                  <div>
                    <p className="text-sm font-bold text-white mb-1">Fast Delivery</p>
                    <p className="text-xs text-blue-200">Delivery within 24-48 hours</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(16, 185, 129, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(16, 185, 129, 0.7);
        }
      `}</style>
    </div>
  );
}