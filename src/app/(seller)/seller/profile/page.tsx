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

  // ✅ ডাটাবেস থেকে অরিজিনাল রেজিস্ট্রেশন ডেটা আনা
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setLoading(true);
        // api.ts থেকে getMe মেথড কল করা হচ্ছে
        const response = await api.auth.getMe(); 
        
        // ব্যাকএন্ড যদি সরাসরি ডেটা পাঠায় অথবা .data এর ভেতর পাঠায়
        const user = response?.data || response;

        if (user) {
          const fetchedData = {
            name: user.name || "MediStore User", // রেজিস্ট্রেশনের নাম
            email: user.email || "",             // রেজিস্ট্রেশনের ইমেইল
            phone: user.phone || "Not set yet",
            address: user.address || "Not set yet",
            role: user.role || "Seller"
          };
          setSellerInfo(fetchedData);
          setTempData(fetchedData);
        }
      } catch (error: any) {
        console.error("Profile Load Error:", error);
        // টোকেন না থাকলে বা এরর হলে ইউজারকে জানানো
        toast.error("সেশন শেষ হয়ে গেছে, আবার লগইন করুন।");
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, []);

  const handleSave = async () => {
    const toastId = toast.loading("তথ্য আপডেট হচ্ছে...");
    try {
      // এখানে আপনার এডিট করা ডেটা ব্যাকএন্ডে পাঠানোর জন্য PATCH রিকোয়েস্ট দিতে পারেন
      // await api.user.updateProfile(tempData);
      
      setSellerInfo(tempData);
      setIsEditing(false);
      toast.success("প্রোফাইল আপডেট সফল হয়েছে!", { id: toastId });
    } catch (error) {
      toast.error("আপডেট করা সম্ভব হয়নি", { id: toastId });
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600 mb-4" size={40} />
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Syncing Profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-black italic uppercase text-indigo-950 tracking-tighter">
            My <span className="text-indigo-600">Account</span>
          </h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Registration Details</p>
        </div>
        
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)} className="flex items-center gap-2 bg-indigo-900 text-white px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-800 transition-all shadow-lg shadow-indigo-900/20">
            <Edit3 size={16} /> Edit Profile
          </button>
        ) : (
          <button onClick={() => setIsEditing(false)} className="flex items-center gap-2 bg-slate-100 text-slate-600 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all">
            <X size={16} /> Cancel
          </button>
        )}
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Avatar Card */}
        <div className="lg:col-span-4">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white border border-slate-200 rounded-[40px] p-8 text-center shadow-sm h-fit sticky top-6"
          >
            <div className="w-24 h-24 bg-indigo-50 border-2 border-indigo-100 rounded-[35%] mx-auto mb-4 flex items-center justify-center text-4xl font-black text-indigo-600 italic shadow-inner">
              {sellerInfo.name?.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-xl font-black text-indigo-950 uppercase italic tracking-tight truncate">{sellerInfo.name}</h2>
            <div className="flex items-center justify-center gap-1.5 text-indigo-500 bg-indigo-50 px-3 py-1.5 rounded-full mt-3">
              <BadgeCheck size={14} />
              <span className="text-[9px] font-black uppercase tracking-widest">{sellerInfo.role}</span>
            </div>
          </motion.div>
        </div>

        {/* Form Details */}
        <div className="lg:col-span-8">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white border border-slate-200 rounded-[40px] p-6 md:p-10 shadow-sm"
          >
            <div className="space-y-8">
              {/* Name */}
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Full Name (Registered)</label>
                <div className="relative mt-2 group">
                  <User className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isEditing ? 'text-indigo-500' : 'text-slate-300'}`} size={18} />
                  <input 
                    type="text"
                    disabled={!isEditing}
                    value={isEditing ? tempData.name : sellerInfo.name}
                    onChange={(e) => setTempData({...tempData, name: e.target.value})}
                    className={`w-full py-4 pl-12 pr-4 rounded-2xl text-sm font-bold outline-none transition-all ${isEditing ? 'bg-white border border-indigo-200 focus:border-indigo-600 shadow-sm' : 'bg-slate-50 border-transparent text-slate-500'}`}
                  />
                </div>
              </div>

              {/* Email - Read Only */}
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Email Address (Locked)</label>
                <div className="relative mt-2">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input 
                    type="email"
                    disabled
                    value={sellerInfo.email}
                    className="w-full py-4 pl-12 pr-4 rounded-2xl text-sm font-bold bg-slate-100 border-transparent text-slate-400 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Phone */}
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Phone Number</label>
                  <div className="relative mt-2">
                    <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 ${isEditing ? 'text-indigo-500' : 'text-slate-300'}`} size={18} />
                    <input 
                      type="text"
                      disabled={!isEditing}
                      value={isEditing ? tempData.phone : sellerInfo.phone}
                      onChange={(e) => setTempData({...tempData, phone: e.target.value})}
                      className={`w-full py-4 pl-12 pr-4 rounded-2xl text-sm font-bold outline-none transition-all ${isEditing ? 'bg-white border border-indigo-200 focus:border-indigo-600 shadow-sm' : 'bg-slate-50 border-transparent text-slate-500'}`}
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Address</label>
                  <div className="relative mt-2">
                    <MapPin className={`absolute left-4 top-1/2 -translate-y-1/2 ${isEditing ? 'text-indigo-500' : 'text-slate-300'}`} size={18} />
                    <input 
                      type="text"
                      disabled={!isEditing}
                      value={isEditing ? tempData.address : sellerInfo.address}
                      onChange={(e) => setTempData({...tempData, address: e.target.value})}
                      className={`w-full py-4 pl-12 pr-4 rounded-2xl text-sm font-bold outline-none transition-all ${isEditing ? 'bg-white border border-indigo-200 focus:border-indigo-600 shadow-sm' : 'bg-slate-50 border-transparent text-slate-500'}`}
                    />
                  </div>
                </div>
              </div>

              {isEditing && (
                <motion.button 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={handleSave}
                  className="w-full bg-indigo-600 text-white py-5 rounded-3xl font-black uppercase text-[12px] tracking-[0.2em] shadow-xl shadow-indigo-600/20 hover:bg-indigo-700 transition-all flex items-center justify-center gap-3"
                >
                  <Save size={20} /> Update Account Info
                </motion.button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}