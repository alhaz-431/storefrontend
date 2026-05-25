"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  Package, MapPin, ArrowLeft, CheckCircle2, 
  Clock, Star, Phone, CreditCard, Loader2, AlertCircle
} from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "react-hot-toast";

interface OrderItem {
  id: string;
  medicineId: string;
  name: string;
  quantity: number;
  price: number;
  medicine?: { name: string };
}

export default function OrderDetails() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const res = await api.orders.getOrderById(id);
      const data = res.data || res;
      setOrder({
        ...data,
        items: (data.items || []).map((item: any, idx: number) => ({
          ...item,
          name: item.medicine?.name || item.name || "Unknown",
          id: item.id || `item-${idx}`
        }))
      });
    } catch (err) {
      toast.error("অর্ডারের তথ্য পাওয়া যায়নি");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!confirm("Are you sure?")) return;
    setCancelling(true);
    try {
      await api.orders.updateStatus(order.id, "CANCELLED");
      toast.success("Order Cancelled");
      await fetchOrderDetails();
    } catch (error) {
      toast.error("Failed to cancel");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#020d0a] flex items-center justify-center">
      <Loader2 className="animate-spin text-[#008249]" size={32} />
    </div>
  );

  if (!order) return <div className="text-white p-10 text-center">Order not found</div>;

  const steps = ["PLACED", "PROCESSING", "SHIPPED", "DELIVERED"];
  const isCancelled = order.status === "CANCELLED";
  const currentStep = isCancelled ? -1 : steps.indexOf(order.status?.toUpperCase());

  return (
    <div className="min-h-screen bg-[#020d0a] text-white p-6 lg:p-12">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => router.back()} className="text-[#008249] flex items-center gap-2 mb-8 font-black uppercase text-xs">
          <ArrowLeft size={16} /> Go Back
        </button>

        <div className="flex justify-between items-center mb-12">
          <h1 className="text-5xl font-black italic uppercase">Order <span className="text-[#008249]">Summary</span></h1>
          <div className={`px-6 py-2 rounded-xl border ${isCancelled ? "bg-red-900/20 border-red-500" : "bg-[#008249]/20 border-[#008249]"}`}>
            {order.status}
          </div>
        </div>

        {/* Tracker */}
        {!isCancelled && (
          <div className="flex justify-between mb-16 bg-[#0a1612] p-8 rounded-3xl border border-[#008249]/20">
            {steps.map((step, i) => (
              <div key={step} className={`flex flex-col items-center ${i <= currentStep ? "text-[#008249]" : "text-gray-600"}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${i <= currentStep ? "bg-[#008249] text-white" : "bg-gray-800"}`}>
                  <CheckCircle2 size={20} />
                </div>
                <span className="text-[10px] font-black uppercase">{step}</span>
              </div>
            ))}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-4">
            {order.items.map((item: OrderItem) => (
              <div key={item.id} className="flex justify-between items-center p-6 bg-[#0a1612] border border-white/5 rounded-2xl">
                <div className="flex items-center gap-4">
                  <Package className="text-[#008249]" />
                  <div>
                    <p className="font-bold">{item.name}</p>
                    <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-black">৳{item.price * item.quantity}</p>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            <div className="bg-[#008249] p-8 rounded-3xl">
              <p className="text-xs font-bold uppercase opacity-80">Total Payable</p>
              <h2 className="text-5xl font-black italic">৳{order.totalAmount}</h2>
            </div>
            
            {(order.status === "PENDING" || order.status === "PLACED") && (
              <button 
                onClick={handleCancelOrder}
                disabled={cancelling}
                className="w-full py-4 bg-red-600 rounded-xl font-bold uppercase hover:bg-red-700 transition"
              >
                {cancelling ? "Cancelling..." : "Cancel Order"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}