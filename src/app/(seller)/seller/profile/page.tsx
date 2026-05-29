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
      toast.error("সেশন শেষ হয়ে গেছে, আবার লগইন করুন।");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfileData();
  }, []);

  const handleCancel = () => {
    setTempData({ ...sellerInfo });
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!tempData.name.trim()) {
      toast.error("নামের ফিল্ডটি খালি রাখা যাবে না");
      return;
    }

    setUpdating(true);
    const toastId = toast.loading("তথ্য আপডেট হচ্ছে...");
    try {
      if ("updateProfile" in api.auth) {
        await (api.auth as any).updateProfile(tempData);
      } else {
        await fetch("https://storemedistore.onrender.com/api/auth/profile", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")?.replace(/['"]+/g, '')}`
          },
          body: JSON.stringify(tempData)
        });
      }

      const currentUserStr = localStorage.getItem("medistore_user");
      if (currentUserStr) {
        const currentUser = JSON.parse(currentUserStr);
        const updatedUser = { ...currentUser, ...tempData };
        localStorage.setItem("medistore_user", JSON.stringify(updatedUser));
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
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center text-slate-800 font-black text-xs uppercase tracking-widest gap-2">
        <Loader2 className="animate-spin text-emerald-600" size={20} />
        Checking Profile Access...
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-10 min-h-screen bg-slate-50 font-sans text-slate-900">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-8 md:mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 uppercase tracking-tight">
              My <span className="text-emerald-600">Account</span>
            </h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">Manage your identity and details</p>
          </div>
          
          {!isEditing ? (
            <button 
              onClick={() => setIsEditing(true)} 
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all shadow-md shadow-emerald-100"
            >
              <Edit3 size={15} /> Edit Profile
            </button>
          ) : (
            <button 
              onClick={handleCancel} 
              className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider hover:bg-slate-50 transition-all shadow-sm"
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
              className="bg-white border border-slate-200 rounded-[32px] p-8 text-center shadow-sm h-fit sticky top-6"
            >
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="w-full h-full bg-emerald-50 border border-emerald-200 rounded-3xl flex items-center justify-center text-3xl font-black text-emerald-600 shadow-sm uppercase">
                  {sellerInfo.name ? sellerInfo.name.charAt(0) : "M"}
                </div>
                <div className="absolute -bottom-1 -right-1 bg-white p-0.5 rounded-full shadow-sm">
                  <BadgeCheck size={24} className="text-emerald-500 fill-emerald-100" />
                </div>
              </div>
              
              <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight truncate">
                {sellerInfo.name || "MediStore User"}
              </h2>
              <p className="text-slate-400 text-[10px] font-bold mt-1">
                {sellerInfo.email}
              </p>
              
              <div className="inline-flex items-center gap-1.5 text-emerald-600 bg-emerald-50 px-4 py-1.5 rounded-xl mt-6 border border-emerald-100">
                <span className="text-[9px] font-black uppercase tracking-widest">{sellerInfo.role} Access</span>
              </div>
            </motion.div>
          </div>

          {/* Right Form Details */}
          <div className="lg:col-span-8">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white border border-slate-200 rounded-[32px] p-6 md:p-8 shadow-sm"
            >
              <div className="space-y-6">
                
                {/* Name Input */}
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Full Name</label>
                  <div className="relative">
                    <User className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isEditing ? 'text-emerald-600' : 'text-slate-300'}`} size={18} />
                    <input 
                      type="text"
                      disabled={!isEditing}
                      value={isEditing ? tempData.name : sellerInfo.name}
                      onChange={(e) => setTempData({...tempData, name: e.target.value})}
                      placeholder="Enter your full name"
                      className={`w-full py-4 pl-12 pr-4 rounded-2xl text-sm font-bold outline-none transition-all ${isEditing ? 'bg-white border border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-slate-900' : 'bg-slate-50 border border-slate-100 text-slate-500 cursor-not-allowed'}`}
                    />
                  </div>
                </div>

                {/* Email Input */}
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
                      <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 ${isEditing ? 'text-emerald-600' : 'text-slate-300'}`} size={18} />
                      <input 
                        type="text"
                        disabled={!isEditing}
                        value={isEditing ? tempData.phone : sellerInfo.phone || "Not set yet"}
                        onChange={(e) => setTempData({...tempData, phone: e.target.value})}
                        placeholder="Add phone number"
                        className={`w-full py-4 pl-12 pr-4 rounded-2xl text-sm font-bold outline-none transition-all ${isEditing ? 'bg-white border border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-slate-900' : 'bg-slate-50 border border-slate-100 text-slate-500'}`}
                      />
                    </div>
                  </div>

                  {/* Address Input */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Store / Home Address</label>
                    <div className="relative">
                      <MapPin className={`absolute left-4 top-1/2 -translate-y-1/2 ${isEditing ? 'text-emerald-600' : 'text-slate-300'}`} size={18} />
                      <input 
                        type="text"
                        disabled={!isEditing}
                        value={isEditing ? tempData.address : sellerInfo.address || "Not set yet"}
                        onChange={(e) => setTempData({...tempData, address: e.target.value})}
                        placeholder="Add your address"
                        className={`w-full py-4 pl-12 pr-4 rounded-2xl text-sm font-bold outline-none transition-all ${isEditing ? 'bg-white border border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 text-slate-900' : 'bg-slate-50 border border-slate-100 text-slate-500'}`}
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
                    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white py-4 mt-4 rounded-2xl font-black uppercase text-xs tracking-widest shadow-md shadow-emerald-100 transition-all flex items-center justify-center gap-3"
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