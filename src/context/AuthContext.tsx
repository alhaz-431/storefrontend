"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// ইউজারের টাইপ ডিফাইন করা
type User = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "SELLER" | "CUSTOMER" | "admin" | "seller" | "customer";
} | null;

type AuthContextType = {
  user: User;
  login: (userData: any) => void;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const savedUser = localStorage.getItem("medistore_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Failed to parse user data:", error);
      }
    }
    setIsLoading(false);
  }, []);

  const login = (userData: any) => {
    setUser(userData);
    localStorage.setItem("medistore_user", JSON.stringify(userData));
    
    // 🔥 ROLE CASE FIX: বড় হাত বা ছোট হাত যাই আসুক, সব লোয়ারকেস করে চেক হবে (100% Safe)
    const userRole = userData?.role?.toLowerCase()?.trim();

    if (userRole === "admin") {
      router.push("/admin/dashboard");
    } else if (userRole === "seller") {
      router.push("/seller/dashboard");
    } else if (userRole === "customer") {
      router.push("/customer/dashboard"); // 🛍️ কাস্টমারকে তার ড্যাশবোর্ডে পাঠাবে
    } else {
      router.push("/");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("medistore_user");
    localStorage.removeItem("token"); // টোকেনও রিমুভ করে দেওয়া ভালো
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;"; // কুকি ক্লিয়ার
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    return {
      user: null,
      login: () => {},
      logout: () => {},
      isLoading: false,
    };
  }
  
  return context;
};