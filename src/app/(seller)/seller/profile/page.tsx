"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
// lucide-center এর বদলে lucide-react ব্যবহার করতে হবে
import { 
  User, Mail, Phone, MapPin, ShieldCheck, 
  Camera, Edit3, Save, Calendar, BadgeCheck, X, LogOut 
} from "lucide-react";

// টাইপ সেফটির জন্য ইন্টারফেস
interface SellerData {
  name: string;
  email: string;
  phone: string;
  address: string;
  joined: string;
  role: string;
  status: string;
  totalSales: string;
  rating: string;
}

export default function SellerProfile() {
  // ১. প্রোফাইল ডেটা স্টেট
  const [sellerInfo, setSellerInfo] = useState<SellerData>({
    name: "Alfaz ARbby",
    email: "alfaz.arbby@medistore.com",
    phone: "+880 1700 000 000",
    address: "Dhaka, Bangladesh",
    joined: "May 2026",
    role: "Premium Seller",
    status: "Verified",
    totalSales: "৳12.4k",
    rating: "4.9/5",
  });

  // ২. এডিটিং মোড ও টেম্পোরারি ডেটা স্টেট
  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState<SellerData>({ ...sellerInfo });

  // ইনপুট হ্যান্ডেলার
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditClick = () => {
    setTempData({ ...sellerInfo });
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    setSellerInfo({ ...tempData });
    setIsEditing(false);
    // TODO: Prisma API Call here
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleLogoutClick = () => {
    if (confirm("Are you sure you want to logout?")) {
      alert("Logging out from MediStore...");
    }
  };

  const firstLetter = sellerInfo.name ? sellerInfo.name.charAt(0).toUpperCase() : "S";

  return (
    <div className="p-4 sm:p-6 lg:p-10 min-h-screen bg-[#02040a] text-white">
      
      {/* Header Section */}
      <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-white">
            Seller <span className="text-emerald-500">Profile</span>
          </h1>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mt-2">
            Manage your account settings
          </p>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button 
            onClick={handleLogoutClick}
            className="flex items-center gap-2 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white px-5 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all border border-red-500/20 hover:border-red-600"
          >
            <LogOut size={16} /> Logout
          </button>

          {!isEditing ? (
            <button 
              onClick={handleEditClick}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-lg shadow-emerald-900/20"
            >
              <Edit3 size={16} /> Edit Profile
            </button>
          ) : (
            <button 
              onClick={handleCancelClick}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest border border-white/10 transition-all"
            >
              <X size={16} /> Cancel
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left: Avatar Card */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/[0.02] border border-white/5 rounded-[40px] p-8 text-center relative overflow-hidden"
          >
            <div className="relative w-32 h-32 mx-auto mb-6">
              <div className="w-full h-full rounded-full bg-emerald-600/20 border-2 border-emerald-500/30 flex items-center justify-center text-5xl font-black text-emerald-500 italic shadow-inner">
                {firstLetter}
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 p-2 bg-emerald-600 rounded-full border-4 border-[#02040a] text-white hover:scale-110 transition-all">
                  <Camera size={18} />
                </button>
              )}
            </div>
            
            <h2 className="text-2xl font-black italic uppercase tracking-tight text-white mb-1 truncate">
              {sellerInfo.name}
            </h2>
            
            <div className="flex items-center justify-center gap-2 text-emerald-500 mb-6">
              <BadgeCheck size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">{sellerInfo.role}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-6 bg-white/[0.01] rounded-b-[40px] -mx-8 -mb-8 px-8 pb-8">
              <div>
                <p className="text-[8px] font-black uppercase text-slate-500 tracking-widest">Total Sales</p>
                <p className="text-lg font-black text-white italic">{sellerInfo.totalSales}</p>
              </div>
              <div>
                <p className="text-[8px] font-black uppercase text-slate-500 tracking-widest">Rating</p>
                <p className="text-lg font-black text-white italic">{sellerInfo.rating}</p>
              </div>
            </div>
          </motion.div>

          <div className="bg-emerald-600/5 border border-emerald-600/10 rounded-[32px] p-6 space-y-4">
             <div className="flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-lg text-emerald-500 shrink-0"><Calendar size={18}/></div>
                <div>
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Member Since</p>
                  <p className="text-xs font-bold text-white">{sellerInfo.joined}</p>
                </div>
             </div>
             <div className="flex items-center gap-3">
                <div className="p-2 bg-white/5 rounded-lg text-emerald-500 shrink-0"><ShieldCheck size={18}/></div>
                <div>
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Account Status</p>
                  <p className="text-xs font-bold text-emerald-500 uppercase">{sellerInfo.status}</p>
                </div>
             </div>
          </div>
        </div>

        {/* Right: Info Form */}
        <div className="lg:col-span-2 relative">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/[0.02] border border-white/5 rounded-[40px] p-6 md:p-10"
          >
            <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
              <h3 className="text-xl font-black italic uppercase tracking-tight text-white">
                Personal <span className="text-emerald-500">Information</span>
              </h3>
              {isEditing && (
                <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 animate-pulse">
                  Editing Mode
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
              {/* Name Input */}
              <div className="space-y-2.5">
                <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest ml-1">Full Name</label>
                <div className="relative group">
                  <User className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isEditing ? 'text-emerald-500' : 'text-slate-500'}`} size={18} />
                  <input 
                    type="text" 
                    name="name"
                    value={isEditing ? tempData.name : sellerInfo.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full bg-white/5 border rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white outline-none transition-all 
                      ${isEditing ? 'border-emerald-500/50 focus:border-emerald-500 focus:bg-white/10' : 'border-white/10 cursor-not-allowed opacity-80'}`}
                    placeholder="Enter full name"
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-2.5">
                <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isEditing ? 'text-emerald-500' : 'text-slate-500'}`} size={18} />
                  <input 
                    type="email" 
                    name="email"
                    value={isEditing ? tempData.email : sellerInfo.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full bg-white/5 border rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white outline-none transition-all 
                      ${isEditing ? 'border-emerald-500/50 focus:border-emerald-500 focus:bg-white/10' : 'border-white/10 cursor-not-allowed opacity-80'}`}
                    placeholder="Enter email"
                  />
                </div>
              </div>

              {/* Phone Input */}
              <div className="space-y-2.5">
                <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest ml-1">Phone Number</label>
                <div className="relative group">
                  <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isEditing ? 'text-emerald-500' : 'text-slate-500'}`} size={18} />
                  <input 
                    type="text" 
                    name="phone"
                    value={isEditing ? tempData.phone : sellerInfo.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full bg-white/5 border rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white outline-none transition-all 
                      ${isEditing ? 'border-emerald-500/50 focus:border-emerald-500 focus:bg-white/10' : 'border-white/10 cursor-not-allowed opacity-80'}`}
                    placeholder="Enter phone"
                  />
                </div>
              </div>

              {/* Address Input */}
              <div className="space-y-2.5">
                <label className="text-[9px] font-black uppercase text-slate-500 tracking-widest ml-1">Store Address</label>
                <div className="relative group">
                  <MapPin className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isEditing ? 'text-emerald-500' : 'text-slate-500'}`} size={18} />
                  <input 
                    type="text" 
                    name="address"
                    value={isEditing ? tempData.address : sellerInfo.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full bg-white/5 border rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white outline-none transition-all 
                      ${isEditing ? 'border-emerald-500/50 focus:border-emerald-500 focus:bg-white/10' : 'border-white/10 cursor-not-allowed opacity-80'}`}
                    placeholder="Enter address"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <AnimatePresence>
              {isEditing && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mt-12 flex flex-col sm:flex-row gap-4 border-t border-white/5 pt-8"
                >
                  <button 
                    onClick={handleSaveClick}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    <Save size={18} /> Save Changes
                  </button>
                  <button 
                    onClick={handleCancelClick}
                    className="flex-1 bg-white/5 hover:bg-white/10 text-white py-4 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] border border-white/10 transition-all active:scale-95"
                  >
                    Discard Changes
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}