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
  const token = getCleanToken();
  
  // 🎯 Headers অবজেক্টের বদলে প্লেইন অবজেক্ট ব্যবহার করা হলো যা প্রোডাকশনে হেডার ড্রপ হওয়া আটকাবে
  const headers: Record<string, string> = {};

  // আগের কোনো হেডার থাকলে তা প্লেইন অবজেক্টে রূপান্তর করা
  if (options.headers) {
    if (options.headers instanceof Headers) {
      options.headers.forEach((value, key) => {
        headers[key] = value;
      });
    } else if (Array.isArray(options.headers)) {
      options.headers.forEach(([key, value]) => {
        headers[key] = value;
      });
    } else {
      Object.assign(headers, options.headers);
    }
  }
  
  if (!isFormData && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }
  
  // ✅ Token হেডার ইনজেক্ট করা
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
    console.log("🔐 Authorization header set successfully");
  } else {
    console.warn("⚠️ No token to send");
  }

  const formattedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const fullUrl = `${BASE_URL}${formattedEndpoint}`;

  console.log(`📡 ${options.method || "GET"} ${fullUrl}`);

  // 🛰️ fetch কল করার সময় প্লেইন হেডার অবজেক্ট পাস করা হলো
  const res = await fetch(fullUrl, { ...options, headers });
  
  // 401 handle করো
  if (res.status === 401) { 
    console.error("❌ 401 Unauthorized");
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("medistore_user");
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