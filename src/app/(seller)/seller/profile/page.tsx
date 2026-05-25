"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  User, Mail, Phone, MapPin, Edit3, Save, BadgeCheck, X, Loader2 
} from "lucide-react";
import { api } from "@/lib/api"; 
import { toast } from "react-hot-toast";

interface SellerData {
  name: string;
  email: string;
  phone: string;
  address: string;
  role: string;
}

export default function SellerProfile() {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [updating, setUpdating] = useState(false);
  
  const [sellerInfo, setSellerInfo] = useState<SellerData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    role: "Seller"
  });

  const [tempData, setTempData] = useState<SellerData>({ ...sellerInfo });

  // প্রোফাইল ডাটা লোড করার ফাংশন
  const loadProfileData = async () => {
    try {
      setLoading(true);
      const response = await api.auth.getMe(); 
      const user = response?.data || response;

      if (user) {
        const fetchedData = {
          name: user.name || "MediStore Seller",
          email: user.email || "",
          phone: user.phone && user.phone !== "Not set yet" ? user.phone : "",
          address: user.address && user.address !== "Not set yet" ? user.address : "",
          role: user.role || "Seller"
        };
        setSellerInfo(fetchedData);
        setTempData(fetchedData);
      }
    } catch (error: any) {
      console.error("Profile load error:", error);
      toast.error("সেশন শেষ হয়ে গেছে অথবা সার্ভারে সমস্যা, আবার লগইন করুন।");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfileData();
  }, []);

  // এডিট মোড ক্যান্সেল করলে ডাটা আগের অবস্থায় ফিরিয়ে নেওয়া
  const handleCancel = () => {
    setTempData({ ...sellerInfo });
    setIsEditing(false);
  };

  // ডাটাবেজে তথ্য সেভ করার ফাংশন
  const handleSave = async () => {
    if (!tempData.name.trim()) {
      toast.error("নামের ফিল্ডটি খালি রাখা যাবে না");
      return;
    }

    setUpdating(true);
    const toastId = toast.loading("তথ্য আপডেট হচ্ছে...");
    try {
      // 🛡️ টাইপস্ক্রিপ্ট সেফ অবজেক্ট আপডেট হ্যান্ডলিং
      if ("updateProfile" in api.auth) {
        await (api.auth as any).updateProfile(tempData);
      } else {
        // যদি নির্দিষ্ট এন্ডপয়েন্ট না থাকে তবে সাধারণ প্যাচ রিকোয়েস্ট ব্যাকআপ লজিক
        await fetch("https://storemedistore.onrender.com/api/auth/profile", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")?.replace(/['"]+/g, '')}`
          },
          body: JSON.stringify(tempData)
        });
      }

      setSellerInfo(tempData);
      setIsEditing(false);
      toast.success("প্রোফাইল আপডেট সফল হয়েছে!", { id: toastId });
    } catch (error: any) {
      toast.error(error?.message || "আপডেট করা সম্ভব হয়নি", { id: toastId });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020d0a] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-[#008249] mb-4" size={40} />
        <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500/60 animate-pulse">Syncing Profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020d0a] bg-[radial-gradient(circle_at_top_right,_#062d24,_#020d0a)] text-white p-4 md:p-10 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter leading-none">
              My <span className="text-[#008249]">Account</span>
            </h1>
            <p className="text-[10px] font-bold text-emerald-500/40 uppercase tracking-[0.3em] mt-3">Manage your identity and details</p>
          </div>
          
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)} 
              className="flex items-center gap-2 bg-[#008249] hover:bg-[#006633] text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-lg shadow-[#008249]/10"
            >
              <Edit3 size={15} /> Edit Profile
            </button>
          ) : (
            <button 
              onClick={handleCancel} 
              className="flex items-center gap-2 bg-white/5 border border-white/10 text-slate-300 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider hover:bg-white/10 transition-all"
            >
              <X size={15} /> Cancel
            </button>
          )}
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Left Avatar Card */}
          <div className="lg:col-span-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/[0.02] border border-white/5 rounded-[32px] p-10 text-center shadow-2xl backdrop-blur-md h-fit sticky top-6"
            >
              <div className="relative w-28 h-28 mx-auto mb-6">
                <div className="w-full h-full bg-[#008249]/10 border-2 border-[#008249]/30 rounded-[40%] flex items-center justify-center text-4xl font-black text-[#008249] italic uppercase shadow-[0_0_30px_rgba(0,130,73,0.15)]">
                  {sellerInfo.name ? sellerInfo.name.charAt(0) : "M"}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-[#020d0a] p-1 rounded-full border border-white/5">
                  {/* 🎯 এখানে সিঙ্গেল className মিক্স করে ফিক্স করা হয়েছে */}
                  <BadgeCheck size={26} fill="currentColor" className="text-[#020d0a] fill-[#008249] text-emerald-500" />
                </div>
              </div>
              
              <h2 className="text-xl font-black italic uppercase tracking-tight truncate text-slate-100">
                {sellerInfo.name || "MediStore User"}
              </h2>
              <p className="text-emerald-500/50 text-[10px] font-black uppercase tracking-widest mt-2">
                {sellerInfo.email}
              </p>
              
              <div className="inline-flex items-center gap-1.5 text-[#008249] bg-[#008249]/10 px-5 py-2 rounded-xl mt-6 border border-[#008249]/20">
                <span className="text-[10px] font-black uppercase tracking-widest">{sellerInfo.role} Access</span>
              </div>
            </motion.div>
          </div>

          {/* Right Form Details */}
          <div className="lg:col-span-8">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/[0.02] border border-white/5 rounded-[32px] p-6 md:p-10 shadow-2xl backdrop-blur-md"
            >
              <div className="space-y-6">
                
                {/* Name Input */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-emerald-500/40 tracking-widest ml-1">Full Name</label>
                  <div className="relative">
                    <User className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isEditing ? 'text-[#008249]' : 'text-white/20'}`} size={18} />
                    <input 
                      type="text"
                      disabled={!isEditing}
                      value={isEditing ? tempData.name : sellerInfo.name}
                      onChange={(e) => setTempData({...tempData, name: e.target.value})}
                      placeholder="Enter your full name"
                      className={`w-full py-4 pl-12 pr-4 rounded-2xl text-sm font-bold outline-none transition-all ${isEditing ? 'bg-white/5 border border-[#008249]/50 focus:ring-4 focus:ring-[#008249]/10 text-white' : 'bg-white/[0.01] border border-white/5 text-slate-400 cursor-not-allowed'}`}
                    />
                  </div>
                </div>

                {/* Email Input - Read Only */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-emerald-500/40 tracking-widest ml-1">Email Address (Read Only)</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                    <input 
                      type="email"
                      disabled
                      value={sellerInfo.email}
                      className="w-full py-4 pl-12 pr-4 rounded-2xl text-sm font-bold bg-white/[0.005] border border-white/5 text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Phone and Address Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Phone Input */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-emerald-500/40 tracking-widest ml-1">Phone Number</label>
                    <div className="relative">
                      <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 ${isEditing ? 'text-[#008249]' : 'text-white/20'}`} size={18} />
                      <input 
                        type="text"
                        disabled={!isEditing}
                        value={isEditing ? tempData.phone : sellerInfo.phone || "Not set yet"}
                        onChange={(e) => setTempData({...tempData, phone: e.target.value})}
                        placeholder="Add phone number"
                        className={`w-full py-4 pl-12 pr-4 rounded-2xl text-sm font-bold outline-none transition-all ${isEditing ? 'bg-white/5 border border-[#008249]/50 focus:ring-4 focus:ring-[#008249]/10 text-white' : 'bg-white/[0.01] border border-white/5 text-slate-400'}`}
                      />
                    </div>
                  </div>

                  {/* Address Input */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-emerald-500/40 tracking-widest ml-1">Store / Home Address</label>
                    <div className="relative">
                      <MapPin className={`absolute left-4 top-1/2 -translate-y-1/2 ${isEditing ? 'text-[#008249]' : 'text-white/20'}`} size={18} />
                      <input 
                        type="text"
                        disabled={!isEditing}
                        value={isEditing ? tempData.address : sellerInfo.address || "Not set yet"}
                        onChange={(e) => setTempData({...tempData, address: e.target.value})}
                        placeholder="Add your address"
                        className={`w-full py-4 pl-12 pr-4 rounded-2xl text-sm font-bold outline-none transition-all ${isEditing ? 'bg-white/5 border border-[#008249]/50 focus:ring-4 focus:ring-[#008249]/10 text-white' : 'bg-white/[0.01] border border-white/5 text-slate-400'}`}
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                {isEditing && (
                  <motion.button 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={handleSave}
                    disabled={updating}
                    className="w-full bg-[#008249] hover:bg-[#006633] disabled:opacity-50 text-white py-4 mt-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-[#008249]/10 transition-all flex items-center justify-center gap-3"
                  >
                    {updating ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                    Save Changes
                  </motion.button>
                )}
              </div>
            </motion.div>
          </div>
          
        </div>
      </div>
    </div>
  );
}