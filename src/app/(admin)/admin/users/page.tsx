"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, ShieldAlert, ShieldCheck, Search } from "lucide-react";

export default function UserManagementPage() {
  // ১. মেইন ইউজার লিস্ট স্টেট (এটাই চেঞ্জ হবে)
  const [users, setUsers] = useState([
    { id: 1, name: "ALFAZ USER", email: "alfaz@test.com", role: "SELLER", status: "ACTIVE" },
    { id: 2, name: "RAHIM AHMED", email: "rahim@test.com", role: "CUSTOMER", status: "ACTIVE" },
    { id: 3, name: "KARIM KHAN", email: "karim@test.com", role: "SELLER", status: "BANNED" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");

  // ২. ব্যান বা আনব্যান করার আসল লজিক
  const toggleUserStatus = (id: number) => {
    const updatedUsers = users.map((user) => {
      if (user.id === id) {
        return {
          ...user,
          status: user.status === "ACTIVE" ? "BANNED" : "ACTIVE",
        };
      }
      return user;
    });
    setUsers(updatedUsers); // স্টেট আপডেট করা
  };

  // ৩. সার্চ ফিল্টার লজিক
  const filteredUsers = users.filter((u) =>
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 lg:p-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tighter text-white">
            User <span className="text-blue-600">Management</span>
          </h1>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2">
            Monitor and control platform access
          </p>
        </div>

        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="Search by email..."
            className="bg-white/5 border border-white/10 pl-12 pr-6 py-3 rounded-2xl text-sm outline-none focus:border-blue-600 text-white transition-all w-full md:w-64"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/[0.02] border border-white/10 rounded-[32px] overflow-hidden shadow-2xl"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
              <tr>
                <th className="px-8 py-6">Identity</th>
                <th className="px-8 py-6">Role</th>
                <th className="px-8 py-6">Account Status</th>
                <th className="px-8 py-6 text-right">Moderation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 italic">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-white/[0.03] transition-colors group">
                  <td className="px-8 py-6">
                    <div className="font-bold text-white uppercase tracking-tight">{user.name}</div>
                    <div className="text-[10px] text-slate-500 lowercase not-italic">{user.email}</div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${user.role === 'SELLER' ? 'bg-blue-600/10 text-blue-400' : 'bg-purple-600/10 text-purple-400'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`text-[10px] font-black uppercase ${user.status === 'ACTIVE' ? 'text-emerald-500' : 'text-red-500'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    {/* ৪. বাটনে ক্লিক ইভেন্ট কানেক্ট করা হয়েছে */}
                    <button 
                      onClick={() => toggleUserStatus(user.id)}
                      className={`px-4 py-2 rounded-xl transition-all text-[9px] font-black uppercase tracking-widest flex items-center gap-2 ml-auto shadow-lg ${
                        user.status === "ACTIVE" 
                        ? "bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white shadow-red-500/5" 
                        : "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white shadow-emerald-500/5"
                      }`}
                    >
                      {user.status === "ACTIVE" ? (
                        <> <ShieldAlert size={14} /> Ban User </>
                      ) : (
                        <> <ShieldCheck size={14} /> Unban User </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}