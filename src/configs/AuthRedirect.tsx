"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

const AuthRedirect: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace("/dashboard");
    }
  }, [user, router]);

  if (user) {
    return null; 
  }

  return <>{children}</>;
};

export default AuthRedirect;