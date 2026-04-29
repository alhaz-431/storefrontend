// src/lib/api.ts

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://storemedistore.onrender.com/api";

// 🔑 টোকেন গেটার - আপনার লোকাল স্টোরেজে থাকা 'token' কি ব্যবহার করা হয়েছে
const getToken = () => {
  if (typeof window !== "undefined") {
    // আপনার ডাটা অনুযায়ী কি-এর নাম 'token'
    return localStorage.getItem("token");
  }
  return null;
};

// 🔑 হেডার বিল্ডার - অটোমেটিক টোকেন এবং কন্টেন্ট টাইপ সেট করবে
const buildHeaders = (customHeaders?: HeadersInit) => {
  const headers = new Headers(customHeaders);

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const token = getToken();
  if (token) {
    // এটি ইনভ্যালিড টোকেন এরর সমাধান করবে
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

    // রেসপন্স ডাটা হ্যান্ডলিং
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      // সার্ভার থেকে আসা এরর মেসেজটি থ্রো করবে
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
    
    // আপডেট মেথডটি যোগ করা হয়েছে (PATCH)
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

    getUserOrders: () => fetcher("/orders/user"),

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