"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { Eye, Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.admin.getAllOrders();
      setOrders(response || []);
    } catch (error) {
      toast.error("অর্ডার লোড করতে ব্যর্থ হয়েছে");
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
        <Loader2 className="animate-spin text-blue-600" size={32} />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-10 min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-black uppercase text-gray-900 mb-8">
          Order History
        </h1>
        <p className="text-gray-500 text-sm mb-6">Manage and track all customer orders</p>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-[10px] font-black uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-blue-600">{order.id}</td>
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
                  <td className="px-6 py-4">
                    <button className="text-gray-400 hover:text-blue-600 transition-colors">
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {orders.length === 0 && (
            <div className="p-10 text-center text-gray-400">কোনো অর্ডার পাওয়া যায়নি।</div>
          )}
        </div>
      </div>
    </div>
  );
}