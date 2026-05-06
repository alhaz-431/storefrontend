"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, CreditCard } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Link from "next/link";

export default function CheckoutPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [shippingAddress, setShippingAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // ... (আপনার আগের লজিক এবং useEffect একই থাকবে) ...
  useEffect(() => {
    const saved = localStorage.getItem("medistore_cart");
    setCart(saved ? JSON.parse(saved) : []);
  }, []);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handlePlaceOrder = async () => {
    const user = JSON.parse(localStorage.getItem("medistore_user") || "{}");
    if (!user.id) { toast.error("Please login"); router.push("/login"); return; }
    if (!shippingAddress.trim()) { toast.error("Enter address"); return; }
    
    setLoading(true);
    try {
      const items = cart.map((i) => ({ medicineId: i.medicineId, quantity: i.quantity }));
      await api.orders.create({ userId: user.id, items, shippingAddress });
      localStorage.removeItem("medistore_cart");
      toast.success("Order placed!");
      router.push("/customer/orders");
    } catch (err: any) {
      toast.error("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    // বডি গ্রেডিয়েন্ট (Deep Slate to Black)
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-950 to-black text-white p-6 lg:p-10">
      
      {/* হেডলাইন গ্রেডিয়েন্ট টেক্সট */}
      <h1 className="text-4xl font-black mb-8 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400">
        Checkout 💳
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-6">
          {/* Glassmorphism কার্ড */}
          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <MapPin className="text-emerald-500" />
              <h2 className="font-bold text-lg">Shipping Address</h2>
            </div>
            <textarea
              className="w-full p-4 bg-black/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition"
              rows={4}
              placeholder="আপনার ঠিকানা লিখুন..."
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
            />
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
            <div className="flex items-center gap-3">
              <CreditCard className="text-emerald-500" />
              <p className="font-bold">Cash on Delivery (COD)</p>
            </div>
          </div>
        </div>

        {/* সাইডবার (Summary) */}
        <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl h-fit shadow-2xl">
          <h2 className="font-bold mb-6 text-xl">Summary</h2>
          
          <div className="flex justify-between mb-4 text-gray-300">
            <span className="text-yellowgreen-300">Total Amount</span>
            <span className="text-emerald-400 font-bold text-xl">৳{total}</span>
          </div>

          {/* গ্রেডিয়েন্ট বাটন */}
          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 py-4 rounded-xl font-bold text-white shadow-lg shadow-emerald-500/20 transition-transform active:scale-95"
          >
            {loading ? "Placing Order..." : "Place Order Now"}
          </button>
        </div>
      </div>
    </div>
  );
}