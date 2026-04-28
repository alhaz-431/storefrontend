// src/lib/api.ts

// ১. রেন্ডার ইউআরএল সরাসরি দেওয়া আছে
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://storemedistore.onrender.com/api";

const fetcher = async (endpoint: string, options: RequestInit = {}) => {
  // ২. ইউআরএল তৈরি করা
  const fullUrl = `${BASE_URL}${endpoint}`;

  try {
    const res = await fetch(fullUrl, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      cache: 'no-store',
    });

    // ৩. রেসপন্স হ্যান্ডেল করা
    const responseData = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new Error(responseData.message || responseData.error || "API request failed");
    }

    return responseData;
  } catch (error: any) {
    console.error("Fetch Error:", error.message);
    throw error;
  }
};

export const api = {
  auth: {
    login: (data: any) => fetcher("/auth/login", { method: "POST", body: JSON.stringify(data) }),
    register: (data: any) => fetcher("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  },
  medicines: {
    getAll: () => fetcher("/medicines"),
    getById: (id: string) => fetcher(`/medicines/${id}`),
   
    create: (data: any, token: string) => 
      fetcher("/medicines/add", { 
        method: "POST", 
        body: JSON.stringify(data),
        headers: { Authorization: `Bearer ${token}` } 
      }),
    delete: (id: string, token: string) => 
      fetcher(`/medicines/${id}`, { 
        method: "DELETE", 
        headers: { Authorization: `Bearer ${token}` } 
      }),
  },
  categories: {
    getAll: () => fetcher("/categories"),
  },
  orders: {
    create: (data: any, token: string) => 
      fetcher("/orders", { 
        method: "POST", 
        body: JSON.stringify(data),
        headers: { Authorization: `Bearer ${token}` } 
      }),
    getUserOrders: (token: string) => fetcher("/orders/user", { headers: { Authorization: `Bearer ${token}` } }),
    getSellerOrders: (token: string) => fetcher("/orders/seller", { headers: { Authorization: `Bearer ${token}` } }),
  },
  admin: {
    getAllUsers: (token: string) => fetcher("/admin/users", { headers: { Authorization: `Bearer ${token}` } }),
    updateStatus: (id: string, status: string, token: string) => 
      fetcher(`/admin/orders/${id}`, { 
        method: "PATCH", 
        body: JSON.stringify({ status }),
        headers: { Authorization: `Bearer ${token}` } 
      }),
  }
};