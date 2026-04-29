// src/lib/api.ts

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://storemedistore.onrender.com/api";

// 🔑 টোকেন গেটার
const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

// 🔑 হেডার বিল্ডার
const buildHeaders = (customHeaders?: HeadersInit) => {
  const headers = new Headers(customHeaders);

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const token = getToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return headers;
};

// 🚀 মেইন ফেচার ফাংশন
const fetcher = async (endpoint: string, options: RequestInit = {}) => {
  const fullUrl = `${BASE_URL}${endpoint}`;

  try {
    const res = await fetch(fullUrl, {
      ...options,
      headers: buildHeaders(options.headers),
      cache: "no-store",
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(data.error || data.message || "API request failed");
    }

    return data;
  } catch (error: any) {
    console.error("Fetch Error:", error.message);
    throw error;
  }
};

// 📦 আপনার সমস্ত এপিআই মেথড
export const api = {
  auth: {
    login: (data: any) =>
      fetcher("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    register: (data: any) =>
      fetcher("/auth/register", {
        method: "POST",
        body: JSON.stringify(data),
      }),
  },

  medicines: {
    getAll: () => fetcher("/medicines"),

    getById: (id: string) => fetcher(`/medicines/${id}`),

    create: (data: any) =>
      fetcher("/medicines/add", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    
    update: (id: string, data: any) =>
      fetcher(`/medicines/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),

    delete: (id: string) =>
      fetcher(`/medicines/${id}`, {
        method: "DELETE",
      }),
  },

  categories: {
    getAll: () => fetcher("/categories"),
  },

  orders: {
    create: (data: any) =>
      fetcher("/orders", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    // ✅ FIXED: এখন এটি userId গ্রহণ করবে এবং ডাইনামিক URL তৈরি করবে
    getUserOrders: (userId: string) => fetcher(`/orders/user/${userId}`),

    getSellerOrders: () => fetcher("/orders/seller"),
  },

  admin: {
    getAllUsers: () => fetcher("/admin/users"),

    updateStatus: (id: string, status: string) =>
      fetcher(`/admin/orders/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
  },
};