"use client";

import { useEffect, useState } from "react";
import { User, Mail, ShieldCheck, LogOut, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("medistore_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#02040a] text-white flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-[#0d111c] border border-white/10 rounded-[48px] overflow-hidden shadow-2xl">
        {/* Profile Header */}
        <div className="h-32 bg-gradient-to-r from-emerald-600 to-teal-700 flex items-end justify-center pb-0">
           <div className="w-24 h-24 bg-[#0d111c] rounded-full border-8 border-[#0d111c] translate-y-12 flex items-center justify-center shadow-xl">
             <User size={40} className="text-emerald-500" />
           </div>
        </div>

        <div className="pt-16 p-10 text-center">
          <h2 className="text-2xl font-black italic uppercase tracking-tighter">{user.name}</h2>
          <p className="text-[10px] text-emerald-500 font-black uppercase tracking-[0.3em] mt-1">Verified Member</p>

          <div className="mt-10 space-y-3 text-left">
            <div className="bg-white/[0.03] p-4 rounded-2xl flex items-center gap-4 border border-white/5">
              <Mail className="text-slate-500" size={18} />
              <div>
                <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Email Address</p>
                <p className="text-sm font-medium">{user.email}</p>
              </div>
            </div>

            <div className="bg-white/[0.03] p-4 rounded-2xl flex items-center gap-4 border border-white/5">
              <ShieldCheck className="text-slate-500" size={18} />
              <div>
                <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Account Type</p>
                <p className="text-sm font-medium uppercase tracking-tighter">{user.role}</p>
              </div>
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="w-full mt-10 bg-red-500/10 hover:bg-red-500 transition-all py-4 rounded-2xl text-red-500 hover:text-white font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2"
          >
            <LogOut size={16} /> Logout Session
          </button>
        </div>
      </div>
    </div>
  );
}