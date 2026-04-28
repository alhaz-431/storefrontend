// ১. এখানে আপনার রেন্ডার ইউআরএল সরাসরি ব্যাকআপ হিসেবে দিয়ে দিন
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://storemedistore.onrender.com/api";

const fetcher = async (endpoint: string, options: RequestInit = {}) => {
  // ২. ইউআরএল চেক করার সময় স্ল্যাশ (/) হ্যান্ডেল করা
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

    // ৩. যদি রেসপন্স এম্পটি হয় বা এরর থাকে
    const responseData = await res.json().catch(() => ({}));

    if (!res.ok) {
      // ব্যাকএন্ড থেকে আসা এরর মেসেজ দেখাবে
      throw new Error(responseData.message || "API request failed");
    }

    return responseData;
  } catch (error: any) {
    console.error("Fetch Error:", error.message);
    // যাতে আপনার পেজ ক্র্যাশ না করে শুধু এরর থ্রো করে
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