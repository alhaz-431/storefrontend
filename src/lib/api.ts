const BASE_URL = "https://storemedistore.onrender.com/api";

const getCleanToken = () => {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  // যদি টোকেন থাকে তবে তা থেকে ডাবল কোটেশন রিমুভ করে ক্লিন টোকেন রিটার্ন করবে
  return token ? token.replace(/^"|"$/g, '').replace(/['"]+/g, '') : null;
};

const fetcher = async (endpoint: string, options: RequestInit = {}, isFormData = false) => {
  const token = getCleanToken();
  const headers = new Headers(options.headers || {});

  if (!isFormData && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
  
  // 401 এরর হলে টোকেন ডিলিট করে ইউজারকে অথেন্টিকেশন এরর দেওয়া
  if (res.status === 401) {
    localStorage.removeItem("token");
    throw new Error("আপনার সেশন শেষ! আবার লগইন করুন।");
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || "API request failed");
  }

  return res.json();
};

export const api = {
  auth: {
    login: async (data: any) => {
      const res = await fetcher("/auth/login", { 
        method: "POST", 
        body: JSON.stringify(data) 
      });
      // টোকেন সেভ করার সময় JSON.stringify করবেন না, কারণ এটি সরাসরি স্ট্রিং
      if (res.token) localStorage.setItem("token", res.token);
      return res;
    },
  },
  orders: {
    create: (data: any) => fetcher("/orders", { 
      method: "POST", 
      body: JSON.stringify(data) 
    }),
    getAllOrders: () => fetcher("/seller/orders"),
    updateStatus: (id: string, status: string) => 
      fetcher(`/seller/orders/${id}`, { 
        method: "PATCH", 
        body: JSON.stringify({ status }) 
      }),
  }
};