// Vercel বা Local - সব জায়গার জন্য ডাইনামিক URL
const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

const fetcher = async (endpoint: string, options: RequestInit = {}) => {
  // যদি URL সেট করা না থাকে তার জন্য চেক
  if (!BASE_URL) {
    console.error("API URL is not defined in Environment Variables");
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    // লাইভ সাইটে ডাটা আপডেট পেতে cache: 'no-store' ব্যবহার করা ভালো
    cache: 'no-store',
  });

  const responseData = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(responseData.message || "Something went wrong with the API");
  }

  return responseData;
};

export const api = {
  // --- Auth ---
  auth: {
    login: (data: any) => 
      fetcher("/auth/login", { method: "POST", body: JSON.stringify(data) }),
    register: (data: any) => 
      fetcher("/auth/register", { method: "POST", body: JSON.stringify(data) }),
  },

  // --- Medicines ---
  medicines: {
    getAll: () => fetcher("/medicines"),
    getById: (id: string) => fetcher(`/medicines/${id}`),
    // সেলারের জন্য ওষুধ অ্যাড করা
    create: (data: any, token: string) => 
      fetcher("/medicines", { 
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

  // --- Categories ---
  categories: {
    getAll: () => fetcher("/categories"),
  },

  // --- Orders ---
  orders: {
    create: (data: any, token: string) => 
      fetcher("/orders", { 
        method: "POST", 
        body: JSON.stringify(data),
        headers: { Authorization: `Bearer ${token}` } 
      }),
    getUserOrders: (token: string) => 
      fetcher("/orders/user", { headers: { Authorization: `Bearer ${token}` } }),
    getSellerOrders: (token: string) => 
      fetcher("/orders/seller", { headers: { Authorization: `Bearer ${token}` } }),
  },

  // --- Admin ---
  admin: {
    getAllUsers: (token: string) => 
      fetcher("/admin/users", { headers: { Authorization: `Bearer ${token}` } }),
    updateStatus: (id: string, status: string, token: string) => 
      fetcher(`/admin/orders/${id}`, { 
        method: "PATCH", 
        body: JSON.stringify({ status }),
        headers: { Authorization: `Bearer ${token}` } 
      }),
  }
};