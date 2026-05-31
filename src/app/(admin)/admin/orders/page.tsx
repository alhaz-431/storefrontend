"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Eye, Loader2, X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null); // ডিটেইলস দেখার জন্য

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.admin.getAllOrders();
      setOrders(response || []);
    } catch (error) {
      toast.error("অর্ডার লোড করতে ব্যর্থ হয়েছে");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin text-emerald-600" size={32} />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-black uppercase text-gray-900 mb-8">Order History</h1>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-[10px] font-black uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-blue-600">
                     <span className="text-xs font-mono bg-blue-50 px-2 py-1 rounded">
                        {order.id.slice(0, 8)}...
                     </span>
                  </td>
                  <td className="px-6 py-4 font-bold uppercase text-gray-800">
                    {order.customer?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase ${
                      order.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-600' :
                      order.status === 'PROCESSING' ? 'bg-blue-50 text-blue-600' :
                      'bg-orange-50 text-orange-600'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {/* ভিউ আইকনে ক্লিক হ্যান্ডলার যোগ করা হয়েছে */}
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="text-gray-400 hover:text-emerald-600 transition-colors"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* সিম্পল Modal - ক্লিক করলে এটি দেখাবে */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-black uppercase">Order Details</h2>
              <button onClick={() => setSelectedOrder(null)}><X size={20}/></button>
            </div>
            <div className="space-y-2 text-sm">
              <p><strong>ID:</strong> {selectedOrder.id}</p>
              <p><strong>Customer:</strong> {selectedOrder.customer?.name}</p>
              <p><strong>Status:</strong> {selectedOrder.status}</p>
              
            </div>
          </div>
        </div>
      )}
    </div>
  );
}