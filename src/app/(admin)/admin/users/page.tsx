"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, ShieldCheck, Search, Loader2, Package } from "lucide-react";
import { api } from "@/lib/api";
import toast, { Toaster } from "react-hot-toast";

export default function UserManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await api.admin.getAllUsers();
      setUsers(data || []);
    } catch (err) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await api.admin.updateUserStatus(id, newStatus);
      toast.success(`User ${newStatus.toLowerCase()} successfully!`);
      fetchUsers();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const filteredUsers = users.filter((u) =>
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin text-blue-600" />
      </div>
    );

  return (
    <div className="p-4 md:p-10 min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h1 className="text-2xl md:text-3xl font-black uppercase text-gray-900">
            User Management
          </h1>

          <div className="relative w-full md:w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search name or email..."
              className="w-full bg-white border border-gray-200 pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <motion.div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-[10px] font-black uppercase text-gray-500">
              <tr>
                <th className="px-6 py-4">Identity</th>
                <th className="px-6 py-4">Role / Status</th>
                <th className="px-6 py-4 text-center">Medicines & Logs</th>
                <th className="px-6 py-4 text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-900">{user.name}</div>
                    <div className="text-xs text-gray-400">{user.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-black uppercase text-[10px] text-gray-600">
                      {user.role}
                    </div>
                    <div
                      className={`font-bold uppercase text-[9px] ${
                        user.status === "ACTIVE"
                          ? "text-emerald-500"
                          : "text-red-500"
                      }`}
                    >
                      {user.status || "N/A"}
                    </div>
                  </td>
                  {/* আপডেট করা মেডিসিন এবং লগস কাউন্ট */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center justify-center gap-0.5 text-gray-600 font-bold">
                      <div className="flex items-center gap-1">
                        <Package size={14} />
                        <span>{user._count?.medicines || 0}</span>
                      </div>
                      <span className="text-[9px] text-gray-400 font-normal">
                        Logs: {user._count?.activityLogs || 0}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right flex justify-end gap-2">
                    <button
                      onClick={() => handleStatusChange(user.id, "BANNED")}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
                        user.status === "BANNED"
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-red-50 text-red-600 hover:bg-red-100"
                      }`}
                      disabled={user.status === "BANNED"}
                    >
                      <ShieldAlert size={12} className="inline mr-1" /> Ban
                    </button>
                    <button
                      onClick={() => handleStatusChange(user.id, "ACTIVE")}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
                        user.status === "ACTIVE"
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                      }`}
                      disabled={user.status === "ACTIVE"}
                    >
                      <ShieldCheck size={12} className="inline mr-1" /> Unban
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      </div>
    </div>
  );
}