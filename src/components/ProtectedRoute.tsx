"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingSpinner from "@/components/LoadingSpinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push("/login");
      } else if (allowedRoles && !allowedRoles.includes(user.role?.toUpperCase())) {
        router.push("/"); // রোল না মিললে হোমে পাঠাবে
      }
    }
  }, [user, isLoading, router, allowedRoles]);

  if (isLoading) return <LoadingSpinner />;

  return user ? <>{children}</> : null;
}