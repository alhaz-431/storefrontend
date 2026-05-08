// src/lib/api.ts

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://storemedistore.onrender.com/api/v1"; // ✅ FIXED (v1 added)

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
      throw new Error(data.message || "API request failed");
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
    login: async (data: any) => {
      const res = await fetcher("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      });

      // ✅ AUTO SAVE TOKEN
      if (typeof window !== "undefined" && res.token) {
        localStorage.setItem("token", res.token);
      }

      return res;
    },

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
    // ✅ CREATE ORDER
    create: (data: any) =>
      fetcher("/orders", {
        method: "POST",
        body: JSON.stringify(data),
      }),

    // ✅ USER OWN ORDERS
    getMyOrders: () => fetcher("/orders/my"),

    // ✅ ADMIN ONLY
    getAllOrders: () => fetcher("/orders"),

    // ✅ GET SINGLE ORDER DETAILS
    getOrderById: (id: string) =>
      fetcher(`/orders/${id}`),

    // ✅ UPDATE ORDER STATUS (For Cancel or Admin Update)
    updateStatus: (id: string, status: string) =>
      fetcher(`/orders/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
  },

  admin: {
    getAllUsers: () => fetcher("/admin/users"),

    // Admin Specific status update if endpoint is different
    updateOrderStatus: (id: string, status: string) =>
      fetcher(`/admin/orders/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
  },
};