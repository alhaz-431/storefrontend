"use client";
import { useState } from "react";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const cart = JSON.parse(localStorage.getItem("medistore_cart") || "[]");

    if (cart.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    try {
      await api.orders.create({
        items: cart,
        address: address,
        totalAmount: cart.reduce((acc: any, item: any) => acc + item.price * item.quantity, 0) + 60
      });
      
      localStorage.removeItem("medistore_cart");
      toast.success("Order Placed Successfully!");
      router.push("/orders");
    } catch (error: any) {
      toast.error(error.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#02040a] text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-[#0d111c] p-10 rounded-[40px] border border-white/10">
        <h1 className="text-2xl font-black italic uppercase mb-8">Shipping <span className="text-emerald-500">Details</span></h1>
        <form onSubmit={handlePlaceOrder} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black text-slate-500 tracking-widest ml-2">Delivery Address</label>
            <textarea 
              required 
              rows={4}
              placeholder="House #, Road #, Area, City..."
              className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl outline-none focus:border-emerald-500 transition-all text-sm"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>
          <button 
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 py-5 rounded-2xl font-black uppercase text-xs tracking-widest transition-all disabled:opacity-50"
          >
            {loading ? "Processing..." : "Confirm Order"}
          </button>
        </form>
      </div>
    </div>
  );
}