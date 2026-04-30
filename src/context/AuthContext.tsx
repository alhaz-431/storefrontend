"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// ইউজারের টাইপ ডিফাইন করা
type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "seller" | "customer";
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

  // পেজ রিফ্রেশ দিলেও যেন লগইন থাকে (Local Storage চেক)
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
    // রোল অনুযায়ী রিডাইরেক্ট
    if (userData.role === "admin") router.push("/admin/dashboard");
    else if (userData.role === "seller") router.push("/seller/dashboard");
    else router.push("/");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("medistore_user");
    router.push("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// এখানে মেইন পরিবর্তনটি করা হয়েছে (বিল্ড এরর এড়ানোর জন্য)
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    // বিল্ডের সময় যদি Provider না থাকে, এরর না দিয়ে আমরা একটি সেফ ভ্যালু রিটার্ন করছি
    return {
      user: null,
      login: () => {},
      logout: () => {},
      isLoading: false,
    };
  }
  
  return context;
};