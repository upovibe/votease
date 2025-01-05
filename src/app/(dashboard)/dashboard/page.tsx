"use client";

import React from 'react';
import { useAuth } from "@/contexts/AuthContext";
import Loading from "@/components/ui/Loading";
import Toolbar from '@/components/layouts/Toolbar';
import FirstPollCTA from '@/components/layouts/FirstPollCTA';
import { useRouter } from "next/navigation"; 

const DashboardPage = () => {
  const { loading } = useAuth();
  const router = useRouter(); 

  const handleAddNewPoll = () => {
    router.push("/dashboard/polls/new");
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className='p-4'>
      <Toolbar/>
      <FirstPollCTA onCreatePoll={handleAddNewPoll}/>
    </div>
  );
}

export default DashboardPage;