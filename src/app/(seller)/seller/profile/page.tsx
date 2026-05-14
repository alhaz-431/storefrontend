"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Mail, Phone, MapPin, ShieldCheck, 
  Camera, Edit3, Save, Calendar, BadgeCheck, X, LogOut 
} from "lucide-react";

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

  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState<SellerData>({ ...sellerInfo });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveClick = () => {
    setSellerInfo({ ...tempData });
    setIsEditing(false);
    alert("Profile Updated Locally!");
  };

  const firstLetter = sellerInfo.name ? sellerInfo.name.charAt(0).toUpperCase() : "S";

  return (
    // bg-[#050a08] একটি ডার্ক গ্রিন টোন দিবে
    <div className="p-4 sm:p-6 lg:p-10 min-h-screen bg-[#050a08] text-slate-200 selection:bg-emerald-500/30">
      
      {/* Header Section */}
      <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-white">
            Seller <span className="text-emerald-500">Account</span>
          </h1>
          <div className="h-1 w-12 bg-emerald-500 mt-1 rounded-full"></div>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button 
            className="flex items-center gap-2 bg-red-500/5 hover:bg-red-500/20 text-red-500 px-5 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all border border-red-500/10"
          >
            <LogOut size={16} /> Logout
          </button>

          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all shadow-lg shadow-emerald-500/20"
            >
              <Edit3 size={16} /> Edit Profile
            </button>
          ) : (
            <button 
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest border border-white/10 transition-all"
            >
              <X size={16} /> Cancel
            </button>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Stats Card */}
        <div className="lg:col-span-4 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0a120f] border border-emerald-900/20 rounded-[40px] p-8 text-center relative shadow-2xl"
          >
            <div className="relative w-32 h-32 mx-auto mb-6">
              <div className="w-full h-full rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center text-5xl font-black text-emerald-500 italic shadow-[0_0_30px_rgba(16,185,129,0.1)]">
                {firstLetter}
              </div>
              {isEditing && (
                <div className="absolute bottom-0 right-0 p-2 bg-emerald-600 rounded-full border-4 border-[#0a120f] text-white cursor-pointer hover:scale-110 transition-all">
                  <Camera size={18} />
                </div>
              )}
            </div>
            
            <h2 className="text-2xl font-black italic uppercase tracking-tight text-white mb-1 truncate">
              {sellerInfo.name}
            </h2>
            
            <div className="flex items-center justify-center gap-2 text-emerald-500/80 mb-6 font-bold uppercase text-[10px] tracking-[0.2em]">
              <BadgeCheck size={14} /> {sellerInfo.role}
            </div>

            <div className="grid grid-cols-2 gap-px bg-emerald-900/10 border-t border-emerald-900/20 -mx-8 -mb-8">
              <div className="p-6">
                <p className="text-[8px] font-black uppercase text-emerald-700 tracking-widest mb-1">Total Sales</p>
                <p className="text-xl font-black text-white italic">{sellerInfo.totalSales}</p>
              </div>
              <div className="p-6 border-l border-emerald-900/10">
                <p className="text-[8px] font-black uppercase text-emerald-700 tracking-widest mb-1">Rating</p>
                <p className="text-xl font-black text-white italic">{sellerInfo.rating}</p>
              </div>
            </div>
          </motion.div>

          <div className="bg-emerald-950/20 border border-emerald-900/20 rounded-[32px] p-6 space-y-5">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500"><Calendar size={20}/></div>
                <div>
                  <p className="text-[8px] font-black text-emerald-800 uppercase tracking-[0.2em]">Member Since</p>
                  <p className="text-sm font-bold text-slate-300">{sellerInfo.joined}</p>
                </div>
             </div>
             <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500"><ShieldCheck size={20}/></div>
                <div>
                  <p className="text-[8px] font-black text-emerald-800 uppercase tracking-[0.2em]">Verified Status</p>
                  <p className="text-sm font-bold text-emerald-500 uppercase tracking-tighter italic">Official Seller</p>
                </div>
             </div>
          </div>
        </div>

        {/* Right: Info Form */}
        <div className="lg:col-span-8">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#0a120f] border border-emerald-900/20 rounded-[40px] p-6 md:p-10 shadow-2xl h-full"
          >
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-black italic uppercase tracking-tight text-white border-l-4 border-emerald-500 pl-4">
                Store <span className="text-emerald-500">Credentials</span>
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
              {/* Name Input */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-emerald-800 tracking-widest ml-1">Legal Full Name</label>
                <div className="relative group">
                  <User className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isEditing ? 'text-emerald-500' : 'text-emerald-900'}`} size={18} />
                  <input 
                    type="text" 
                    name="name"
                    value={isEditing ? tempData.name : sellerInfo.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full bg-[#050a08] border rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white outline-none transition-all 
                      ${isEditing ? 'border-emerald-500/40 focus:border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.05)]' : 'border-white/5 opacity-50 cursor-not-allowed'}`}
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-emerald-800 tracking-widest ml-1">Business Email</label>
                <div className="relative group">
                  <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isEditing ? 'text-emerald-500' : 'text-emerald-900'}`} size={18} />
                  <input 
                    type="email" 
                    name="email"
                    value={isEditing ? tempData.email : sellerInfo.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full bg-[#050a08] border rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white outline-none transition-all 
                      ${isEditing ? 'border-emerald-500/40 focus:border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.05)]' : 'border-white/5 opacity-50 cursor-not-allowed'}`}
                  />
                </div>
              </div>

              {/* Phone Input */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-emerald-800 tracking-widest ml-1">Contact Number</label>
                <div className="relative group">
                  <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isEditing ? 'text-emerald-500' : 'text-emerald-900'}`} size={18} />
                  <input 
                    type="text" 
                    name="phone"
                    value={isEditing ? tempData.phone : sellerInfo.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full bg-[#050a08] border rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white outline-none transition-all 
                      ${isEditing ? 'border-emerald-500/40 focus:border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.05)]' : 'border-white/5 opacity-50 cursor-not-allowed'}`}
                  />
                </div>
              </div>

              {/* Address Input */}
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-emerald-800 tracking-widest ml-1">Main Store Location</label>
                <div className="relative group">
                  <MapPin className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isEditing ? 'text-emerald-500' : 'text-emerald-900'}`} size={18} />
                  <input 
                    type="text" 
                    name="address"
                    value={isEditing ? tempData.address : sellerInfo.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full bg-[#050a08] border rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white outline-none transition-all 
                      ${isEditing ? 'border-emerald-500/40 focus:border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.05)]' : 'border-white/5 opacity-50 cursor-not-allowed'}`}
                  />
                </div>
              </div>
            </div>

            {/* Save Button with Animation */}
            <AnimatePresence>
              {isEditing && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="mt-16"
                >
                  <button 
                    onClick={handleSaveClick}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-5 rounded-3xl font-black uppercase text-[12px] tracking-[0.3em] transition-all flex items-center justify-center gap-3 active:scale-[0.98] shadow-[0_10px_30px_rgba(16,185,129,0.2)]"
                  >
                    <Save size={20} /> Update Records
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