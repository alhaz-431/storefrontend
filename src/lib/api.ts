const BASE_URL = "https://storemedistore.onrender.com/api";

const getCleanToken = () => {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  return token ? token.replace(/^"|"$/g, '').replace(/['"]+/g, '') : null;
};

const fetcher = async (endpoint: string, options: RequestInit = {}, isFormData = false) => {
  const token = getCleanToken();
  const headers = new Headers(options.headers || {});
  if (!isFormData && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
  if (res.status === 401) { if (typeof window !== "undefined") localStorage.removeItem("token"); throw new Error("Unauthorized"); }
  if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err.message || "API failed"); }
  return res.json();
};

export const api = {
  auth: { 
    login: async (data: any) => { const res = await fetcher("/auth/login", { method: "POST", body: JSON.stringify(data) }); if (res.token) localStorage.setItem("token", res.token); return res; } 
  },
  orders: {
    create: (data: any) => fetcher("/orders", { method: "POST", body: JSON.stringify(data) }),
    getAllOrders: () => fetcher("/seller/orders"),
    getMyOrders: () => fetcher("/orders/my-orders"),
    getOrderById: (id: string) => fetcher(`/orders/${id}`),
    updateStatus: (id: string, status: string) => fetcher(`/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
  },
  // 🎯 এই অংশটুকু নিশ্চিত করুন:
  medicines: { 
    getAll: () => fetcher("/medicines") 
  },
  seller: {
    addMedicine: (data: FormData) => fetcher("/seller/medicines", { method: "POST", body: data }, true),
    updateMedicine: (id: string, data: FormData) => fetcher(`/seller/medicines/${id}`, { method: "PATCH", body: data }, true),
    deleteMedicine: (id: string) => fetcher(`/seller/medicines/${id}`, { method: "DELETE" }),
  }
} as const;