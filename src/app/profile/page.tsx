"use client";
import ProtectedRoute from "@/components/protectedRoute";
import { useAuth } from "@/context/AuthContext";
// সঠিক পাথটি এখানে বসিয়েছি:

import { User, Mail, Shield, Calendar } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#02040a] py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-black italic uppercase text-white mb-10 tracking-tighter">
            Your <span className="text-emerald-500">Profile</span>
          </h1>

          <div className="bg-white/[0.03] border border-white/10 rounded-[40px] p-10 backdrop-blur-xl">
            <div className="flex flex-col md:flex-row items-center gap-10">
              {/* Avatar Placeholder */}
              <div className="w-32 h-32 bg-emerald-500/10 rounded-full flex items-center justify-center border-2 border-emerald-500/20">
                <User size={60} className="text-emerald-500" />
              </div>

              <div className="flex-1 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                      <User size={12} /> Full Name
                    </p>
                    <p className="text-xl font-bold text-white uppercase italic">{user?.name || "N/A"}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                      <Mail size={12} /> Email Address
                    </p>
                    <p className="text-xl font-bold text-white">{user?.email || "N/A"}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                      <Shield size={12} /> Account Role
                    </p>
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-full text-[10px] font-black uppercase tracking-tighter border border-emerald-500/20">
                      {user?.role || "User"}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-2">
                      <Calendar size={12} /> Member Since
                    </p>
                    <p className="text-white font-bold tracking-tight">April 2026</p>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/5 flex gap-4">
                  <button className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                    Edit Profile
                  </button>
                  <button className="px-8 py-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
                    Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}


