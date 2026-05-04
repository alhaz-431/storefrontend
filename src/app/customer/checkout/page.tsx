"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, MapPin, CreditCard, CheckCircle } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import Link from "next/link";

export default function CheckoutPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [shippingAddress, setShippingAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const saved = localStorage.getItem("medistore_cart");
    setCart(saved ? JSON.parse(saved) : []);
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {
    if (!shippingAddress.trim()) {
      toast.error("Enter shipping address");
      return;
    }

    if (!cart.length) {
      toast.error("Cart is empty");
      return;
    }

    setLoading(true);

    try {
      const user = JSON.parse(
        localStorage.getItem("medistore_user") || "{}"
      );

      const items = cart.map((i) => ({
        medicineId: i.medicineId,
        quantity: i.quantity,
      }));

      await api.orders.create({
        userId: user.id,
        items,
        shippingAddress,
      });

      localStorage.removeItem("medistore_cart");

      toast.success("Order placed successfully 🎉");

      router.push("/customer/orders");
    } catch (err: any) {
      toast.error(err?.response?.data?.error || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  if (!cart.length) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <p className="mb-4">Cart is empty</p>
          <Link
            href="/customer"
            className="text-emerald-500 font-bold"
          >
            Go Shop
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#02040a] text-white p-6 lg:p-10">
      <h1 className="text-3xl font-black mb-8">
        Checkout <span className="text-emerald-500">💳</span>
      </h1>

      <div className="grid lg:grid-cols-3 gap-8">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">

          {/* ADDRESS */}
          <div className="bg-white/5 p-6 rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <MapPin className="text-emerald-500" />
              <h2 className="font-bold">Shipping Address</h2>
            </div>

            <textarea
              className="w-full p-3 bg-black/40 rounded-xl"
              rows={4}
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
            />
          </div>

          {/* PAYMENT */}
          <div className="bg-white/5 p-6 rounded-2xl">
            <div className="flex items-center gap-3">
              <CreditCard className="text-emerald-500" />
              <p className="font-bold">Cash on Delivery</p>
            </div>
          </div>

          {/* ITEMS */}
          <div className="bg-white/5 p-6 rounded-2xl">
            <h2 className="font-bold mb-4">Items</h2>

            {cart.map((item) => (
              <div
                key={item.medicineId}
                className="flex justify-between py-2 border-b border-white/10"
              >
                <p>{item.name} × {item.quantity}</p>
                <p className="text-emerald-500">
                  ৳{item.price * item.quantity}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="bg-white/5 p-6 rounded-2xl h-fit">
          <h2 className="font-bold mb-4">Summary</h2>

          <div className="flex justify-between mb-3">
            <span>Total</span>
            <span className="text-emerald-500">৳{total}</span>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className="w-full bg-emerald-600 py-3 rounded-xl font-bold"
          >
            {loading ? "Placing..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}