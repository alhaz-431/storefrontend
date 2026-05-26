"use client";

// 🎯 বেস ইউআরএল (অ্যাসাইনমেন্টের নিয়ম অনুযায়ী /v1 ছাড়া ক্লিন রাখা হয়েছে)
const BASE_URL = "https://storemedistore.onrender.com/api";

const getCleanToken = () => {
  if (typeof window === "undefined") return null;
  
  let token = localStorage.getItem("token");
  
  if (!token) {
    const userStr = localStorage.getItem("medistore_user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        token = user.token || user.accessToken || null;
      } catch (e) {
        console.error("Error parsing medistore_user:", e);
      }
    }
  }
  
  if (!token) return null;
  
  // ডাবল বা সিঙ্গেল কোটেশন এবং এক্সট্রা স্পেস ক্লিনিং লজিক
  let cleanToken = String(token).trim();
  if (cleanToken.startsWith('"') && cleanToken.endsWith('"')) {
    cleanToken = cleanToken.slice(1, -1);
  }
  if (cleanToken.startsWith("'") && cleanToken.endsWith("'")) {
    cleanToken = cleanToken.slice(1, -1);
  }
  
  return cleanToken;
};

const fetcher = async (
  endpoint: string,
  options: RequestInit = {},
  isFormData = false
) => {
  const token = getCleanToken();
  const headers = new Headers(options.headers || {});
  
  // যদি FormData না হয়, শুধু তখনই Content-Type JSON সেট হবে
  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const formattedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const fullUrl = `${BASE_URL}${formattedEndpoint}`;

  console.log(`📡 API Call: ${options.method || "GET"} ${fullUrl}`);

  const res = await fetch(fullUrl, { ...options, headers });
  
  // টোকেন এক্সপায়ারড বা ইনভ্যালিড হলে অটো-লগআউট ও ক্লিনআপ
  if (res.status === 401) { 
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("medistore_user"); 
    } 
    throw new Error("Unauthorized: Please login again"); 
  }
  
  if (!res.ok) { 
    const err = await res.json().catch(() => ({})); 
    throw new Error(err.error || err.message || `API Error: ${res.status}`); 
  }
  
  return res.json();
};

export const api = {
  // ✅ Authentication
  auth: { 
    login: async (data: any) => { 
      const res = await fetcher("/auth/login", { 
        method: "POST", 
        body: JSON.stringify(data) 
      }); 
      if (res.token) {
        localStorage.setItem("token", res.token); 
      }
      return res; 
    },
    register: (data: any) => fetcher("/auth/register", { 
      method: "POST", 
      body: JSON.stringify(data) 
    }),
    getMe: () => fetcher("/auth/me"),
    updateProfile: (data: any) => fetcher("/auth/profile", { 
      method: "PATCH", 
      body: JSON.stringify(data) 
    }),
  },

  // ✅ Medicines (Public + Seller/Admin Management)
  medicines: { 
    getAll: () => fetcher("/medicines"),
    getById: (id: string) => fetcher(`/medicines/${id}`),
    
    // 📸 সেলার বা অ্যাডমিন ইমেজসহ আপলোড করবে তাই FormData এবং ৩ নম্বর প্যারামিটার true দেওয়া হয়েছে
    create: (data: FormData) => fetcher("/medicines/add", { 
      method: "POST", 
      body: data 
    }, true),
    
    update: (id: string, data: FormData) => fetcher(`/medicines/${id}`, { 
      method: "PATCH", 
      body: data 
    }, true),
    
    delete: (id: string) => fetcher(`/medicines/${id}`, { 
      method: "DELETE" 
    }),
  },

  // ✅ Categories
  categories: {
    getAll: () => fetcher("/medicines/categories"),
  },

  // ✅ Orders (Customer Specific)
  orders: {
    create: (data: any) => fetcher("/orders", { 
      method: "POST", 
      body: JSON.stringify(data) 
    }),
    getAll: () => fetcher("/orders"), // সব অর্ডার দেখার জন্য (যদি প্রয়োজন হয়)
    getMyOrders: () => fetcher("/orders/my-orders"), // 👈 কাস্টমারের নিজস্ব অর্ডার দেখার জন্য সেফ রুট
    getById: (id: string) => fetcher(`/orders/${id}`),
    cancel: (id: string) => fetcher(`/orders/${id}/cancel`, { 
      method: "PATCH" 
    }),
  },

  // ✅ Seller Panel
  seller: {
    getOrders: () => fetcher("/seller/orders"),
    updateOrderStatus: (id: string, status: string) => fetcher(`/seller/orders/${id}/status`, { 
      method: "PATCH", 
      body: JSON.stringify({ status }) 
    }),
  },

  // ✅ Admin Panel
  admin: {
    getAllUsers: () => fetcher("/admin/users"),
    updateUserStatus: (id: string, isActive: boolean) => fetcher(`/admin/users/${id}`, { 
      method: "PATCH", 
      body: JSON.stringify({ isActive }) 
    }),
    getAllOrders: () => fetcher("/admin/orders"),
    getStatistics: () => fetcher("/admin/statistics"),
  },
} as const;