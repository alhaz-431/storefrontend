"use client";
import { useState, useEffect } from "react";
import { api } from "@/lib/api";
import { ShieldAlert, ShieldCheck, Loader2, UserCheck, UserX } from "lucide-react";
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
      // ১. রিফ্রেশ ছাড়াই সাথে সাথে ইউআই আপডেট (Optimistic Update)
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === id ? { ...user, status: newStatus } : user
        )
      );

      await api.admin.updateUserStatus(id, newStatus);
      
      // ২. সাকসেস টোস্ট মেসেজ
      toast.success(`ইউজার এখন ${newStatus === 'ACTIVE' ? 'Active' : 'Banned'}!`);
      
    } catch (err) {
      // যদি ভুল হয়, আগের অবস্থায় ফিরে যাওয়া
      fetchUsers(); 
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
    <div className="p-2 md:p-10 min-h-screen bg-gray-50">
      {/* টোস্টের ডিউরেশন ২ সেকেন্ডে সেট করা হয়েছে */}
      <Toaster 
        position="top-right" 
        toastOptions={{ duration: 2000 }} 
      />
      
      <div className="max-w-6xl mx-auto">
        <h1 className="text-xl md:text-3xl font-black uppercase text-gray-900 mb-6">
          User Management
        </h1>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[300px]">
            <thead>
              <tr className="bg-gray-50 text-[10px] font-black uppercase text-gray-500">
                <th className="px-3 py-4">Name</th>
                <th className="px-3 py-4">Status</th>
                <th className="px-3 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-3 py-4 font-bold text-gray-800 text-xs flex items-center gap-2">
                    {/* আইকন দিয়ে স্ট্যাটাস বোঝা যাবে */}
                    {user.status === 'BANNED' ? <UserX size={14} className="text-red-500"/> : <UserCheck size={14} className="text-emerald-500"/>}
                    {user.name}
                  </td>
                  <td className="px-3 py-4">
                    <span className={`px-2 py-1 rounded-full text-[8px] font-black uppercase whitespace-nowrap ${
                      user.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-600' : 
                      user.status === 'BANNED' ? 'bg-red-50 text-red-600' : 
                      'bg-gray-100 text-gray-400'
                    }`}>
                      {user.status || "UNKNOWN"}
                    </span>
                  </td>
                  <td className="px-3 py-4 flex gap-1 justify-center">
                    <button 
                      onClick={() => handleStatusChange(user.id, "BANNED")}
                      className={`flex items-center gap-0.5 text-[8px] font-black uppercase px-2 py-1.5 rounded-lg transition-colors ${user.status === 'BANNED' ? 'bg-red-100 text-red-700 opacity-50 cursor-not-allowed' : 'bg-red-50 text-red-600 hover:bg-red-100'}`}
                      disabled={user.status === 'BANNED'}
                    >
                      <ShieldAlert size={10} /> Ban
                    </button>
                    <button 
                      onClick={() => handleStatusChange(user.id, "ACTIVE")}
                      className={`flex items-center gap-0.5 text-[8px] font-black uppercase px-2 py-1.5 rounded-lg transition-colors ${user.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700 opacity-50 cursor-not-allowed' : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'}`}
                      disabled={user.status === 'ACTIVE'}
                    >
                      <ShieldCheck size={10} /> Unban
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {users.length === 0 && (
            <div className="p-6 text-center text-gray-400 text-sm">কোনো ইউজার পাওয়া যায়নি।</div>
          )}
        </div>
      </div>
    </div>
  );
}