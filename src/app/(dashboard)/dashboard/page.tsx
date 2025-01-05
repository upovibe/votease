"use client";

import React from 'react';
import { useAuth } from "@/contexts/AuthContext";
import Loading from "@/components/ui/Loading";
import Toolbar from '@/components/layouts/Toolbar';
import FirstPollCTA from '@/components/layouts/FirstPollCTA';

const DashboardPage = () => {
  const { loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return (
    <div className='p-4'>
      <Toolbar/>
      <FirstPollCTA />
    </div>
  );
}

export default DashboardPage;