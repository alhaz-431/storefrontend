// src/lib/api.ts

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://storemedistore.onrender.com/api";

// 🔑 Token getter
const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

// 🔑 Headers builder
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

// 🚀 Main fetcher
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

// 📦 API Object
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

    // 👇 সব user orders
    getUserOrders: (userId: string) =>
      fetcher(`/orders/user/${userId}`),

    // 👇 seller orders
    getSellerOrders: () => fetcher("/orders/seller"),

    // ✅ FIX: single order by id (এটাই missing ছিল)
    getOrderById: (id: string) =>
      fetcher(`/orders/${id}`),
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