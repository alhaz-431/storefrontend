"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Edit3, Save, Loader2 } from "lucide-react";
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

  const API_BASE = "https://storemedistore.onrender.com/api";

  const loadProfileData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token")?.replace(/['"]+/g, '');
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();
      const user = data.data || data;

      if (user) {
        const fetchedData = {
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          address: user.address || "",
          role: user.role || "Seller"
        };
        setSellerInfo(fetchedData);
        setTempData(fetchedData);
      }
    } catch (error) {
      toast.error("প্রোফাইল ডাটা লোড করা যায়নি।");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfileData();
  }, []);

  const handleSave = async () => {
    setUpdating(true);
    const toastId = toast.loading("আপডেট হচ্ছে...");
    try {
      const token = localStorage.getItem("token")?.replace(/['"]+/g, '');
      
      // যেহেতু ডাটাবেজে আপাতত শুধু 'name' আপডেট করার ফিল্ড আছে
      const payload = { name: tempData.name };

      const res = await fetch(`${API_BASE}/auth/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("আপডেট ব্যর্থ হয়েছে");

      setSellerInfo(tempData);
      setIsEditing(false);
      toast.success("সফলভাবে আপডেট হয়েছে!", { id: toastId });
    } catch (error) {
      toast.error("আপডেট করা সম্ভব হয়নি", { id: toastId });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="animate-spin text-emerald-600" size={30} />
    </div>
  );

  return (
    <div className="p-6 min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-black">MY <span className="text-emerald-600">ACCOUNT</span></h1>
          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className="bg-emerald-600 text-white px-6 py-2 rounded-xl font-bold transition hover:bg-emerald-700"
          >
            {isEditing ? (updating ? "Saving..." : "Save Changes") : "Edit Profile"}
          </button>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">Full Name</label>
              <input 
                disabled={!isEditing}
                className="w-full p-3 mt-1 bg-slate-50 rounded-xl border border-slate-200"
                value={isEditing ? tempData.name : sellerInfo.name}
                onChange={e => setTempData({...tempData, name: e.target.value})}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">Email</label>
              <input disabled className="w-full p-3 mt-1 bg-slate-100 rounded-xl border" value={sellerInfo.email} />
            </div>
            {/* Phone ও Address এর জন্য ডাটাবেজ আপডেট প্রয়োজন */}
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">Phone</label>
              <input disabled className="w-full p-3 mt-1 bg-slate-100 rounded-xl border" value={sellerInfo.phone || "N/A"} />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase">Address</label>
              <input disabled className="w-full p-3 mt-1 bg-slate-100 rounded-xl border" value={sellerInfo.address || "N/A"} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}