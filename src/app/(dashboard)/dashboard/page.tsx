"use client";

import React from 'react';
import { useAuth } from "@/contexts/AuthContext";
import Loading from "@/components/ui/Loading";

const DashboardPage = () => {
  const { loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return (
    <div>Dashboard</div>
  );
}

export default DashboardPage;