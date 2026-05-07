"use client";
import { motion } from "framer-motion";
import { 
  User, Mail, Phone, MapPin, ShieldCheck, 
  Camera, Edit3, Save, Calendar, BadgeCheck 
} from "lucide-react";

export default function SellerProfile() {
  // ডামি ডেটা (পরে আপনি Prisma থেকে নিয়ে আসবেন)
  const sellerInfo = {
    name: "Alfaz ARbby",
    email: "alfaz.arbby@medistore.com",
    phone: "+880 1700 000 000",
    address: "Dhaka, Bangladesh",
    joined: "May 2026",
    role: "Premium Seller",
    status: "Verified",
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10 min-h-screen bg-[#02040a] text-white">
      {/* Header */}
      <div className="mb-10 flex justify-between items-center">
        <div>
          <h1 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-white">
            Seller <span className="text-emerald-500">Profile</span>
          </h1>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2">Manage your account settings</p>
        </div>
        <button className="hidden sm:flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all">
          <Edit3 size={16} /> Edit Profile
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Avatar Card */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/[0.02] border border-white/5 rounded-[40px] p-8 text-center relative overflow-hidden"
          >
            <div className="relative w-32 h-32 mx-auto mb-6">
              <div className="w-full h-full rounded-full bg-emerald-600/20 border-2 border-emerald-500/30 flex items-center justify-center text-5xl font-black text-emerald-500 italic">
                A
              </div>
              <button className="absolute bottom-0 right-0 p-2 bg-emerald-600 rounded-full border-4 border-[#02040a] text-white hover:scale-110 transition-all">
                <Camera size={18} />
              </button>
            </div>
            
            <h2 className="text-2xl font-black italic uppercase tracking-tight text-white mb-1">{sellerInfo.name}</h2>
            <div className="flex items-center justify-center gap-2 text-emerald-500 mb-6">
              <BadgeCheck size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">{sellerInfo.role}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-6">
              <div>
                <p className="text-[8px] font-black uppercase text-slate-500 tracking-widest">Total Sales</p>
                <p className="text-lg font-black text-white italic">৳12.4k</p>
              </div>
              <div>
                <p className="text-[8px] font-black uppercase text-slate-500 tracking-widest">Rating</p>
                <p className="text-lg font-black text-white italic">4.9/5</p>
              </div>
            </div>
          </motion.div>

          {/* Quick Info Card */}
          <div className="bg-emerald-600/5 border border-emerald-600/10 rounded-[32px] p-6 space-y-4">
             <div className="flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-lg text-emerald-500"><Calendar size={18}/></div>
                <div>
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Member Since</p>
                  <p className="text-xs font-bold text-white">{sellerInfo.joined}</p>
                </div>
             </div>
             <div className="flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-lg text-emerald-500"><ShieldCheck size={18}/></div>
                <div>
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Account Status</p>
                  <p className="text-xs font-bold text-emerald-500 uppercase">{sellerInfo.status}</p>
                </div>
             </div>
          </div>
        </div>

        {/* Right Side: Information Form */}
        <div className="lg:col-span-2">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/[0.02] border border-white/5 rounded-[40px] p-6 md:p-10"
          >
            <h3 className="text-xl font-black italic uppercase tracking-tight text-white mb-8 border-b border-white/5 pb-4">
              Personal <span className="text-emerald-500">Information</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name Input */}
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
                  <input 
                    type="text" 
                    defaultValue={sellerInfo.name}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white outline-none focus:border-emerald-500/50 transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
                  <input 
                    type="email" 
                    defaultValue={sellerInfo.email}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white outline-none focus:border-emerald-500/50 transition-all shadow-inner font-mono"
                  />
                </div>
              </div>

              {/* Phone Input */}
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest ml-1">Phone Number</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
                  <input 
                    type="text" 
                    defaultValue={sellerInfo.phone}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white outline-none focus:border-emerald-500/50 transition-all shadow-inner"
                  />
                </div>
              </div>

              {/* Address Input */}
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest ml-1">Store Address</label>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
                  <input 
                    type="text" 
                    defaultValue={sellerInfo.address}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white outline-none focus:border-emerald-500/50 transition-all shadow-inner"
                  />
                </div>
              </div>
            </div>

            <div className="mt-12 flex flex-col sm:flex-row gap-4">
              <button className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2">
                <Save size={18} /> Save Changes
              </button>
              <button className="flex-1 bg-white/5 hover:bg-white/10 text-white py-4 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] border border-white/10 transition-all">
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}