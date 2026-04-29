"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [shippingData, setShippingData] = useState({
    houseRoad: "",
    area: "",
    city: "",
    phone: "",
    name: ""
  });

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loading) return;
    setLoading(true);

    try {
      const cart = JSON.parse(localStorage.getItem("medistore_cart") || "[]");
      const user = JSON.parse(localStorage.getItem("medistore_user") || "{}");

      // ✅ Cart check
      if (!cart.length) {
        toast.error("Your cart is empty!");
        setLoading(false);
        return;
      }

      // ✅ Auth check
      if (!user?.id) {
        toast.error("Please login first!");
        setLoading(false);
        return;
      }

      // ✅ Phone validation
      if (shippingData.phone.length < 10) {
        toast.error("Invalid phone number!");
        setLoading(false);
        return;
      }

      const fullAddress = `${shippingData.houseRoad}, ${shippingData.area}, ${shippingData.city}`;

      // ✅ SAFE item mapping
      const orderItems = cart.map((item: any) => {
        const medicineId = item.id || item._id;

        if (!medicineId) {
          throw new Error("Invalid cart item!");
        }

        return {
          medicineId,
          quantity: Number(item.quantity),
          price: Number(item.price)
        };
      });

      // ✅ API call (100% backend compatible)
      await api.orders.create({
        customerId: user.id,
        items: orderItems,
        shippingAddress: fullAddress,
        shippingName: shippingData.name,
        shippingPhone: shippingData.phone
      });

      // ✅ Success কাজ
      localStorage.removeItem("medistore_cart");
      toast.success("Order Placed Successfully!");
      router.push("/dashboard/my-orders");

    } catch (error: any) {
      console.error("Checkout Error:", error);

      toast.error(
        error?.response?.data?.error ||
        error.message ||
        "Checkout failed. Please try again."
      );
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

          {/* Name */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black text-slate-500 ml-2">
              Receiver Name
            </label>
            <input
              required
              type="text"
              placeholder="e.g. Alhaz Islam"
              className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl"
              value={shippingData.name}
              onChange={(e) =>
                setShippingData({ ...shippingData, name: e.target.value })
              }
            />
          </div>

          {/* House & Road */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black text-slate-500 ml-2">
              House & Road
            </label>
            <input
              required
              type="text"
              placeholder="House #12, Road #05"
              className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl"
              value={shippingData.houseRoad}
              onChange={(e) =>
                setShippingData({ ...shippingData, houseRoad: e.target.value })
              }
            />
          </div>

          {/* Area + City */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-slate-500 ml-2">
                Area
              </label>
              <input
                required
                type="text"
                placeholder="Dhanmondi"
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl"
                value={shippingData.area}
                onChange={(e) =>
                  setShippingData({ ...shippingData, area: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-slate-500 ml-2">
                City
              </label>
              <input
                required
                type="text"
                placeholder="Dhaka"
                className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl"
                value={shippingData.city}
                onChange={(e) =>
                  setShippingData({ ...shippingData, city: e.target.value })
                }
              />
            </div>

          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black text-slate-500 ml-2">
              Phone Number
            </label>
            <input
              required
              type="tel"
              placeholder="+8801XXXXXXXXX"
              className="w-full bg-white/5 border border-white/10 p-4 rounded-2xl"
              value={shippingData.phone}
              onChange={(e) =>
                setShippingData({ ...shippingData, phone: e.target.value })
              }
            />
          </div>

          {/* Button */}
          <button
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-500 py-5 rounded-2xl font-black uppercase text-xs tracking-widest disabled:opacity-50"
          >
            {loading ? "Processing..." : "Confirm Order"}
          </button>

        </form>
      </div>
    </div>
  );
}