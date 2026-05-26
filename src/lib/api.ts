"use client";

// ১. শেষে একটি স্ল্যাশ (/) নিশ্চিত করা হয়েছে যাতে এন্ডপয়েন্টের সাথে জোড়া লাগলে ইউআরএল না ভাঙে
const BASE_URL = "https://storemedistore.onrender.com/api";

const getCleanToken = () => {
  if (typeof window === "undefined") return null;
  
  // প্রথমে সরাসরি "token" কী দিয়ে চেক করবে
  let token = localStorage.getItem("token");
  
  // যদি সরাসরি না পায়, তবে "medistore_user" অবজেক্টের ভেতর থেকে টোকেন খোঁজার চেষ্টা করবে
  if (!token) {
    const userStr = localStorage.getItem("medistore_user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        token = user.token || user.accessToken || null;
      } catch (e) {
        console.error("Error parsing medistore_user for token", e);
      }
    }
  }
  
  if (!token) return null;
  
  // কোটেশন মার্ক ক্লিনিং লজিক (আপনার আগেরটাই অক্ষুণ্ণ রাখা হয়েছে)
  return token.replace(/^"|"$/g, '').replace(/['"]+/g, '');
};

const fetcher = async (endpoint: string, options: RequestInit = {}, isFormData = false) => {
  const token = getCleanToken();
  const headers = new Headers(options.headers || {});
  
  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  // এন্ডপয়েন্টের শুরুতে স্লাশ না থাকলে স্লাশসহ ইউআরএল ফরম্যাট করবে সেফটি চেকের জন্য
  const formattedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const fullUrl = `${BASE_URL}${formattedEndpoint}`;

  const res = await fetch(fullUrl, { ...options, headers });
  
  if (res.status === 401) { 
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("medistore_user"); // দুটিই ক্লিন করবে সেফটির জন্য
    } 
    throw new Error("Unauthorized"); 
  }
  
  if (!res.ok) { 
    const err = await res.json().catch(() => ({})); 
    throw new Error(err.message || "API failed"); 
  }
  
  return res.json();
};

export const api = {
  auth: { 
    login: async (data: any) => { 
      const res = await fetcher("/auth/login", { method: "POST", body: JSON.stringify(data) }); 
      if (res.token) {
        localStorage.setItem("token", res.token); 
      }
      return res; 
    },
    getMe: () => fetcher("/auth/me"),
    updateProfile: (data: any) => fetcher("/auth/profile", { method: "PATCH", body: JSON.stringify(data) })
  },
  orders: {
    create: (data: any) => fetcher("/orders", { method: "POST", body: JSON.stringify(data) }),
    getAllOrders: () => fetcher("/seller/orders"),
    getMyOrders: () => fetcher("/orders/my-orders"),
    getOrderById: (id: string) => fetcher(`/orders/${id}`),
    updateStatus: (id: string, status: string) => fetcher(`/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  },
  medicines: { 
    getAll: () => fetcher("/medicines"),
    getById: (id: string) => fetcher(`/medicines/${id}`)
  },
  seller: {
    addMedicine: (data: FormData) => fetcher("/seller/medicines", { method: "POST", body: data }, true),
    updateMedicine: (id: string, data: FormData) => fetcher(`/seller/medicines/${id}`, { method: "PATCH", body: data }, true),
    deleteMedicine: (id: string) => fetcher(`/seller/medicines/${id}`, { method: "DELETE" }),
  }
} as const;