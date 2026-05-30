"use client";

import { useState, useEffect } from "react";
import { User, Mail, Phone, MapPin, Loader2, Save, X, Edit3 } from "lucide-react";
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
    name: "", email: "", phone: "", address: "", role: "Seller"
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
      const user = data.user || data.data || data;

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

  useEffect(() => { loadProfileData(); }, []);

  const handleSave = async () => {
    setUpdating(true);
    const toastId = toast.loading("আপডেট হচ্ছে...");
    try {
      const token = localStorage.getItem("token")?.replace(/['"]+/g, '');
      const res = await fetch(`${API_BASE}/auth/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(tempData)
      });

      if (!res.ok) throw new Error("আপডেট ব্যর্থ হয়েছে");

      setSellerInfo(tempData);
      setIsEditing(false);
      toast.success("প্রোফাইল আপডেট হয়েছে!", { id: toastId });
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
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-800">My Account</h1>
            <p className="text-slate-500">Manage your personal information</p>
          </div>
          <button 
            onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${isEditing ? "bg-emerald-600 text-white" : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"}`}
          >
            {isEditing ? (updating ? <Loader2 className="animate-spin" size={18}/> : <Save size={18}/>) : <Edit3 size={18}/>}
            {isEditing ? "Save Changes" : "Edit Profile"}
          </button>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="grid md:grid-cols-2 gap-8">
            {[ 
              { label: "Full Name", key: "name", icon: User },
              { label: "Email Address", key: "email", icon: Mail, disabled: true },
              { label: "Phone Number", key: "phone", icon: Phone },
              { label: "Delivery Address", key: "address", icon: MapPin }
            ].map((field) => (
              <div key={field.key}>
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <field.icon size={14} /> {field.label}
                </label>
                <input 
                  disabled={!isEditing || field.disabled}
                  className={`w-full p-4 rounded-xl border ${isEditing && !field.disabled ? "bg-white border-emerald-200 ring-2 ring-emerald-50" : "bg-slate-50 border-slate-200"} transition-all`}
                  value={isEditing ? (tempData as any)[field.key] : (sellerInfo as any)[field.key]}
                  onChange={e => setTempData({...tempData, [field.key]: e.target.value})}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}