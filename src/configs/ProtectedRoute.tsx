"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/auth/signup");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
