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
      } catch (e) { console.error(e); }
    }
  }
  if (!token) return null;
  let cleanToken = String(token).trim();
  if (cleanToken.startsWith('"') && cleanToken.endsWith('"')) cleanToken = cleanToken.slice(1, -1);
  return cleanToken;
};

interface CustomRequestInit extends RequestInit {
  body?: any;
}

const fetcher = async (endpoint: string, options: CustomRequestInit = {}, isFormData = false) => {
  const token = getCleanToken();
  const headers: Record<string, string> = {};

  if (options.headers) {
    Object.assign(headers, options.headers);
  }
  
  if (!isFormData && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const fullUrl = `${BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  
  let finalBody = options.body;
  if (!isFormData && options.body && typeof options.body !== "string") {
    finalBody = JSON.stringify(options.body);
  }

  const res = await fetch(fullUrl, { 
    ...options, 
    headers, 
    body: finalBody 
  });
  
  if (res.status === 401) {
    if (typeof window !== "undefined") {
      localStorage.clear();
      window.location.href = "/login";
    }
    throw new Error("Unauthorized");
  }
  
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "API Error");
  }
  return res.json();
};

export const api = {
  auth: { 
    login: (data: any) => fetcher("/auth/login", { method: "POST", body: data }),
    register: (data: any) => fetcher("/auth/register", { method: "POST", body: data }),
    getMe: () => fetcher("/auth/me"),
  },

  medicines: { 
    getAll: () => fetcher("/medicines"),
    getById: (id: string) => fetcher(`/medicines/${id}`),
    create: (data: any, config?: CustomRequestInit) => 
        fetcher("/medicines", { method: "POST", body: data, ...config }, true),
    update: (id: string, data: any, config?: CustomRequestInit) => 
        fetcher(`/medicines/${id}`, { method: "PATCH", body: data, ...config }, true),
    delete: (id: string, config?: CustomRequestInit) => 
        fetcher(`/medicines/${id}`, { method: "DELETE", ...config }),
  },

  categories: { getAll: () => fetcher("/categories") },
  
  orders: {
    create: (data: any) => fetcher("/orders", { method: "POST", body: data }),
    getAll: () => fetcher("/orders"),
    // ✅ এখানে বসানো হয়েছে:
    getById: (id: string) => fetcher(`/orders/${id}`),
    cancel: (id: string) => fetcher(`/orders/${id}/cancel`, { method: "PATCH" }),
  },

  seller: {
    getOrders: () => fetcher("/seller/orders"),
    updateOrderStatus: (id: string, status: string) => 
        fetcher(`/seller/orders/${id}/status`, { method: "PATCH", body: { status } }),
  }
} as const;