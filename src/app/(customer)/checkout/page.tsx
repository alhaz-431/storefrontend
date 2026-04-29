"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // এড্রেস আলাদা ফিল্ডে ভাগ করা হয়েছে
  const [shippingData, setShippingData] = useState({
    houseRoad: "",
    area: "",
    city: "",
    phone: ""
  });

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // লোকাল স্টোরেজ থেকে কার্ট ডাটা নেওয়া
    const cart = JSON.parse(localStorage.getItem("medistore_cart") || "[]");

    if (cart.length === 0) {
      toast.error("Your cart is empty!");
      setLoading(false);
      return;
    }

    try {
      // এড্রেসগুলো একসাথে জোড়া লাগানো
      const fullAddress = `${shippingData.houseRoad}, ${shippingData.area}, ${shippingData.city}. Phone: ${shippingData.phone}`;

      // Prisma Error ফিক্স করতে items ম্যাপ করা হয়েছে যাতে নিশ্চিতভাবে 'id' যায়
      const orderItems = cart.map((item: any) => ({
        id: item.id || item._id, // আপনার ডাটাবেজ অনুযায়ী id প্রপার্টি নিশ্চিত করুন
        quantity: item.quantity,
        price: item.price
      }));

      await api.orders.create({
        items: orderItems,
        address: fullAddress,
        totalAmount: cart.reduce((acc: any, item: any) => acc + (item.price * item.quantity), 0) + 60
      });
      
      localStorage.removeItem("medistore_cart");
      toast.success("Order Placed Successfully!");
      router.push("/orders");
    } catch (error: any) {
      console.error("Checkout Error:", error);
      toast.error(error.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#02040a] text-white flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-[#0d111c] p-8 md:p-12 rounded-[40px] border border-white/10 shadow-2xl">
        <h1 className="text-2xl font-black italic uppercase mb-8">
          Shipping <span className="text-emerald-500">Details</span>
        </h1>
        
        <form onSubmit={handlePlaceOrder} className="space-y-6">
          {/* House & Road */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest ml-2">House & Road Number</label>
            <input 
              required 
              type="text"
              placeholder="e.g. House #12, Road #05"
              className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-emerald-500 transition-all text-sm"
              value={shippingData.houseRoad}
              onChange={(e) => setShippingData({...shippingData, houseRoad: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Area */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest ml-2">Area / Landmark</label>
              <input 
                required 
                type="text"
                placeholder="e.g. Dhanmondi"
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-emerald-500 transition-all text-sm"
                value={shippingData.area}
                onChange={(e) => setShippingData({...shippingData, area: e.target.value})}
              />
            </div>
            {/* City */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest ml-2">City</label>
              <input 
                required 
                type="text"
                placeholder="e.g. Dhaka"
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-emerald-500 transition-all text-sm"
                value={shippingData.city}
                onChange={(e) => setShippingData({...shippingData, city: e.target.value})}
              />
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest ml-2">Phone Number</label>
            <input 
              required 
              type="tel"
              placeholder="+880 1XXX XXXXXX"
              className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl outline-none focus:border-emerald-500 transition-all text-sm"
              value={shippingData.phone}
              onChange={(e) => setShippingData({...shippingData, phone: e.target.value})}
            />
          </div>

          <button 
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 py-5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/10"
          >
            {loading ? "Processing..." : "Confirm Order"}
          </button>
        </form>
      </div>
    </div>
  );
}