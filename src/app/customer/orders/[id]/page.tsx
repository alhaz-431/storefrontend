"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Package, Calendar, MapPin, 
  ShoppingBag, ArrowLeft, CheckCircle2, 
  Clock, Star 
} from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast";

export default function OrderDetails() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const res = await api.orders.getOrderById(id as string);

      // ✅ normalize data (MOST IMPORTANT FIX)
      const data = res.data || res;

      const normalizedItems = (data.items || []).map((item: any) => ({
        ...item,
        name: item.medicine?.name || item.name || "Unknown Medicine",
        id: item.id || item.medicineId || Math.random()
      }));

      setOrder({
        ...data,
        items: normalizedItems
      });

    } catch (err) {
      toast.error("অর্ডারের তথ্য পাওয়া যায়নি");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#020d0a] flex items-center justify-center text-emerald-500 font-black italic tracking-widest animate-pulse">
      FETCHING DETAILS...
    </div>
  );

  if (!order) return <div className="p-10 text-white text-center">অর্ডার খুঁজে পাওয়া যায়নি।</div>;

  const steps = ["PLACED", "PROCESSING", "SHIPPED", "DELIVERED"];
  const currentStep = steps.indexOf(order.status);

  return (
    <div className="min-h-screen bg-[#020d0a] text-white p-6 lg:p-12">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-emerald-500/60 hover:text-emerald-400 mb-8 text-xs font-black uppercase"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <h1 className="text-4xl font-black mb-6">
          Order #{order.orderNumber}
        </h1>

        {/* TRACKER */}
        <div className="mb-10">
          <div className="flex justify-between">
            {steps.map((step, index) => (
              <div key={step} className="text-center">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  index <= currentStep ? "bg-emerald-500 text-black" : "bg-gray-700"
                }`}>
                  {index <= currentStep ? <CheckCircle2 size={18} /> : <Clock size={18} />}
                </div>
                <p className="text-xs mt-2">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* ITEMS */}
          <div className="lg:col-span-2 space-y-4">
            {order.items.map((item: any) => (
              <div key={item.id} className="flex justify-between p-4 bg-white/5 rounded-xl">
                <div>
                  {/* ✅ SAFE RENDER */}
                  <p className="font-bold">{item.name}</p>
                  <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                </div>
                <p>৳{item.price * item.quantity}</p>
              </div>
            ))}
          </div>

          {/* SIDEBAR */}
          <div className="space-y-6">
            <div className="bg-white/5 p-6 rounded-xl">
              <p>Total</p>
              <h2 className="text-2xl font-bold">৳{order.totalPrice}</h2>
            </div>

            <div className="bg-white/5 p-6 rounded-xl">
              <p className="text-sm mb-2">Address</p>
              <p className="text-sm">{order.shippingAddress}</p>
            </div>

            {order.status === "DELIVERED" && (
              <button className="w-full bg-emerald-500 text-black py-3 rounded-xl flex items-center justify-center gap-2">
                <Star size={14} /> Review
              </button>
            )}

            {order.status === "PLACED" && (
              <button 
                className="w-full bg-red-500 text-white py-3 rounded-xl"
                onClick={() => {
                  if(confirm("Cancel order?")) {
                    api.orders.updateStatus(order.id, "CANCELLED")
                      .then(() => fetchOrderDetails());
                  }
                }}
              >
                Cancel Order
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}