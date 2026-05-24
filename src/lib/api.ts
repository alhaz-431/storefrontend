


const BASE_URL = "https://storemedistore.onrender.com/api";

// 🔑 Token getter
const getToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

// 🔑 Headers builder
const buildHeaders = (
  customHeaders?: HeadersInit,
  isFormData = false
) => {
  const headers = new Headers(customHeaders);

  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const token = getToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return headers;
};

// 🚀 Main fetcher
const fetcher = async (
  endpoint: string,
  options: RequestInit = {},
  isFormData = false
) => {
  const fullUrl = `${BASE_URL}${endpoint}`;

  try {
    const res = await fetch(fullUrl, {
      ...options,
      headers: buildHeaders(options.headers, isFormData),
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


export const api = {
  
  auth: {
    login: async (data: any) => {
      const res = await fetcher("/auth/login", {
        method: "POST",
        body: JSON.stringify(data),
      });

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

    getMe: () => fetcher("/auth/me"), 
  },

  
  medicines: {
    getAll: () => fetcher("/medicines"), 
    getById: (id: string) => fetcher(`/medicines/${id}`), 
    
  
    create: (data: FormData) => 
      fetcher("/seller/medicines", { method: "POST", body: data }, true),
    update: (id: string, data: FormData) => 
      fetcher(`/seller/medicines/${id}`, { method: "PUT", body: data }, true),
    delete: (id: string) => 
      fetcher(`/seller/medicines/${id}`, { method: "DELETE" }),
  },
  categories: {
    getAll: () => fetcher("/categories"), // GET /api/categories
  },

  // 3️⃣ Orders (Customer & Seller page backups)
  orders: {
    create: (data: any) =>
      fetcher("/orders", { method: "POST", body: JSON.stringify(data) }), // POST /api/orders
    getMyOrders: () => fetcher("/orders"),
    getOrderById: (id: string) => fetcher(`/orders/${id}`), // GET /api/orders/:id
    
    
    getAllOrders: () => fetcher("/seller/orders"), 
    updateStatus: (id: string, data: { status: string }) =>
      fetcher(`/seller/orders/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }),
  },

  // 4️⃣ Seller Management (অফিশিয়াল স্ট্রাকচার)
  seller: {
    addMedicine: (data: FormData) =>
      fetcher("/seller/medicines", { method: "POST", body: data }, true), // POST /api/seller/medicines
    updateMedicine: (id: string, data: FormData) =>
      fetcher(`/seller/medicines/${id}`, { method: "PUT", body: data }, true), // PUT /api/seller/medicines/:id
    deleteMedicine: (id: string) =>
      fetcher(`/seller/medicines/${id}`, { method: "DELETE" }), // DELETE /api/seller/medicines/:id
    getOrders: () => fetcher("/seller/orders"), // GET /api/seller/orders
    updateOrderStatus: (id: string, status: string) =>
      fetcher(`/seller/orders/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }), // PATCH /api/seller/orders/:id
  },

  // 5️⃣ Admin Management
  admin: {
    getAllUsers: () => fetcher("/admin/users"), // GET /api/admin/users
    updateUserStatus: (id: string, status: string) =>
      fetcher(`/admin/users/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      }), // PATCH /api/admin/users/:id
      
    // 💡 এডমিন পেজে যদি ওল্ড মেথড কল করা থাকে তার ব্যাকআপ:
    updateOrderStatus: (id: string, data: { status: string }) =>
      fetcher(`/admin/orders/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      }),
  },
};