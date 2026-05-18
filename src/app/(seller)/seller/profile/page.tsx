"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { 
  User, Mail, Phone, MapPin, Edit3, Save, BadgeCheck, X, Loader2 
} from "lucide-react";
import { api } from "@/lib/api"; 
import { toast } from "react-hot-toast";

export default function SellerProfile() {
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  
  const [sellerInfo, setSellerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    role: "Seller"
  });

  const [tempData, setTempData] = useState({ ...sellerInfo });

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

  // এডিট মোড ক্যান্সেল করলে ডাটা আগের অবস্থায় ফিরিয়ে নেওয়া
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

    const toastId = toast.loading("তথ্য আপডেট হচ্ছে...");
    try {
      // 🛠️ টাইপস্ক্রিপ্ট এরর এড়াতে 'as any' কাস্টিং ব্যবহার করা হয়েছে
      await (api.auth as any).updateProfile(tempData);

      setSellerInfo(tempData);
      setIsEditing(false);
      toast.success("প্রোফাইল আপডেট সফল হয়েছে!", { id: toastId });
    } catch (error: any) {
      toast.error(error?.message || "আপডেট করা সম্ভব হয়নি", { id: toastId });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing Profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-10">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tight">
              My <span className="text-indigo-600">Account</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Manage your identity and details</p>
          </div>
          
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)} 
              className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
            >
              <Edit3 size={16} /> Edit Profile
            </button>
          ) : (
            <button 
              onClick={handleCancel} 
              className="flex items-center gap-2 bg-white text-slate-500 border border-slate-200 px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider hover:bg-slate-50 transition-all"
            >
              <X size={16} /> Cancel
            </button>
          )}
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left Avatar Card */}
          <div className="lg:col-span-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-slate-200 rounded-[32px] p-10 text-center shadow-sm h-fit sticky top-6"
            >
              <div className="relative w-28 h-28 mx-auto mb-6">
                <div className="w-full h-full bg-indigo-50 border-2 border-indigo-100 rounded-[40%] flex items-center justify-center text-4xl font-black text-indigo-600 italic uppercase">
                  {sellerInfo.name ? sellerInfo.name.charAt(0) : "M"}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-full shadow-md border border-slate-100">
                   <BadgeCheck className="text-emerald-500" size={24} />
                </div>
              </div>
              
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight truncate">
                {sellerInfo.name || "MediStore User"}
              </h2>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1">
                {sellerInfo.email}
              </p>
              
              <div className="inline-flex items-center gap-1.5 text-indigo-600 bg-indigo-50 px-4 py-2 rounded-xl mt-6 border border-indigo-100">
                <span className="text-[10px] font-black uppercase tracking-widest">{sellerInfo.role} Access</span>
              </div>
            </motion.div>
          </div>

          {/* Right Form Details */}
          <div className="lg:col-span-8">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white border border-slate-200 rounded-[32px] p-6 md:p-10 shadow-sm"
            >
              <div className="space-y-8">
                {/* Name Input */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Full Name</label>
                  <div className="relative group">
                    <User className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isEditing ? 'text-indigo-600' : 'text-slate-300'}`} size={18} />
                    <input 
                      type="text"
                      disabled={!isEditing}
                      value={isEditing ? tempData.name : sellerInfo.name}
                      onChange={(e) => setTempData({...tempData, name: e.target.value})}
                      placeholder="Enter your full name"
                      className={`w-full py-4 pl-12 pr-4 rounded-2xl text-sm font-bold outline-none transition-all ${isEditing ? 'bg-white border border-indigo-200 focus:ring-4 focus:ring-indigo-50 shadow-sm' : 'bg-slate-50 border-transparent text-slate-500 cursor-not-allowed'}`}
                    />
                  </div>
                </div>

                {/* Email Input - Read Only */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Email Address (Read Only)</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input 
                      type="email"
                      disabled
                      value={sellerInfo.email}
                      className="w-full py-4 pl-12 pr-4 rounded-2xl text-sm font-bold bg-slate-50 border border-slate-100 text-slate-400 cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Phone and Address Grid */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Phone Input */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Phone Number</label>
                    <div className="relative">
                      <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 ${isEditing ? 'text-indigo-600' : 'text-slate-300'}`} size={18} />
                      <input 
                        type="text"
                        disabled={!isEditing}
                        value={isEditing ? tempData.phone : sellerInfo.phone || "Not set yet"}
                        onChange={(e) => setTempData({...tempData, phone: e.target.value})}
                        placeholder="Add phone number"
                        className={`w-full py-4 pl-12 pr-4 rounded-2xl text-sm font-bold outline-none transition-all ${isEditing ? 'bg-white border border-indigo-200 focus:ring-4 focus:ring-indigo-50 shadow-sm' : 'bg-slate-50 border-transparent text-slate-500'}`}
                      />
                    </div>
                  </div>

                  {/* Address Input */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Store/Home Address</label>
                    <div className="relative">
                      <MapPin className={`absolute left-4 top-1/2 -translate-y-1/2 ${isEditing ? 'text-indigo-600' : 'text-slate-300'}`} size={18} />
                      <input 
                        type="text"
                        disabled={!isEditing}
                        value={isEditing ? tempData.address : sellerInfo.address || "Not set yet"}
                        onChange={(e) => setTempData({...tempData, address: e.target.value})}
                        placeholder="Add your address"
                        className={`w-full py-4 pl-12 pr-4 rounded-2xl text-sm font-bold outline-none transition-all ${isEditing ? 'bg-white border border-indigo-200 focus:ring-4 focus:ring-indigo-50 shadow-sm' : 'bg-slate-50 border-transparent text-slate-500'}`}
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                {isEditing && (
                  <motion.button 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    onClick={handleSave}
                    className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3"
                  >
                    <Save size={18} /> Save Changes
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