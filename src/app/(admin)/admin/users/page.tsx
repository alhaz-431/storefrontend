"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, ShieldCheck, Search, Loader2, User } from "lucide-react";
import { api } from "@/lib/api";

export default function UserManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await api.admin.getAllUsers();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleUserStatus = async (user: any) => {
    const newStatus = user.status === "ACTIVE" ? "BANNED" : "ACTIVE";
    try {
      await api.admin.updateUserStatus(user.id, newStatus);
      fetchUsers();
    } catch (err) {
      console.error("Status update failed", err);
    }
  };

  const filteredUsers = users.filter((u) =>
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin text-blue-600" /></div>;

  return (
    <div className="p-4 md:p-10 min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-gray-900">
              User <span className="text-blue-600">Management</span>
            </h1>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">
              Admin Control Panel
            </p>
          </div>

          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search users..."
              className="w-full bg-white border border-gray-200 pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-sm"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table/Card Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-500">
                <tr>
                  <th className="px-6 py-4">Identity</th>
                  <th className="px-6 py-4 hidden md:table-cell">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{user.name}</div>
                      <div className="text-[10px] text-gray-400">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <span className={`px-2 py-1 rounded text-[9px] font-bold uppercase ${user.role === 'SELLER' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-black uppercase ${user.status === 'ACTIVE' ? 'text-emerald-600' : 'text-red-600'}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => toggleUserStatus(user)}
                        className={`flex items-center gap-2 ml-auto px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${
                          user.status === "ACTIVE" 
                          ? "bg-red-50 text-red-600 hover:bg-red-100" 
                          : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                        }`}
                      >
                        {user.status === "ACTIVE" ? <ShieldAlert size={12} /> : <ShieldCheck size={12} />}
                        {user.status === "ACTIVE" ? "Ban" : "Unban"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}