"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { ShieldAlert, ShieldCheck, Loader2 } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function UserManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await api.admin.getAllUsers();
      setUsers(data || []);
    } catch (err) {
      toast.error("ইউজারদের তালিকা আনতে ব্যর্থ হয়েছে");
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
      toast.success(`ইউজার স্ট্যাটাস ${newStatus} করা হয়েছে`);
      fetchUsers();
    } catch (err) {
      toast.error("স্ট্যাটাস পরিবর্তন করা যায়নি");
    }
  };

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
        <h1 className="text-2xl md:text-3xl font-black uppercase text-gray-900 mb-8">
          User Management
        </h1>

        {/* টেবিলের চারপাশে overflow-x-auto যোগ করা হয়েছে যাতে মোবাইলে স্ক্রল করা যায় */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
          <table className="w-full text-left min-w-[400px]">
            <thead className="bg-gray-50 text-[10px] font-black uppercase text-gray-500">
              <tr>
                <th className="px-4 py-4">Name</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 font-bold text-gray-800 text-sm whitespace-nowrap">{user.name}</td>
                  <td className="px-4 py-4">
                    <span className={`px-2 py-1 rounded-full text-[9px] font-black uppercase whitespace-nowrap ${
                      user.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 
                      user.status === 'BANNED' ? 'bg-red-50 text-red-600' : 
                      'bg-gray-100 text-gray-400'
                    }`}>
                      {user.status || "UNKNOWN"}
                    </span>
                  </td>
                  <td className="px-4 py-4 flex gap-1">
                    <button 
                      onClick={() => handleStatusChange(user.id, "BANNED")}
                      className="flex items-center gap-1 text-[9px] font-black uppercase bg-red-50 text-red-600 px-2 py-1.5 rounded-lg hover:bg-red-100 transition-colors whitespace-nowrap"
                    >
                      <ShieldAlert size={10} /> Ban
                    </button>
                    <button 
                      onClick={() => handleStatusChange(user.id, "ACTIVE")}
                      className="flex items-center gap-1 text-[9px] font-black uppercase bg-emerald-50 text-emerald-600 px-2 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors whitespace-nowrap"
                    >
                      <ShieldCheck size={10} /> Unban
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {users.length === 0 && (
            <div className="p-10 text-center text-gray-400">কোনো ইউজার পাওয়া যায়নি।</div>
          )}
        </div>
      </div>
    </div>
  );
}