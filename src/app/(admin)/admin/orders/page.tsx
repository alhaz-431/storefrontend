"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, Search, X, Package } from "lucide-react";

export default function AdminOrdersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  // ডামি ডাটা (ব্যাকএন্ড কানেক্ট করলে এখান থেকে পরিবর্তন করবেন)
  const orders = [
    { id: "ORD-7721", customer: "ALFAZ ARBBY", date: "24 April 2026", amount: "$45.00", status: "DELIVERED", email: "alfaz@example.com", items: "Napa Extra x5, Sergel x2" },
    { id: "ORD-8842", customer: "RAHIM AHMED", date: "25 April 2026", amount: "$120.00", status: "PROCESSING", email: "rahim@example.com", items: "Ace Plus x10" },
    { id: "ORD-9910", customer: "KARIM KHAN", date: "26 April 2026", amount: "$15.50", status: "PENDING", email: "karim@example.com", items: "Fexo 120mg x3" },
  ];

  const filteredOrders = orders.filter(order => 
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "DELIVERED": return "text-emerald-600 bg-emerald-50";
      case "PROCESSING": return "text-blue-600 bg-blue-50";
      case "PENDING": return "text-orange-600 bg-orange-50";
      default: return "text-gray-600 bg-gray-50";
    }
  };

  return (
    <div className="p-4 md:p-10 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8">
        <h1 className="text-2xl md:text-3xl font-black uppercase text-gray-900 tracking-tight">Order History</h1>
        <p className="text-gray-500 text-sm mt-1">Manage and track all customer orders</p>
      </div>

      {/* Table Container */}
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 md:p-6 border-b border-gray-100">
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
             <input 
               type="text" 
               placeholder="Search by ID or Name..."
               className="w-full md:w-80 pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 text-sm"
               onChange={(e) => setSearchTerm(e.target.value)}
             />
           </div>
        </div>

        {/* Scrollable Table for Mobile */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-[10px] font-black uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 text-blue-600 font-medium text-xs">{order.id}</td>
                  <td className="px-6 py-4 text-gray-900 font-bold">{order.customer}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${getStatusStyle(order.status)}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => setSelectedOrder(order)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="bg-white p-8 rounded-3xl w-full max-w-lg shadow-2xl relative">
              <button onClick={() => setSelectedOrder(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900"><X /></button>
              <h2 className="text-xl font-black text-gray-900 mb-6 uppercase tracking-tight">Order Details</h2>
              <div className="space-y-4">
                <div className="flex justify-between border-b pb-2"><span className="text-gray-500 text-sm">Customer:</span> <span className="font-bold">{selectedOrder.customer}</span></div>
                <div className="flex justify-between border-b pb-2"><span className="text-gray-500 text-sm">Email:</span> <span className="font-bold">{selectedOrder.email}</span></div>
                <div className="flex justify-between border-b pb-2"><span className="text-gray-500 text-sm">Items:</span> <span className="font-bold text-right">{selectedOrder.items}</span></div>
                <div className="flex justify-between items-center pt-4">
                    <span className="text-gray-500">Total Paid:</span>
                    <span className="text-2xl font-black text-blue-600">{selectedOrder.amount}</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}