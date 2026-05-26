"use client";

const BASE_URL = "https://storemedistore.onrender.com/api";

const getCleanToken = () => {
  if (typeof window === "undefined") return null;
  
  let token = localStorage.getItem("token");
  
  if (!token) {
    const userStr = localStorage.getItem("medistore_user");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        token = user.token || null;
      } catch (e) {
        console.error("Error parsing user:", e);
      }
    }
  }
  
  if (!token) {
    console.warn("⚠️ No token found in localStorage");
    return null;
  }
  
  // Clean token
  let cleanToken = String(token).trim();
  if (cleanToken.startsWith('"') && cleanToken.endsWith('"')) {
    cleanToken = cleanToken.slice(1, -1);
  }
  if (cleanToken.startsWith("'") && cleanToken.endsWith("'")) {
    cleanToken = cleanToken.slice(1, -1);
  }
  
  console.log("✅ Token found:", cleanToken.substring(0, 20) + "...");
  return cleanToken;
};

const fetcher = async (
  endpoint: string,
  options: RequestInit = {},
  isFormData = false
) => {
  // রিকোয়েস্ট এক্সিকিউট হওয়ার মুহূর্তে একদম কারেন্ট/তাজা টোকেন তুলে আনবে
  const token = getCleanToken();
  const headers = new Headers(options.headers || {});
  
  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  
  // ✅ Token add করো
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
    console.log("🔐 Authorization header set");
  } else {
    console.warn("⚠️ No token to send");
  }

  const formattedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const fullUrl = `${BASE_URL}${formattedEndpoint}`;

  console.log(`📡 ${options.method || "GET"} ${fullUrl}`);
  console.log("🔑 Headers:", {
    "Content-Type": headers.get("Content-Type"),
    "Authorization": headers.get("Authorization") ? "Bearer [TOKEN]" : "None"
  });

  const res = await fetch(fullUrl, { ...options, headers });
  
  // 401 handle করো
  if (res.status === 401) { 
    console.error("❌ 401 Unauthorized");
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("medistore_user");
      // কুকি ক্লিয়ার করে দেওয়া ভালো যাতে ওল্ড সেশন ঝুলে না থাকে
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax";
      window.location.href = "/login";
    } 
    throw new Error("Unauthorized: Please login again"); 
  }
  
  if (!res.ok) { 
    const err = await res.json().catch(() => ({})); 
    console.error("❌ API Error:", err);
    throw new Error(err.error || err.message || `Error ${res.status}`); 
  }
  
  return res.json();
};

export const api = {
  auth: { 
    login: async (data: any) => { 
      const res = await fetcher("/auth/login", { 
        method: "POST", 
        body: JSON.stringify(data) 
      }); 
      
      const token = res.token || res.accessToken || res.data?.token;
      const user = res.user || res.data?.user;

      // ✅ এপিআই লেয়ারেই টোকেন ও ইউজার সেভ নিশ্চিত করা হলো
      if (typeof window !== "undefined" && token) {
        localStorage.setItem("token", token);
        document.cookie = `token=${token}; path=/; SameSite=Lax`;
        if (user) {
          localStorage.setItem("medistore_user", JSON.stringify(user));
        }
      }

      console.log("✅ Login successful, token secured.");
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

  medicines: { 
    getAll: () => fetcher("/medicines"),
    getById: (id: string) => fetcher(`/medicines/${id}`),
    create: (data: any) => fetcher("/medicines/add", { 
      method: "POST", 
      body: JSON.stringify(data) 
    }),
    update: (id: string, data: any) => fetcher(`/medicines/${id}`, { 
      method: "PATCH", 
      body: JSON.stringify(data) 
    }),
    delete: (id: string) => fetcher(`/medicines/${id}`, { 
      method: "DELETE" 
    }),
  },

  categories: {
    getAll: () => fetcher("/medicines/categories"),
  },

  orders: {
    create: (data: any) => fetcher("/orders", { 
      method: "POST", 
      body: JSON.stringify(data) 
    }),
    getAll: () => fetcher("/orders"),
    getById: (id: string) => fetcher(`/orders/${id}`),
    cancel: (id: string) => fetcher(`/orders/${id}/cancel`, { 
      method: "PATCH" 
    }),
  },

  seller: {
    getOrders: () => fetcher("/seller/orders"),
    updateOrderStatus: (id: string, status: string) => fetcher(`/seller/orders/${id}/status`, { 
      method: "PATCH", 
      body: JSON.stringify({ status }) 
    }),
  },

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