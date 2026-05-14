"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  User, Mail, Phone, MapPin, ShieldCheck, 
  Edit3, Save, BadgeCheck, X 
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
  // সেশন স্ট্যাটাস ম্যানুয়ালি হ্যান্ডেল করার জন্য
  const [loading, setLoading] = useState(true);
  const [sellerInfo, setSellerInfo] = useState<SellerData>({
    name: "",
    email: "",
    phone: "Not provided",
    address: "Not provided",
    joined: "2026",
    role: "Seller",
    status: "Verified",
    totalSales: "৳0",
    rating: "N/A",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempData, setTempData] = useState<SellerData>({ ...sellerInfo });

  // পেজ লোড হলে ডাটাবেস (Backend API) থেকে ডাটা নিয়ে আসা
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token"); // আপনার সিস্টেম অনুযায়ী টোকেন কি দিন
        const response = await fetch("/api/user/profile", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          const updatedInfo = {
            ...sellerInfo,
            name: data.name,
            email: data.email,
            role: data.role || "Seller",
          };
          setSellerInfo(updatedInfo);
          setTempData(updatedInfo);
        }
      } catch (error) {
        console.error("Profile fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTempData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveClick = async () => {
    // এখানে আপনার ডাটা আপডেট করার জন্য PATCH/PUT রিকোয়েস্ট পাঠাতে পারেন
    setSellerInfo({ ...tempData });
    setIsEditing(false);
    alert("Profile Updated Successfully!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050a08] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-500"></div>
      </div>
    );
  }

  const firstLetter = sellerInfo.name ? sellerInfo.name.charAt(0).toUpperCase() : "S";

  return (
    <div className="p-4 sm:p-6 lg:p-10 min-h-screen bg-[#050a08] text-slate-200">
      
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-white">
            Seller <span className="text-emerald-500">Account</span>
          </h1>
          <div className="h-1 w-12 bg-emerald-500 mt-1 rounded-full"></div>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
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
        
        {/* Left Side (Avatar Card) */}
        <div className="lg:col-span-4 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0a120f] border border-emerald-900/20 rounded-[40px] p-8 text-center relative shadow-2xl"
          >
            <div className="relative w-32 h-32 mx-auto mb-6">
              <div className="w-full h-full rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center text-5xl font-black text-emerald-500 italic">
                {firstLetter}
              </div>
            </div>
            
            <h2 className="text-2xl font-black italic uppercase tracking-tight text-white mb-1 truncate">
              {sellerInfo.name}
            </h2>
            
            <div className="flex items-center justify-center gap-2 text-emerald-500/80 mb-6 font-bold uppercase text-[10px] tracking-[0.2em]">
              <BadgeCheck size={14} /> {sellerInfo.role}
            </div>

            <div className="grid grid-cols-2 gap-px bg-emerald-900/10 border-t border-emerald-900/20 -mx-8 -mb-8">
              <div className="p-6 text-center">
                <p className="text-[8px] font-black uppercase text-emerald-700 tracking-widest mb-1">Total Sales</p>
                <p className="text-xl font-black text-white italic">{sellerInfo.totalSales}</p>
              </div>
              <div className="p-6 border-l border-emerald-900/10 text-center">
                <p className="text-[8px] font-black uppercase text-emerald-700 tracking-widest mb-1">Rating</p>
                <p className="text-xl font-black text-white italic">{sellerInfo.rating}</p>
              </div>
            </div>
          </motion.div>

          <div className="bg-emerald-950/20 border border-emerald-900/20 rounded-[32px] p-6 space-y-5 shadow-inner">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500"><ShieldCheck size={20}/></div>
                <div>
                  <p className="text-[8px] font-black text-emerald-800 uppercase tracking-[0.2em]">Status</p>
                  <p className="text-sm font-bold text-emerald-500 uppercase italic">Verified Seller</p>
                </div>
             </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="lg:col-span-8">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#0a120f] border border-emerald-900/20 rounded-[40px] p-6 md:p-10 shadow-2xl"
          >
            <h3 className="text-xl font-black italic uppercase tracking-tight text-white mb-10 border-l-4 border-emerald-500 pl-4">
              Profile <span className="text-emerald-500">Details</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-emerald-800 tracking-widest ml-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-900" size={18} />
                  <input 
                    type="text" name="name"
                    value={isEditing ? tempData.name : sellerInfo.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full bg-[#050a08] border rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white outline-none transition-all 
                      ${isEditing ? 'border-emerald-500/40 focus:border-emerald-500' : 'border-white/5 opacity-50 cursor-not-allowed'}`}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-emerald-800 tracking-widest ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-900" size={18} />
                  <input 
                    type="email" 
                    value={sellerInfo.email}
                    disabled
                    className="w-full bg-[#050a08] border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white opacity-50 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-emerald-800 tracking-widest ml-1">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-900" size={18} />
                  <input 
                    type="text" name="phone"
                    value={isEditing ? tempData.phone : sellerInfo.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full bg-[#050a08] border rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white outline-none transition-all 
                      ${isEditing ? 'border-emerald-500/40 focus:border-emerald-500' : 'border-white/5 opacity-50 cursor-not-allowed'}`}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase text-emerald-800 tracking-widest ml-1">Address</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-900" size={18} />
                  <input 
                    type="text" name="address"
                    value={isEditing ? tempData.address : sellerInfo.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full bg-[#050a08] border rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-white outline-none transition-all 
                      ${isEditing ? 'border-emerald-500/40 focus:border-emerald-500' : 'border-white/5 opacity-50 cursor-not-allowed'}`}
                  />
                </div>
              </div>
            </div>

            {isEditing && (
              <motion.button 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleSaveClick}
                className="w-full mt-12 bg-emerald-600 hover:bg-emerald-500 text-white py-5 rounded-3xl font-black uppercase text-[12px] tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-lg shadow-emerald-500/20"
              >
                <Save size={20} /> Save Changes
              </motion.button>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}