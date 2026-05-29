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
      } catch (e) {
        console.error("Error parsing user:", e);
      }
    }
  }
  
  if (!token) {
    console.warn("⚠️ No token found in localStorage");
    return null;
  }
  
  // Clean token
  let cleanToken = String(token).trim();
  if (cleanToken.startsWith('"') && cleanToken.endsWith('"')) {
    cleanToken = cleanToken.slice(1, -1);
  }
  if (cleanToken.startsWith("'") && cleanToken.endsWith("'")) {
    cleanToken = cleanToken.slice(1, -1);
  }
  
  return cleanToken;
};

// টাইপস্ক্রিপ্টের বডি এবং অপশনস এরর ফিক্স করার জন্য কাস্টম ইন্টারফেস
interface CustomRequestInit extends Omit<RequestInit, "body"> {
  body?: any; 
}

const fetcher = async (
  endpoint: string,
  options: CustomRequestInit = {},
  isFormData = false
) => {
  const token = getCleanToken();
  const headers: Record<string, string> = {};

  if (options.headers) {
    if (options.headers instanceof Headers) {
      options.headers.forEach((value, key) => {
        headers[key] = value;
      });
    } else if (Array.isArray(options.headers)) {
      options.headers.forEach(([key, value]) => {
        headers[key] = value;
      });
    } else {
      Object.assign(headers, options.headers);
    }
  }
  
  // FormData না হলে এবং Content-Type না থাকলে অটোমেটিক JSON হেডার বসবে
  if (!isFormData && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const formattedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const fullUrl = `${BASE_URL}${formattedEndpoint}`;

  console.log(`📡 ${options.method || "GET"} ${fullUrl}`);

  // স্মার্ট বডি হ্যান্ডলিং: FormData না হলে অবজেক্টকে অটোমেটিক stringify করে নেবে
  let finalBody = options.body;
  if (!isFormData && options.body && typeof options.body !== "string") {
    finalBody = JSON.stringify(options.body);
  }

  const res = await fetch(fullUrl, { 
    ...(options as RequestInit), 
    headers, 
    body: finalBody 
  });
  
  if (res.status === 401) { 
    console.error("❌ 401 Unauthorized");
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("medistore_user");
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC; SameSite=Lax";
      window.location.href = "/login";
    } 
    throw new Error("Unauthorized: Please login again"); 
  }
  
  if (!res.ok) { 
    const err = await res.json().catch(() => ({})); 
    console.error("❌ API Error:", err);
    throw new Error(err.error || err.message || `Error ${res.status}`); 
  }
  
  return res.json();
};

export const api = {
  auth: { 
    login: async (data: any) => { 
      const res = await fetcher("/auth/login", { 
        method: "POST", 
        body: data 
      }); 
      
      const token = res.token || res.accessToken || res.data?.token;
      const user = res.user || res.data?.user;

      if (typeof window !== "undefined" && token) {
        localStorage.setItem("token", token);
        document.cookie = `token=${token}; path=/; SameSite=Lax`;
        if (user) {
          localStorage.setItem("medistore_user", JSON.stringify(user));
        }
      }

      console.log("✅ Login successful, token secured.");
      return res; 
    },
    register: (data: any) => fetcher("/auth/register", { 
      method: "POST", 
      body: data 
    }),
    getMe: () => fetcher("/auth/me"), 
    updateProfile: (data: any) => fetcher("/auth/me", { 
      method: "PATCH", 
      body: data 
    }),
  },

  medicines: { 
    getAll: () => fetcher("/medicines"),
    getById: (id: string) => fetcher(`/medicines/${id}`),
    
    // ক্রিয়েট করার সময় ক্যাটাগরি আইডি অবজেক্টে থাকলে সেটাকে FormData-তে রূপান্তর নিশ্চিত করা
    create: (data: any) => {
      let bodyData = data;
      if (!(data instanceof FormData)) {
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
          if (key === "category" && !data.categoryId) {
            formData.append("categoryId", data[key]);
          } else {
            formData.append(key, data[key]);
          }
        });
        bodyData = formData;
      } else {
        if (data.has("category") && !data.has("categoryId")) {
          data.append("categoryId", data.get("category") as string);
        }
      }
      
      return fetcher("/medicines", { 
        method: "POST", 
        body: bodyData 
      }, true);
    }, 
    
    // এডিট/আপডেট করার সময় অবজেক্ট নাকি FormData সেটার ওপর ভিত্তি করে ডায়নামিক হ্যান্ডলিং
    update: (id: string, data: any) => {
      let isForm = data instanceof FormData;
      let bodyData = data;

      if (isForm) {
        if (data.has("category") && !data.has("categoryId")) {
          data.append("categoryId", data.get("category") as string);
        }
      } else {
        if (data.category && !data.categoryId) {
          data.categoryId = data.category;
          delete data.category;
        }
      }
      
      return fetcher(`/medicines/${id}`, { 
        method: "PATCH", 
        body: bodyData 
      }, isForm);
    }, 
    
    delete: (id: string) => fetcher(`/medicines/${id}`, { 
      method: "DELETE" 
    }),
  },

  categories: {
    getAll: () => fetcher("/categories"),
  },

  orders: {
    create: (data: any) => fetcher("/orders", { 
      method: "POST", 
      body: data 
    }),
    getAll: () => fetcher("/orders"),
    getById: (id: string) => fetcher(`/orders/${id}`),
    cancel: (id: string) => fetcher(`/orders/${id}/cancel`, { 
      method: "PATCH" 
    }),
  },

  seller: {
    getOrders: () => fetcher("/orders"), 
    updateOrderStatus: (id: string, status: string) => fetcher(`/orders/${id}/status`, { 
      method: "PATCH", 
      body: { status } 
    }),
  },

  admin: {
    getAllUsers: () => fetcher("/admin/users"),
    updateUserStatus: (id: string, isActive: boolean) => fetcher(`/admin/users/${id}`, { 
      method: "PATCH", 
      body: { isActive } 
    }),
    getAllOrders: () => fetcher("/admin/orders"),
    getStatistics: () => fetcher("/admin/statistics"),
  },
} as const;